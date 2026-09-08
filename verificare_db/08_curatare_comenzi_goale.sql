-- =============================================================================
--  08 — CURATAREA COMENZILOR GOALE
-- =============================================================================
--  RULEAZA ASTA DOAR DACA in /account/comenzi vezi textul
--  "Produsele nu pot fi afisate momentan."
--
--  Sunt 9 comenzi in baza care nu au niciun produs atasat. Ele apar in istoric
--  ca niste comenzi fara continut. Cauza este in cod: comanda si produsele ei
--  se salveaza in doua operatii separate, fara tranzactie, deci daca a doua
--  esueaza, prima ramane. Aici doar curatam urmele, nu reparam cauza.
--
--  Fisierul are DOUA parti. Partea 1 doar se uita. Partea 2 sterge, si este
--  comentata intentionat — o activezi tu, dupa ce te uiti la ce ai de sters.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- PARTEA 1 — UITA-TE INTAI (doar citeste, nu modifica nimic)
-- -----------------------------------------------------------------------------
-- Iti arata exact ce ar disparea. Verifica numarul de randuri: trebuie sa fie 9.
-- Daca iese alt numar, opreste-te si spune-mi.
select upper(left(o.id::text, 8))                          as comanda,
       to_char(o.created_at, 'YYYY-MM-DD HH24:MI')         as data,
       case when o.user_id is null then 'vizitator' else 'cont' end as tip,
       o.total_amount                                       as total,
       o.status                                             as status
  from public.orders o
 where not exists (select 1 from public.order_items oi where oi.order_id = o.id)
 order by o.created_at desc;


-- -----------------------------------------------------------------------------
-- PARTEA 2 — STERGEREA
-- -----------------------------------------------------------------------------
--  ATENTIE: sterge definitiv randurile listate mai sus. Nu se poate anula.
--  Nu atinge nicio comanda care are macar un produs — conditia `not exists`
--  este exact aceeasi ca la PARTEA 1, deci sterge fix ce ai vazut acolo.
--
--  Sterge cele doua caractere `--` de la inceputul liniei de mai jos si ruleaza.
--
-- delete from public.orders o
--  where not exists (select 1 from public.order_items oi where oi.order_id = o.id);


-- -----------------------------------------------------------------------------
-- VERIFICARE DUPA STERGERE — trebuie sa dea 0
-- -----------------------------------------------------------------------------
-- select count(*) as comenzi_goale_ramase
--   from public.orders o
--  where not exists (select 1 from public.order_items oi where oi.order_id = o.id);
