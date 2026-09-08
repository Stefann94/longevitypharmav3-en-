import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AboutUs.module.css';
import pageStyles from '../page.module.css';
import { createStaticClient } from '@/lib/supabase/static';

export const metadata = {
  title: 'About Us | Longevity Pharma',
  description:
    'Longevity Pharma was born out of a real need for clean, pharmaceutical-grade supplements. Read the story, the mission and where we are heading.',
};

/**
 * Textele implicite, traduse din setup_about_us.sql.
 *
 * Tabela `about_us_content` nu exista in nicio baza: SQL-ul de creare a fost
 * scris, dar nu a fost rulat niciodata, iar pagina nu a fost construita - nici
 * pe site-ul romanesc. De aceea continutul sta aici si pagina merge imediat.
 *
 * Daca tabela va fi creata mai tarziu (en-07-about-us.sql), randurile ei au
 * prioritate, exact ca la pagina Quality. Fiind export static, continutul se
 * fixeaza la build in ambele cazuri.
 */
const IMPLICIT = {
  hero: {
    label: null as string | null,
    title: 'Beyond supplements: a mission for longevity',
    description:
      'Longevity Pharma was born out of a real need for clean, pharmaceutical-grade supplements. We combined the latest discoveries in medicine with the power of pure extracts to give you a shield against premature aging.',
    image_url: '/images/about/about_hero.png',
  },
  story: {
    label: 'Our Story',
    title: 'How it all began',
    description:
      'The market was full of vitamins padded with filler ingredients and weak extracts the body could barely absorb. We wanted products we could trust completely, so we set out to research the purest sources in the world. We built Longevity Pharma not as an ordinary shop, but as a manifesto for cellular health and preventive medicine.',
    image_url: '/images/about/about_story.png',
  },
  mission: {
    label: 'Vision',
    title: 'Our Mission',
    description:
      'To democratize access to elite nutrients. We do not sell miracles, we sell applied science. We believe every person has the right to maximize their years of vitality through informed choices, backed by strict clinical protocols and ingredients whose purity can be tested and proven at any time.',
    image_url: '/images/about/about_mission.png',
  },
  future: {
    label: 'Innovation',
    title: 'The Future of Your Health',
    description:
      'We keep innovating. From liposomes with 99% absorption to supercritical extracts, our portfolio grows only with formulas validated by the most recent research in the field. The future of medicine is prevention, and the tools for an active longevity are now within your reach.',
    image_url: '/images/about/about_future.png',
  },
};

export default async function AboutUsPage() {
  const supabase = createStaticClient();

  // Tabela poate lipsi cu totul; in acel caz `data` ramane null si folosim
  // textele implicite, fara ca build-ul sa esueze.
  const { data } = await supabase.from('about_us_content').select('*');

  const dinBaza =
    data?.reduce((acc: Record<string, any>, item: any) => {
      acc[item.section_key] = item;
      return acc;
    }, {}) || {};

  const hero = dinBaza['hero'] || IMPLICIT.hero;
  const sectiuni = [
    dinBaza['story'] || IMPLICIT.story,
    dinBaza['mission'] || IMPLICIT.mission,
    dinBaza['future'] || IMPLICIT.future,
  ];

  return (
    <main>
      <div className="container">
        {/* BREADCRUMBS */}
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>About Us</span>
        </nav>

        {/* HERO BANNER */}
        <section
          className={pageStyles.promoBannerSection}
          style={{ padding: '0 0 40px 0', backgroundColor: 'transparent' }}
        >
          <div className={pageStyles.promoBannerLink} style={{ cursor: 'default' }}>
            <Image
              src={hero.image_url}
              alt={hero.title}
              fill
              className={pageStyles.promoBannerImage}
              priority
            />
            <div
              className={pageStyles.promoBannerOverlay}
              style={{
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
                textShadow: '0 2px 15px rgba(0,0,0,0.8)',
              }}
            >
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  margin: '0 0 8px 0',
                }}
              >
                {hero.title}
              </h1>
              <p style={{ margin: '0', fontSize: '1.1rem', maxWidth: '600px' }}>
                {hero.description}
              </p>
            </div>
          </div>
        </section>

        {/* ZIGZAG: poveste, misiune, viitor */}
        <section className={styles.zigzagSection}>
          <div className={styles.zigzagContainer}>
            {sectiuni.map((s, i) => (
              <div
                key={s.title}
                className={`${styles.zigzagItem} ${i % 2 === 1 ? styles.reversed : ''}`}
              >
                <div className={styles.zigzagContent}>
                  {s.label && <span className={styles.zigzagLabel}>{s.label}</span>}
                  <h2 className={styles.zigzagTitle}>{s.title}</h2>
                  <p className={styles.zigzagDesc}>{s.description}</p>
                </div>
                <div className={styles.zigzagImageWrapper}>
                  <Image
                    src={s.image_url}
                    alt={s.title}
                    fill
                    className={styles.zigzagImage}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
