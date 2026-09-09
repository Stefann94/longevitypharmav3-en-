import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const env=Object.fromEntries(fs.readFileSync('.env.local','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()]}))
const url = env.NEXT_PUBLIC_SUPABASE_URL, anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const sb = createClient(url, anon, {auth:{persistSession:false}})

// 1. raspunde serviciul de autentificare?
const r = await fetch(url + '/auth/v1/settings', { headers: { apikey: anon } })
console.log('1) serviciul auth: HTTP ' + r.status)
if (r.ok) {
  const s = await r.json()
  console.log('   inregistrare permisa (disable_signup): ' + s.disable_signup)
  console.log('   autentificare cu parola  : ' + (s.external?.email ?? 'n/a'))
  console.log('   confirmare email ceruta  : ' + (s.mailer_autoconfirm === false ? 'DA' : 'nu'))
}

// 2. cum raspunde o autentificare cu un cont inexistent?
const { error } = await sb.auth.signInWithPassword({ email: 'inexistent-test@example.com', password: 'ParolaGresita123!' })
console.log('2) login cont inexistent: ' + (error ? error.status + ' / ' + error.message : 'a mers?!'))

// 3. exista profiluri in baza?
const { count, error: e3 } = await sb.from('profiles').select('*', { count: 'exact', head: true })
console.log('3) randuri in profiles  : ' + (e3 ? 'EROARE ' + e3.message : count))
