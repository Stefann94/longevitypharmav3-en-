'use client';

import { useEffect, useState } from 'react';
import styles from './BackToTopButton.module.css';

/**
 * Buton de întoarcere în capul paginii.
 * Apare doar după ce utilizatorul a derulat, ca să nu acopere conținutul
 * pe paginile scurte.
 */
export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 400);

    // Verificăm și la montare: utilizatorul poate ajunge direct
    // pe o poziție derulată (de exemplu, revenind cu butonul înapoi).
    toggleVisibility();

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`${styles.button} ${isVisible ? styles.visible : ''}`}
      aria-label="Înapoi sus"
      title="Înapoi sus"
      // Scos din ordinea de tabulare cât timp e ascuns
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
  );
}
