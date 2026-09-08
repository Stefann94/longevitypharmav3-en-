-- =============================================================================
--  Revendicarea comenzilor plasate fara cont
-- =============================================================================
--  PROBLEMA
--  Pana acum, o comanda plasata fara cont se salva cu user_id = NULL si fara
--  nicio informatie despre cine a plasat-o: emailul din formular era folosit
--  doar ca sa se trimita confirmarea. Comanda ramanea orfana, deci logarea
--  ulterioara nu avea cum sa o recupereze.
--
--  SOLUTIA
--  1. Salvam emailul pe comanda de vizitator.
--  2. La autentificare, legam automat de cont comenzile orfane care au acelasi
--     email, dar numai daca acel email a fost confirmat.
--
--  DE RULAT
--  Supabase Dashboard -> SQL Editor -> lipeste tot fisierul -> Run.
--  Toate comenzile sunt idempotente: se poate rula de mai multe ori fara efect.
--
--  ATENTIE
--  Comenzile deja plasate ca vizitator raman orfane definitiv: ele nu au emailul
--  salvat, deci nu exista dupa ce sa fie potrivite. Doar comenzile plasate dupa
--  rularea acestui script pot fi revendicate.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Emailul celui care a plasat comanda fara cont
-- -----------------------------------------------------------------------------
-- Ramane NULL pentru comenzile plasate de utilizatori autentificati: acolo
-- legatura se face deja prin user_id.
alter table public.orders
  add column if not exists guest_email text;

comment on column public.orders.guest_email is
  'Emailul din formularul de checkout, salvat doar pentru comenzile fara cont. '
  'Serveste la revendicarea comenzii cand persoana isi face cont sau se logheaza.';


-- -----------------------------------------------------------------------------
-- 2. Index pentru cautarea comenzilor orfane
-- -----------------------------------------------------------------------------
-- Partial (doar comenzile fara cont) si pe lower(), pentru ca potrivirea
-- emailului se face fara sa conteze literele mari.
create index if not exists orders_guest_email_idx
  on public.orders (lower(guest_email))
  where user_id is null;


-- -----------------------------------------------------------------------------
-- 3. Functia de revendicare
-- -----------------------------------------------------------------------------
-- SECURITY DEFINER pentru ca:
--   a) trebuie sa citeasca auth.users ca sa verifice confirmarea emailului;
--   b) trebuie sa modifice randuri care momentan NU apartin nimanui, deci
--      politicile RLS ale utilizatorului le-ar bloca.
--
-- Functia nu primeste niciun parametru: emailul si identitatea sunt luate din
-- sesiune, nu din client. Astfel nimeni nu poate cere revendicarea comenzilor
-- altcuiva trimitand un email arbitrar.
create or replace function public.claim_guest_orders()
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_uid    uuid := auth.uid();
  current_email  text;
  confirmed_at   timestamptz;
  claimed_count  integer;
begin
  -- Fara sesiune nu exista nimic de revendicat.
  if current_uid is null then
    return 0;
  end if;

  select u.email, u.email_confirmed_at
    into current_email, confirmed_at
    from auth.users u
   where u.id = current_uid;

  -- Poarta de siguranta: o comanda contine nume, telefon si adresa completa.
  -- Fara dovada ca emailul chiar ii apartine, oricine s-ar putea inregistra cu
  -- emailul altcuiva ca sa-i vada datele.
  --
  -- ATENTIE: daca "Confirm email" este DEZACTIVAT in Supabase
  -- (Authentication -> Providers -> Email), atunci email_confirmed_at este
  -- completat automat la inregistrare si aceasta verificare trece mereu.
  -- Protectia devine reala doar dupa ce activezi confirmarea.
  if current_email is null or confirmed_at is null then
    return 0;
  end if;

  update public.orders o
     set user_id = current_uid
   where o.user_id is null
     and o.guest_email is not null
     and lower(o.guest_email) = lower(current_email);

  get diagnostics claimed_count = row_count;
  return claimed_count;
end;
$$;

comment on function public.claim_guest_orders() is
  'Leaga de contul curent comenzile plasate fara cont care au acelasi email '
  'confirmat. Returneaza numarul de comenzi revendicate.';

-- Doar utilizatorii autentificati o pot apela. Vizitatorii nu au ce revendica.
revoke all on function public.claim_guest_orders() from public, anon;
grant execute on function public.claim_guest_orders() to authenticated;


-- =============================================================================
--  DE VERIFICAT DUPA RULARE
-- =============================================================================
--  Produsele unei comenzi (tabelul order_items) trebuie sa devina vizibile
--  automat dupa revendicare. Asta se intampla daca politica RLS de pe
--  order_items se uita la proprietarul comenzii parinte, adica arata cam asa:
--
--    exists (
--      select 1 from public.orders o
--       where o.id = order_items.order_id
--         and o.user_id = auth.uid()
--    )
--
--  Verifica in Supabase -> Authentication -> Policies -> order_items.
--  Daca politica de acolo compara altceva (de exemplu un user_id copiat pe
--  order_items), atunci produsele vor lipsi din comenzile revendicate si
--  trebuie actualizata si ea.
-- =============================================================================


-- =============================================================================
--  ANULARE COMPLETA (rollback)
-- =============================================================================
--  Daca vrei sa readuci baza de date exact in starea dinainte, ruleaza blocul
--  de mai jos. Nu il rula din greseala: sterge coloana guest_email cu tot cu
--  datele din ea, deci comenzile plasate fara cont intre timp devin din nou
--  nerevendicabile. Nicio alta informatie nu se pierde: comenzile, produsele
--  lor si legaturile deja facute catre conturi raman neatinse, pentru ca ele
--  stau in user_id, nu in coloana stearsa.
--
--  Sterge caracterele de comentariu de la inceputul celor trei linii ca sa il
--  poti rula.
-- =============================================================================

-- drop function if exists public.claim_guest_orders();
-- drop index if exists public.orders_guest_email_idx;
-- alter table public.orders drop column if exists guest_email;


-- =============================================================================
--  VERIFICARE RAPIDA DUPA RULARE
-- =============================================================================
--  1. Coloana exista?
--       select column_name from information_schema.columns
--        where table_schema = 'public' and table_name = 'orders'
--          and column_name = 'guest_email';
--
--  2. Functia exista?
--       select proname from pg_proc where proname = 'claim_guest_orders';
--
--  3. Nicio comanda existenta nu a fost atinsa (trebuie sa dea 0):
--       select count(*) from public.orders where guest_email is not null;
--
--  Dupa ce plasezi o comanda noua fara cont, aceeasi interogare trebuie sa dea
--  1. Apoi te loghezi cu un cont care are exact acel email, iar comanda trebuie
--  sa apara in /account/comenzi.
-- =============================================================================
