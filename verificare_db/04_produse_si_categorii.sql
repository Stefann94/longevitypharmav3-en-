-- =============================================================================
--  04 — INVENTAR, PRODUSE SI CATEGORII
-- =============================================================================
--  Tot ce ar putea strica o pagina in timpul demo-ului: produse fara pret,
--  fara imagine, cu slug duplicat sau cu o categorie care nu exista.
--
--  Citeste tabelele propriu-zise. Daca un tabel lipseste, apare eroarea
--  "relation ... does not exist" — trimite-mi-o asa cum e.
--  Returneaza doar numaratori, niciun nume si niciun email.
--  RULEAZA TOT FISIERUL: Ctrl+A, apoi Run.
-- =============================================================================

select 10 as ord, 'INVENTAR' as sectiune, 'produse' as verificare, count(*)::text as valoare, '' as semnal
  from public.products
union all select 10,'INVENTAR','categorii',          count(*)::text,'' from public.categories
union all select 10,'INVENTAR','articole jurnal',    count(*)::text,'' from public.journal_articles
union all select 10,'INVENTAR','slide-uri hero',     count(*)::text,'' from public.hero_slides
union all select 10,'INVENTAR','promotii',           count(*)::text,'' from public.promos
union all select 10,'INVENTAR','recenzii',           count(*)::text,'' from public.reviews
union all select 10,'INVENTAR','profiluri',          count(*)::text,'' from public.profiles

-- --- Produse ----------------------------------------------------------------
union all select 20,'PRODUSE','fara pret sau cu pret 0', count(*)::text,
       case when count(*) > 0 then '### ATENTIE ###' else 'ok' end
  from public.products where price is null or price <= 0
union all select 20,'PRODUSE','fara imagine (image_url gol)', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — apare placeholder ###' else 'ok' end
  from public.products where image_url is null or btrim(image_url) = ''
union all select 20,'PRODUSE','fara nume', count(*)::text,
       case when count(*) > 0 then '### ATENTIE ###' else 'ok' end
  from public.products where name is null or btrim(name) = ''
union all select 20,'PRODUSE','slug gol', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — pagina inaccesibila ###' else 'ok' end
  from public.products where slug is null or btrim(slug) = ''
union all select 20,'PRODUSE','slug-uri duplicate', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — .single() va da eroare ###' else 'ok' end
  from (select slug from public.products group by slug having count(*) > 1) d
union all select 20,'PRODUSE','marcate ca indisponibile (in_stock=false)', count(*)::text,''
  from public.products where in_stock is false
union all select 20,'PRODUSE','cu category_slug care nu exista in categories', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — breadcrumb fara categorie ###' else 'ok' end
  from public.products p
 where p.category_slug is not null
   and not exists (select 1 from public.categories c where c.slug = p.category_slug)
union all select 20,'PRODUSE','fara descriere', count(*)::text,''
  from public.products where description is null or btrim(description) = ''

-- --- Categorii --------------------------------------------------------------
union all select 25,'CATEGORII','slug-uri duplicate', count(*)::text,
       case when count(*) > 0 then '### ATENTIE ###' else 'ok' end
  from (select slug from public.categories group by slug having count(*) > 1) d
union all select 25,'CATEGORII','categorii fara niciun produs', count(*)::text,
       case when count(*) > 0 then 'pagina va fi goala' else 'ok' end
  from public.categories c
 where not exists (select 1 from public.products p where p.category_slug = c.slug)

-- --- Jurnal -----------------------------------------------------------------
union all select 30,'JURNAL','articole cu slug gol', count(*)::text,
       case when count(*) > 0 then '### ATENTIE ###' else 'ok' end
  from public.journal_articles where slug is null or btrim(slug) = ''
union all select 30,'JURNAL','slug-uri duplicate', count(*)::text,
       case when count(*) > 0 then '### ATENTIE ###' else 'ok' end
  from (select slug from public.journal_articles group by slug having count(*) > 1) d

order by ord, verificare;
