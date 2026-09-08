'use client';

import React, { useEffect, useState } from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/client';
import { useCurrentUser } from '../useCurrentUser';
import AddressForm from './AddressForm';

// Campurile sunt cele asteptate de AddressForm, toate optionale: un rand
// din baza de date poate avea adresa completata partial.
type Address = {
  id: string;
  type: string;
  street?: string;
  city?: string;
  postal_code?: string;
  county?: string;
};

export default function AddressesPage() {
  const { user } = useCurrentUser();
  const [addresses, setAddresses] = useState<Address[] | null>(null);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    let activ = true;

    supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (activ) setAddresses((data as Address[] | null) ?? []);
      });

    return () => {
      activ = false;
    };
  }, [user]);

  const shipping = addresses?.find(a => a.type === 'shipping');
  const billing = addresses?.find(a => a.type === 'billing');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className={styles.heroTitle} style={{ marginBottom: 0 }}>Address <strong>book</strong></h2>
      </div>
      
      {/* Formularele își preiau valorile inițiale o singură dată, la montare,
          deci așteptăm adresele înainte să le afișăm. */}
      {addresses !== null && (
        <div className={styles.dashboardGrid}>
          <AddressForm 
            type="shipping"
            title="Default shipping address"
            description="You have not set a shipping address yet. Add one to check out faster on future orders."
            initialData={shipping}
          />

          <AddressForm 
            type="billing"
            title="Default billing address"
            description="You have not set a billing address yet. It will be used when issuing your invoices."
            initialData={billing}
          />
        </div>
      )}
    </div>
  );
}
