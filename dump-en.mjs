import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env.local','utf8').split(/\r?\n/)
  .filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()]}))
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {auth:{persistSession:false}})
for (const t of ['products','categories','journal_articles','hero_slides','reviews','promos','calitate_content']) {
  const { data, error } = await sb.from(t).select('*')
  if (error) { console.log(`${t}: EROARE ${error.message}`); continue }
  const cols = data.length ? Object.keys(data[0]) : []
  console.log(`\n### ${t}  (${data.length} randuri)`)
  console.log('coloane: ' + cols.join(', '))
  fs.writeFileSync(`./tmp-en-${t}.json`, JSON.stringify(data,null,1))
}
