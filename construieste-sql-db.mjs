// Construieste fisierul SQL care traduce continutul bazei de date englezesti.
//
// ATENTIE: acest script NU traduce nimic. Face exclusiv cautari exacte in
// dictionarele scrise de mana (traduceri-db.mjs si traduceri-db2.mjs) si se
// opreste cu eroare daca intalneste un text fara corespondent. Asa nu poate
// strecura o traducere inventata sau sa lase ceva netradus fara sa se observe.
//
// Nu scrie nimic in baza de date. Produce doar fisierul en-04-traducere-continut.sql.

import fs from 'fs';
import * as T from './traduceri-db.mjs';
import * as T2 from './traduceri-db2.mjs';

const lipsa = [];

// Cauta exact; daca nu gaseste, retine problema si intoarce textul original
// (ca sa putem raporta TOATE lipsurile deodata, nu doar prima).
function tr(tabel, valoare, unde) {
  if (valoare === null || valoare === undefined) return valoare;
  if (Object.prototype.hasOwnProperty.call(tabel, valoare)) return tabel[valoare];
  lipsa.push(`${unde}: ${JSON.stringify(valoare)}`);
  return valoare;
}

// Escapeaza un sir pentru un literal SQL.
const q = (s) => (s === null || s === undefined) ? 'null' : `'${String(s).split("'").join("''")}'`;

// Coloanele "tags" sunt text[] (nu jsonb), deci au nevoie de forma ARRAY[...].
const qArray = (v) => !Array.isArray(v) ? 'null'
  : v.length === 0 ? `'{}'::text[]`
  : `ARRAY[${v.map(q).join(', ')}]::text[]`;

const produse = JSON.parse(fs.readFileSync('tmp-en-products.json', 'utf8'));
const categorii = JSON.parse(fs.readFileSync('tmp-en-categories.json', 'utf8'));
const jurnal = JSON.parse(fs.readFileSync('tmp-en-journal_articles.json', 'utf8'));
const hero = JSON.parse(fs.readFileSync('tmp-en-hero_slides.json', 'utf8'));
const promos = JSON.parse(fs.readFileSync('tmp-en-promos.json', 'utf8'));
const calitate = JSON.parse(fs.readFileSync('tmp-en-calitate_content.json', 'utf8'));

const linii = [];
linii.push('-- Traducerea in engleza a continutului din baza de date.');
linii.push('-- Generat din dictionare scrise manual. NU modifica preturi, id-uri sau sluguri.');
linii.push('-- Ruleaza-l DOAR in proiectul Supabase ENGLEZESC (ceyxsfcnrnrbyaaeqduh).');
linii.push('');
linii.push('begin;');
linii.push('');

// --- Oprire de siguranta: refuza sa ruleze in baza romaneasca -----------------
// Garda de siguranta. Numele romanesti exista in AMBELE baze, deci ele singure
// nu deosebesc baza engleza de cea romaneasca. Semnele care chiar le deosebesc:
// preturile in EUR (astaxantina 18.90 EUR fata de 95 RON) si faptul ca baza
// engleza este noua, deci nu are inca nicio comanda si niciun cont.
linii.push(`-- Opreste executia daca nu esti in baza ENGLEZA sau daca traducerea a rulat deja.`);
linii.push(`do $$
declare
  nr_ro       int;
  pret_test   numeric;
  nr_comenzi  int;
  nr_profile  int;
begin
  select count(*) into nr_ro from public.products where name = 'Astaxantină Naturală 12mg';
  if nr_ro = 0 then
    raise exception 'OPRIT: produsele nu mai sunt in romana. Traducerea a rulat deja.';
  end if;

  select price into pret_test from public.products where slug = 'astaxantina';
  if pret_test is null or pret_test > 30 then
    raise exception 'OPRIT: preturile nu sunt in EUR (astaxantina = %). Pare baza ROMANEASCA.', pret_test;
  end if;

  select count(*) into nr_comenzi from public.orders;
  select count(*) into nr_profile from public.profiles;
  if nr_comenzi > 0 or nr_profile > 0 then
    raise exception 'OPRIT: baza are % comenzi si % conturi. Baza engleza este goala, deci esti in baza gresita.', nr_comenzi, nr_profile;
  end if;
end $$;`);
linii.push('');

// --- Produse -----------------------------------------------------------------
linii.push('-- ' + '='.repeat(70));
linii.push(`-- PRODUSE (${produse.length})`);
linii.push('-- ' + '='.repeat(70));

for (const p of produse) {
  const numeEn = tr(T.NUME_PRODUSE, p.slug, `nume produs [${p.slug}]`);
  const descEn = tr(T.DESCRIERI_PRODUSE, p.slug, `descriere produs [${p.slug}]`);
  const numeRo = p.name;

  // {NAME} in dictionar -> numele englezesc al produsului
  const pune = (s) => (s === null || s === undefined) ? s : String(s).split('{NAME}').join(numeEn);
  // textul din baza contine numele ROMANESC; il normalizam inainte de cautare
  const cheie = (s) => (s === null || s === undefined) ? s : String(s).split(numeRo).join('{NAME}');

  const rc = p.rich_content;
  let rcEn = null;

  if (rc && typeof rc === 'object') {
    rcEn = { ...rc };

    if ('banner_text' in rc)
      rcEn.banner_text = pune(tr(T.BANNER_TEXT, cheie(rc.banner_text), `banner_text [${p.slug}]`));

    if ('intro_description' in rc)
      rcEn.intro_description = pune(tr(T.INTRO_DESCRIPTION, cheie(rc.intro_description), `intro_description [${p.slug}]`));

    if (Array.isArray(rc.why_recommend))
      rcEn.why_recommend = rc.why_recommend.map(w =>
        pune(tr(T.WHY_RECOMMEND, cheie(w), `why_recommend [${p.slug}]`)));

    if (Array.isArray(rc.faq))
      rcEn.faq = rc.faq.map(f => ({
        ...f,
        question: pune(tr(T.FAQ_Q, cheie(f.question), `faq.question [${p.slug}]`)),
        answer: pune(tr(T.FAQ_A, cheie(f.answer), `faq.answer [${p.slug}]`)),
      }));

    if (Array.isArray(rc.reviews))
      rcEn.reviews = rc.reviews.map(r => ({
        ...r,
        comment: pune(tr(T.REVIEW_COMMENT, cheie(r.comment), `review.comment [${p.slug}]`)),
        author: tr(T.AUTORI, r.author, `review.author [${p.slug}]`),
        date: traduData(r.date, p.slug),
      }));

    if (Array.isArray(rc.ingredients_table))
      rcEn.ingredients_table = rc.ingredients_table.map(i => ({
        ...i,
        name: tr(T.INGR_NAME, i.name, `ingredient [${p.slug}]`),
        // cantitatile sunt aproape toate numerice (ex. "500 mg") si raman asa;
        // se traduc doar cele cu cuvinte.
        quantity: /[A-Za-zĂÂÎȘȚăâîșț]{3,}/.test(String(i.quantity))
          ? tr(T.INGR_QTY, i.quantity, `cantitate [${p.slug}]`)
          : i.quantity,
      }));
  }

  const taguri = Array.isArray(p.tags)
    ? p.tags.map(t => tr(T2.TAGURI, t, `tag produs [${p.slug}]`))
    : p.tags;

  const seturi = [
    `name = ${q(numeEn)}`,
    `description = ${q(descEn)}`,
  ];
  if (rcEn !== null) seturi.push(`rich_content = ${q(JSON.stringify(rcEn))}::jsonb`);
  if (Array.isArray(taguri)) seturi.push(`tags = ${qArray(taguri)}`);

  linii.push(`update public.products set ${seturi.join(', ')} where id = '${p.id}';`);
}

// Traduce "12 August 2026" -> "12 August 2026" (luna in engleza).
function traduData(data, slug) {
  if (!data) return data;
  const parti = String(data).split(' ');
  if (parti.length !== 3) { lipsa.push(`data recenzie [${slug}]: ${JSON.stringify(data)}`); return data; }
  const luna = tr(T.LUNI, parti[1], `luna recenzie [${slug}]`);
  return `${parti[0]} ${luna} ${parti[2]}`;
}

// --- Categorii ---------------------------------------------------------------
linii.push('');
linii.push('-- ' + '='.repeat(70));
linii.push(`-- CATEGORII (${categorii.length})`);
linii.push('-- ' + '='.repeat(70));
for (const c of categorii) {
  linii.push(
    `update public.categories set name = ${q(tr(T.CATEGORII, c.name, `categorie`))}, ` +
    `group_name = ${q(tr(T.GRUPURI_CATEGORII, c.group_name, `grup categorie`))} ` +
    `where id = '${c.id}';`
  );
}

// --- Articole de jurnal ------------------------------------------------------
linii.push('');
linii.push('-- ' + '='.repeat(70));
linii.push(`-- ARTICOLE JURNAL (${jurnal.length})`);
linii.push('-- ' + '='.repeat(70));
for (const a of jurnal) {
  const en = T2.JURNAL[a.slug];
  if (!en) { lipsa.push(`articol jurnal: ${a.slug}`); continue; }
  const taguri = Array.isArray(a.tags)
    ? a.tags.map(t => tr(T2.TAGURI_JURNAL, t, `tag jurnal [${a.slug}]`))
    : a.tags;
  const seturi = [
    `title = ${q(en.title)}`,
    `summary = ${q(en.summary)}`,
    `content = ${q(en.content)}`,
    `author = ${q(tr(T2.AUTOR_JURNAL, a.author, `autor jurnal`))}`,
  ];
  if (Array.isArray(taguri)) seturi.push(`tags = ${qArray(taguri)}`);
  linii.push(`update public.journal_articles set ${seturi.join(', ')} where id = '${a.id}';`);
}

// --- Hero slides -------------------------------------------------------------
linii.push('');
linii.push('-- ' + '='.repeat(70));
linii.push(`-- SLIDE-URI HERO (${hero.length})`);
linii.push('-- ' + '='.repeat(70));
for (const h of hero) {
  const en = T2.HERO[h.title];
  if (!en) { lipsa.push(`slide hero: ${h.title}`); continue; }
  linii.push(
    `update public.hero_slides set label = ${q(en.label)}, title = ${q(en.title)}, ` +
    `description = ${q(en.description)} where id = '${h.id}';`
  );
}

// --- Promo -------------------------------------------------------------------
linii.push('');
linii.push('-- ' + '='.repeat(70));
linii.push(`-- PROMO (${promos.length})`);
linii.push('-- ' + '='.repeat(70));
for (const p of promos) {
  const en = T2.PROMO[p.title];
  if (!en) { lipsa.push(`promo: ${p.title}`); continue; }
  linii.push(
    `update public.promos set title = ${q(en.title)}, description = ${q(en.description)}, ` +
    `tag = ${q(en.tag)} where id = '${p.id}';`
  );
}

// --- Pagina Calitate ---------------------------------------------------------
linii.push('');
linii.push('-- ' + '='.repeat(70));
linii.push(`-- PAGINA CALITATE (${calitate.length})`);
linii.push('-- ' + '='.repeat(70));
for (const c of calitate) {
  const en = T2.CALITATE[c.section_key];
  if (!en) { lipsa.push(`calitate_content: ${c.section_key}`); continue; }
  linii.push(
    `update public.calitate_content set label = ${q(en.label)}, title = ${q(en.title)}, ` +
    `description = ${q(en.description)} where id = '${c.id}';`
  );
}

linii.push('');
linii.push('commit;');
linii.push('');

// --- Verdict -----------------------------------------------------------------
if (lipsa.length) {
  console.error(`\nOPRIT: ${lipsa.length} texte nu au traducere in dictionar.\n`);
  [...new Set(lipsa)].forEach(l => console.error('  - ' + l));
  console.error('\nNu am scris niciun fisier SQL.');
  process.exit(1);
}

fs.writeFileSync('en-04-traducere-continut.sql', linii.join('\n'), 'utf8');
console.log(`OK. Am scris en-04-traducere-continut.sql`);
console.log(`   produse: ${produse.length} | categorii: ${categorii.length} | jurnal: ${jurnal.length}`);
console.log(`   hero: ${hero.length} | promo: ${promos.length} | calitate: ${calitate.length}`);
