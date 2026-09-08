-- =============================================================================
--  07 — DIAGNOSTIC: comenzile goale, totalurile gresite si categoriile rupte
-- =============================================================================
--  Raportul precedent a aratat 9 comenzi fara niciun produs SI 9 comenzi cu
--  total gresit. Trebuie sa stiu daca sunt aceleasi 9 (o singura problema) sau
--  doua probleme diferite — raspunsul schimba complet gravitatea.
--
--  Doar citeste. Nu returneaza nume, email, telefon sau adresa: doar primele 8
--  caractere din id-ul comenzii (exact ce afiseaza si site-ul ca "Comanda #").
--  RULEAZA TOT FISIERUL: Ctrl+A, apoi Run.
-- =============================================================================

-- A. Comenzile fara niciun produs. Astea apar in /account/comenzi cu textul
--    "Produsele nu pot fi afisate momentan."
select 'A. COMENZI GOALE' as sectiune,
       upper(left(o.id::text, 8)) as comanda,
       to_char(o.created_at, 'YYYY-MM-DD HH24:MI') as data,
       case when o.user_id is null then 'vizitator' else 'cont' end
         || '  |  total: ' || coalesce(o.total_amount::text, '—')
         || '  |  transport: ' || coalesce(o.shipping_cost::text, '—') as detalii
  from public.orders o
 where not exists (select 1 from public.order_items oi where oi.order_id = o.id)

union all

-- B. Comenzi care CHIAR AU produse, dar al caror total nu se potriveste.
--    Daca aici nu apare niciun rand, inseamna ca cele 9 totaluri gresite erau
--    doar cele 9 comenzi goale, iar calculul din checkout este corect.
select 'B. TOTAL GRESIT (cu produse)',
       upper(left(t.id::text, 8)),
       'salvat: ' || t.total_salvat::text,
       'calculat: ' || t.total_calculat::text || '   (produse: ' || t.suma_produse::text
         || ' + transport: ' || t.transport::text || ')'
  from (
    select o.id,
           round(coalesce(o.total_amount, 0)::numeric, 2) as total_salvat,
           round((coalesce(sum(oi.price_at_time * oi.quantity), 0) + coalesce(o.shipping_cost, 0))::numeric, 2) as total_calculat,
           round(coalesce(sum(oi.price_at_time * oi.quantity), 0)::numeric, 2) as suma_produse,
           round(coalesce(o.shipping_cost, 0)::numeric, 2) as transport
      from public.orders o
      join public.order_items oi on oi.order_id = o.id   -- JOIN, nu LEFT JOIN: doar comenzi cu produse
     group by o.id, o.total_amount, o.shipping_cost
    having round((coalesce(sum(oi.price_at_time * oi.quantity), 0) + coalesce(o.shipping_cost, 0))::numeric, 2)
        <> round(coalesce(o.total_amount, 0)::numeric, 2)
  ) t

union all

-- C. Comenzi cu produse la care transportul nu respecta pragul de 200 lei.
select 'C. TRANSPORT GRESIT (cu produse)',
       upper(left(t2.id::text, 8)),
       'produse: ' || t2.suma_produse::text,
       'transport salvat: ' || t2.transport::text
         || '   (asteptat: ' || case when t2.suma_produse >= 200 then '0' else '19.99' end || ')'
  from (
    select o.id,
           round(coalesce(sum(oi.price_at_time * oi.quantity), 0)::numeric, 2) as suma_produse,
           round(coalesce(o.shipping_cost, 0)::numeric, 2) as transport
      from public.orders o
      join public.order_items oi on oi.order_id = o.id
     group by o.id, o.shipping_cost
    having (coalesce(sum(oi.price_at_time * oi.quantity), 0) >= 200 and coalesce(o.shipping_cost, 0) <> 0)
        or (coalesce(sum(oi.price_at_time * oi.quantity), 0) <  200 and coalesce(o.shipping_cost, 0) = 0)
  ) t2

union all

-- D. Cele 11 produse al caror category_slug nu exista in tabelul categories.
--    Efect: pe pagina produsului, firul Ariadnei ramane "Acasa / Produs", fara
--    categorie. Nu crapa nimic, codul trateaza cazul.
select 'D. PRODUS CU CATEGORIE INEXISTENTA',
       p.slug,
       'category_slug: ' || coalesce(p.category_slug, '(gol)'),
       ''
  from public.products p
 where p.category_slug is not null
   and not exists (select 1 from public.categories c where c.slug = p.category_slug)

union all

-- E. Se creeaza automat un rand in `profiles` la inregistrarea unui cont nou?
--    Conteaza: addresses si newsletter_subscriptions au cheie straina catre
--    profiles(id). Fara profil, salvarea adresei si abonarea la newsletter
--    esueaza pentru un cont nou-nout — exact ce s-ar intampla daca iti faci
--    cont live in fata intervievatorului.
select 'E. TRIGGER PE auth.users',
       t.tgname,
       'apeleaza: ' || p.proname || '()',
       ''
  from pg_trigger t
  join pg_proc p on p.oid = t.tgfoid
 where t.tgrelid = to_regclass('auth.users')
   and not t.tgisinternal

union all

select 'E. TRIGGER PE auth.users',
       '(numaratoare)',
       'conturi in auth.users: ' || (select count(*)::text from auth.users),
       'randuri in profiles: '   || (select count(*)::text from public.profiles)

order by 1, 2;
