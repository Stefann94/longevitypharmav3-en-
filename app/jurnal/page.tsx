import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getJournalArticles, JournalArticle } from './actions';
import styles from './Jurnal.module.css';

export const metadata = {
  title: 'Jurnal Științific | Longevity Pharma',
  description: 'Informații susținute de știință despre medicină preventivă, anti-aging, ingrediente și protocoale de sănătate.',
};


function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default async function JurnalPage() {
  const articles = await getJournalArticles();
  
  if (!articles || articles.length === 0) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Jurnal Științific</h1>
          <p className={styles.emptyText}>Momentan nu există articole publicate.</p>
        </div>
      </div>
    );
  }

  const heroArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Jurnal Științific</h1>
          <p className={styles.pageSubtitle}>
            Medicină preventivă, studii clinice și protocoale de longevitate explicate de experți.
          </p>
        </div>

        {/* Hero Article */}
        <Link href={`/jurnal/${heroArticle.slug}`} className={styles.heroLink}>
          <article className={styles.heroArticle}>
            <div className={styles.heroImageWrapper}>
              <Image 
                src={heroArticle.image_url} 
                alt={heroArticle.title} 
                fill 
                className={styles.heroImage}
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            <div className={styles.heroContent}>
              <div className={styles.tagsContainer}>
                {heroArticle.tags?.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <h2 className={styles.heroTitle}>{heroArticle.title}</h2>
              <p className={styles.heroSummary}>{heroArticle.summary}</p>
              <div className={styles.metaInfo}>
                <span className={styles.author}>{heroArticle.author}</span>
                <span className={styles.dot}>•</span>
                <time className={styles.date}>{formatDate(heroArticle.published_at)}</time>
              </div>
            </div>
          </article>
        </Link>

        {/* Grid Articles */}
        {gridArticles.length > 0 && (
          <div className={styles.gridSection}>
            <h3 className={styles.sectionTitle}>Ultimele Articole</h3>
            <div className={styles.articlesGrid}>
              {gridArticles.map((article) => (
                <Link key={article.id} href={`/jurnal/${article.slug}`} className={styles.cardLink}>
                  <article className={styles.articleCard}>
                    <div className={styles.cardImageWrapper}>
                      <Image 
                        src={article.image_url} 
                        alt={article.title} 
                        fill 
                        className={styles.cardImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.tagsContainer}>
                        {article.tags?.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                      <h3 className={styles.cardTitle}>{article.title}</h3>
                      <p className={styles.cardSummary}>{article.summary}</p>
                      <div className={styles.metaInfo}>
                        <time className={styles.date}>{formatDate(article.published_at)}</time>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* PROMO BANNER */}
        <section className={styles.promoBannerSection}>
          <a href="/categorie/focus" className={styles.promoBannerLink}>
            <Image 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" 
              alt="Promo Banner" 
              fill
              className={styles.promoBannerImage}
            />
            <div className={styles.promoBannerOverlay}>
              <h3>Performanță Mentală Absolută</h3>
              <p>Descoperă noile extracte standardizate pentru focus și energie curată.</p>
              <span className={styles.promoBannerBtn}>Vezi Colecția</span>
            </div>
          </a>
        </section>

      </div>
    </div>
  );
}
