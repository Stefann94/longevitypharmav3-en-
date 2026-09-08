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
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Newsletter <strong>subscription</strong></h2>

      <div className={styles.premiumCard}>
        <div className={styles.cardHeader}>Communication settings</div>
        <p className={styles.cardContent} style={{ marginBottom: '30px' }}>
          Subscribe to receive our latest articles on longevity, exclusive offers and news about our products.
        </p>

        {/* Comutatorul reține starea inițială la prima randare, deci îl afișăm
            abia după ce știm dacă utilizatorul este sau nu abonat. */}
        {isSubscribed !== null && <NewsletterSwitch initialSubscribed={isSubscribed} />}
      </div>
    </div>
  );
}
