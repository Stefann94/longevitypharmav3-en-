'use client';

import React, { useEffect, useState } from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/client';
import { useUtilizatorCurent } from '../useUtilizatorCurent';
import ProfileForm from './ProfileForm';

type DateProfil = { first_name: string; last_name: string; email: string; phone: string };

export default function PersonalInfoPage() {
  const { user } = useUtilizatorCurent();
  const [initialData, setInitialData] = useState<DateProfil | null>(null);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    let activ = true;

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data: profile }) => {
        if (!activ) return;
        setInitialData({
          first_name: profile?.first_name || user.user_metadata?.first_name || '',
          last_name: profile?.last_name || user.user_metadata?.last_name || '',
          email: user.email || '',
          phone: profile?.phone || '',
        });
      });

    return () => {
      activ = false;
    };
  }, [user]);

  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Informații <strong>cont</strong></h2>
      {initialData && <ProfileForm initialData={initialData} />}
    </div>
  );
}
