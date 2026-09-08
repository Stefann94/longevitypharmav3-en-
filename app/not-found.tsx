import Link from 'next/link';
import styles from './StatusPage.module.css';

export const metadata = {
  title: 'Pagină negăsită | Longevity Pharma',
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

        <div className={styles.code}>Eroare 404</div>
        <h1 className={styles.title}>Pagina căutată nu există</h1>
        <p className={styles.description}>
          Este posibil ca adresa să fie greșită sau ca produsul să nu mai fie
          disponibil. Îți lăsăm mai jos câteva direcții utile.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Înapoi la pagina principală
          </Link>
          <Link href="/contact" className={styles.secondaryLink}>
            Contactează-ne
          </Link>
        </div>

        <div className={styles.suggestions}>
          <div className={styles.suggestionsTitle}>Categorii populare</div>
          <div className={styles.suggestionsList}>
            <Link href="/bestsellers" className={styles.suggestionChip}>Bestsellers</Link>
            <Link href="/categorie/longevitate" className={styles.suggestionChip}>Longevitate</Link>
            <Link href="/categorie/imunitate" className={styles.suggestionChip}>Imunitate</Link>
            <Link href="/categorie/focus" className={styles.suggestionChip}>Focus</Link>
            <Link href="/jurnal" className={styles.suggestionChip}>Jurnal</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
