-- =============================================================================
--  REDENUMIRE BRAND: "Longevity Farma" -> "Longevity Pharma"
-- =============================================================================
--  CE S-A FACUT DEJA, IN COD
--  Toate textele si logo-urile din aplicatie au fost schimbate: antet, subsol,
--  titluri de pagina, metadate, emailuri de confirmare. Au fost 23 de fisiere.
--
--  CE A RAMAS, AICI
--  Brandul apare si in continutul din baza de date, care nu tine de cod:
--  Lista de mai jos este rezultatul cautarii din pasul 1, rulata pe baza reala:
--    - products.brand                  19 randuri cu "LongevityFarma"
--    - journal_articles.author          4 randuri
--    - journal_articles.content         2 randuri
--    - calitate_content.description     1 rand
--
--  `calitate_content` nu fusese anticipat: tabelul este protejat de RLS si nu
--  putea fi vazut din exterior. De aceea pasul 1 cauta singur prin toate
--  coloanele de text, in loc sa se bazeze pe o lista scrisa de mana.
--
--  ATENTIE — CE NU SE ATINGE
--  In texte exista cuvintele romanesti "farmacie", "farmaciile" si
--  "farmaceutic". Toate incep cu litera mica, iar inlocuirea de mai jos cauta
--  strict "Farma" cu F mare. Astfel cuvintele obisnuite raman neatinse.
--  Aceeasi regula a fost folosita si la modificarile din cod.
--
--  DE RULAT: Supabase Dashboard -> SQL Editor.
--  Ruleaza intai PASUL 1 singur, ca sa vezi ce urmeaza sa se schimbe.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- PASUL 1 — CAUTARE: unde mai apare brandul vechi?
-- -----------------------------------------------------------------------------
-- Trece prin toate coloanele de text din schema `public` si numara aparitiile.
-- Doar citeste, nu modifica nimic. Ruleaza-l si uita-te la rezultat inainte de
-- pasul 2 — asa vezi si tabelele pe care nu le-am putut inspecta din afara.

drop table if exists gasit_brand;
create temp table gasit_brand (tabel text, coloana text, randuri bigint);

do $$
declare
  r record;
  n bigint;
begin
  for r in
    select c.table_name, c.column_name
      from information_schema.columns c
      join information_schema.tables t
        on t.table_schema = c.table_schema
       and t.table_name = c.table_name
     where c.table_schema = 'public'
       and t.table_type = 'BASE TABLE'
       and c.data_type in ('text', 'character varying')
  loop
    execute format(
      'select count(*) from public.%I where %I like %L',
      r.table_name, r.column_name, '%Farma%'
    ) into n;

    if n > 0 then
      insert into gasit_brand values (r.table_name, r.column_name, n);
    end if;
  end loop;
end $$;

select * from gasit_brand order by randuri desc, tabel, coloana;


-- -----------------------------------------------------------------------------
-- PASUL 2 — INLOCUIREA
-- -----------------------------------------------------------------------------
-- Ruleaza-l dupa ce ai vazut rezultatul pasului 1.
-- Clauzele `where` fac operatia repetabila: randurile deja corecte nu sunt
-- atinse a doua oara, deci poti rula fisierul de mai multe ori fara efecte.

-- Marca produselor: "LongevityFarma" -> "LongevityPharma"
update public.products
   set brand = replace(brand, 'Farma', 'Pharma')
 where brand like '%Farma%';

-- Textul de pe pagina "Calitate" — gasit de cautarea din pasul 1
update public.calitate_content
   set description = replace(description, 'Farma', 'Pharma')
 where description like '%Farma%';

-- Articolele din jurnal: numele autorului si textul articolului
update public.journal_articles
   set author  = replace(author,  'Farma', 'Pharma'),
       content = replace(content, 'Farma', 'Pharma')
 where author like '%Farma%'
    or content like '%Farma%';


-- -----------------------------------------------------------------------------
-- PASUL 3 — VERIFICARE
-- -----------------------------------------------------------------------------
-- Ambele trebuie sa returneze 0.

select count(*) as produse_ramase_cu_brandul_vechi
  from public.products
 where brand like '%Farma%';

select count(*) as articole_ramase_cu_brandul_vechi
  from public.journal_articles
 where author like '%Farma%' or content like '%Farma%';

select count(*) as calitate_ramas_cu_brandul_vechi
  from public.calitate_content
 where description like '%Farma%';

-- Marcile existente dupa modificare — "LongevityPharma" trebuie sa apara cu 19:
select brand, count(*) as bucati
  from public.products
 group by brand
 order by bucati desc;


-- =============================================================================
--  DACA PASUL 1 A GASIT SI ALTE TABELE
-- =============================================================================
--  Cel mai probabil `about_us_content`, pe care nu l-am putut verifica.
--  Pentru fiecare pereche tabel/coloana aparuta in rezultat, adauga o linie
--  dupa acelasi tipar, inlocuind NUMELE_TABELULUI si NUMELE_COLOANEI:
--
--      update public.NUMELE_TABELULUI
--         set NUMELE_COLOANEI = replace(NUMELE_COLOANEI, 'Farma', 'Pharma')
--       where NUMELE_COLOANEI like '%Farma%';
--
--  Trimite-mi rezultatul pasului 1 si ti le scriu eu pe toate.
-- =============================================================================
