-- =============================================================================
--  03 — FUNCTII RPC, CONSTRANGERI SI VERIFICARI PUNCTUALE
-- =============================================================================
--  Raspunde la intrebarea pe care nu am putut sa o verific din exterior:
--  poate un vizitator fara cont sa plaseze efectiv o comanda?
--
--  Doar citeste catalogul Postgres. Nu poate esua.
--  RULEAZA TOT FISIERUL: Ctrl+A, apoi Run.
-- =============================================================================

with functii_asteptate(fn) as (
  values ('search_products'),('claim_guest_orders')
)

-- Cele doua functii apelate din cod prin .rpc()
select 5 as ord, '5. FUNCTII (RPC)' as sectiune,
       f.fn as obiect,
       case
         when p.oid is null then '### LIPSESTE — apelul din cod va esua ###'
         when p.prosecdef   then 'exista — SECURITY DEFINER'
         else 'exista — security invoker'
       end as rezultat,
       case when p.oid is null then ''
            else 'search_path: ' || coalesce(array_to_string(p.proconfig, ', '), '### NESETAT ###')
                 || '  |  anon poate executa: ' || has_function_privilege('anon', p.oid, 'EXECUTE')::text
                 || '  |  authenticated: '      || has_function_privilege('authenticated', p.oid, 'EXECUTE')::text
       end as detalii
  from functii_asteptate f
  left join pg_proc p
         on p.proname = f.fn
        and p.pronamespace = 'public'::regnamespace

union all

-- Chei straine, unicitati si restrictii pe tabelele tranzactionale.
-- Aici se vede daca order_items are cheie straina catre orders si daca
-- cart_items / favorites au UNIQUE(user_id, product_slug).
select 6, '6. CONSTRANGERI',
       con.conrelid::regclass::text || '  /  ' || con.conname,
       case con.contype when 'f' then 'FOREIGN KEY' when 'u' then 'UNIQUE'
                        when 'p' then 'PRIMARY KEY' when 'c' then 'CHECK' else con.contype::text end,
       pg_get_constraintdef(con.oid)
  from pg_constraint con
 where con.connamespace = 'public'::regnamespace
   and con.conrelid::regclass::text in
       ('orders','order_items','cart_items','favorites','newsletter_subscriptions',
        'addresses','profiles','medical_profiles','reviews')

union all

-- Verificari punctuale de care depinde un flux anume din site
select 7, '7. VERIFICARI PUNCTUALE',
       'orders.user_id accepta NULL  (necesar pentru comanda fara cont)',
       case when col.is_nullable = 'YES' then 'ok — DA'
            else '### NU — checkout-ul de vizitator va esua ###' end,
       'coloana e ' || col.data_type
  from information_schema.columns col
 where col.table_schema = 'public' and col.table_name = 'orders' and col.column_name = 'user_id'

union all

select 7, '7. VERIFICARI PUNCTUALE',
       'orders.guest_email exista  (revendicarea comenzilor de vizitator)',
       case when count(*) > 0 then 'ok — DA' else '### NU — ruleaza setup_guest_orders.sql ###' end,
       ''
  from information_schema.columns
 where table_schema = 'public' and table_name = 'orders' and column_name = 'guest_email'

union all

select 7, '7. VERIFICARI PUNCTUALE',
       'order_items are politica de INSERT  (altfel comanda se salveaza fara produse)',
       case when count(*) > 0 then 'ok — DA' else '### NU — produsele comenzii nu se pot salva ###' end,
       coalesce(string_agg(policyname || ' [' || array_to_string(roles, ',') || ']', '; '), '')
  from pg_policies
 where schemaname = 'public' and tablename = 'order_items' and cmd in ('INSERT','ALL')

union all

select 7, '7. VERIFICARI PUNCTUALE',
       'orders are politica de INSERT pentru anon  (comanda fara cont)',
       case when count(*) > 0 then 'ok — DA' else '### NU — vizitatorul nu poate comanda ###' end,
       coalesce(string_agg(policyname || ' [' || array_to_string(roles, ',') || ']', '; '), '')
  from pg_policies
 where schemaname = 'public' and tablename = 'orders' and cmd in ('INSERT','ALL')
   and ('anon' = any(roles) or 'public' = any(roles))

union all

select 7, '7. VERIFICARI PUNCTUALE',
       'order_items are politica de INSERT pentru anon  (produsele comenzii fara cont)',
       case when count(*) > 0 then 'ok — DA' else '### NU — comanda de vizitator ramane fara produse ###' end,
       coalesce(string_agg(policyname || ' [' || array_to_string(roles, ',') || ']', '; '), '')
  from pg_policies
 where schemaname = 'public' and tablename = 'order_items' and cmd in ('INSERT','ALL')
   and ('anon' = any(roles) or 'public' = any(roles))

order by ord, obiect;
