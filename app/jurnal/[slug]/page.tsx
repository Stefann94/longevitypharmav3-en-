import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getJournalArticleBySlug } from '../actions';
import styles from './Article.module.css';
import ProductSection from '@/components/ProductSection';
import { createStaticClient } from '@/lib/supabase/static';
import { getJournalArticles } from '../actions';

// Cate o pagina pre-generata pentru fiecare articol din jurnal.
export async function generateStaticParams() {
  const articole = await getJournalArticles();
  return articole.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;



// În Next 16, `params` este o promisiune și trebuie așteptată.
// Citirea sincronă (`params.slug`) returna `undefined`, articolul nu era găsit
// și fiecare pagină de articol răspundea cu 404.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getJournalArticleBySlug(slug);
  if (!article) return { title: 'Articol inexistent' };

  return {
    title: `${article.title} | Longevity Pharma`,
    description: article.summary,
    alternates: {
      canonical: `/jurnal/${encodeURIComponent(article.slug)}`,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.published_at,
      authors: article.author ? [article.author] : undefined,
      images: article.image_url ? [article.image_url] : undefined,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getJournalArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const supabase = createStaticClient();
  const { data: recommendedProducts } = await supabase
    .from('products')
    .select('id, name, slug, image_url, price')
    .limit(4);

  // Format paragraphs from plain text content
  const paragraphs = article.content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className={styles.pageWrapper}>
      <article className={styles.articleContainer}>
        
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Acasă</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link href="/jurnal">Jurnal Științific</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{article.title}</span>
        </div>

        {/* Header */}
        <header className={styles.articleHeader}>
          <div className={styles.tagsContainer}>
            {article.tags?.map((tag, idx) => (
              <span key={idx} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.summary}>{article.summary}</p>
          
          <div className={styles.metaInfo}>
            <div className={styles.authorBlock}>
              <span className={styles.authorName}>{article.author}</span>
            </div>
            <span className={styles.dot}>•</span>
            <time className={styles.date}>{formatDate(article.published_at)}</time>
          </div>
        </header>

        {/* Cover Image */}
        <div className={styles.coverImageWrapper}>
          <Image 
            src={article.image_url} 
            alt={article.title} 
            fill 
            className={styles.coverImage}
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>

        {/* Content */}
        <div className={styles.articleContent}>
          {paragraphs.map((text, idx) => {
            // Un mic hack pentru a randa bold text (ex: **Text**) doar daca avem
            const parts = text.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={idx}>
                {parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                  }
                  return part;
                })}
              </p>
            );
          })}
        </div>

        {/* Share / Back */}
        <div className={styles.articleFooter}>
          <Link href="/jurnal" className={styles.backBtn}>
            &larr; Înapoi la Jurnal
          </Link>
        </div>
      </article>

      {/* Recomandari produse */}
      <div className={styles.recommendedSection}>
        <ProductSection 
          title="Produse recomandate pentru tine" 
          products={recommendedProducts || []} 
        />
      </div>
    </div>
  );
}
