-- =============================================================================
--  01 — TABELE, RLS SI COLOANE LIPSA
-- =============================================================================
--  Doar citeste catalogul Postgres. Nu atinge niciun tabel, deci nu poate esua.
--  RULEAZA TOT FISIERUL: selecteaza tot (Ctrl+A) in SQL Editor si apasa Run.
-- =============================================================================

with asteptate(tabel) as (
  values ('about_us_content'),('addresses'),('calitate_content'),('cart_items'),
         ('categories'),('contact_messages'),('favorites'),('hero_slides'),
         ('invoices'),('journal_articles'),('medical_profiles'),
         ('newsletter_subscriptions'),('order_items'),('orders'),
         ('payment_methods'),('products'),('profiles'),('promos'),('reviews')
),
coloane_asteptate(tabel, coloana) as (
  values
    ('products','slug'),('products','name'),('products','price'),('products','image_url'),
    ('products','in_stock'),('products','category_slug'),('products','is_bestseller'),
    ('products','is_featured'),('products','is_recommended'),('products','rich_content'),
    ('orders','id'),('orders','user_id'),('orders','total_amount'),('orders','shipping_cost'),
    ('orders','shipping_name'),('orders','shipping_phone'),('orders','shipping_address'),
    ('orders','status'),('orders','guest_email'),('orders','created_at'),
    ('order_items','order_id'),('order_items','product_slug'),('order_items','product_name'),
    ('order_items','quantity'),('order_items','price_at_time'),('order_items','price'),
    ('cart_items','user_id'),('cart_items','product_slug'),('cart_items','quantity'),
    ('cart_items','price'),('cart_items','updated_at'),('cart_items','created_at'),
    ('favorites','user_id'),('favorites','product_slug'),('favorites','created_at'),
    ('profiles','id'),('profiles','first_name'),('profiles','last_name'),('profiles','phone'),
    ('addresses','user_id'),('addresses','type'),('addresses','street'),('addresses','city'),
    ('addresses','county'),('addresses','postal_code'),('addresses','first_name'),
    ('addresses','last_name'),('addresses','phone'),('addresses','is_default'),
    ('newsletter_subscriptions','user_id'),('newsletter_subscriptions','email'),
    ('newsletter_subscriptions','is_subscribed'),
    ('medical_profiles','user_id'),('medical_profiles','allergies'),
    ('medical_profiles','current_treatments'),
    ('contact_messages','name'),('contact_messages','email'),('contact_messages','subject'),
    ('contact_messages','message'),
    ('categories','name'),('categories','slug'),('categories','sort_order'),
    ('categories','group_name')
)

-- Tabelele folosite de cod: exista? au RLS pornit? cate politici au?
select 1 as ord, '1. TABELE + RLS' as sectiune,
       a.tabel as obiect,
       case
         when c.oid is null                then '### LIPSESTE DIN BAZA ###'
         when not c.relrowsecurity         then '### RLS OPRIT — TABEL DESCHIS ###'
         when (select count(*) from pg_policies p
                where p.schemaname = 'public' and p.tablename = a.tabel) = 0
                                           then '### RLS pornit DAR 0 politici (blocheaza tot) ###'
         else 'ok — RLS pornit'
       end as rezultat,
       coalesce((select count(*)::text from pg_policies p
                  where p.schemaname = 'public' and p.tablename = a.tabel), '0') || ' politici' as detalii
  from asteptate a
  left join pg_class c on c.oid = to_regclass('public.' || a.tabel)

union all

-- Coloane pe care codul le foloseste dar care nu exista in tabel.
-- Daca nu apare niciun rand de tip "2. COLOANE LIPSA", inseamna ca schema e completa.
select 2, '2. COLOANE LIPSA',
       ca.tabel || '.' || ca.coloana,
       '### LIPSESTE — codul o foloseste ###',
       ''
  from coloane_asteptate ca
 where to_regclass('public.' || ca.tabel) is not null
   and not exists (
         select 1 from information_schema.columns ic
          where ic.table_schema = 'public'
            and ic.table_name   = ca.tabel
            and ic.column_name  = ca.coloana)

order by ord, obiect;
