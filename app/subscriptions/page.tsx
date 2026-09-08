import React from 'react';
import Link from 'next/link';
import styles from './Abonamente.module.css';

export const metadata = {
  title: 'Subscriptions | Longevity Pharma',
  description: 'Choose the subscription plan that suits you and enjoy discounts and exclusive benefits on your favorite supplements.',
};

export default function AbonamentePage() {
  return (
    <main className={styles.pageWrapper}>
      <div className="container">
        
        {/* BREADCRUMBS */}
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Subscriptions</span>
        </nav>

        {/* TITLU SIMPLU CENTRAT */}
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Subscriptions</h1>
          <p className={styles.pageSubtitle}>
            Choose the plan that fits your health goals. Fully flexible — cancel any time.
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
            <h3 className={styles.cardTitle}>Monthly plan</h3>
            <p className={styles.cardDesc}>
              Ideal for trying our products and building a daily health routine.
            </p>
            <ul className={styles.benefitsList}>
              <li><strong>10%</strong> off every order</li>
              <li>Free shipping (over 40 €)</li>
              <li>Renews automatically every 30 days</li>
            </ul>
            <div className={styles.cardFooter}>
              <button className={styles.actionBtn}>Choose this plan</button>
            </div>
          </div>

          {/* Card 2: Trimestrial */}
          <div className={styles.subCard}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Quarterly plan</h3>
            <p className={styles.cardDesc}>
              The popular choice. A steady supply of nutrients for visible results over the medium term.
            </p>
            <ul className={styles.benefitsList}>
              <li><strong>15%</strong> off every order</li>
              <li>Free shipping included</li>
              <li>Renews automatically every 3 months</li>
            </ul>
            <div className={styles.cardFooter}>
              <button className={styles.actionBtn}>Choose this plan</button>
            </div>
          </div>

          {/* Card 3: Semestrial */}
          <div className={styles.subCard}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Half-yearly plan</h3>
            <p className={styles.cardDesc}>
              For those who have fully built supplements into their biohacking lifestyle.
            </p>
            <ul className={styles.benefitsList}>
              <li><strong>20%</strong> off every order</li>
              <li>Free shipping included</li>
              <li>Early access to new products</li>
            </ul>
            <div className={styles.cardFooter}>
              <button className={styles.actionBtn}>Choose this plan</button>
            </div>
          </div>

          {/* Card 4: Anual (VIP) */}
          <div className={`${styles.subCard} ${styles.subCardVip}`}>
            <div className={styles.iconWrapperVip}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>VIP Protocol (yearly)</h3>
            <p className={styles.cardDesc}>
              The highest level of longevity. No worrying about running out for a whole year, plus extra benefits.
            </p>
            <ul className={styles.benefitsList}>
              <li><strong>25%</strong> off every order</li>
              <li>Free shipping included</li>
              <li>Consultation and priority support</li>
              <li>Occasional surprise gifts</li>
            </ul>
            <div className={styles.cardFooter}>
              <button className={styles.actionBtnVip}>Become VIP</button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
