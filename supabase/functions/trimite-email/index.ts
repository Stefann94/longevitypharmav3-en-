// Supabase Edge Function — trimiterea emailurilor
//
// De ce există acest fișier
// -------------------------
// Site-ul se publică pe Hostico ca export static, deci nu mai există niciun
// server Node al aplicației. Restul operațiunilor s-au mutat în browser, dar
// trimiterea de emailuri nu poate: ar însemna ca RESEND_API_KEY să ajungă în
// fișierele JavaScript livrate, adică vizibilă oricui deschide DevTools. Cu ea,
// oricine ar putea trimite emailuri în numele magazinului.
//
// Funcția rulează pe infrastructura Supabase, unde cheia stă în variabile de
// mediu, nu în cod.
//
// Cum e protejată împotriva abuzului
// ----------------------------------
// Funcția nu acceptă niciodată o adresă de destinatar de la apelant. Primește
// doar un identificator, citește rândul din baza de date cu cheia de serviciu
// și deduce singură destinatarul. Astfel nu poate fi folosită ca releu de spam:
//   - pentru comenzi, destinatarul e clientul comenzii respective
//   - pentru contact, destinatarul e strict CONTACT_NOTIFICATION_EMAIL
//
// Variabile necesare (Supabase Dashboard → Edge Functions → Secrets):
//   RESEND_API_KEY               cheia Resend
//   CONTACT_NOTIFICATION_EMAIL   unde ajung mesajele din formularul de contact
//   EMAIL_EXPEDITOR              opțional; implicit onboarding@resend.dev
// SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY sunt furnizate automat.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Textul vine de la vizitatori și ajunge într-un email HTML. Fără escapare,
 * cineva ar putea injecta linkuri sau markup în mesajul primit în inbox.
 */
function escapeHtml(value: string) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function raspuns(corp: unknown, status = 200) {
  return new Response(JSON.stringify(corp), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function trimitePrinResend(mesaj: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const cheie = Deno.env.get('RESEND_API_KEY');
  if (!cheie) {
    console.warn('RESEND_API_KEY nu este setat: emailul nu a fost trimis.');
    return { trimis: false, motiv: 'lipseste RESEND_API_KEY' };
  }

  const expeditor = Deno.env.get('EMAIL_EXPEDITOR') ?? 'Longevity Farma <onboarding@resend.dev>';

  const raspunsResend = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cheie}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: expeditor,
      to: [mesaj.to],
      subject: mesaj.subject,
      html: mesaj.html,
      ...(mesaj.replyTo ? { reply_to: mesaj.replyTo } : {}),
    }),
  });

  if (!raspunsResend.ok) {
    const detaliu = await raspunsResend.text();
    console.error('Eroare Resend:', raspunsResend.status, detaliu);
    return { trimis: false, motiv: detaliu };
  }

  return { trimis: true };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { tip, id } = await req.json();

    if (!id || (tip !== 'comanda' && tip !== 'contact')) {
      return raspuns({ error: 'Parametri lipsă sau invalizi.' }, 400);
    }

    // Cheia de serviciu ocolește RLS: e nevoie, pentru că funcția trebuie să
    // citească o comandă sau un mesaj care nu îi aparțin apelantului.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ---------------------------------------------------------------- CONTACT
    if (tip === 'contact') {
      const destinatar = Deno.env.get('CONTACT_NOTIFICATION_EMAIL');
      if (!destinatar) {
        console.warn('CONTACT_NOTIFICATION_EMAIL nu este setat.');
        return raspuns({ trimis: false, motiv: 'destinatar neconfigurat' });
      }

      const { data: mesaj, error } = await supabase
        .from('contact_messages')
        .select('name, email, subject, message, created_at')
        .eq('id', id)
        .single();

      if (error || !mesaj) {
        return raspuns({ error: 'Mesajul nu a fost găsit.' }, 404);
      }

      const safe = {
        name: escapeHtml(mesaj.name),
        email: escapeHtml(mesaj.email),
        subject: escapeHtml(mesaj.subject || 'Fără subiect'),
        // Mesajul e scris pe mai multe rânduri într-un textarea; fără asta ar
        // ajunge un bloc compact în email.
        message: escapeHtml(mesaj.message).replace(/\r?\n/g, '<br />'),
      };

      const primitLa = new Date(mesaj.created_at).toLocaleString('ro-RO', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Europe/Bucharest',
      });

      const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a2b22;">
      <h2 style="color: #2e8b57; margin-bottom: 4px;">Mesaj nou din formularul de contact</h2>
      <p style="color: #777; font-size: 13px; margin-top: 0;">Primit pe ${primitLa}</p>

      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #777; width: 110px;">Nume</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">${safe.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #777;">E-mail</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">
            <a href="mailto:${safe.email}" style="color: #2e8b57;">${safe.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #777;">Subiect</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">${safe.subject}</td>
        </tr>
      </table>

      <div style="background-color: #f4f8f1; border: 1px solid #d6e4d9; border-radius: 8px; padding: 18px;">
        <div style="color: #777; font-size: 13px; margin-bottom: 10px;">Mesaj</div>
        <div style="line-height: 1.6;">${safe.message}</div>
      </div>

      <p style="color: #777; font-size: 13px; margin-top: 24px;">
        Poți răspunde direct la acest email: destinatarul va fi ${safe.name}.
      </p>
    </div>
  `;

      const rezultat = await trimitePrinResend({
        to: destinatar,
        // Un simplu Reply în clientul de email răspunde persoanei, nu ție.
        replyTo: mesaj.email,
        subject: `[Contact] ${mesaj.subject || 'Fără subiect'} — ${mesaj.name}`,
        html,
      });

      return raspuns(rezultat);
    }

    // ---------------------------------------------------------------- COMANDA
    const { data: comanda, error: eroareComanda } = await supabase
      .from('orders')
      .select(
        'id, user_id, guest_email, total_amount, shipping_cost, shipping_name, shipping_phone, shipping_address'
      )
      .eq('id', id)
      .single();

    if (eroareComanda || !comanda) {
      return raspuns({ error: 'Comanda nu a fost găsită.' }, 404);
    }

    // Destinatarul nu vine niciodată de la apelant. Pentru un client cu cont îl
    // luăm din tabela de utilizatori; pentru un vizitator, din comandă.
    let destinatar = comanda.guest_email as string | null;
    if (!destinatar && comanda.user_id) {
      const { data: utilizator } = await supabase.auth.admin.getUserById(comanda.user_id);
      destinatar = utilizator?.user?.email ?? null;
    }

    if (!destinatar) {
      return raspuns({ trimis: false, motiv: 'comanda nu are adresa de email' });
    }

    const { data: produse } = await supabase
      .from('order_items')
      .select('product_name, quantity, price_at_time')
      .eq('order_id', id);

    const itemsHtml = (produse ?? [])
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${escapeHtml(item.product_name)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.price_at_time} Lei</td>
      </tr>
    `
      )
      .join('');

    const prenume = escapeHtml(String(comanda.shipping_name ?? '').split(' ')[0]);
    const transport = Number(comanda.shipping_cost) === 0 ? 'GRATUIT' : `${comanda.shipping_cost} Lei`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2e8b57;">Confirmare Comandă Longevity Farma</h2>
        <p>Salut, <strong>${prenume}</strong>!</p>
        <p>Îți mulțumim pentru comandă. Mai jos regăsești detaliile cumpărăturilor tale:</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Produs</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Cantitate</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Preț/buc</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="text-align: right; font-size: 16px;">Transport: <strong>${transport}</strong></p>
        <h3 style="text-align: right; color: #1a2b22;">Total: ${Number(comanda.total_amount).toFixed(2)} Lei</h3>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 30px;">
          <h4 style="margin-top: 0; color: #333;">Adresa de livrare:</h4>
          <p style="margin: 0; color: #555;">${escapeHtml(comanda.shipping_address)}</p>
          <p style="margin: 5px 0 0 0; color: #555;">Telefon: ${escapeHtml(comanda.shipping_phone)}</p>
        </div>
      </div>
    `;

    const rezultat = await trimitePrinResend({
      to: destinatar,
      subject: `Confirmare Comandă #${String(comanda.id).split('-')[0]} - Longevity Farma`,
      html,
    });

    return raspuns(rezultat);
  } catch (err) {
    console.error('Eroare in functia de email:', err);
    return raspuns({ error: 'Eroare internă.' }, 500);
  }
});
