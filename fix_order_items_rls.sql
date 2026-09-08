-- =============================================================================
--  URGENT — order_items are RLS OPRIT
-- =============================================================================
--  CE ARATA RAPORTUL
--  Tabelul public.order_items are 4 politici RLS scrise corect, dar RLS este
--  DEZACTIVAT pe tabel. Politicile exista degeaba: Postgres nici nu se uita la
--  ele cat timp RLS e oprit. Singura poarta ramasa sunt drepturile de rol, iar
--  raportul arata ca rolul `anon` are pe acest tabel:
--
--      SELECT, INSERT, UPDATE, DELETE, TRUNCATE
--
--  Rolul `anon` este cel folosit de cheia publica din browser. Deci, in acest
--  moment, oricine deschide DevTools pe site poate nu doar sa CITEASCA toate
--  cele 72 de randuri (am confirmat asta din exterior), ci si sa le MODIFICE
--  sau sa le STEARGA pe toate.
--
--  Nu am incercat stergerea — e distructiva. Concluzia vine din combinatia
--  "RLS oprit" + "anon are DELETE/TRUNCATE", care este suficienta.
--
--  VESTEA BUNA
--  Nu trebuie scrisa nicio politica. Cele 4 existente sunt exact ce trebuie:
--    - SELECT  : doar produsele din propriile comenzi (verifica orders.user_id)
--    - INSERT  : una pentru `anon` (checkout fara cont) si una pentru user logat
--  E de ajuns sa pornesti RLS si intra toate in vigoare.
--
--  DE RULAT: Supabase Dashboard -> SQL Editor -> tot fisierul -> Run.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- REPARATIA — o singura linie
-- -----------------------------------------------------------------------------
alter table public.order_items enable row level security;


-- -----------------------------------------------------------------------------
-- VERIFICARE IMEDIATA (ruleaza-le dupa)
-- -----------------------------------------------------------------------------
-- 1. Trebuie sa scrie true:
select relrowsecurity as rls_pornit_acum
  from pg_class where oid = 'public.order_items'::regclass;

-- 2. Cele 4 politici care tocmai au intrat in vigoare:
select policyname, cmd, roles
  from pg_policies
 where schemaname = 'public' and tablename = 'order_items'
 order by cmd, policyname;


-- =============================================================================
--  DE TESTAT IN SITE, IMEDIAT DUPA (2 minute)
-- =============================================================================
--  a) Din terminal, cu cheia anon — inainte returna 72 de randuri, acum trebuie
--     sa returneze lista goala `[]`:
--
--       curl "<SUPABASE_URL>/rest/v1/order_items?select=*" \
--            -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>"
--
--  b) Autentificat in site, intra pe /account/comenzi. Comenzile trebuie sa-si
--     arate in continuare produsele. Politica de SELECT se uita la
--     orders.user_id = auth.uid(), deci ar trebui sa fie neschimbat.
--
--  c) Plaseaza o comanda de proba FARA cont si verifica in Table Editor ca
--     randurile din order_items chiar s-au creat. Politica "Permite salvarea
--     produselor din comanda vizitatorului" acopera cazul asta.
--
--  Daca ceva se strica, revii instantaneu la starea de acum cu:
--       alter table public.order_items disable row level security;
-- =============================================================================


-- =============================================================================
--  DUPA INTERVIU — nu acum, nu e urgent
-- =============================================================================
--  1. Politica de INSERT pentru anon are WITH CHECK (true), adica oricine cu
--     cheia publica poate adauga produse la o comanda existenta, daca ii
--     ghiceste UUID-ul. Dupa ce pornesti RLS nu le mai poate CITI inapoi, deci
--     nu mai e o scurgere de date — dar ramane o cale de a polua comanda
--     altcuiva. Stransul suruburilor cere o functie SECURITY DEFINER (o
--     verificare directa pe `orders` din interiorul politicii ar fi filtrata
--     tot de RLS-ul lui `orders` si ar rupe checkout-ul de vizitator).
--     De aceea NU o ating acum: riscul de a strica fluxul inainte de
--     prezentare e mai mare decat cistigul.
--
--  2. Ai politici duplicate, identice ca efect:
--       order_items : "Users can view own order items" + "Users can view their order items"
--       orders      : "Users can view own orders"      + "Users can view their own orders"
--     Nu strica nimic, dar sunt dezordine. La fel, medical_profiles are de doua
--     ori aceeasi constrangere UNIQUE(user_id).
-- =============================================================================
