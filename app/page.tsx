import Image from "next/image";
import HeroCarousel from "../components/HeroCarousel";
import styles from "./page.module.css";
import { createStaticClient } from '@/lib/supabase/static';
import ProductSection from "../components/ProductSection";

import ProductCarousel from "../components/ProductCarousel";

export default async function Home() {
  const supabase = createStaticClient();
  const { data: slidesDb } = await supabase.from('hero_slides').select('*').order('id');
  
  let slides = slidesDb || [];
  if (slides.length >= 3) {
    // Current order by id: [slide1, slide2, slide3]
    // Desired order: [slide2, slide3, slide1]
    slides = [slides[1], slides[2], slides[0], ...slides.slice(3)];
  }

  const { data: quickCategories } = await supabase.from('categories').select('*').eq('is_quick_category', true).order('sort_order').limit(6);
  
  // Fetch products for all sections
  const [
    { data: essentials },
    { data: focusEnergy },
    { data: premiumBundles },
    { data: recommendedProducts, error: recommendedError }
  ] = await Promise.all([
    supabase.from('products').select('*').eq('is_bestseller', true).limit(8),
    supabase.from('products').select('*').eq('is_focus_energy', true).limit(8),
    supabase.from('products').select('*').eq('is_premium_bundle', true).limit(8),
    supabase.from('products').select('*').eq('is_recommended', true).limit(10)
  ]);

  // Folosim fallback în caz că coloana 'is_recommended' încă nu a fost creată în baza de date
  const finalRecommended = recommendedError ? essentials : recommendedProducts;

  return (
    <>
      <main>
        <HeroCarousel slides={slides || []} />

        {/* QUICK CATEGORIES */}
        <section className={styles.quickCategoriesSection}>
          <div className="container">
            <div className={styles.quickCategoriesContainer}>
              {quickCategories?.map(cat => (
                <a key={cat.id} href={`/categorie/${cat.slug}`} className={styles.quickCategoryCard}>
                  <span className={styles.quickCategoryName}>{cat.name}</span>
                  <div className={styles.quickCategoryIcon}>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTIONS */}
        <ProductSection 
          title={<>Esențiale <span>pentru</span> Longevitate</>}
          products={essentials || []}
          viewAllLink="/categorie/longevitate"
          badgeText="Bestseller"
        />

        {/* PROMO BANNER (Între Esențiale și Focus) */}
        <section className={styles.promoBannerSection}>
          <div className="container">
            <a href="/categorie/focus" className={styles.promoBannerLink}>
              <img 
                src="/images/jurnal/promo_banner.png" 
                alt="Promo Banner" 
                className={styles.promoBannerImage}
              />
              <div className={styles.promoBannerOverlay}>
                <h3>Performanță Mentală Absolută</h3>
                <p>Descoperă noile extracte standardizate pentru focus și energie curată.</p>
                <span className={styles.promoBannerBtn}>Vezi Colecția</span>
              </div>
            </a>
          </div>
        </section>

        <ProductSection 
          title={<>Focus & <span>Claritate Mentală</span></>}
          products={focusEnergy || []}
          viewAllLink="/categorie/focus"
        />

        {/* DISCOVER CARDS - "Descoperă după nevoie" */}
        <section className={styles.discoverCardsSection}>
          <div className="container">
            <div className={styles.discoverSectionHeader}>
              <h2 className={styles.discoverSectionTitle}>
                Descoperă <span>după obiectiv</span>
              </h2>
            </div>
            <div className={styles.discoverCardsGrid}>

              <a href="/categorie/focus" className={styles.discoverCard}>
                <div className={styles.discoverCardImageWrapper}>
                  <img 
                    src="/images/cards/energie-focus.png" 
                    alt="Energie și Focus" 
                    className={styles.discoverCardImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.discoverCardContent}>
                  <span className={styles.discoverCardLabel}>Performanță</span>
                  <h3 className={styles.discoverCardTitle}>Energie & Focus</h3>
                  <p className={styles.discoverCardSubtitle}>Concentrare maximă și energie curată, fără crash.</p>
                  <span className={styles.discoverCardBtn}>Descoperă</span>
                </div>
              </a>

              <a href="/categorie/longevitate" className={styles.discoverCard}>
                <div className={styles.discoverCardImageWrapper}>
                  <img 
                    src="/images/cards/anti-aging.png" 
                    alt="Anti-Aging și Longevitate" 
                    className={styles.discoverCardImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.discoverCardContent}>
                  <span className={styles.discoverCardLabel}>Longevitate</span>
                  <h3 className={styles.discoverCardTitle}>Anti-Aging</h3>
                  <p className={styles.discoverCardSubtitle}>Formule avansate pentru regenerare celulară și vitalitate.</p>
                  <span className={styles.discoverCardBtn}>Descoperă</span>
                </div>
              </a>

              <a href="/categorie/imunitate" className={styles.discoverCard}>
                <div className={styles.discoverCardImageWrapper}>
                  <img 
                    src="/images/cards/imunitate.png" 
                    alt="Imunitate și Detox" 
                    className={styles.discoverCardImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.discoverCardContent}>
                  <span className={styles.discoverCardLabel}>Protecție</span>
                  <h3 className={styles.discoverCardTitle}>Imunitate & Detox</h3>
                  <p className={styles.discoverCardSubtitle}>Susține apărarea naturală a organismului tău.</p>
                  <span className={styles.discoverCardBtn}>Descoperă</span>
                </div>
              </a>

            </div>
          </div>
        </section>

        <ProductSection 
          title={<>Protocoale & <span>Pachete Premium</span></>}
          products={premiumBundles || []}
          badgeText="-15% Extra"
        />
        
        {/* RECOMMENDED CAROUSEL */}
        <ProductCarousel 
          title={<>Produse <span>Recomandate</span></>}
          products={finalRecommended || []}
        />

        {/* CONTACT BANNER SECTION */}
        <section className={styles.contactBannerSection}>
          <div className="container">
            <div className={styles.contactBannerWrapper}>
              <div className={styles.contactBannerContent}>
                <h3 className={styles.contactBannerTitle}>Ai nevoie de îndrumare?</h3>
                <p className={styles.contactBannerDesc}>
                  Fiecare organism este unic. Dacă nu ești sigur ce suplimente ți se potrivesc cel mai bine pentru a-ți atinge obiectivele de sănătate, specialiștii noștri sunt aici să te ajute cu o recomandare personalizată.
                </p>
                <a href="/contact" className={styles.contactBannerBtn}>
                  Contactează-ne
                </a>
              </div>
            </div>
          </div>
        </section>
        
      </main>
    </>
  );
}
