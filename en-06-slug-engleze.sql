-- Slug-urile devin englezesti (URL-urile produselor, categoriilor si articolelor).
-- Ruleaza-l DOAR in proiectul Supabase ENGLEZESC, si DUPA en-04.
--
-- Dupa rularea acestui fisier, site-ul TREBUIE reconstruit si reurcat:
-- paginile statice sunt generate dupa slug, deci vechile fisiere HTML nu
-- mai corespund noilor adrese.

begin;

do $$
declare
  nr_ro       int;
  nr_comenzi  int;
  nr_profile  int;
begin
  -- Trebuie sa fim in baza ENGLEZA: continutul deja tradus, dar slug-urile inca romanesti.
  select count(*) into nr_ro from public.products where slug = 'carbune-activat';
  if nr_ro = 0 then
    raise exception 'OPRIT: nu am gasit slug-urile romanesti. Traducerea a rulat deja sau esti in baza gresita.';
  end if;

  if not exists (select 1 from public.products where name = 'Activated Charcoal') then
    raise exception 'OPRIT: continutul nu este tradus. Ruleaza mai intai en-04-traducere-continut.sql.';
  end if;

  select count(*) into nr_comenzi from public.orders;
  select count(*) into nr_profile from public.profiles;
  if nr_comenzi > 0 or nr_profile > 0 then
    raise exception 'OPRIT: baza are % comenzi si % conturi. Baza engleza este goala, deci esti in baza gresita.', nr_comenzi, nr_profile;
  end if;
end $$;

-- ======================================================================
-- CATEGORII (12)
-- ======================================================================
update public.categories set slug = 'natural-extracts' where id = '520bb666-e4f9-4dcd-836e-1c4f0a51d8f7';
update public.categories set slug = 'antioxidants-nad' where id = 'cc54dd04-bba1-425d-9abc-1f8d95692a08';
update public.categories set slug = 'focus-memory' where id = 'be81705f-019b-483a-bcfa-e5e0c020ba20';
update public.categories set slug = 'collagen-joints' where id = '5d932272-611b-485f-9dad-0dd5237b3f57';
update public.categories set slug = 'probiotics-digestion' where id = '2557f088-d3c8-4b8c-a1de-d5d562148a61';
update public.categories set slug = 'omega-3-fatty-acids' where id = 'be9ecd6e-2ee2-4ac0-a830-892bd23f792f';
update public.categories set slug = 'longevity-anti-aging' where id = '8a25ff8d-c3e4-45db-ad8b-f7a90ebdab0f';
update public.categories set slug = 'energy-vitality' where id = '495ee2fb-618d-4b15-9672-eece95984a45';
update public.categories set slug = 'immunity-protection' where id = 'c1aec4ab-c87e-48a2-907b-fc45d12558f4';
update public.categories set slug = 'vitamins-minerals' where id = '8e90a941-0501-45d7-956e-5355ed2aae65';
update public.categories set slug = 'heart-health' where id = '6040f8af-9f8c-41f8-9e5d-7e8d112da1c4';
update public.categories set slug = 'sleep-stress' where id = '12c6368f-b94e-403a-98d5-e3af6fc12ebe';

-- ======================================================================
-- PRODUSE (110) - slug si category_slug denormalizat
-- ======================================================================
update public.products set slug = 'grape-seed-extract', category_slug = 'natural-extracts' where id = 'cea8cd2a-40f5-4bb9-89ac-e73f76499353';
update public.products set slug = 'longevity-mushroom-mix', category_slug = 'longevity-anti-aging' where id = 'c3a941dc-1a94-4344-bb6f-755801625aa6';
update public.products set slug = 'magnesium-malate', category_slug = 'energy-vitality' where id = 'e31e3e6c-8953-43c1-af45-9e7e7b80d4a8';
update public.products set slug = 'olive-leaf-extract', category_slug = 'natural-extracts' where id = 'f4a827c1-7d94-4bc1-8e92-7b72399e3456';
update public.products set slug = 'natural-astaxanthin-12mg', category_slug = 'antioxidants-nad' where id = '73ffa516-a754-43c0-945e-ecb471bc9e3c';
update public.products set slug = 'pure-nmn-500mg-anti-aging', category_slug = 'longevity-anti-aging' where id = 'af2c0aa0-9a25-4e8b-a003-70876b266cc7';
update public.products set slug = 'urolithin-a-500mg-extract', category_slug = 'longevity-anti-aging' where id = '0c9fd816-e8c7-4b2f-a6ac-cc508eb11cc3';
update public.products set slug = 'omega-3-wild-fish-oil', category_slug = 'essentials' where id = 'bb8181ab-19ea-4f30-a29c-2d77c0b1e134';
update public.products set slug = 'pure-resveratrol-99', category_slug = 'longevity-anti-aging' where id = 'b3967136-cf6c-4f5f-a1ab-e02dc3b151ee';
update public.products set slug = 'trans-resveratrol-99', category_slug = 'longevity-anti-aging' where id = 'ac7127f6-0f9d-4aec-8fd1-fad4349d83d7';
update public.products set slug = 'activated-b-vitamin-complex', category_slug = 'vitamins-minerals' where id = 'ad2fe80e-abd5-46eb-9562-ccac5f1f1a25';
update public.products set slug = 'moringa-oleifera', category_slug = 'natural-extracts' where id = '139456eb-3285-4589-9469-9f6df70cb715';
update public.products set slug = 'huperzine-a', category_slug = 'focus-memory' where id = 'd51a9642-e960-4673-b5fb-6960ee8144b3';
update public.products set slug = 'grass-fed-bovine-collagen', category_slug = 'collagen-joints' where id = 'bf9ccd48-e039-477f-8300-5a5b41aaa69d';
update public.products set slug = 'celadrin-extract', category_slug = 'collagen-joints' where id = '49574dee-c560-4247-9864-8b0256fe9f32';
update public.products set slug = 'prebiotics-inulin-fos', category_slug = 'probiotics-digestion' where id = 'c541e8ef-1f5f-44b5-af74-a9ab9adf312b';
update public.products set slug = 'l-glutamine-powder-500g', category_slug = 'probiotics-digestion' where id = '84c326a9-a10a-4d0d-97f4-b0837f0e2296';
update public.products set slug = 'rhodiola-rosea', category_slug = 'focus-memory' where id = '93728854-2bd9-401f-8f91-1d1330af3431';
update public.products set slug = 'collagen-peptides-hyaluronic-acid', category_slug = 'longevity-anti-aging' where id = '7befa0fc-f3b9-4dac-849f-ee69de15b96c';
update public.products set slug = 'quercetin-with-bromelain', category_slug = 'essentials' where id = 'cdf1cd23-36e5-4f74-bcdd-7bce788b7f09';
update public.products set slug = 'quercetin-phytosome', category_slug = 'longevity-anti-aging' where id = 'db03e7a0-de49-4e5f-ab0b-f0ffad5a0300';
update public.products set slug = 'zinc-picolinate-copper', category_slug = 'immunity-protection' where id = '207fb438-0511-4bfd-a098-03178ae2af65';
update public.products set slug = 'purified-shilajit', category_slug = 'energy-vitality' where id = '17d8cd89-fce6-49eb-a260-d6dfea5317aa';
update public.products set slug = 'boswellia-serrata', category_slug = 'natural-extracts' where id = 'b77d523d-8677-4485-835e-a0913f6947bb';
update public.products set slug = 'standardized-ginkgo-biloba', category_slug = 'natural-extracts' where id = '4b5f3e66-fa33-498a-962b-fba275e4c3a4';
update public.products set slug = 'anti-aging-protocol', category_slug = 'bundles' where id = '4b94306d-5832-4407-8881-4c8ab446f3c6';
update public.products set slug = 'valerian-hops', category_slug = 'sleep-stress' where id = 'bdf59bfb-1e91-45b9-90c4-1ca02354948b';
update public.products set slug = 'aloe-vera-extract', category_slug = 'probiotics-digestion' where id = '8967adc3-c983-4394-be94-d6319d3f441f';
update public.products set slug = 'womens-probiotics-l-rhamnosus', category_slug = 'probiotics-digestion' where id = 'adb52ad8-899a-4448-b11d-d0006082821a';
update public.products set slug = 'gaba-500mg', category_slug = 'sleep-stress' where id = '33b80280-b589-4d25-ac69-31403ee2f362';
update public.products set slug = 'magnesium-bisglycinate', category_slug = 'essentials' where id = '0b5a2b3e-9b7e-48df-96bf-eede56b9dbbb';
update public.products set slug = 'green-tea-extract-egcg', category_slug = 'natural-extracts' where id = 'aa048e77-f508-446d-9246-375eb13f3cbd';
update public.products set slug = 'vitamin-d3-5000iu-k2', category_slug = 'immunity-protection' where id = 'df4590d9-2477-4e96-9602-7549e160bcb4';
update public.products set slug = 'concentrated-marine-omega-3', category_slug = 'omega-3-fatty-acids' where id = 'f5fcb234-3a6b-426e-8134-19767988c2f3';
update public.products set slug = 'multivitamin-complex', category_slug = 'vitamins-minerals' where id = '94bb843e-c994-403b-a2f2-45cc5285b0e8';
update public.products set slug = 'sod-superoxide-dismutase', category_slug = 'antioxidants-nad' where id = '2f71ca14-525d-4ef7-85c5-19be832a554b';
update public.products set slug = 'bacopa-monnieri', category_slug = 'focus-memory' where id = '870a04e4-aac8-41c7-9bc5-6f78e4dc309d';
update public.products set slug = 'magnesium-l-threonate', category_slug = 'focus-memory' where id = '3b2388b0-3492-4f30-93dd-a19bbe444790';
update public.products set slug = 'womens-bundle-collagen-d3-iron', category_slug = 'bundles' where id = '24c3dc75-6922-47c2-be45-1ff4860c0974';
update public.products set slug = 'creapure-creatine-monohydrate', category_slug = 'focus-memory' where id = 'a0df56da-b536-47c3-836c-ab2aebd56daf';
update public.products set slug = 'lions-mane-extract', category_slug = 'focus-memory' where id = '4ce342bc-78a3-44b9-be3b-d5fa39f8c5a6';
update public.products set slug = 'joint-recovery-protocol', category_slug = 'bundles' where id = 'b1285661-ef41-468a-bca4-a9de99bdc3fe';
update public.products set slug = 'unlimited-focus-bundle', category_slug = 'bundles' where id = 'a3ef67bd-bc81-4896-9244-c0b6ee59c3eb';
update public.products set slug = 'nr-nicotinamide-riboside', category_slug = 'longevity-anti-aging' where id = '4e01d13c-a8d2-408b-b1f8-a9ef072c7560';
update public.products set slug = 'fermented-black-garlic', category_slug = 'natural-extracts' where id = '4dc4a8ab-25e5-4a51-897e-47b3e2b2909e';
update public.products set slug = 'liposomal-glutathione', category_slug = 'antioxidants-nad' where id = 'c6f36bc2-623c-42f4-95fe-95a6c22c29c2';
update public.products set slug = 'nad-nasal-spray', category_slug = 'antioxidants-nad' where id = '2ea4b3d2-7882-4871-8dd6-ffd37bb9ff06';
update public.products set slug = 'berberine-hcl-500mg', category_slug = 'natural-extracts' where id = 'c117e5dc-2b57-435c-8a7a-3495697aa432';
update public.products set slug = 'fermented-panax-ginseng', category_slug = 'energy-vitality' where id = '9d12ff61-5d48-496b-b211-f51358972299';
update public.products set slug = 'liposomal-vitamin-d3-k2', category_slug = 'vitamins-minerals' where id = '3f004c19-13da-4315-83db-f8172812647f';
update public.products set slug = 'cordyceps', category_slug = 'energy-vitality' where id = 'c3325ef3-03ef-4dd7-bc86-d19e8e405262';
update public.products set slug = 'ashwagandha-ksm', category_slug = 'energy-vitality' where id = 'a4c31ca9-683e-4170-9f91-7cd71bc1bf49';
update public.products set slug = 'rhodiola-extract', category_slug = 'energy-vitality' where id = '3b3d129a-9cfb-4199-80b6-a2863b94dd82';
update public.products set slug = 'cordyceps-militaris', category_slug = 'focus-memory' where id = '5e91a66c-066a-43b4-aae8-762d9cf6b3c5';
update public.products set slug = 'vitamin-e-tocotrienol-complex', category_slug = 'antioxidants-nad' where id = '1b572cb8-6647-4ef4-bd30-5d2ba29cb6ed';
update public.products set slug = 'wild-fish-oil-omega-3', category_slug = 'omega-3-fatty-acids' where id = '8a9f2853-e73a-47e3-94c2-a55b289f2e6d';
update public.products set slug = 'extended-release-melatonin', category_slug = 'sleep-stress' where id = 'c129c50a-d199-4d88-ad11-258cad751b55';
update public.products set slug = 'apigenin-sleep-aging', category_slug = 'longevity-anti-aging' where id = 'e604aa5b-8831-4ac0-adf2-e3f1c94ed2d7';
update public.products set slug = 'trans-resveratrol', category_slug = 'longevity-anti-aging' where id = 'a9b1f5da-c54b-4590-91f8-631ea19986e5';
update public.products set slug = 'fisetin-100mg-extract', category_slug = 'longevity-anti-aging' where id = '9a1ba2cd-baaf-48dd-8c1b-2b54da4f4055';
update public.products set slug = 'deep-sleep-bundle', category_slug = 'bundles' where id = '48fad123-8f67-4c03-9b79-9c04a09d5542';
update public.products set slug = 'cardiovascular-health-protocol', category_slug = 'bundles' where id = 'efdeac53-614e-486f-b563-2924af6e61ef';
update public.products set slug = 'ashwagandha-ksm-66', category_slug = 'focus-memory' where id = '2873005f-b0e6-4cd4-adef-871e425c5709';
update public.products set slug = 'nad-booster-complex', category_slug = 'longevity-anti-aging' where id = 'f2a6a3d3-feaa-4137-834f-5988f9a8a66a';
update public.products set slug = 'wild-oregano-oil', category_slug = 'probiotics-digestion' where id = '3bd66e63-cde3-4942-b405-159e04d8fd8a';
update public.products set slug = 'activated-charcoal', category_slug = 'probiotics-digestion' where id = 'b2863e60-a771-4c84-94b9-d6306f59ef00';
update public.products set slug = 'ca-akg-longevity-complex', category_slug = 'longevity-anti-aging' where id = '95a314cc-5029-4958-a75f-989524fc93e4';
update public.products set slug = 'liposomal-vitamin-c-1000mg', category_slug = 'immunity-protection' where id = '7d6d944f-b56d-49b5-b8bd-5e1fceb5ca03';
update public.products set slug = 'ginkgo-biloba-ginseng-premium', category_slug = 'focus-memory' where id = 'ed289ece-a67f-4cc2-b5e8-f81d5c1c29c3';
update public.products set slug = 'immunity-complex-360', category_slug = 'immunity-protection' where id = '75ba1e2e-6ecb-4847-a75f-5404c17138b7';
update public.products set slug = 'alpha-lipoic-acid', category_slug = 'antioxidants-nad' where id = '2f1120d0-6df0-4c21-808f-f82ce77cb85f';
update public.products set slug = 'nac-n-acetyl-cysteine', category_slug = 'antioxidants-nad' where id = 'c20de2e7-7bb2-478f-ad72-9dc6b878a872';
update public.products set slug = 'iron-immunity-bundle', category_slug = 'bundles' where id = 'e35b2be3-fc29-4f0d-b117-ebcf64c370fb';
update public.products set slug = 'liquid-l-carnitine', category_slug = 'energy-vitality' where id = '57d7703f-1962-417d-ac61-6ba4e87e95cd';
update public.products set slug = 'coq10-ubiquinol-100mg', category_slug = 'energy-vitality' where id = '169136a0-369d-4113-b23d-445671edbdf0';
update public.products set slug = 'l-theanine-natural-caffeine', category_slug = 'focus-memory' where id = '238fe37c-7c2e-4d3d-baf4-60bf6a21964e';
update public.products set slug = 'milk-thistle', category_slug = 'natural-extracts' where id = 'e1f6d5d1-d47d-4011-8011-596ca5d3a7d9';
update public.products set slug = 'organic-selenium', category_slug = 'antioxidants-nad' where id = '9dd10611-8168-425b-bb5c-a220e5549f83';
update public.products set slug = 'nmn-99-purity', category_slug = 'longevity-anti-aging' where id = '85ded015-86a1-49ac-8eae-7d012258e9a3';
update public.products set slug = 'zeaxanthin-lutein', category_slug = 'antioxidants-nad' where id = 'e817375d-5f36-46fe-bc37-505c9d83decc';
update public.products set slug = 'coq10-kaneka-200mg', category_slug = 'heart-health' where id = '9dbd886d-0907-4b23-b7d2-0f3ff012649b';
update public.products set slug = 'standardized-pomegranate-extract', category_slug = 'antioxidants-nad' where id = 'bd627d60-d04a-4c0c-8ad5-8090b3ca8f7f';
update public.products set slug = 'pterostilbene-50mg', category_slug = 'longevity-anti-aging' where id = '3bb19c3d-36f2-453e-b041-8b0ec31bd30e';
update public.products set slug = 'turmeric-curcumin-95', category_slug = 'natural-extracts' where id = 'da7330d1-975c-4e15-b760-60cd2200165e';
update public.products set slug = 'liposomal-nmn-500mg', category_slug = 'longevity-anti-aging' where id = '8d23801d-8cf5-411a-9302-0a66b83d484f';
update public.products set slug = 'beginner-biohacker-bundle', category_slug = 'bundles' where id = 'e257f4dc-8b97-4a5f-8eaf-c6f6c04a6f4b';
update public.products set slug = 'black-elderberry-extract', category_slug = 'immunity-protection' where id = 'ed82f0f6-a9ab-410d-b96e-b862ef3d1d3c';
update public.products set slug = 'antarctic-krill-oil', category_slug = 'omega-3-fatty-acids' where id = '913a9be2-b9df-4461-926f-52c371788f59';
update public.products set slug = 'echinacea-forte', category_slug = 'immunity-protection' where id = 'c391a6c8-9eeb-4dd3-8a42-408c355a9001';
update public.products set slug = 'reishi-mushroom-extract', category_slug = 'immunity-protection' where id = '6c742d01-9d90-4de2-9fb7-9e38137cb7f7';
update public.products set slug = 'propolis-manuka-honey', category_slug = 'immunity-protection' where id = '167e6b47-9b50-44b7-81b2-16603b5a2a00';
update public.products set slug = 'quercetin-bromelain', category_slug = 'immunity-protection' where id = 'b7afc5e3-3a3a-47f1-aafa-68a7fd97d013';
update public.products set slug = 'glucosamine-chondroitin', category_slug = 'collagen-joints' where id = 'debbac4c-17cf-4702-95a3-9f33c47c9148';
update public.products set slug = 'marine-collagen-peptides', category_slug = 'collagen-joints' where id = '83e1c018-142b-44eb-9f95-14c4dfdebbfc';
update public.products set slug = 'undenatured-type-2-collagen', category_slug = 'collagen-joints' where id = '5ccae9da-7af3-4248-ad57-56556b9db1fe';
update public.products set slug = 'astragalus-extract', category_slug = 'immunity-protection' where id = '41696a56-0426-4786-a67b-e1ded0dff2ce';
update public.products set slug = 'gelatinized-peruvian-maca', category_slug = 'energy-vitality' where id = 'aceb4745-5481-4481-95f1-c9c99aa93b18';
update public.products set slug = 'msm-methylsulfonylmethane', category_slug = 'collagen-joints' where id = '6da8548a-bcf2-4b97-b3ac-941573a4e00c';
update public.products set slug = 'active-b-complex', category_slug = 'energy-vitality' where id = 'ab3ea017-1625-4623-9b7b-0385c529d12a';
update public.products set slug = 'arnica-joint-cream', category_slug = 'collagen-joints' where id = 'd7bbe1d2-8ef2-44d5-9483-0e66aead4120';
update public.products set slug = 'digestive-enzyme-complex', category_slug = 'probiotics-digestion' where id = 'c34668cc-afc7-4c48-ade8-d41030431c91';
update public.products set slug = 'saccharomyces-boulardii', category_slug = 'probiotics-digestion' where id = '3b84b29b-8fee-4aae-bf92-bd3c33d38a99';
update public.products set slug = 'probiotics-50-billion-cfu', category_slug = 'probiotics-digestion' where id = '03df53be-571d-4c1b-ae79-3124dc794565';
update public.products set slug = 'betaine-hcl-pepsin', category_slug = 'probiotics-digestion' where id = '628a3077-d9ec-4425-b50e-8a9dcfa09b2c';
update public.products set slug = 'alpha-gpc-300mg', category_slug = 'focus-memory' where id = '6bb0904c-5499-4c77-a831-44b14190d575';
update public.products set slug = 'hyaluronic-acid-100mg', category_slug = 'collagen-joints' where id = 'd004941b-e555-433e-8ea7-250399286033';
update public.products set slug = 'eggshell-membrane-extract', category_slug = 'collagen-joints' where id = '7eaa6a02-774c-4a89-aa69-91f89cdd4b9a';
update public.products set slug = 'vitamin-c-silicon', category_slug = 'collagen-joints' where id = '8a89d2f7-285a-4b8e-af04-ad97c84af1f8';
update public.products set slug = 'nattokinase', category_slug = 'heart-health' where id = 'e0edf608-d21b-459d-b16d-cb3592b383d4';
update public.products set slug = 'aged-garlic-extract', category_slug = 'heart-health' where id = 'd4aa35a3-3928-4cc3-9147-75cb240a0913';

-- ======================================================================
-- ARTICOLE JURNAL (4)
-- ======================================================================
update public.journal_articles set slug = 'how-nmn-works-at-the-cellular-level' where id = '52ec529d-9129-40e8-8e8f-114c69c94eb5';
update public.journal_articles set slug = 'hydrolyzed-vs-native-collagen' where id = '68f70486-ed1b-44ca-bc85-eab54dc0ae9e';
update public.journal_articles set slug = 'protocol-for-reducing-inflammation-and-oxidative-stress' where id = '90863fa8-870a-4a6f-a2cd-bfc977154886';
update public.journal_articles set slug = 'third-party-laboratory-batch-testing' where id = '56260326-36a2-48b4-ab15-b153fcef6011';

-- Verificare finala: nu trebuie sa mai existe niciun slug cu diacritice
-- sau cu litere in afara setului a-z, 0-9 si cratima.
do $$
declare
  nr int;
begin
  select count(*) into nr from public.products where slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$';
  if nr > 0 then raise exception 'OPRIT: % slug-uri de produs au format invalid.', nr; end if;

  select count(*) into nr from public.categories where slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$';
  if nr > 0 then raise exception 'OPRIT: % slug-uri de categorie au format invalid.', nr; end if;

  select count(*) into nr from public.journal_articles where slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$';
  if nr > 0 then raise exception 'OPRIT: % slug-uri de articol au format invalid.', nr; end if;

  select count(*) into nr from (select slug from public.products group by slug having count(*) > 1) t;
  if nr > 0 then raise exception 'OPRIT: % slug-uri de produs sunt duplicate.', nr; end if;
end $$;

commit;
