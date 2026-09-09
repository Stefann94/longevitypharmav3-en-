-- Creeaza declansatorul care lipsea: profilul unui utilizator nou.
--
-- De ce lipsea: en-01-structura.sql a fost obtinut cu `supabase db dump`, care
-- NU exporta zona `auth`. Functia public.handle_new_user() a venit in dump
-- (este in schema `public`), dar declansatorul care o apeleaza este definit pe
-- auth.users, deci a ramas in urma. Rezultatul: la inregistrare nu se creeaza
-- randul din public.profiles.
--
-- Efectul vizibil: pagina "Account details" apare goala si formularul de
-- checkout nu se precompleteaza. Nu da eroare - codul trateaza lipsa randului -
-- dar difera de site-ul romanesc, unde declansatorul exista.
--
-- Ruleaza-l DOAR in proiectul Supabase ENGLEZESC.

begin;

-- Garda: trebuie sa fim in baza ENGLEZA (continutul e tradus) si declansatorul
-- sa nu existe deja.
do $$
begin
  if not exists (select 1 from public.products where name = 'Activated Charcoal') then
    raise exception 'OPRIT: produsele nu sunt in engleza. Pare baza ROMANEASCA sau alta baza.';
  end if;

  if exists (
    select 1 from pg_trigger
    where tgname = 'on_auth_user_created'
      and tgrelid = 'auth.users'::regclass
  ) then
    raise exception 'OPRIT: declansatorul on_auth_user_created exista deja.';
  end if;
end $$;

-- 1. Declansatorul propriu-zis
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Recupereaza utilizatorii inregistrati inainte de corectura, ca sa nu ramana
--    fara profil. Nu atinge randurile existente.
insert into public.profiles (id, first_name, last_name, phone)
select u.id,
       u.raw_user_meta_data->>'first_name',
       u.raw_user_meta_data->>'last_name',
       u.raw_user_meta_data->>'phone'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 3. Verificare: fiecare utilizator trebuie sa aiba acum profil.
do $$
declare
  nr_fara int;
begin
  select count(*) into nr_fara
  from auth.users u
  left join public.profiles p on p.id = u.id
  where p.id is null;

  if nr_fara > 0 then
    raise exception 'OPRIT: % utilizatori au ramas fara profil.', nr_fara;
  end if;
end $$;

commit;

-- Dupa rulare, verificarea de mai jos ar trebui sa intoarca acelasi numar de
-- randuri in ambele coloane:
-- select (select count(*) from auth.users) as utilizatori,
--        (select count(*) from public.profiles) as profiluri;
