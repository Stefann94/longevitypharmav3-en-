
import { createClient } from '@/lib/supabase/client'

/**
 * Abonarea ruleaza acum din browser: sunt doar apeluri Supabase, iar
 * revalidatePath nu are corespondent fara server. Panoul din cont isi citeste
 * oricum starea la fiecare afisare, deci ramane la zi.
 */

/**
 * Abonare la newsletter din subsolul site-ului.
 *
 * Tabelul are `email` unic, deci o a doua încercare cu aceeași adresă este
 * respinsă de baza de date cu codul 23505. Nu este o eroare pentru vizitator,
 * ci exact răspunsul de care avem nevoie: înseamnă că e deja abonat.
 */
export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email')?.toString().trim()

  if (!email) {
    return { error: 'Te rugăm să introduci o adresă de e-mail.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Adresa de e-mail nu pare validă.' }
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Pentru un utilizator autentificat folosim exact aceeași operație ca
  // panoul din cont (upsert după user_id), ca cele două să scrie în același
  // rând și să nu se contrazică.
  if (user) {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .upsert({
        user_id: user.id,
        email: user.email ?? email,
        is_subscribed: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      if (error.code === '23505') {
        return { success: true, alreadySubscribed: true }
      }
      console.error('Eroare abonare newsletter (utilizator autentificat):', error)
      return { error: 'Nu am putut salva abonarea. Te rugăm să încerci din nou.' }
    }

    return { success: true }
  }

  // Vizitator: politica de INSERT permite oricui să lase o adresă, dar
  // politicile de SELECT și UPDATE sunt legate de cont, deci nu putem verifica
  // în prealabil dacă adresa există. Ne bazăm pe constrângerea de unicitate.
  const { error } = await supabase
    .from('newsletter_subscriptions')
    .insert({
      email,
      is_subscribed: true,
      updated_at: new Date().toISOString()
    })

  if (error) {
    if (error.code === '23505') {
      return { success: true, alreadySubscribed: true }
    }
    console.error('Eroare abonare newsletter (vizitator):', error)
    return { error: 'Nu am putut salva abonarea. Te rugăm să încerci din nou.' }
  }

  return { success: true }
}
