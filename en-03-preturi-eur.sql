-- =============================================================================
--  CONVERSIA PRETURILOR DIN RON IN EUR
-- =============================================================================
--  DE RULAT NUMAI IN BAZA ENGLEZA (proiectul LongevityPharma EN).
--  Daca il rulezi din greseala in baza romaneasca, strici preturile site-ului
--  care este deja live. Verifica sus, in bara Supabase, ca esti in proiectul
--  corect inainte de a apasa Run.
--
--  CURSUL FOLOSIT: 1 EUR = 5.25 RON
--  Cursul BNR din 4 septembrie 2026 era 5.2524. S-a rotunjit la 5.25, o valoare
--  usor conservatoare: daca leul se depreciaza putin, preturile in euro raman
--  acoperitoare.
--
--  ROTUNJIREA: in sus, la urmatoarea valoare terminata in .90
--    30 RON  ->  5.90 EUR      (conversie exacta 5.71)
--    85 RON  -> 16.90 EUR      (conversie exacta 16.19)
--   145 RON  -> 27.90 EUR      (conversie exacta 27.62)
--   350 RON  -> 66.90 EUR      (conversie exacta 66.67)
--
--  Rotunjirea este intotdeauna IN SUS fata de conversia exacta, deci nu se
--  pierde din marja, iar preturile arata a preturi de magazin, nu a rezultate
--  de calculator.
--
--  PROTECTIE IMPOTRIVA RULARII DE DOUA ORI
--  O a doua rulare ar imparti preturile inca o data la 5.25 si le-ar face de
--  cinci ori mai mici. Ca sa nu se poata intampla, conversia se inregistreaza
--  intr-un tabel, iar la a doua incercare scriptul se opreste cu eroare.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- PASUL 1 — PREVIZUALIZARE: ce se va schimba, fara sa se schimbe nimic
-- -----------------------------------------------------------------------------
-- Ruleaza intai doar sectiunea asta si uita-te la rezultat.

select name,
       price                              as pret_actual_ron,
       round(price / 5.25, 2)             as conversie_exacta_eur,
       ceil(price / 5.25 - 0.90) + 0.90   as pret_nou_eur
  from public.products
 order by price desc
 limit 20;


-- -----------------------------------------------------------------------------
-- PASUL 2 — CONVERSIA
-- -----------------------------------------------------------------------------

create table if not exists public.conversii_moneda (
  id            text primary key,
  efectuata_la  timestamptz not null default now(),
  detalii       text
);

alter table public.conversii_moneda enable row level security;
-- Fara politici: tabelul e doar pentru evidenta interna, nu il citeste site-ul.

do $$
declare
  nr_produse int;
begin
  if exists (select 1 from public.conversii_moneda where id = 'ron_to_eur') then
    raise exception
      'OPRIT: conversia RON -> EUR a fost deja rulata pe aceasta baza. O a doua rulare ar imparti preturile inca o data. Daca chiar vrei sa o repeti, sterge intai randul din public.conversii_moneda.';
  end if;

  update public.products
     set price = ceil(price / 5.25 - 0.90) + 0.90;

  get diagnostics nr_produse = row_count;

  insert into public.conversii_moneda (id, detalii)
  values ('ron_to_eur', format('curs 5.25, rotunjire in sus la .90, %s produse', nr_produse));

  raise notice 'Convertite % produse din RON in EUR.', nr_produse;
end $$;


-- -----------------------------------------------------------------------------
-- PASUL 3 — VERIFICARE
-- -----------------------------------------------------------------------------
-- Toate preturile trebuie sa se termine in .90, iar intervalul sa fie
-- aproximativ 5.90 - 66.90 EUR.

select min(price)                                   as cel_mai_mic,
       max(price)                                   as cel_mai_mare,
       round(avg(price), 2)                         as media,
       count(*)                                     as total_produse,
       count(*) filter (where price % 1 <> 0.90)    as preturi_care_nu_se_termina_in_90
  from public.products;

-- Evidenta conversiei
select * from public.conversii_moneda;
