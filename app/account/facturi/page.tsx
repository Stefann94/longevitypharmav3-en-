'use client';

import React, { useEffect, useState } from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/client';
import { useUtilizatorCurent } from '../useUtilizatorCurent';

export default function InvoicesPage() {
  const { user } = useUtilizatorCurent();
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    let activ = true;

    supabase.from('invoices').select('*').eq('user_id', user.id).then(({ data }) => {
      if (activ) setInvoices(data ?? []);
    });

    return () => {
      activ = false;
    };
  }, [user]);

  // Layout-ul de cont nu randeaza continutul pana nu stie cine e utilizatorul.
  if (!user) return null;

  const hasInvoices = invoices.length > 0;
  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Istoric <strong>facturi</strong></h2>
      
      {!hasInvoices ? (
        <div className={styles.premiumCard} style={{ textAlign: 'center', padding: '60px 20px', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#f4f8f1', border: '1px solid #d6e4d9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--color-primary)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div className={styles.cardHeader}>Nu ai nicio factură emisă</div>
          <p className={styles.cardContent} style={{ maxWidth: '400px', margin: '0 auto' }}>
            Facturile aferente comenzilor tale vor fi generate și salvate aici automat, pentru a le putea descărca oricând în format PDF.
          </p>
        </div>
      ) : (
        <div className={styles.premiumCard}>
          <div className={styles.cardHeader}>Ai {invoices.length} facturi</div>
        </div>
      )}
    </div>
  );
}
