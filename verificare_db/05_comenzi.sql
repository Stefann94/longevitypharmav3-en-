-- =============================================================================
--  05 — COMENZI SI INTEGRITATEA CALCULULUI DIN CHECKOUT
-- =============================================================================
--  Cel mai important fisier pentru logica. Verifica daca totalul salvat pe
--  comanda se potriveste cu suma produselor plus transportul, si daca a intrat
--  vreodata in baza o cantitate sau un pret invalid — adica daca lipsa
--  validarii din app/checkout/actions.ts a fost deja atinsa in practica.
--
--  Returneaza doar numaratori, niciun nume, email, telefon sau adresa.
--  RULEAZA TOT FISIERUL: Ctrl+A, apoi Run.
-- =============================================================================

select 10 as ord, 'INVENTAR' as sectiune, 'comenzi' as verificare, count(*)::text as valoare, '' as semnal
  from public.orders
union all select 10,'INVENTAR','produse in comenzi', count(*)::text,'' from public.order_items

-- --- Comenzi de vizitator ---------------------------------------------------
union all select 30,'COMENZI','comenzi de vizitator (user_id NULL)', count(*)::text,''
  from public.orders where user_id is null
union all select 30,'COMENZI','comenzi orfane definitiv (fara user_id SI fara guest_email)', count(*)::text,
       case when count(*) > 0 then 'nerevendicabile — normal daca sunt dinainte de migrare' else 'ok' end
  from public.orders where user_id is null and (guest_email is null or btrim(guest_email) = '')
union all select 30,'COMENZI','comenzi de vizitator revendicabile (au guest_email)', count(*)::text,''
  from public.orders where user_id is null and guest_email is not null and btrim(guest_email) <> ''

-- --- Integritatea totalurilor ----------------------------------------------
union all select 30,'COMENZI','comenzi cu total <= 0', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — total invalid ###' else 'ok' end
  from public.orders where total_amount is null or total_amount <= 0
union all select 30,'COMENZI','comenzi fara niciun produs', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — comanda goala in istoric ###' else 'ok' end
  from public.orders o
 where not exists (select 1 from public.order_items oi where oi.order_id = o.id)
union all select 30,'COMENZI','comenzi cu total gresit (total <> suma produse + transport)', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — calculul nu se potriveste ###' else 'ok' end
  from (
    select o.id
      from public.orders o
      left join public.order_items oi on oi.order_id = o.id
     group by o.id, o.total_amount, o.shipping_cost
    having round((coalesce(sum(oi.price_at_time * oi.quantity), 0) + coalesce(o.shipping_cost, 0))::numeric, 2)
        <> round(coalesce(o.total_amount, 0)::numeric, 2)
  ) t
union all select 30,'COMENZI','transport gresit fata de pragul de 200 lei', count(*)::text,
       case when count(*) > 0 then 'de verificat' else 'ok' end
  from (
    select o.id
      from public.orders o
      left join public.order_items oi on oi.order_id = o.id
     group by o.id, o.shipping_cost
    having (coalesce(sum(oi.price_at_time * oi.quantity), 0) >= 200 and coalesce(o.shipping_cost, 0) <> 0)
        or (coalesce(sum(oi.price_at_time * oi.quantity), 0) <  200 and coalesce(o.shipping_cost, 0) = 0)
  ) t2
union all select 30,'COMENZI','statusuri distincte folosite',
       coalesce(string_agg(distinct coalesce(status,'(gol)'), ' | '), '—'), ''
  from public.orders

-- --- Produsele din comenzi: aici se vede daca a intrat vreodata date stricate
union all select 40,'PRODUSE IN COMENZI','cu order_id care nu exista (orfane)', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — lipseste cheia straina ###' else 'ok' end
  from public.order_items oi
 where not exists (select 1 from public.orders o where o.id = oi.order_id)
union all select 40,'PRODUSE IN COMENZI','cantitate <= 0 sau NULL', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — cantitate trimisa de client, nevalidata ###' else 'ok' end
  from public.order_items where quantity is null or quantity <= 0
union all select 40,'PRODUSE IN COMENZI','cantitate suspect de mare (peste 100)', count(*)::text,
       case when count(*) > 0 then 'de verificat' else 'ok' end
  from public.order_items where quantity > 100
union all select 40,'PRODUSE IN COMENZI','pret <= 0 sau NULL', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — pret manipulat sau produs lipsa ###' else 'ok' end
  from public.order_items where price_at_time is null or price_at_time <= 0
union all select 40,'PRODUSE IN COMENZI','cu slug care nu mai exista in products', count(*)::text,
       case when count(*) > 0 then 'link mort in istoricul comenzilor' else 'ok' end
  from public.order_items oi
 where not exists (select 1 from public.products p where p.slug = oi.product_slug)
union all select 40,'PRODUSE IN COMENZI','pret salvat diferit de pretul actual al produsului', count(*)::text,
       case when count(*) > 0 then 'normal daca ai schimbat preturi intre timp' else 'ok' end
  from public.order_items oi
  join public.products p on p.slug = oi.product_slug
 where round(oi.price_at_time::numeric, 2) <> round(p.price::numeric, 2)

order by ord, verificare;
