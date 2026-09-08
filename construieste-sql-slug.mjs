// Construieste en-06-slug-engleze.sql: traduce slug-urile din baza de date.
//
// Ca si la traducerea continutului, acest script nu inventeaza nimic: face doar
// cautari exacte in traduceri-slug.mjs si se opreste daca gaseste un slug fara
// corespondent. Nu scrie in baza de date.

import fs from 'fs';
import * as S from './traduceri-slug.mjs';

const lipsa = [];
const q = (s) => `'${String(s).split("'").join("''")}'`;

const produse = JSON.parse(fs.readFileSync('tmp-en-products.json', 'utf8'));
const categorii = JSON.parse(fs.readFileSync('tmp-en-categories.json', 'utf8'));
const jurnal = JSON.parse(fs.readFileSync('tmp-en-journal_articles.json', 'utf8'));

function tr(tabel, valoare, unde) {
  if (valoare === null || valoare === undefined) return valoare;
  if (Object.prototype.hasOwnProperty.call(tabel, valoare)) return tabel[valoare];
  lipsa.push(`${unde}: ${JSON.stringify(valoare)}`);
  return valoare;
}

const L = [];
L.push('-- Slug-urile devin englezesti (URL-urile produselor, categoriilor si articolelor).');
L.push('-- Ruleaza-l DOAR in proiectul Supabase ENGLEZESC, si DUPA en-04.');
L.push('--');
L.push('-- Dupa rularea acestui fisier, site-ul TREBUIE reconstruit si reurcat:');
L.push('-- paginile statice sunt generate dupa slug, deci vechile fisiere HTML nu');
L.push('-- mai corespund noilor adrese.');
L.push('');
L.push('begin;');
L.push('');
L.push(`do $$
declare
  nr_ro       int;
  nr_comenzi  int;
  nr_profile  int;
begin
  -- Trebuie sa fim in baza ENGLEZA: continutul deja tradus, dar slug-urile inca romanesti.
  select count(*) into nr_ro from public.products where slug = 'carbune-activat';
  if nr_ro = 0 then
    raise exception 'OPRIT: nu am gasit slug-urile romanesti. Traducerea a rulat deja sau esti in baza gresita.';
  end if;

  if not exists (select 1 from public.products where name = 'Activated Charcoal') then
    raise exception 'OPRIT: continutul nu este tradus. Ruleaza mai intai en-04-traducere-continut.sql.';
  end if;

  select count(*) into nr_comenzi from public.orders;
  select count(*) into nr_profile from public.profiles;
  if nr_comenzi > 0 or nr_profile > 0 then
    raise exception 'OPRIT: baza are % comenzi si % conturi. Baza engleza este goala, deci esti in baza gresita.', nr_comenzi, nr_profile;
  end if;
end $$;`);
L.push('');

L.push('-- ' + '='.repeat(70));
L.push(`-- CATEGORII (${categorii.length})`);
L.push('-- ' + '='.repeat(70));
for (const c of categorii) {
  L.push(`update public.categories set slug = ${q(tr(S.SLUG_CATEGORII, c.slug, 'slug categorie'))} where id = '${c.id}';`);
}

L.push('');
L.push('-- ' + '='.repeat(70));
L.push(`-- PRODUSE (${produse.length}) - slug si category_slug denormalizat`);
L.push('-- ' + '='.repeat(70));
for (const p of produse) {
  const seturi = [`slug = ${q(tr(S.SLUG_PRODUSE, p.slug, 'slug produs'))}`];
  if (p.category_slug) {
    seturi.push(`category_slug = ${q(tr(S.SLUG_CATEGORII, p.category_slug, 'category_slug'))}`);
  }
  L.push(`update public.products set ${seturi.join(', ')} where id = '${p.id}';`);
}

L.push('');
L.push('-- ' + '='.repeat(70));
L.push(`-- ARTICOLE JURNAL (${jurnal.length})`);
L.push('-- ' + '='.repeat(70));
for (const a of jurnal) {
  L.push(`update public.journal_articles set slug = ${q(tr(S.SLUG_JURNAL, a.slug, 'slug articol'))} where id = '${a.id}';`);
}

L.push('');
L.push('-- Verificare finala: nu trebuie sa mai existe niciun slug cu diacritice');
L.push('-- sau cu litere in afara setului a-z, 0-9 si cratima.');
L.push(`do $$
declare
  nr int;
begin
  select count(*) into nr from public.products where slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$';
  if nr > 0 then raise exception 'OPRIT: % slug-uri de produs au format invalid.', nr; end if;

  select count(*) into nr from public.categories where slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$';
  if nr > 0 then raise exception 'OPRIT: % slug-uri de categorie au format invalid.', nr; end if;

  select count(*) into nr from public.journal_articles where slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$';
  if nr > 0 then raise exception 'OPRIT: % slug-uri de articol au format invalid.', nr; end if;

  select count(*) into nr from (select slug from public.products group by slug having count(*) > 1) t;
  if nr > 0 then raise exception 'OPRIT: % slug-uri de produs sunt duplicate.', nr; end if;
end $$;`);
L.push('');
L.push('commit;');
L.push('');

if (lipsa.length) {
  console.error(`\nOPRIT: ${lipsa.length} slug-uri fara traducere.\n`);
  [...new Set(lipsa)].forEach(l => console.error('  - ' + l));
  process.exit(1);
}

fs.writeFileSync('en-06-slug-engleze.sql', L.join('\n'), 'utf8');
console.log('OK. Am scris en-06-slug-engleze.sql');
console.log(`   produse: ${produse.length} | categorii: ${categorii.length} | articole: ${jurnal.length}`);
