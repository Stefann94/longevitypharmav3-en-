import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Calitate.module.css';
import pageStyles from '../page.module.css';
import { createStaticClient } from '@/lib/supabase/static';

export const metadata = {
  title: 'Calitate & Ingrediente | Longevity Pharma',
  description: 'Nu facem compromisuri când vine vorba de calitatea și puritatea ingredientelor noastre.',
};


export default async function CalitatePage() {
  const supabase = createStaticClient();
  
  // Preluăm conținutul din baza de date
  const { data: contentData } = await supabase.from('calitate_content').select('*');
  
  // Creăm un map pentru a accesa ușor secțiunile după section_key
  const contentMap = contentData?.reduce((acc: any, item: any) => {
    acc[item.section_key] = item;
    return acc;
  }, {}) || {};

  // Valori default (fallback) în cazul în care tabelul nu e populat
  const hero = contentMap['hero'] || {
    title: 'Calitate & Ingrediente',
    description: 'Nu facem compromisuri când vine vorba de sănătatea ta. Selectăm doar materie primă de grad farmaceutic.',
    image_url: '/images/banners/calitate_hero.png'
  };

  const simple = contentMap['simple_section'] || {
    title: 'Știința purității absolute',
    description: 'Eficiența oricărui supliment depinde de calitatea materiei prime. Din acest motiv, la Longevity Pharma lucrăm exclusiv cu furnizori certificați și verificăm riguros fiecare lot de ingrediente.',
    image_url: '/images/banners/calitate_ingrediente.png'
  };

  const card1 = contentMap['card_1'] || {
    title: 'Extracte Standardizate',
    description: 'Nu folosim pulberi de plante simple, ci extracte standardizate, asigurând exact cantitatea de substanță activă de care corpul are nevoie.',
    label: 'Eficiență',
    image_url: '/images/banners/calitate_proces.png'
  };

  const card2 = contentMap['card_2'] || {
    title: 'Tehnologie Lipozomală',
    description: 'Încapsulăm nutrienții sensibili în sfere lipidice (lipozomi) pentru a-i proteja de acidul gastric și a le crește rata de absorbție.',
    label: 'Absorbție',
    image_url: '/images/banners/calitate_surse.png'
  };

  const card3 = contentMap['card_3'] || {
    title: 'Curat & Vegan',
    description: 'Capsulele noastre sunt 100% vegetale. Excludem coloranții, aromele artificiale, glutenul sau conservanții toxici din toate formulele.',
    label: 'Puritate',
    image_url: '/images/zen_stones.png'
  };

  return (
    <main>
      <div className="container">
        
        {/* 1. BREADCRUMBS */}
        <nav className={styles.breadcrumbs}>
          <Link href="/">Acasă</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Calitate & Ingrediente</span>
        </nav>

        {/* 2. HERO BANNER */}
        <section className={pageStyles.promoBannerSection} style={{ padding: '0 0 40px 0', backgroundColor: 'transparent' }}>
            <div className={pageStyles.promoBannerLink} style={{ cursor: 'default' }}>
              <Image 
                src={hero.image_url}
                alt={hero.title}
                fill 
                className={pageStyles.promoBannerImage}
                priority
              />
              <div className={pageStyles.promoBannerOverlay} style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)', textShadow: '0 2px 15px rgba(0,0,0,0.8)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0 0 8px 0' }}>
                  {hero.title}
                </h1>
                <p style={{ margin: '0', fontSize: '1.1rem', maxWidth: '600px' }}>
                  {hero.description}
                </p>
              </div>
            </div>
        </section>

        {/* 3. DESCRIERE SIMPLĂ */}
        <section className={styles.simpleSection}>
          <div className={styles.simpleText}>
            <h2 className={styles.simpleTitle}>{simple.title}</h2>
            <p className={styles.simpleDesc}>
              {simple.description}
            </p>
            <p className={styles.simpleDesc}>
              Alegem forme bioactive superioare, precum extractele standardizate și vitaminele lipozomale, 
              care asigură o absorbție celulară maximă, fără aditivi inutili sau substanțe de umplutură sintetice.
            </p>
            <ul className={styles.simpleList}>
              <li>Garantăm o puritate de 99.8% pentru moleculele cheie (ex. NMN, Resveratrol).</li>
              <li>Toate produsele sunt fabricate în unități certificate GMP (Good Manufacturing Practice).</li>
              <li>Fiecare formulă se bazează pe rezultatele ultimelor studii clinice din domeniul longevității.</li>
            </ul>
          </div>
          <div className={styles.simpleImageWrapper}>
            <Image 
              src={simple.image_url} 
              alt={simple.title}
              fill
              className={styles.simpleImage}
            />
          </div>
        </section>

        {/* 4. INGREDIENTE DE BAZĂ - ZIGZAG LAYOUT */}
        <section className={styles.zigzagSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Pilonii <span>Formulelor Noastre</span>
            </h2>
          </div>
          
          <div className={styles.zigzagContainer}>
            
            {/* Card 1 - Text Left, Image Right */}
            <div className={styles.zigzagItem}>
              <div className={styles.zigzagContent}>
                <span className={styles.zigzagLabel}>{card1.label}</span>
                <h3 className={styles.zigzagTitle}>{card1.title}</h3>
                <p className={styles.zigzagDesc}>{card1.description}</p>
              </div>
              <div className={styles.zigzagImageWrapper}>
                <Image 
                  src={card1.image_url} 
                  alt={card1.title}
                  fill
                  className={styles.zigzagImage}
                />
              </div>
            </div>

            {/* Card 2 - Image Left, Text Right (Reversed) */}
            <div className={`${styles.zigzagItem} ${styles.reversed}`}>
              <div className={styles.zigzagContent}>
                <span className={styles.zigzagLabel}>{card2.label}</span>
                <h3 className={styles.zigzagTitle}>{card2.title}</h3>
                <p className={styles.zigzagDesc}>{card2.description}</p>
              </div>
              <div className={styles.zigzagImageWrapper}>
                <Image 
                  src={card2.image_url} 
                  alt={card2.title}
                  fill
                  className={styles.zigzagImage}
                />
              </div>
            </div>

            {/* Card 3 - Text Left, Image Right */}
            <div className={styles.zigzagItem}>
              <div className={styles.zigzagContent}>
                <span className={styles.zigzagLabel}>{card3.label}</span>
                <h3 className={styles.zigzagTitle}>{card3.title}</h3>
                <p className={styles.zigzagDesc}>{card3.description}</p>
              </div>
              <div className={styles.zigzagImageWrapper}>
                <Image 
                  src={card3.image_url} 
                  alt={card3.title}
                  fill
                  className={styles.zigzagImage}
                />
              </div>
            </div>

          </div>
        </section>

        {/* 5. CERTIFICĂRI */}
        <section className={styles.certBar}>
          <div className={styles.certItem}>Certificat GMP</div>
          <div className={styles.certDivider}>|</div>
          <div className={styles.certItem}>Formule Vegane</div>
          <div className={styles.certDivider}>|</div>
          <div className={styles.certItem}>Fără Organisme Modificate (Non-GMO)</div>
          <div className={styles.certDivider}>|</div>
          <div className={styles.certItem}>Testare în Laboratoare Terțe</div>
        </section>

      </div>
    </main>
  );
}
