import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Calitate.module.css';
import pageStyles from '../page.module.css';
import { createStaticClient } from '@/lib/supabase/static';

export const metadata = {
  title: 'Quality & Ingredients | Longevity Pharma',
  description: 'We make no compromises when it comes to the quality and purity of our ingredients.',
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
    title: 'Quality & Ingredients',
    description: 'We make no compromises when it comes to your health. We source only pharmaceutical-grade raw materials.',
    image_url: '/images/banners/quality_hero.png'
  };

  const simple = contentMap['simple_section'] || {
    title: 'The science of absolute purity',
    description: 'The effectiveness of any supplement depends on the quality of its raw materials. That is why Longevity Pharma works only with certified suppliers and rigorously tests every batch of ingredients.',
    image_url: '/images/banners/quality_ingrediente.png'
  };

  const card1 = contentMap['card_1'] || {
    title: 'Standardized Extracts',
    description: 'We do not use plain plant powders, but standardized extracts, delivering exactly the amount of active substance your body needs.',
    label: 'Efficacy',
    image_url: '/images/banners/quality_proces.png'
  };

  const card2 = contentMap['card_2'] || {
    title: 'Liposomal Technology',
    description: 'We encapsulate sensitive nutrients in lipid spheres (liposomes) to protect them from stomach acid and increase their absorption rate.',
    label: 'Absorption',
    image_url: '/images/banners/quality_surse.png'
  };

  const card3 = contentMap['card_3'] || {
    title: 'Clean & Vegan',
    description: 'Our capsules are 100% plant-based. We exclude colourings, artificial flavours, gluten and harmful preservatives from every formula.',
    label: 'Purity',
    image_url: '/images/zen_stones.png'
  };

  return (
    <main>
      <div className="container">
        
        {/* 1. BREADCRUMBS */}
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Quality & Ingredients</span>
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
              We choose superior bioactive forms, such as standardized extracts and liposomal vitamins,
              which deliver maximum cellular absorption, with no unnecessary additives or synthetic fillers.
            </p>
            <ul className={styles.simpleList}>
              <li>We guarantee 99.8% purity for key molecules such as NMN and Resveratrol.</li>
              <li>All products are manufactured in GMP-certified facilities (Good Manufacturing Practice).</li>
              <li>Every formula is based on the findings of the latest clinical studies in longevity research.</li>
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
              The Pillars of <span>Our Formulas</span>
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
          <div className={styles.certItem}>GMP Certified</div>
          <div className={styles.certDivider}>|</div>
          <div className={styles.certItem}>Vegan Formulas</div>
          <div className={styles.certDivider}>|</div>
          <div className={styles.certItem}>Non-GMO</div>
          <div className={styles.certDivider}>|</div>
          <div className={styles.certItem}>Third-Party Lab Tested</div>
        </section>

      </div>
    </main>
  );
}
