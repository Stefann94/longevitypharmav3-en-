-- =============================================================================
--  CONVERSIA PRETURILOR DIN RON IN EUR — cu protectie impotriva bazei gresite
-- =============================================================================
--  DE CE ARATA ALTFEL FATA DE PRIMA VERSIUNE
--  Prima versiune avea doar un comentariu care spunea "ruleaza numai in baza
--  engleza". Un comentariu nu opreste nimic: fisierul a ajuns sa fie rulat pe
--  baza romaneasca si a impartit la 5.25 preturile site-ului aflat in productie.
--  A trebuit restaurat produs cu produs.
--
--  Versiunea asta refuza sa ruleze daca nu se afla in baza engleza. Verificarea
--  nu se bazeaza pe atentia celui care apasa Run.
--
--  CUM RECUNOASTE BAZA
--  Baza romaneasca este in productie: are comenzi si conturi de clienti. Baza
--  engleza a fost populata doar cu produse si articole, deci `orders` si
--  `profiles` sunt goale. Daca scriptul gaseste fie si o singura comanda sau un
--  singur profil, se opreste cu eroare si nu modifica nimic.
--
--  CURSUL: 1 EUR = 5.25 RON  (BNR, 4 septembrie 2026: 5.2524)
--  ROTUNJIREA: in sus, la urmatoarea valoare terminata in .90
--     30 RON ->  5.90 EUR        145 RON -> 27.90 EUR
--     85 RON -> 16.90 EUR        350 RON -> 66.90 EUR
--  Rezultatul e mereu peste conversia exacta, deci nu se pierde marja.
--
--  A doua rulare pe aceeasi baza este blocata separat, prin tabelul
--  conversii_moneda.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- PASUL 1 — PREVIZUALIZARE
-- -----------------------------------------------------------------------------
-- Nu modifica nimic. Uita-te la rezultat inainte de pasul 2.

select name,
       price                              as pret_actual,
       round(price / 5.25, 2)             as conversie_exacta,
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
  nr_comenzi  bigint;
  nr_profile  bigint;
  nr_produse  int;
begin
  -- ---------------------------------------------------------------------
  -- PROTECTIA: suntem in baza engleza sau in cea romaneasca?
  -- ---------------------------------------------------------------------
  select count(*) into nr_comenzi from public.orders;
  select count(*) into nr_profile from public.profiles;

  if nr_comenzi > 0 or nr_profile > 0 then
    raise exception
      'OPRIT: baza contine % comenzi si % conturi de clienti, deci este baza romaneasca de productie, nu cea engleza. Nu s-a modificat niciun pret.',
      nr_comenzi, nr_profile;
  end if;

  -- ---------------------------------------------------------------------
  -- Protectia impotriva rularii de doua ori pe aceeasi baza
  -- ---------------------------------------------------------------------
  if exists (select 1 from public.conversii_moneda where id = 'ron_to_eur') then
    raise exception
      'OPRIT: conversia a fost deja rulata pe aceasta baza. O a doua rulare ar imparti preturile inca o data. Daca chiar vrei sa o repeti, sterge intai randul din public.conversii_moneda.';
  end if;

  -- ---------------------------------------------------------------------
  -- Conversia propriu-zisa
  -- ---------------------------------------------------------------------
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
-- Intervalul trebuie sa fie aproximativ 5.90 - 66.90, iar ultima coloana 0.

select min(price)                                 as cel_mai_mic,
       max(price)                                 as cel_mai_mare,
       round(avg(price), 2)                       as media,
       count(*)                                   as total_produse,
       count(*) filter (where price % 1 <> 0.90)  as nu_se_termina_in_90
  from public.products;

select * from public.conversii_moneda;
