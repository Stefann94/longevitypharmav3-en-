'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from './Account.module.css';
import { useUtilizatorCurent } from './useUtilizatorCurent';

type Address = {
  id: string;
  type: string;
  street: string;
  city: string;
  country: string;
};

export default function AccountPage() {
  const { user } = useUtilizatorCurent();

  const [defaultShipping, setDefaultShipping] = useState<Address | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    let activ = true;

    // Aceleași două interogări ca înainte, rulate acum din browser.
    // Politicile RLS le filtrează după `auth.uid()`, deci fiecare client
    // primește exact rândurile lui.
    Promise.all([
      supabase.from('addresses').select('*').eq('user_id', user.id),
      supabase
        .from('newsletter_subscriptions')
        .select('is_subscribed')
        .eq('user_id', user.id)
        .single(),
    ]).then(([{ data: addresses }, { data: newsletter }]) => {
      if (!activ) return;
      setDefaultShipping((addresses as Address[] | null)?.find(a => a.type === 'shipping') ?? null);
      setIsSubscribed(newsletter?.is_subscribed || false);
    });

    return () => {
      activ = false;
    };
  }, [user]);

  // Layout-ul de cont nu randează conținutul până nu știe cine e utilizatorul,
  // deci aici `user` este deja disponibil. Verificarea rămâne pentru TypeScript.
  if (!user) return null;

  // Obținem informații adiționale
  const firstName = user.user_metadata?.first_name || '';
  const lastName = user.user_metadata?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const email = user.email || '';

  return (
    <div className={styles.contentArea}>
      
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Bine ai venit, <strong>{firstName || 'în contul tău'}</strong>!</h2>
          <p className={styles.heroSubtitle}>Gestionează-ți datele personale, urmărește comenzile și descoperă noutățile.</p>
        </div>
        <img src="/images/zen_stones.png" alt="Zen Stones" className={styles.heroImage} />
      </div>

      <div className={styles.dashboardGrid}>
        
        {/* Contact Info Premium Card */}
        <div className={styles.premiumCard}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className={styles.cardHeader}>Date de Contact</div>
          <div className={styles.cardContent}>
            <strong>{fullName || 'Nume Nesetat'}</strong><br/>
            {email}
          </div>
          <a href="/account/informatii" className={styles.actionLink}>
            Modifică datele
          </a>
        </div>

        {/* Newsletter Premium Card */}
        <div className={styles.premiumCard}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <div className={styles.cardHeader}>Newsletter</div>
          <div className={styles.cardContent}>
            {isSubscribed 
              ? 'Ești abonat la newsletter-ul nostru.' 
              : 'Nu ești abonat la newsletter-ul nostru.'}
          </div>
          <a href="/account/newsletter" className={styles.actionLink}>
            Gestionează abonarea
          </a>
        </div>

        {/* Address Premium Card */}
        <div className={styles.premiumCard}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <div className={styles.cardHeader}>Adresă Principală</div>
          <div className={styles.cardContent}>
            {defaultShipping 
              ? `${defaultShipping.street}, ${defaultShipping.city}, ${defaultShipping.country}`
              : 'Nu ai configurat încă o adresă implicită pentru livrare.'}
          </div>
          <a href="/account/adrese" className={styles.actionLink}>
            {defaultShipping ? 'Modifică adresa' : 'Adaugă adresă'}
          </a>
        </div>

      </div>
    </div>
  );
}
