import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Client Supabase fără cookie-uri, pentru date publice.
 *
 * Paginile de catalog (acasă, produse, categorii, produs, jurnal) citesc doar
 * informații publice: produse, categorii, articole. Nu au nevoie să știe cine
 * este vizitatorul, deci nu au nevoie de `cookies()`.
 *
 * Diferența față de `./server.ts` este esențială pentru găzduirea pe Hostico:
 * fără `cookies()`, Next.js poate randa aceste pagini la build și le poate
 * scrie ca HTML static. Cu `cookies()`, ar fi obligat să le randeze la fiecare
 * cerere, ceea ce cere un server Node — exact ce nu avem pe pachetul Start.
 *
 * Rezultatul pe ecran este identic: aceleași date, același HTML. Se schimbă
 * doar momentul în care sunt cerute — o dată, la build, în loc de la fiecare
 * vizitator.
 */
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Nu există sesiune de păstrat: rulează la build, nu în browser.
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
