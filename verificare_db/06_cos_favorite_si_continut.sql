-- =============================================================================
--  06 — COS, FAVORITE, NEWSLETTER SI CONTINUT EDITORIAL
-- =============================================================================
--  Verifica daca lipsesc constrangerile de unicitate care ar lasa acelasi
--  produs sa apara de doua ori in cos sau la favorite, si daca paginile de
--  continut au ce afisa.
--
--  Returneaza doar numaratori, niciun nume si niciun email.
--  RULEAZA TOT FISIERUL: Ctrl+A, apoi Run.
-- =============================================================================

select 50 as ord, 'COS' as sectiune, 'randuri in cart_items' as verificare,
       count(*)::text as valoare, '' as semnal
  from public.cart_items
union all select 50,'COS','cantitate <= 0', count(*)::text,
       case when count(*) > 0 then '### ATENTIE ###' else 'ok' end
  from public.cart_items where quantity is null or quantity <= 0
union all select 50,'COS','cu slug care nu exista in products', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — apare "Produs" fara imagine ###' else 'ok' end
  from public.cart_items ci
 where not exists (select 1 from public.products p where p.slug = ci.product_slug)
union all select 50,'COS','acelasi produs de doua ori pentru acelasi user', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — lipseste UNIQUE(user_id, product_slug) ###' else 'ok' end
  from (select user_id, product_slug from public.cart_items
         group by user_id, product_slug having count(*) > 1) d

-- --- Favorite ---------------------------------------------------------------
union all select 55,'FAVORITE','randuri in favorites', count(*)::text,'' from public.favorites
union all select 55,'FAVORITE','cu slug care nu exista in products', count(*)::text,
       case when count(*) > 0 then 'apare gol in panou' else 'ok' end
  from public.favorites f
 where not exists (select 1 from public.products p where p.slug = f.product_slug)
union all select 55,'FAVORITE','acelasi produs de doua ori pentru acelasi user', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — lipseste UNIQUE(user_id, product_slug) ###' else 'ok' end
  from (select user_id, product_slug from public.favorites
         group by user_id, product_slug having count(*) > 1) d

-- --- Newsletter -------------------------------------------------------------
union all select 60,'NEWSLETTER','total abonari', count(*)::text,''
  from public.newsletter_subscriptions
union all select 60,'NEWSLETTER','abonari active', count(*)::text,''
  from public.newsletter_subscriptions where is_subscribed is true
union all select 60,'NEWSLETTER','adrese duplicate', count(*)::text,
       case when count(*) > 0 then '### ATENTIE — lipseste UNIQUE(email) ###' else 'ok' end
  from (select lower(email) e from public.newsletter_subscriptions
         where email is not null group by lower(email) having count(*) > 1) d

-- --- Continut editorial -----------------------------------------------------
union all select 70,'CONTINUT','mesaje contact',     count(*)::text,'' from public.contact_messages
union all select 70,'CONTINUT','sectiuni despre noi',count(*)::text,'' from public.about_us_content
union all select 70,'CONTINUT','sectiuni calitate',  count(*)::text,'' from public.calitate_content
union all select 70,'CONTINUT','metode de plata',    count(*)::text,'' from public.payment_methods
union all select 70,'CONTINUT','facturi',            count(*)::text,'' from public.invoices

order by ord, verificare;
