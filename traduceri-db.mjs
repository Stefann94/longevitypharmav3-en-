// Dictionar de traduceri RO -> EN pentru continutul din baza de date.
// Fiecare sir a fost tradus manual. Constructorul (construieste-sql-db.mjs)
// face DOAR cautari exacte in aceste tabele si se opreste cu eroare daca
// intalneste un text care nu are corespondent aici.
//
// {NAME} este un substituent pentru numele produsului; la reconstruire este
// inlocuit cu numele ENGLEZESC din NUME_PRODUSE.

export const NUME_PRODUSE = {
  'acid-alfa-lipoic': 'ALA (Alpha Lipoic Acid)',
  'acid-hialuronic': 'Hyaluronic Acid 100mg',
  'aged-garlic': 'Aged Garlic Extract',
  'aloe-vera': 'Aloe Vera Extract',
  'alpha-gpc': 'Alpha GPC 300mg',
  'apigenin-aging': 'Apigenin Sleep & Aging',
  'ashwagandha-ksm': 'Ashwagandha KSM-66',
  'ashwagandha-ksm66': 'Ashwagandha KSM-66',
  'astaxantina': 'Natural Astaxanthin 12mg',
  'astragalus-extract': 'Astragalus Extract',
  'bacopa-monnieri': 'Bacopa Monnieri',
  'berberina-hcl': 'Berberine HCL 500mg',
  'betaina-hcl': 'Betaine HCL with Pepsin',
  'boswellia-serrata': 'Boswellia Serrata',
  'carbune-activat': 'Activated Charcoal',
  'ceai-verde-egcg': 'Green Tea Extract (EGCG)',
  'celadrin': 'Celadrin Extract',
  'colagen-bovin': 'Grass-Fed Bovine Collagen',
  'colagen-marine': 'Marine Collagen Peptides',
  'colagen-peptide': 'Collagen Peptides + Hyaluronic Acid',
  'colagen-tip-2': 'Undenatured Type II Collagen',
  'complex-b-activ': 'Active B Complex',
  'complex-b-activat': 'Activated B Vitamin Complex',
  'coq10-kaneka': 'CoQ10 Kaneka 200mg',
  'coq10-ubiquinol': 'CoQ10 Ubiquinol 100mg',
  'cordyceps': 'Cordyceps Militaris',
  'cordyceps-militaris': 'Cordyceps Militaris',
  'creatina-creapure': 'Creapure Creatine Monohydrate',
  'crema-arnica': 'Arnica Joint Cream',
  'echinacea-forte': 'Echinacea Forte',
  'enzime-digestive': 'Digestive Enzyme Complex',
  'fisetin-extract': 'Fisetin 100mg Extract',
  'gaba-500': 'GABA 500mg',
  'ginkgo-biloba': 'Standardized Ginkgo Biloba',
  'ginkgo-biloba-ginseng-premium': 'Ginkgo Biloba & Ginseng Premium Extract',
  'ginseng-panax': 'Fermented Panax Ginseng',
  'glucozamina-condroitina': 'Glucosamine & Chondroitin',
  'glutation-lipozomal': 'Liposomal Glutathione',
  'grape-seed': 'Grape Seed Extract',
  'huperzine-a': 'Huperzine A',
  'imunity-complex': 'Immunity Complex 360',
  'krill-oil': 'Antarctic Krill Oil',
  'l-carnitina': 'Liquid L-Carnitine',
  'l-glutamina': 'L-Glutamine Powder 500g',
  'l-theanine-cofeina': 'L-Theanine + Natural Caffeine',
  'lions-mane-extract': "Lion's Mane Extract",
  'maca-extract': 'Gelatinized Peruvian Maca',
  'magneziu-bisglicinat': 'Magnesium Bisglycinate',
  'magneziu-l-threonate': 'Magnesium L-Threonate',
  'magneziu-malat': 'Magnesium Malate',
  'melatonina': 'Extended-Release Melatonin',
  'milk-thistle': 'Milk Thistle',
  'moringa': 'Moringa Oleifera',
  'msm-pur': 'MSM (Methylsulfonylmethane)',
  'multivitamine': 'Multivitamin Complex',
  'mushroom-mix-long': 'Longevity Mushroom Mix',
  'nac-cisteina': 'NAC (N-Acetyl Cysteine)',
  'nad-booster': 'NAD+ Booster Complex',
  'nad-spray': 'NAD+ Nasal Spray',
  'nattokinaza': 'Nattokinase',
  'nem-extract': 'Eggshell Membrane Extract',
  'nmn-lipozomal': 'Liposomal NMN 500mg',
  'nmn-pur-500mg': 'Pure NMN 500mg - Anti-Aging',
  'nmn-puritate': 'NMN 99% Purity',
  'nr-riboside': 'NR (Nicotinamide Riboside)',
  'olive-leaf': 'Olive Leaf Extract',
  'omega-3-marin': 'Concentrated Marine Omega 3',
  'omega-3-salbatic': 'Wild Fish Oil Omega 3',
  'omega-3-sălbatic': 'Omega-3 Wild Fish Oil',
  'oregano-oil': 'Wild Oregano Oil',
  'pachet-biohacker': 'Beginner Biohacker Bundle',
  'pachet-femei': "Women's Bundle (Collagen + D3 + Iron)",
  'pachet-focus': 'Unlimited Focus Bundle (Nootropics)',
  'pachet-imunitate': 'Iron Immunity Bundle',
  'pachet-somn-adanc': 'Deep Sleep Bundle (Magnesium+Theanine)',
  'prebiotice': 'Prebiotics Inulin & FOS',
  'probiotice-50': 'Probiotics 50 Billion CFU',
  'probiotice-femei': "Women's Probiotics (L. rhamnosus)",
  'propolis-manuka': 'Propolis & Manuka Honey',
  'protocol-anti-aging': 'The Anti-Aging Protocol (NMN+Resveratrol)',
  'protocol-articulatii': 'Joint Recovery Protocol',
  'protocol-inima': 'Cardiovascular Health Protocol',
  'pterostilbene': 'Pterostilbene 50mg',
  'quercetin-bromelain': 'Quercetin + Bromelain',
  'quercetin-phyto': 'Quercetin Phytosome',
  'quercetina-bromelaina': 'Quercetin with Bromelain',
  'reishi-extract': 'Reishi Mushroom Extract',
  'resveratrol-pur': 'Pure Resveratrol 99%',
  'resveratrol-trans': 'Trans-Resveratrol 99%',
  'resveratrol-trans-99': 'Trans-Resveratrol 99%',
  'rhodiola-extract': 'Rhodiola Rosea Extract',
  'rhodiola-rosea': 'Rhodiola Rosea Extract',
  'rodie-extract': 'Standardized Pomegranate Extract',
  's-boulardii': 'Saccharomyces Boulardii',
  'seleniu-organic': 'Organic Selenium',
  'shilajit': 'Purified Shilajit',
  'soc-negru': 'Black Elderberry Extract',
  'sod-dismutaza': 'SOD (Superoxide Dismutase)',
  'spermidina-extract': 'Urolithin A 500mg Extract',
  'spermidine-extract': 'Ca-AKG Longevity Complex',
  'turmeric-curcumin': 'Turmeric & Curcumin 95%',
  'usturoi-negru': 'Fermented Black Garlic',
  'valeriana-hamei': 'Valerian & Hops',
  'vit-c-lipozomal': 'Liposomal Vitamin C 1000mg',
  'vit-d3-k2': 'Vitamin D3 5000 IU + K2',
  'vitamina-d3-k2-lipozomala': 'Liposomal Vitamin D3 + K2',
  'vitamina-e-complex': 'Vitamin E Tocotrienol Complex',
  'vitc-siliciu': 'Vitamin C + Silicon',
  'zeaxantina': 'Zeaxanthin & Lutein',
  'zinc-picolinat': 'Zinc Picolinate & Copper',
};

export const DESCRIERI_PRODUSE = {
  'acid-alfa-lipoic': 'A universal water- and fat-soluble antioxidant.',
  'acid-hialuronic': 'Joint lubrication and hydration.',
  'aged-garlic': 'Blood pressure and cholesterol.',
  'aloe-vera': 'Soothes an irritated digestive tract.',
  'alpha-gpc': 'An acetylcholine precursor for learning.',
  'apigenin-aging': 'For deep relaxation and regeneration.',
  'ashwagandha-ksm': 'Reduces stress and boosts vitality.',
  'ashwagandha-ksm66': "Patented KSM-66 extract. It rapidly lowers cortisol (the stress hormone) and brings the body back into hormonal balance.",
  'astaxantina': 'The king of carotenoids for eyes and skin.',
  'astragalus-extract': 'An adaptogen that fortifies the body.',
  'bacopa-monnieri': 'An Ayurvedic herb for retaining information.',
  'berberina-hcl': 'Blood sugar and metabolism control.',
  'betaina-hcl': 'For optimal stomach acidity.',
  'boswellia-serrata': 'Supports joint mobility.',
  'carbune-activat': 'Detoxification and less bloating.',
  'ceai-verde-egcg': 'Metabolism and cellular antioxidant support.',
  'celadrin': 'Esterified fatty acids for mobility.',
  'colagen-bovin': 'A neutral powder, ideal for coffee.',
  'colagen-marine': 'Maximum bioavailability for the skin.',
  'colagen-peptide': 'The ultimate formula for skin and joints. Collagen peptides restore the elasticity of tissues and hydrate the structure of the dermis.',
  'colagen-tip-2': 'Acts directly on the joint immune system.',
  'complex-b-activ': 'All the B vitamins in coenzyme form.',
  'complex-b-activat': 'All the B vitamins in their coenzyme form, already activated (methylated). Clean energy and essential support.',
  'coq10-kaneka': 'Essential for the heart muscle.',
  'coq10-ubiquinol': 'Pure energy for your heart and your cells.',
  'cordyceps': 'Increases ATP and cellular oxygenation.',
  'cordyceps-militaris': 'The energy mushroom used by athletes. It naturally increases cellular ATP production and blood oxygenation, giving a boost in physical and mental performance without the crash.',
  'creatina-creapure': 'Creapure® - the purest creatine in the world. An excellent nootropic that fuels the brain with energy (ATP).',
  'crema-arnica': 'Fast, targeted local action.',
  'echinacea-forte': 'A traditional immune stimulant.',
  'enzime-digestive': 'Easy digestion for any meal.',
  'fisetin-extract': 'Supports the clearing of cellular senescence.',
  'gaba-500': 'Calms brain activity.',
  'ginkgo-biloba': 'Peripheral circulation and memory.',
  'ginkgo-biloba-ginseng-premium': 'Supports memory, focus and blood circulation. Clean energy from premium standardized extracts.',
  'ginseng-panax': 'The most potent ginseng, with rapid absorption.',
  'glucozamina-condroitina': 'Rebuilding worn cartilage.',
  'glutation-lipozomal': 'The most powerful intracellular antioxidant.',
  'grape-seed': 'Improves venous circulation.',
  'huperzine-a': 'An acetylcholinesterase inhibitor for extreme focus.',
  'imunity-complex': 'Every essential vitamin in a single capsule.',
  'krill-oil': 'Cellular absorption with astaxanthin.',
  'l-carnitina': 'Turns fat into energy.',
  'l-glutamina': 'Repairs the gut lining (leaky gut).',
  'l-theanine-cofeina': 'The classic productivity biohack: the calm of theanine balances the stimulation of caffeine. Pure energy, without the anxiety.',
  'lions-mane-extract': "A super-concentrated Lion's Mane extract, scientifically shown to stimulate neurogenesis (NGF). Zero brain fog, surgical focus and a sharp memory.",
  'maca-extract': 'Hormonal balance and natural energy.',
  'magneziu-bisglicinat': 'The most absorbable and gentlest form of magnesium (it causes no stomach discomfort). It fights stress, relaxes the muscles and dramatically improves sleep quality.',
  'magneziu-l-threonate': 'The only form of magnesium able to fully cross the blood-brain barrier. It supports synaptic density.',
  'magneziu-malat': 'The form of magnesium that fights fatigue.',
  'melatonina': 'Deep, uninterrupted sleep.',
  'milk-thistle': 'Superior liver detoxification.',
  'moringa': 'A superfood packed with vitamins.',
  'msm-pur': 'Organic sulfur for reducing pain.',
  'multivitamine': 'A full spectrum of essential vitamins and minerals in bioactive (methylated) forms, absorbed instantly. Your daily foundation.',
  'mushroom-mix-long': 'A blend of medicinal mushrooms.',
  'nac-cisteina': 'A glutathione precursor and lung support.',
  'nad-booster': 'A complete complex for rejuvenation.',
  'nad-spray': 'Instant absorption into the brain.',
  'nattokinaza': 'Dissolves fibrin and clears the blood vessels.',
  'nem-extract': 'Clinical results in 7 days.',
  'nmn-lipozomal': 'The longevity revolution. Liposomal encapsulation protects NMN from stomach acid, delivering the molecule intact straight into the bloodstream for up to three times the bioavailability.',
  'nmn-pur-500mg': 'A direct precursor of NAD+, formulated for maximum intracellular absorption. It supports DNA repair and raises cellular energy levels.',
  'nmn-puritate': 'Laboratory grade. Independently tested NMN with a purity above 99%, guaranteed free of heavy metals and contaminants.',
  'nr-riboside': 'A direct precursor of intracellular NAD+.',
  'olive-leaf': 'Antiviral and cardiovascular support.',
  'omega-3-marin': 'A massive concentration of EPA and DHA drawn from deep sea waters and purified molecularly. Indispensable for brain health.',
  'omega-3-salbatic': 'Rich in EPA and DHA.',
  'omega-3-sălbatic': 'A pure, sustainable source of omega-3 from wild fish (free of heavy metals). It supports cognitive function and joint lubrication.',
  'oregano-oil': 'Eradicates pathogenic bacteria.',
  'pachet-biohacker': 'The perfect starting point for human optimization. It includes the fundamental base of vitamins and magnesium.',
  'pachet-femei': 'Hormonal balance and energy. A bundle dedicated to female physiology, supporting the skin, the hair and bone health.',
  'pachet-focus': "The perfect stack for deep work. It includes Lion's Mane and L-Threonate to give you 8 hours of elite focus.",
  'pachet-imunitate': 'Your shield against infection. A complete protocol built from optimal doses of D3+K2, zinc and liposomal vitamin C for an impenetrable immune system.',
  'pachet-somn-adanc': 'Stop your mind from racing. This synergy between magnesium and L-theanine drops you quickly into deep relaxation, extending the REM phase of sleep and cellular recovery.',
  'prebiotice': 'The ideal food for your good bacteria.',
  'probiotice-50': 'A complete restoration of the gut flora.',
  'probiotice-femei': 'Intimate and digestive health.',
  'propolis-manuka': 'A natural antibacterial and soother.',
  'protocol-anti-aging': 'Known as the "Sinclair Protocol", it acts on the causes of aging at the molecular level.',
  'protocol-articulatii': 'A bundle dedicated to rebuilding cartilage and lubricating the locomotor system. It contains Marine Collagen and Omega 3 Forte.',
  'protocol-inima': 'Designed to clear the blood vessels. A synergy of omega-3, coenzyme Q10 and aged garlic extract.',
  'pterostilbene': 'A superior analog of resveratrol.',
  'quercetin-bromelain': 'A powerful anti-inflammatory combination.',
  'quercetin-phyto': 'A superior formula with increased absorption.',
  'quercetina-bromelaina': 'A natural anti-inflammatory complex. Quercetin modulates the histamine response, while bromelain amplifies its absorption.',
  'reishi-extract': 'The king of mushrooms for balanced immunity.',
  'resveratrol-pur': 'Resveratrol in its most biologically active form. A formidable antioxidant that works in perfect synergy alongside NMN.',
  'resveratrol-trans': 'A powerful antioxidant for your heart.',
  'resveratrol-trans-99': 'The most potent activator of the sirtuins. At 99% purity, this extract neutralizes free radicals and protects the cardiovascular system.',
  'rhodiola-extract': 'An adaptogen for physical and mental stamina.',
  'rhodiola-rosea': 'The endurance herb of the Vikings. It increases resistance to mental and physical stress, reducing accumulated fatigue.',
  'rodie-extract': 'A pure source of punicalagins.',
  's-boulardii': 'A beneficial yeast for diarrhea and candida.',
  'seleniu-organic': 'Essential for the thyroid and antioxidant defense.',
  'shilajit': 'An ancient mineral resin for extreme vitality.',
  'soc-negru': 'Natural antioxidant and antiviral support.',
  'sod-dismutaza': 'The enzyme of cellular youth.',
  'spermidina-extract': 'A pure natural extract that triggers autophagy - the process by which the body recycles aged or damaged cells. The cellular secret to a long and vital life.',
  'spermidine-extract': 'A natural inducer of autophagy.',
  'turmeric-curcumin': 'An extremely potent natural anti-inflammatory.',
  'usturoi-negru': 'A superior antioxidant, without the odor.',
  'valeriana-hamei': 'A traditional remedy for calm.',
  'vit-c-lipozomal': 'Maximum absorption, without the acidity.',
  'vit-d3-k2': 'The synergistic formula for immunity and bones.',
  'vitamina-d3-k2-lipozomala': 'The perfect synergy for strong bones and immunity. Liposomal technology makes sure the calcium is directed exactly into the bones.',
  'vitamina-e-complex': 'The superior form of vitamin E.',
  'vitc-siliciu': 'Essential cofactors for collagen synthesis.',
  'zeaxantina': 'A shield against blue light.',
  'zinc-picolinat': 'Essential for the immune system.',
};

export const BANNER_TEXT = {
  'Calitate superioară și eficiență maximă pentru corpul tău.':
    'Superior quality and maximum efficiency for your body.',
  'Fundația unei sănătăți de fier în fiecare zi!':
    'The foundation of iron-clad health, every single day!',
  'Refă-ți rezervele de energie la nivel celular cu molecula longevității!':
    'Rebuild your energy reserves at the cellular level with the longevity molecule!',
  'Activează reînnoirea celulară și trăiește la potențialul maxim!':
    'Activate cellular renewal and live at your full potential!',
  'Claritate mentală de top, energie constantă și zero brain-fog!':
    'Top mental clarity, steady energy and zero brain fog!',
  'Sinergie completă pentru rezultate rapide. Plus economie la pachet!':
    'Complete synergy for fast results. Plus savings when you buy the bundle!',
  'Somn profund, mușchi relaxați și sistem nervos echilibrat':
    'Deep sleep, relaxed muscles and a balanced nervous system',
  'Claritate mentală, memorie ageră și o circulație excelentă!':
    'Mental clarity, a sharp memory and excellent circulation!',
};

export const INTRO_DESCRIPTION = {
  '<p>Descoperă beneficiile extraordinare oferite de <strong>{NAME}</strong>. Formulă dezvoltată special pentru a susține performanța optimă a organismului tău zi de zi.</p><p>Prin combinarea extractelor de înaltă puritate, acest supliment reprezintă alegerea perfectă pentru un stil de viață echilibrat și sănătos.</p>':
    '<p>Discover the extraordinary benefits of <strong>{NAME}</strong>. A formula developed specifically to support your body’s optimal performance day after day.</p><p>By combining extracts of high purity, this supplement is the perfect choice for a balanced and healthy lifestyle.</p>',

  '<p>Fundația sănătății tale zilnice. Corpul nostru nu poate sintetiza eficient anumite micro-elemente, de aceea un supliment curat și extrem de asimilabil face toată diferența.</p><p>Fie că vorbim de susținerea imunității, protecția cardiovasculară sau sănătatea oaselor, acest produs de bază a fost formulat folosind doar cele mai calitative și sigure materii prime.</p>':
    '<p>The foundation of your daily health. Our bodies cannot efficiently synthesize certain micro-elements, which is why a clean and highly absorbable supplement makes all the difference.</p><p>Whether it is immune support, cardiovascular protection or bone health, this staple product has been formulated using only the highest quality and safest raw materials.</p>',

  '<p><strong>NMN (Nicotinamid Mononucleotid)</strong> este molecula care a revoluționat domeniul anti-aging. Funcționează ca un precursor direct al NAD+ (Nicotinamidă Adenin Dinucleotidă), o coenzimă vitală prezentă în fiecare celulă a corpului nostru.</p><p>Pe măsură ce îmbătrânim, nivelurile de NAD+ scad dramatic, ceea ce duce la oboseală, declin cognitiv și încetinirea metabolismului. Prin suplimentarea zilnică cu NMN de puritate 99%, susții refacerea celulară și energia din interior spre exterior.</p>':
    '<p><strong>NMN (Nicotinamide Mononucleotide)</strong> is the molecule that revolutionized the anti-aging field. It works as a direct precursor of NAD+ (Nicotinamide Adenine Dinucleotide), a vital coenzyme present in every cell of the body.</p><p>As we age, NAD+ levels fall dramatically, which leads to fatigue, cognitive decline and a slower metabolism. By supplementing daily with NMN of 99% purity, you support cellular repair and energy from the inside out.</p>',

  '<p>Formulă de ultimă generație concepută pentru a încetini procesul de îmbătrânire celulară. Acționând direct la nivelul mitocondriilor, acest supliment stimulează longevitatea și vitalitatea din interior spre exterior.</p><p>Prin activarea procesului natural de autofagie (curățarea celulelor senescente), corpul tău își recapătă energia și capacitatea de regenerare specifice tinereții.</p>':
    '<p>A state-of-the-art formula designed to slow down cellular aging. Acting directly at the level of the mitochondria, this supplement stimulates longevity and vitality from the inside out.</p><p>By activating the natural process of autophagy (the clearing of senescent cells), your body regains the energy and the capacity for regeneration of its younger years.</p>',

  '<p>Bucură-te de concentrare profundă, memorie ageră și claritate mentală fără căderile de energie asociate cafeinei. Extractele noastre standardizate din ciuperci funcționale și adaptogeni sunt super-alimente pentru creierul tău.</p><p>Susține neurogeneza (formarea de noi neuroni) și elimină „ceața mentală” chiar și în cele mai aglomerate și stresante zile de muncă.</p>':
    '<p>Enjoy deep concentration, a sharp memory and mental clarity without the energy crashes that come with caffeine. Our standardized extracts from functional mushrooms and adaptogens are superfoods for your brain.</p><p>It supports neurogenesis (the formation of new neurons) and clears away the “brain fog” even on the busiest and most stressful working days.</p>',

  '<p>Sinergia perfectă pentru rezultate maxime. Am creat acest pachet combinând cele mai complementare produse ale noastre, pentru a ataca o problemă specifică din mai multe unghiuri simultan.</p><p>Atunci când ingredientele lucrează împreună, efectul lor nu se adună, ci se multiplică. Beneficiază de sănătate optimă și economisește prin achiziția la pachet.</p>':
    '<p>The perfect synergy for maximum results. We built this bundle by combining our most complementary products, so that a specific problem is tackled from several angles at once.</p><p>When ingredients work together, their effect does not add up - it multiplies. Enjoy optimal health and save by buying the bundle.</p>',

  '<p>Forma supremă de magneziu pentru calmarea sistemului nervos. Bisglicinatul de Magneziu este creat prin legarea magneziului de două molecule din aminoacidul Glicină, asigurând o absorbție intestinală excelentă <strong>fără efecte laxative</strong>.</p><p>Ideal pentru consum seara, înainte de culcare, acest supliment reduce stresul acumulat peste zi și pregătește corpul pentru un somn adânc, reparator.</p>':
    '<p>The ultimate form of magnesium for calming the nervous system. Magnesium Bisglycinate is created by binding magnesium to two molecules of the amino acid glycine, which gives excellent intestinal absorption <strong>with no laxative effect</strong>.</p><p>Ideal taken in the evening before bed, this supplement reduces the stress built up over the day and prepares the body for deep, restorative sleep.</p>',

  '<p>Descoperă beneficiile sinergice oferite de <strong>{NAME}</strong>. O formulă special dezvoltată pentru a sprijini funcțiile cognitive, combaterea oboselii și menținerea unui nivel optim de energie zi de zi.</p><p>Extractele noastre standardizate asigură cea mai bună calitate pentru creierul și corpul tău, redând vitalitatea de care ai nevoie.</p>':
    '<p>Discover the synergistic benefits of <strong>{NAME}</strong>. A formula developed specifically to support cognitive function, fight fatigue and maintain an optimal level of energy day after day.</p><p>Our standardized extracts deliver the very best quality for your brain and body, giving back the vitality you need.</p>',
};

export const WHY_RECOMMEND = {
  'Ingrediente 100% pure și atent selecționate': '100% pure, carefully selected ingredients',
  'Fără aditivi inutili sau conservanți artificiali': 'No needless additives or artificial preservatives',
  'Absorbție superioară datorită formulei avansate': 'Superior absorption thanks to the advanced formula',
  'Formă moleculară bio-identică pentru asimilare perfectă': 'A bio-identical molecular form for perfect absorption',
  'Fără metale grele sau toxine': 'Free of heavy metals and toxins',
  'Necesar zilnic pentru o funcționare optimă a corpului': 'Needed daily for your body to work at its best',
  'Puritate testată independent > 99%': 'Independently tested purity > 99%',
  'Formulă stabilizată la temperatură, fără necesitate de refrigerare': 'A heat-stabilized formula, with no need for refrigeration',
  'Absorbție maximă datorită capsulelor gastro-rezistente': 'Maximum absorption thanks to the gastro-resistant capsules',
  'Nu conține metale grele, gluten sau OMG-uri': 'Contains no heavy metals, gluten or GMOs',
  'Formulă stabilizată pentru biodisponibilitate maximă': 'A stabilized formula for maximum bioavailability',
  'Fără efecte adverse, sigur pentru utilizare zilnică': 'No adverse effects, safe for daily use',
  'Combate stresul oxidativ de la prima administrare': 'Fights oxidative stress from the very first dose',
  'Extract 100% din corpul fructifer (fără miceliu pe cereale)': '100% fruiting body extract (no grain-grown mycelium)',
  'Extracție duală pentru maximizarea substanțelor active': 'Dual extraction to maximize the active compounds',
  'Efect adaptogen: te calmează și te focusează simultan': 'An adaptogenic effect: it calms and focuses you at the same time',
  'O formulă completă gândită de specialiști': 'A complete formula designed by specialists',
  'Efect sinergic demonstrat (1+1=3)': 'A proven synergistic effect (1+1=3)',
  'Ofertă avantajoasă la cumpărarea produselor împreună': 'Great value when the products are bought together',
  'Absorbție net superioară față de oxidul sau citratul de magneziu': 'Far better absorption than magnesium oxide or citrate',
  'Bând cu stomacul, zero disconfort digestiv': 'Gentle on the stomach, with zero digestive discomfort',
  'Sinergie cu Vitamina B6 bioactivă pentru relaxare musculară': 'Synergy with bioactive vitamin B6 for muscle relaxation',
  'Sinergie perfectă între Ginkgo Biloba și Ginseng': 'A perfect synergy between Ginkgo Biloba and Ginseng',
  'Susține atât activitatea cerebrală cât și energia fizică': 'Supports both brain activity and physical energy',
};

export const FAQ_Q = {
  'Cum se administrează {NAME}?': 'How do I take {NAME}?',
  'Este acest produs natural?': 'Is this product natural?',
  'Se poate lua pe stomacul gol?': 'Can it be taken on an empty stomach?',
  'Pot folosi produsul pe tot parcursul anului?': 'Can I use the product all year round?',
  'Când și cum se administrează NMN-ul?': 'When and how should NMN be taken?',
  'În cât timp voi vedea primele rezultate?': 'How soon will I see the first results?',
  'NMN-ul vostru are nevoie de păstrare la frigider?': 'Does your NMN need to be kept refrigerated?',
  'Care este doza recomandată?': 'What is the recommended dose?',
  'În cât timp voi vedea efectele anti-aging?': 'How soon will I see the anti-aging effects?',
  'Este sigur de administrat pe termen lung?': 'Is it safe to take long term?',
  'Conține cofeină?': 'Does it contain caffeine?',
  'Îmi va afecta somnul?': 'Will it affect my sleep?',
  'Cum se administrează produsele din pachet?': 'How do I take the products in the bundle?',
  'Se poate combina cu alte suplimente?': 'Can it be combined with other supplements?',
  'Are efect laxativ?': 'Does it have a laxative effect?',
  'Cum se administrează Ginkgo Biloba & Ginseng?': 'How do I take Ginkgo Biloba & Ginseng?',
  'Este acest produs sigur pentru utilizare pe termen lung?': 'Is this product safe for long-term use?',
};

export const FAQ_A = {
  'Recomandăm administrarea conform instrucțiunilor de pe ambalaj, de preferat în timpul meselor pentru o absorbție optimă.':
    'We recommend taking it as directed on the packaging, preferably with meals for optimal absorption.',
  'Da, {NAME} folosește ingrediente premium și extracte standardizate de cea mai înaltă puritate.':
    'Yes. {NAME} uses premium ingredients and standardized extracts of the highest purity.',
  'Deși extractele noastre sunt foarte blânde cu mucoasa gastrică, recomandăm administrarea după masă (preferabil o masă ce conține puține grăsimi sănătoase).':
    'Although our extracts are very gentle on the stomach lining, we recommend taking it after a meal (ideally one containing a little healthy fat).',
  'Da, acest produs face parte din categoria Esențialelor, așadar corpul are nevoie constantă de el pentru a preveni carențele.':
    'Yes. This product belongs to the Essentials category, so the body needs it consistently in order to prevent deficiencies.',
  'Pentru rezultate optime, recomandăm administrarea a 1-2 capsule de NMN dimineața, pe stomacul gol, cu un pahar cu apă. NMN-ul este o moleculă care oferă energie, motiv pentru care nu este recomandat să fie luat seara târziu, putând afecta calitatea somnului.':
    'For the best results we recommend taking 1-2 NMN capsules in the morning, on an empty stomach, with a glass of water. NMN is an energizing molecule, which is why it is not advisable to take it late in the evening, as it may affect the quality of your sleep.',
  'Majoritatea utilizatorilor raportează o creștere a nivelului de energie și o claritate mentală mai bună în primele 7-10 zile de administrare constantă. Efectele profunde anti-aging la nivel celular se consolidează după 2-3 luni de utilizare regulată.':
    'Most users report a rise in energy levels and better mental clarity within the first 7-10 days of consistent use. The deeper anti-aging effects at the cellular level build up after 2-3 months of regular use.',
  'Nu. Formula noastră este sintetizată printr-un proces enzimatic avansat și este stabilizată termic. Produsul poate fi păstrat la temperatura camerei, într-un loc uscat și ferit de razele directe ale soarelui, menținându-și puritatea de >99%.':
    'No. Our formula is synthesized through an advanced enzymatic process and is heat-stabilized. The product can be kept at room temperature, in a dry place away from direct sunlight, and will retain its purity of >99%.',
  'Recomandăm 1-2 capsule pe zi, dimineața cu un pahar de apă, pentru a maximiza rata de absorbție celulară de-a lungul zilei.':
    'We recommend 1-2 capsules a day, in the morning with a glass of water, to maximize the rate of cellular absorption throughout the day.',
  'Efectele de creștere a energiei se simt în 7-14 zile, însă refacerea celulară profundă necesită o cură de minimum 3 luni pentru rezultate optime.':
    'The rise in energy is felt within 7-14 days, but deep cellular repair calls for a course of at least 3 months for the best results.',
  'Da, substanțele active sunt 100% bio-identice cu moleculele produse deja de corpul uman, fiind complet sigure și non-toxice.':
    'Yes. The active substances are 100% bio-identical to the molecules the human body already produces, making them completely safe and non-toxic.',
  'Nu. Claritatea mentală este obținută strict natural prin compușii nootropici din ciuperci, deci nu vei experimenta stări de agitație sau tahicardie.':
    'No. The mental clarity comes purely from the natural nootropic compounds in the mushrooms, so you will not experience jitteriness or a racing heart.',
  'Extractele funcționale sunt adaptogene, ajutând la reglarea sistemului nervos. Totuși, recomandăm administrarea lor în prima parte a zilei.':
    'The functional extracts are adaptogenic and help regulate the nervous system. Even so, we recommend taking them in the first half of the day.',
  'Produsele se pot administra concomitent (în aceeași zi). De regulă, găsești instrucțiunile specifice de administrare pe eticheta fiecărui flacon din pachet.':
    'The products can be taken alongside one another (on the same day). As a rule, you will find the specific instructions on the label of each bottle in the bundle.',
  'Da, acest pachet este creat pentru a fi baza sănătății tale și poate fi combinat în siguranță cu majoritatea vitaminelor.':
    'Yes. This bundle is built to be the foundation of your health and can safely be combined with most vitamins.',
  'Datorită formei sale de bisglicinat, este foarte blând cu stomacul și poate fi luat pe stomacul gol fără probleme, deși noi recomandăm seara după o masă ușoară.':
    'Thanks to its bisglycinate form it is very gentle on the stomach and can be taken on an empty stomach without trouble, although we recommend the evening, after a light meal.',
  'Nu. Spre deosebire de oxidul sau citratul de magneziu, bisglicinatul se absoarbe direct și nu atrage apa în intestine, deci nu are niciun efect laxativ.':
    'No. Unlike magnesium oxide or citrate, bisglycinate is absorbed directly and does not draw water into the intestines, so it has no laxative effect at all.',
  'Recomandăm 1-2 capsule pe zi, de preferat dimineața sau la prânz în timpul meselor pentru o absorbție optimă.':
    'We recommend 1-2 capsules a day, preferably in the morning or at midday with meals for optimal absorption.',
  'Da, formula folosește extracte standardizate de cea mai înaltă puritate, fiind perfect sigură pentru suplimentarea zilnică.':
    'Yes. The formula uses standardized extracts of the highest purity and is perfectly safe for daily supplementation.',
};

export const REVIEW_COMMENT = {
  'Un produs excelent, se simte calitatea din primele zile de utilizare. Recomand {NAME}!':
    'An excellent product - you can feel the quality from the first days of use. I recommend {NAME}!',
  'Foarte mulțumită de rezultate. Livrare rapidă și produs conform descrierii.':
    'Very happy with the results. Fast delivery and the product matches the description.',
  'Mă simt excelent de când îl iau, iar cel mai mare plus este că nu îmi provoacă absolut deloc greață, cum pățeam la alte branduri.':
    'I have felt great since I started taking it, and the biggest plus is that it causes me no nausea at all, which used to happen with other brands.',
  'Analizele au ieșit perfect! Fix ce căutam.':
    'My blood work came back perfect! Exactly what I was looking for.',
  'Am început să iau de 3 săptămâni. Cel mai evident efect este că nu mai am acea cădere de energie de la ora 15:00. Mă simt mult mai alert la birou și parcă mă recuperez mai repede după sală.':
    'I started taking it 3 weeks ago. The most obvious effect is that I no longer get that energy crash at 3pm. I feel much more alert at the office and I seem to recover faster after the gym.',
  'Folosesc NMN în combinație cu resveratrol și rezultatele sunt excelente. Capsulele nu au un gust neplăcut și se înghit ușor. Apreciez enorm că oferiți certificatul de analiză a purității!':
    'I take NMN together with resveratrol and the results are excellent. The capsules have no unpleasant taste and go down easily. I really appreciate that you provide the certificate of purity analysis!',
  'Produs foarte bun, calitativ. Singurul minus este că o singură dată s-a întârziat livrarea cu o zi, dar în rest, produsul face exact ce promite: energie curată toată ziua.':
    'A very good, high quality product. The only downside is that delivery was one day late on a single occasion, but otherwise the product does exactly what it promises: clean energy all day long.',
  'Folosesc de 2 luni și am observat o îmbunătățire drastică a rezistenței la efort. Nu mai obosesc la fel de repede.':
    'I have been using it for 2 months and I have noticed a dramatic improvement in my stamina. I do not tire as quickly any more.',
  'Analizele mele de sânge s-au îmbunătățit de când folosesc produsele voastre de longevitate. Recomand cu drag!':
    'My blood tests have improved since I started using your longevity products. Happy to recommend them!',
  'Un supliment foarte bun. Prețul este corect pentru calitatea oferită.':
    'A very good supplement. The price is fair for the quality you get.',
  'Am înlocuit a doua cafea a zilei cu acest extract. Focus incredibil, stau 4 ore lipit de monitor fără să-mi pierd concentrarea.':
    'I replaced my second coffee of the day with this extract. Incredible focus - I can spend 4 hours glued to the monitor without losing concentration.',
  'Foarte bun pentru studenți în sesiune! Recomand 100%.':
    'Very good for students during exams! I recommend it 100%.',
  'Ies mult mai ieftin cumpărând la pachet, iar rezultatele sunt minunate! Livrarea a fost de pe o zi pe alta.':
    'It works out much cheaper buying the bundle, and the results are wonderful! Delivery was next day.',
  'Produse de top, combinate excelent.':
    'Top products, combined excellently.',
  'Dorm mult mai adânc de când am început să îl iau. Mă trezesc odihnită și nu mai am deloc crampe musculare.':
    'I sleep far more deeply since I started taking it. I wake up rested and I no longer get muscle cramps at all.',
  'Cel mai bun magneziu pe care l-am încercat. Stomacul meu este foarte sensibil dar cu acesta nu am avut nicio problemă.':
    'The best magnesium I have tried. My stomach is very sensitive but I have had no trouble at all with this one.',
  'Foarte bun pentru perioadele aglomerate. Simt o diferență mare la nivel de concentrare.':
    'Very good for busy periods. I feel a big difference in my concentration.',
  'Livrare rapidă. Capsulele nu au gust ciudat și se înghit ușor. Recomand!':
    'Fast delivery. The capsules have no strange taste and go down easily. Recommended!',
};

export const AUTORI = {
  'Andrei M.': 'Andrew M.',
  'Elena P.': 'Elena P.',
  'Camelia P.': 'Camilla P.',
  'Florin B.': 'Florian B.',
  'Mihai V.': 'Michael V.',
  'Elena D.': 'Elena D.',
  'Radu S.': 'Robert S.',
  'Valeriu M.': 'Victor M.',
  'Simona T.': 'Simone T.',
  'Andrei G.': 'Andrew G.',
  'George I.': 'George I.',
  'Diana M.': 'Diana M.',
  'Oana C.': 'Anna C.',
  'Marian D.': 'Martin D.',
  'Andreea M.': 'Andrea M.',
  'Marius D.': 'Marcus D.',
  'Alina S.': 'Alina S.',
};

// Lunile romanesti -> englezesti. Ziua si anul raman neschimbate.
export const LUNI = {
  'Ianuarie': 'January', 'Februarie': 'February', 'Martie': 'March',
  'Aprilie': 'April', 'Mai': 'May', 'Iunie': 'June', 'Iulie': 'July',
  'August': 'August', 'Septembrie': 'September', 'Octombrie': 'October',
  'Noiembrie': 'November', 'Decembrie': 'December',
};

export const INGR_NAME = {
  'Extract purificat standardizat': 'Standardized purified extract',
  'Complex de suport asimilare': 'Absorption support complex',
  'Capsulă vegetală V-Caps®': 'V-Caps® vegetable capsule',
  'Substanță Activă Premium': 'Premium active substance',
  'Cofactori de absorbție': 'Absorption cofactors',
  'Fosfat dicalcic': 'Dicalcium phosphate',
  'Înveliș enteric': 'Enteric coating',
  'Dioxid de siliciu': 'Silicon dioxide',
  'B-Nicotinamid Mononucleotid (NMN)': 'B-Nicotinamide Mononucleotide (NMN)',
  'Extract de Piper Negru (Bioperină)': 'Black Pepper Extract (BioPerine)',
  'Capsulă vegetală (HPMC)': 'Vegetable capsule (HPMC)',
  'Făină de orez organică (Agent de încărcare)': 'Organic rice flour (bulking agent)',
  'L-Leucină (Lubrifiant natural)': 'L-Leucine (natural lubricant)',
  'Extract Purificat (99%)': 'Purified extract (99%)',
  'Complex de absorbție lipozomal': 'Liposomal absorption complex',
  'Celuloză microcristalină': 'Microcrystalline cellulose',
  'Stearat de magneziu vegetal': 'Vegetable magnesium stearate',
  'Extract Concentrat (Dual-Extract 10:1)': 'Concentrated extract (dual extract 10:1)',
  'Beta-Glucani activi': 'Active beta-glucans',
  'Capsulă V-Caps®': 'V-Caps® capsule',
  'Extract de bambus (Sursă de Siliciu)': 'Bamboo extract (source of silicon)',
  'Pulbere de orez organic': 'Organic rice powder',
  'Produs Principal (Bază)': 'Main product (base)',
  'Produs Secundar (Sinergic)': 'Secondary product (synergistic)',
  'Ghid de utilizare în format digital': 'Digital usage guide',
  'Ambalaj premium cadou': 'Premium gift packaging',
  'Transport rapid prioritar': 'Fast priority shipping',
  'Magneziu Elemental (din Bisglicinat)': 'Elemental magnesium (from bisglycinate)',
  'Vitamina B6 (Piridoxal-5-Fosfat)': 'Vitamin B6 (pyridoxal-5-phosphate)',
  'L-Glicină liberă': 'Free L-glycine',
  'Făină de orez organică': 'Organic rice flour',
  'Extract Standardizat Ginkgo Biloba (24/6)': 'Standardized Ginkgo Biloba extract (24/6)',
  'Extract de Ginseng Panax': 'Panax Ginseng extract',
};

export const INGR_QTY = {
  '1 Flacon (60 cps)': '1 bottle (60 caps)',
  '1 Buc': '1 pc',
  'Inclus': 'Included',
  'Gratuit': 'Free',
};

export const CATEGORII = {
  'Extracte Naturale': 'Natural Extracts',
  'Antioxidanți & NAD+': 'Antioxidants & NAD+',
  'Focus & Memorie': 'Focus & Memory',
  'Colagen & Articulații': 'Collagen & Joints',
  'Probiotice & Digestie': 'Probiotics & Digestion',
  'Omega-3 & Acizi Grași': 'Omega-3 & Fatty Acids',
  'Longevitate & Anti-Aging': 'Longevity & Anti-Aging',
  'Energie & Vitalitate': 'Energy & Vitality',
  'Imunitate & Protecție': 'Immunity & Protection',
  'Vitamine & Minerale': 'Vitamins & Minerals',
  'Sănătatea Inimii': 'Heart Health',
  'Somn & Stres': 'Sleep & Stress',
};

export const GRUPURI_CATEGORII = {
  'Nutrienți Esențiali': 'Essential Nutrients',
  'Obiective Sănătate': 'Health Goals',
};
