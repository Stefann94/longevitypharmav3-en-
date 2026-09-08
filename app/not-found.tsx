import Link from 'next/link';
import styles from './StatusPage.module.css';

export const metadata = {
  title: 'Page not found | Longevity Pharma',
  // Paginile de eroare nu trebuie indexate de motoarele de căutare
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.iconCircle}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        <div className={styles.code}>Error 404</div>
        <h1 className={styles.title}>This page does not exist</h1>
        <p className={styles.description}>
          The address may be wrong, or the product may no longer be available.
          Here are a few useful directions instead.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Back to the homepage
          </Link>
          <Link href="/contact" className={styles.secondaryLink}>
            Contact us
          </Link>
        </div>

        <div className={styles.suggestions}>
          <div className={styles.suggestionsTitle}>Popular categories</div>
          <div className={styles.suggestionsList}>
            <Link href="/bestsellers" className={styles.suggestionChip}>Bestsellers</Link>
            <Link href="/category/longevitate" className={styles.suggestionChip}>Longevity</Link>
            <Link href="/category/imunitate" className={styles.suggestionChip}>Immunity</Link>
            <Link href="/category/focus" className={styles.suggestionChip}>Focus</Link>
            <Link href="/journal" className={styles.suggestionChip}>Journal</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
