-- =============================================================================
--  02 — POLITICILE RLS SI DREPTURILE ROLURILOR
-- =============================================================================
--  Cel mai important fisier dintre toate. Aici se vede exact ce are voie sa
--  faca un vizitator neautentificat (rolul "anon") cu fiecare tabel.
--
--  CE SA CAUTI: un rand unde coloana "detalii" incepe cu "USING: true" pentru
--  rolul anon sau public. Aceea e o usa deschisa. Pe order_items am gasit deja
--  una din exterior — ar trebui sa apara aici.
--
--  Doar citeste catalogul Postgres. Nu poate esua.
--  RULEAZA TOT FISIERUL: Ctrl+A, apoi Run.
-- =============================================================================

-- Toate politicile RLS, cu conditia lor exacta
select 3 as ord, '3. POLITICI RLS' as sectiune,
       p.tablename || '  /  ' || p.policyname as obiect,
       p.cmd || ' pentru ' || array_to_string(p.roles, ', ') as rezultat,
       'USING: ' || coalesce(p.qual, '—') || '   ||   WITH CHECK: ' || coalesce(p.with_check, '—') as detalii
  from pg_policies p
 where p.schemaname = 'public'

union all

-- Drepturi acordate direct rolurilor anon / authenticated.
-- Un tabel unde anon are UPDATE sau DELETE e semnalat explicit.
select 4, '4. DREPTURI ROL',
       g.table_name || '  ->  ' || g.grantee,
       string_agg(g.privilege_type, ', ' order by g.privilege_type),
       case when g.grantee = 'anon'
             and bool_or(g.privilege_type in ('UPDATE','DELETE','TRUNCATE'))
            then '### anon are drept de scriere/stergere ###' else '' end
  from information_schema.role_table_grants g
 where g.table_schema = 'public'
   and g.grantee in ('anon', 'authenticated')
 group by g.table_name, g.grantee

order by ord, obiect;
