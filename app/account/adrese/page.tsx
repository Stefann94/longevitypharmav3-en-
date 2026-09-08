'use client';

import React, { useEffect, useState } from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/client';
import { useUtilizatorCurent } from '../useUtilizatorCurent';
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
  const { user } = useUtilizatorCurent();
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
        <h2 className={styles.heroTitle} style={{ marginBottom: 0 }}>Agenda de <strong>adrese</strong></h2>
      </div>
      
      {/* Formularele își preiau valorile inițiale o singură dată, la montare,
          deci așteptăm adresele înainte să le afișăm. */}
      {addresses !== null && (
        <div className={styles.dashboardGrid}>
          <AddressForm 
            type="shipping"
            title="Adresă de livrare implicită"
            description="Nu ai setat nicio adresă de livrare. Adaugă o adresă pentru o finalizare mai rapidă a comenzilor viitoare."
            initialData={shipping}
          />

          <AddressForm 
            type="billing"
            title="Adresă de facturare implicită"
            description="Nu ai setat nicio adresă de facturare. Aceasta va fi folosită pentru emiterea facturilor fiscale."
            initialData={billing}
          />
        </div>
      )}
    </div>
  );
}
