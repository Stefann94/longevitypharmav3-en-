'use client'; // Error boundaries trebuie să fie Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './StatusPage.module.css';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // În producție, aici s-ar conecta un serviciu de monitorizare (ex. Sentry).
    console.error('Eroare de aplicație:', error);
  }, [error]);

  return (
    <main className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.iconCircle}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>

        <div className={styles.code}>Eroare neașteptată</div>
        <h1 className={styles.title}>Ceva nu a funcționat corect</h1>
        <p className={styles.description}>
          Am întâmpinat o problemă la încărcarea acestei pagini. De cele mai multe
          ori este temporară — poți încerca din nou.
        </p>

        <div className={styles.actions}>
          <button onClick={() => unstable_retry()} className={styles.primaryButton}>
            Încearcă din nou
          </button>
          <Link href="/" className={styles.secondaryLink}>
            Înapoi la pagina principală
          </Link>
        </div>

        {/* Identificatorul erorii, util pentru corelarea cu log-urile de pe server */}
        {error.digest && (
          <div className={styles.errorDigest}>Cod referință: {error.digest}</div>
        )}
      </div>
    </main>
  );
}
