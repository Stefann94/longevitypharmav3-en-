-- 1. Creăm tabelul pentru Despre Noi
CREATE TABLE IF NOT EXISTS about_us_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Activăm RLS
ALTER TABLE about_us_content ENABLE ROW LEVEL SECURITY;

-- 3. Politică de citire (oricine poate citi textele)
CREATE POLICY "Public content is viewable by everyone." 
ON about_us_content FOR SELECT 
USING (true);

-- 4. Inserăm conținutul
INSERT INTO about_us_content (section_key, title, description, label, image_url) VALUES
(
  'hero',
  'Dincolo de suplimente: O misiune pentru longevitate',
  'Longevity Farma s-a născut dintr-o nevoie reală de suplimente curate, de calitate farmaceutică. Am combinat cele mai noi descoperiri din medicină cu puterea extractelor pure pentru a-ți oferi un scut împotriva îmbătrânirii premature.',
  NULL,
  '/images/despre/about_hero.png'
),
(
  'story',
  'Cum a început totul',
  'Piața era plină de vitamine cu ingrediente de umplutură și extracte slabe, neasimilabile. Ne-am dorit produse în care putem avea încredere 100%, așa că am început să cercetăm cele mai pure surse din lume. Am construit Longevity Farma nu ca pe un magazin obișnuit, ci ca pe un manifest pentru sănătatea celulară și medicina preventivă.',
  'Povestea Brandului',
  '/images/despre/about_story.png'
),
(
  'mission',
  'Misiunea Noastră',
  'Să democratizăm accesul la nutrienți de elită. Nu vindem miracole, ci știință aplicată. Credem că fiecare individ are dreptul să-și maximizeze anii de vitalitate prin alegeri informate, susținute de protocoale clinice stricte și ingrediente a căror puritate poate fi oricând testată și demonstrată.',
  'Viziune',
  '/images/despre/about_mission.png'
),
(
  'future',
  'Viitorul Sănătății Tale',
  'Continuăm să inovăm. De la lipozomi cu absorbție de 99% la extracte super-critice, portofoliul nostru se extinde exclusiv cu formule validate de cele mai recente cercetări în domeniu. Viitorul medicinei este prevenția, iar instrumentele pentru o longevitate activă sunt acum la îndemâna ta.',
  'Inovație',
  '/images/despre/about_future.png'
);
