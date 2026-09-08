import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Autentificarea, mutată din server în browser.
 *
 * Fișierul era marcat ca acțiuni de server și folosea `revalidatePath` și
 * `redirect` din Next.js. Niciuna nu există în export static: nu mai rămâne un
 * server care să reconstruiască pagini sau să trimită un răspuns de
 * redirecționare.
 *
 * Înlocuitorul este `window.location.assign('/')` — o reîncărcare completă a
 * paginii. Efectul este chiar cel dorit: tot ce ține de sesiune (antetul,
 * coșul, favoritele) pornește de la zero cu noua stare, exact ce obținea
 * înainte `revalidatePath('/', 'layout')`.
 *
 * Semnăturile rămân neschimbate — întorc `{ error }` la eșec și navighează la
 * reușită — deci paginile de login și signup, antetul și bara de cont nu au
 * avut nevoie de nicio modificare.
 */

/**
 * Leagă de contul tocmai autentificat comenzile plasate fără cont cu același
 * email confirmat. Potrivirea o face funcția `claim_guest_orders` din Postgres,
 * care ia emailul din sesiune, nu din client (vezi setup_guest_orders.sql).
 *
 * Eșecul este intenționat ignorat: dacă migrarea nu a fost încă rulată sau
 * apare orice altă eroare, autentificarea trebuie să reușească oricum.
 * Revendicarea se va face oricum la următoarea autentificare.
 */
async function claimGuestOrders(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase.rpc('claim_guest_orders')
    if (error) {
      console.warn('Revendicarea comenzilor fara cont a esuat:', error.message)
      return
    }
    if (data) {
      console.log(`[COMENZI] ${data} comanda/comenzi legate de cont.`)
      // Fără revalidatePath: pagina de comenzi își citește singură datele din
      // browser, iar reîncărcarea de mai jos o va aduce oricum la zi.
    }
  } catch (err) {
    console.warn('Revendicarea comenzilor fara cont a esuat:', err)
  }
}

export async function login(formData: FormData) {
  const supabase = createClient()

  // Extract email/phone and password.
  // Currently, the form asks for "E-mail sau Număr de telefon", but Supabase signInWithPassword primarily uses email.
  // We'll treat it as email for now.
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mail și parolă sunt obligatorii.' }
  }

  // Acelasi motiv ca la inregistrare: o excepție neașteptată trebuie să devină
  // mesaj în formular, nu pagina generică de eroare.
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Return friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Date de conectare incorecte. Verifică e-mailul și parola.' }
      }
      return { error: error.message }
    }
  } catch (err) {
    console.error('Eroare neasteptata la autentificare:', err)
    return { error: 'A apărut o problemă la autentificare. Te rugăm să încerci din nou.' }
  }

  // Sesiunea există de aici încolo, deci comenzile plasate anterior fără cont
  // pot fi legate acum de el.
  await claimGuestOrders(supabase)

  window.location.assign('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string

  if (!email || !password || !firstName || !lastName) {
    return { error: 'Toate câmpurile obligatorii trebuie completate.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Parolele nu coincid.' }
  }

  if (password.length < 6) {
    return { error: 'Parola trebuie să aibă cel puțin 6 caractere.' }
  }

  // Sign up with user metadata.
  // Orice excepție neașteptată (rețea, Supabase indisponibil) ar ajunge altfel
  // la error boundary, iar utilizatorul ar vedea pagina generică "Ceva nu a
  // funcționat corect" în loc de un mesaj în formular.
  let signUpData
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
        },
      },
    })

    if (error) {
      if (error.message.includes('User already registered')) {
        return { error: 'Acest e-mail este deja înregistrat.' }
      }
      return { error: error.message }
    }

    signUpData = data
  } catch (err) {
    console.error('Eroare neasteptata la inregistrare:', err)
    return { error: 'A apărut o problemă la crearea contului. Te rugăm să încerci din nou.' }
  }

  // Când confirmarea pe email este activă, Supabase nu spune că adresa există
  // deja: întoarce succes cu un utilizator fără identități, ca să nu poată fi
  // aflat cine are cont. Fără verificarea asta, cineva care se reînregistrează
  // ar fi trimis pe pagina principală ca și cum contul tocmai s-ar fi creat.
  if (signUpData?.user && signUpData.user.identities?.length === 0) {
    return { error: 'Acest e-mail este deja înregistrat.' }
  }

  // Contul tocmai creat poate prelua comenzile plasate anterior cu același
  // email. Dacă înregistrarea cere confirmare pe email, aici nu există încă
  // sesiune, apelul nu face nimic, iar comenzile vor fi preluate la prima
  // autentificare — de aceea revendicarea stă și în `login`.
  await claimGuestOrders(supabase)

  window.location.assign('/')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()

  window.location.assign('/')
}
