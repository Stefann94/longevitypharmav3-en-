import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getJournalArticles, JournalArticle } from './actions';
import styles from './Journal.module.css';

export const metadata = {
  title: 'Science Journal | Longevity Pharma',
  description: 'Science-backed information on preventive medicine, anti-aging, ingredients and health protocols.',
};


function formatDate(dateStr: string) {
  // en-GB, ca data sa iasa „8 September 2026", nu „September 8, 2026".
  return new Date(dateStr).toLocaleDateString('en-GB', {
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
          <h1 className={styles.pageTitle}>Science Journal</h1>
          <p className={styles.emptyText}>There are no published articles at the moment.</p>
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
          <h1 className={styles.pageTitle}>Science Journal</h1>
          <p className={styles.pageSubtitle}>
            Preventive medicine, clinical studies and longevity protocols, explained by experts.
          </p>
        </div>

        {/* Hero Article */}
        <Link href={`/journal/${heroArticle.slug}`} className={styles.heroLink}>
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
            <h3 className={styles.sectionTitle}>Latest articles</h3>
            <div className={styles.articlesGrid}>
              {gridArticles.map((article) => (
                <Link key={article.id} href={`/journal/${article.slug}`} className={styles.cardLink}>
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
          <a href="/category/focus-memory" className={styles.promoBannerLink}>
            <Image 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" 
              alt="Promo Banner" 
              fill
              className={styles.promoBannerImage}
            />
            <div className={styles.promoBannerOverlay}>
              <h3>Absolute Mental Performance</h3>
              <p>Discover our new standardized extracts for focus and clean energy.</p>
              <span className={styles.promoBannerBtn}>View Collection</span>
            </div>
          </a>
        </section>

      </div>
    </div>
  );
}
