'use client';

import React, { useEffect, useState } from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/client';
import { useUtilizatorCurent } from '../useUtilizatorCurent';
import MedicalForm from './MedicalForm';

type DateMedicale = { allergies: string; current_treatments: string };

export default function MedicalPage() {
  const { user } = useUtilizatorCurent();
  const [initialData, setInitialData] = useState<DateMedicale | null>(null);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    let activ = true;

    supabase
      .from('medical_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data: medical }) => {
        if (!activ) return;
        setInitialData({
          allergies: medical?.allergies || '',
          current_treatments: medical?.current_treatments || '',
        });
      });

    return () => {
      activ = false;
    };
  }, [user]);

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Informații <strong>medicale</strong></h2>
      {/* Formularul își copiază valorile inițiale în starea proprie la prima
          randare, deci nu îl afișăm înainte să avem datele — altfel ar rămâne gol. */}
      {initialData && <MedicalForm initialData={initialData} />}
    </div>
  );
}
