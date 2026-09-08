-- Corecteaza singurul slug care contine un diacritic: omega-3-sălbatic.
--
-- De ce conteaza: exportul static creeaza fisierul out/produs/omega-3-sălbatic.html,
-- iar sitemap-ul il refera codat ca omega-3-s%C4%83lbatic. La arhivare pe Windows
-- si dezarhivare pe serverul Linux al Hostico, numele cu diacritic poate ajunge
-- cu alta codificare decat cea pe care o cere Apache, iar produsul da 404.
--
-- Slug-ul nu este referit hardcodat nicaieri in cod; se citeste doar din baza.
-- Ruleaza-l DOAR in proiectul Supabase ENGLEZESC.

begin;

do $$
declare
  nr int;
begin
  select count(*) into nr from public.products where slug = 'omega-3-sălbatic';
  if nr = 0 then
    raise exception 'OPRIT: nu exista produsul cu slug-ul omega-3-sălbatic (corectura a rulat deja sau esti in baza gresita).';
  end if;

  if exists (select 1 from public.products where slug = 'omega-3-wild-fish-oil') then
    raise exception 'OPRIT: slug-ul omega-3-wild-fish-oil este deja folosit de alt produs.';
  end if;
end $$;

update public.products
set slug = 'omega-3-wild-fish-oil'
where id = 'bb8181ab-19ea-4f30-a29c-2d77c0b1e134'
  and slug = 'omega-3-sălbatic';

commit;

-- Verificare: ar trebui sa intoarca un singur rand, cu slug-ul nou.
-- select slug, name from public.products where id = 'bb8181ab-19ea-4f30-a29c-2d77c0b1e134';
