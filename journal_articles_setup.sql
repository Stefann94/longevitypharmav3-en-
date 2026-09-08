-- 1. Creăm tabelul pentru Jurnalul Științific
CREATE TABLE IF NOT EXISTS journal_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  author TEXT DEFAULT 'Echipa Medicală Longevity Farma',
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Activăm RLS
ALTER TABLE journal_articles ENABLE ROW LEVEL SECURITY;

-- 3. Politică de citire (oricine poate citi articolele)
CREATE POLICY "Public articles are viewable by everyone." 
ON journal_articles FOR SELECT 
USING (true);

-- 4. Inserăm date demo de calitate
INSERT INTO journal_articles (title, slug, summary, content, image_url, tags) VALUES
(
  'Cum funcționează NMN-ul la nivel celular pentru a întârzia îmbătrânirea',
  'cum-functioneaza-nmn-ul-la-nivel-celular',
  'Nicotinamida mononucleotidă (NMN) a captat atenția lumii științifice. Află cum restabilește nivelurile de NAD+ și influențează direct longevitatea.',
  'NAD+ (Nicotinamida Adenin Dinucleotida) este o coenzimă esențială prezentă în fiecare celulă vie, responsabilă pentru producția de energie și repararea ADN-ului. Odată cu înaintarea în vârstă, nivelurile de NAD+ scad dramatic, declanșând procesele de îmbătrânire celulară.

NMN-ul este precursorul direct al NAD+. Studiile clinice recente demonstrează că suplimentarea cu NMN pur de grad farmaceutic poate ridica rapid și eficient rezervele de NAD+ din organism. Acest lucru reactivează sirtuinele (așa-numitele "gene ale longevității"), îmbunătățește funcția mitocondrială și protejează integritatea genomică.

La Longevity Farma, am optat pentru o formulă cu puritate >99%, deoarece moleculele instabile sau impure de NMN se pot degrada în nicotinamidă simplă, pierzându-și astfel proprietățile anti-aging.',
  '/images/jurnal/nmn.png',
  ARRAY['Medicină Preventivă', 'Anti-aging', 'NMN']
),
(
  'Colagen hidrolizat vs. Colagen nativ: Ce spun studiile clinice?',
  'colagen-hidrolizat-vs-colagen-nativ',
  'Diferența dintre tipurile de colagen dictează eficiența lor. Descoperă de ce greutatea moleculară este cel mai important factor în asimilare.',
  'Piața suplimentelor este inundată de diverse formule de colagen, însă puțini consumatori cunosc importanța masei moleculare. Colagenul nativ, deși excelent în teorie, are o moleculă prea mare pentru a traversa bariera intestinală intactă.

Procesul de hidroliză enzimatică folosit în laboratoarele moderne transformă colagenul brut în peptide de dimensiuni microscopice (sub 2000 Daltoni). Această formă de colagen hidrolizat este absorbită în proporție de peste 90% în fluxul sanguin, ajungând direct la fibroblastele care sintetizează țesut conjunctiv nou pentru piele, articulații și vase de sânge.

Recomandarea noastră este utilizarea unui colagen hidrolizat marin, obținut din surse sustenabile, a cărui biodisponibilitate depășește variantele bovine sau porcine.',
  '/images/jurnal/colagen.png',
  ARRAY['Ingrediente', 'Nutriție', 'Articulații']
),
(
  'Protocol complet pentru reducerea inflamației și a stresului oxidativ',
  'protocol-reducere-inflamatie-stres-oxidativ',
  'Inflamația cronică de grad scăzut este sursa majorității afecțiunilor moderne. Iată protocolul zilnic validat de experți pentru combaterea ei.',
  'Inflamația silențioasă sau cronică nu prezintă simptome imediate, însă, în timp, deteriorează țesuturile și accelerează senescența celulară. Stresul oxidativ generat de radicalii liberi este principalul motor al acestui tip de inflamație.

Protocolul propus de experții noștri implică o abordare în 3 pași:
1. **Neutralizarea Radicalilor Liberi:** Administrarea de antioxidanți puternici precum Resveratrolul sau Glutationul, care donează electroni moleculelor instabile fără a deveni ei înșiși nocivi.
2. **Modularea Răspunsului Imun:** Optimizarea nivelurilor de Vitamina D3 și Zinc, esențiale pentru un sistem imunitar echilibrat care nu reacționează exagerat.
3. **Reducerea Markerilor Inflamatori:** Introducerea acizilor grași Omega-3 de înaltă puritate (raport optim EPA/DHA) pentru a scădea nivelul citokinelor pro-inflamatorii.

Suplimentarea trebuie dublată de expunerea la soare în primele ore ale dimineții și un somn reparator de cel puțin 7 ore.',
  '/images/jurnal/inflamatie.png',
  ARRAY['Protocoale', 'Imunitate', 'Stil de viață']
),
(
  'De ce testăm fiecare lot de producție într-un laborator terț',
  'testare-lot-productie-laborator-tert',
  'Calitatea nu se declară, se demonstrează. Află ce presupun testele de laborator independente și de ce sunt esențiale pentru siguranța ta.',
  'Industria suplimentelor alimentare este adesea o zonă gri în ceea ce privește reglementările stricte. Mulți producători se bazează exclusiv pe certificatul de analiză emis de furnizorul materiei prime, o practică predispusă la erori sau inexactități.

La Longevity Farma, aplicăm standardul "Trust, but Verify". Fiecare lot de produse finale este trimis către un laborator independent (Third-Party Testing) pentru analiză. Ce căutăm mai exact?
- **Identitatea și Potența:** Ne asigurăm că există fix 500mg din substanța activă declarată pe etichetă, nu 450mg și nu un compus chimic similar.
- **Microbiologie:** Verificăm absența bacteriilor periculoase, mucegaiurilor sau drojdiilor.
- **Metale Grele:** Testăm pentru plumb, mercur, cadmiu și arsenic, folosind standarde extrem de stricte (USP/EP).

Doar produsele care trec acest "filtru de aur" ajung la tine, asigurându-ți eficiență maximă și risc zero.',
  '/images/jurnal/testare.png',
  ARRAY['Calitate', 'Transparență']
);
