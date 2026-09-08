import { createClient } from '@/lib/supabase/client';

/**
 * Trimiterea mesajului din formularul de contact, mutată în browser.
 *
 * Salvarea în baza de date se face direct, prin clientul Supabase. Notificarea
 * pe email nu poate: ar cere RESEND_API_KEY în browser, adică vizibilă oricui.
 * De aceea emailul este trimis de funcția Edge `trimite-email`, care rulează pe
 * infrastructura Supabase.
 *
 * Funcția primește doar identificatorul mesajului, nu conținutul lui: citește
 * singură rândul din `contact_messages` și trimite strict către adresa
 * configurată în CONTACT_NOTIFICATION_EMAIL. Așa nu poate fi folosită de nimeni
 * ca releu de spam.
 *
 * Identificatorul este generat aici, nu întors de baza de date: tabela
 * `contact_messages` permite oricui să insereze, dar nu are politică de SELECT,
 * deci un `insert().select()` ar fi respins.
 */
export async function submitContactMessage(formData: FormData) {
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const subject = formData.get('subject')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  if (!name || !email || !message) {
    return { success: false, error: 'Te rugăm să completezi toate câmpurile obligatorii.' };
  }

  // Validarea din formular este doar în browser. Emailul ajunge în antetul
  // Reply-To, deci o valoare stricată ar face ca trimiterea să fie respinsă.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Adresa de e-mail nu pare validă.' };
  }

  const supabase = createClient();
  const mesajId = crypto.randomUUID();

  const { error } = await supabase.from('contact_messages').insert([
    { id: mesajId, name, email, subject, message }
  ]);

  if (error) {
    console.error('Failed to submit contact message:', error);
    return { success: false, error: 'A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou.' };
  }

  // Abia după ce mesajul e salvat în siguranță. Eșecul notificării este
  // intenționat înghițit: mesajul rămâne oricum în tabelul contact_messages,
  // deci nu are rost să i se arate vizitatorului o eroare.
  try {
    await supabase.functions.invoke('trimite-email', {
      body: { tip: 'contact', id: mesajId },
    });
  } catch (err) {
    console.error('Notificarea de contact nu a putut fi trimisa:', err);
  }

  return { success: true };
}
