import React from 'react';
import Link from 'next/link';
import styles from './Abonamente.module.css';

export const metadata = {
  title: 'Abonamente | Longevity Pharma',
  description: 'Alege planul de abonament care ți se potrivește și bucură-te de reduceri și beneficii exclusive la suplimentele tale preferate.',
};

export default function AbonamentePage() {
  return (
    <main className={styles.pageWrapper}>
      <div className="container">
        
        {/* BREADCRUMBS */}
        <nav className={styles.breadcrumbs}>
          <Link href="/">Acasă</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Abonamente</span>
        </nav>

        {/* TITLU SIMPLU CENTRAT */}
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Abonamente</h1>
          <p className={styles.pageSubtitle}>
            Alege planul potrivit pentru obiectivele tale de sănătate. Flexibilitate totală, anulezi oricând.
          </p>
        </div>

        {/* CARDURI ABONAMENTE */}
        <div className={styles.cardsGrid}>
          
          {/* Card 1: Basic */}
          <div className={styles.subCard}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Abonament Lunar</h3>
            <p className={styles.cardDesc}>
              Ideal pentru a testa produsele noastre și a-ți construi o rutină zilnică de sănătate.
            </p>
            <ul className={styles.benefitsList}>
              <li>Reducere <strong>10%</strong> la fiecare comandă</li>
              <li>Livrare gratuită (peste 200 RON)</li>
              <li>Reînnoire automată la 30 de zile</li>
            </ul>
            <div className={styles.cardFooter}>
              <button className={styles.actionBtn}>Alege planul</button>
            </div>
          </div>

          {/* Card 2: Trimestrial */}
          <div className={styles.subCard}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Pachet Trimestrial</h3>
            <p className={styles.cardDesc}>
              Alegerea populară. O sursă constantă de nutrienți pentru rezultate vizibile pe termen mediu.
            </p>
            <ul className={styles.benefitsList}>
              <li>Reducere <strong>15%</strong> la fiecare comandă</li>
              <li>Livrare gratuită inclusă</li>
              <li>Reînnoire automată la 3 luni</li>
            </ul>
            <div className={styles.cardFooter}>
              <button className={styles.actionBtn}>Alege planul</button>
            </div>
          </div>

          {/* Card 3: Semestrial */}
          <div className={styles.subCard}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Pachet Semestrial</h3>
            <p className={styles.cardDesc}>
              Dedicat celor care au integrat perfect suplimentele în stilul lor de viață biohacking.
            </p>
            <ul className={styles.benefitsList}>
              <li>Reducere <strong>20%</strong> la fiecare comandă</li>
              <li>Livrare gratuită inclusă</li>
              <li>Acces anticipat la produse noi</li>
            </ul>
            <div className={styles.cardFooter}>
              <button className={styles.actionBtn}>Alege planul</button>
            </div>
          </div>

          {/* Card 4: Anual (VIP) */}
          <div className={`${styles.subCard} ${styles.subCardVip}`}>
            <div className={styles.iconWrapperVip}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Protocol VIP (Anual)</h3>
            <p className={styles.cardDesc}>
              Nivelul suprem de longevitate. Fără grija stocurilor timp de un an întreg, plus extra beneficii.
            </p>
            <ul className={styles.benefitsList}>
              <li>Reducere <strong>25%</strong> la fiecare comandă</li>
              <li>Livrare gratuită inclusă</li>
              <li>Consultanță și suport prioritar</li>
              <li>Cadouri surpriză periodice</li>
            </ul>
            <div className={styles.cardFooter}>
              <button className={styles.actionBtnVip}>Devino VIP</button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
