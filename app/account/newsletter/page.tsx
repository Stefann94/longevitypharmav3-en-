'use client';

import React, { useEffect, useState } from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/client';
import { useUtilizatorCurent } from '../useUtilizatorCurent';
import NewsletterSwitch from './NewsletterSwitch';

export default function NewsletterPage() {
  const { user } = useUtilizatorCurent();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    let activ = true;

    supabase
      .from('newsletter_subscriptions')
      .select('is_subscribed')
      .eq('user_id', user.id)
      .single()
      .then(({ data: subscription }) => {
        if (activ) setIsSubscribed(subscription?.is_subscribed || false);
      });

    return () => {
      activ = false;
    };
  }, [user]);

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Abonare la <strong>newsletter</strong></h2>
      
      <div className={styles.premiumCard}>
        <div className={styles.cardHeader}>Setări Comunicare</div>
        <p className={styles.cardContent} style={{ marginBottom: '30px' }}>
          Abonează-te pentru a primi cele mai noi articole despre longevitate, oferte exclusive și noutăți despre produsele noastre.
        </p>

        {/* Comutatorul reține starea inițială la prima randare, deci îl afișăm
            abia după ce știm dacă utilizatorul este sau nu abonat. */}
        {isSubscribed !== null && <NewsletterSwitch initialSubscribed={isSubscribed} />}
      </div>
    </div>
  );
}
