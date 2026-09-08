'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import CheckoutClient from './CheckoutClient';

type Profile = { first_name: string; last_name: string; phone: string; email: string };
type Address = { street: string; city: string; county: string; postal_code: string } | null;

const PROFIL_GOL: Profile = { first_name: '', last_name: '', phone: '', email: '' };

/**
 * Pre-completează formularul de comandă cu datele clientului conectat.
 *
 * Citirile se făceau pe server, ceea ce forța randarea la cerere. Acum se fac
 * din browser, iar politicile RLS returnează exact rândurile utilizatorului.
 *
 * Formularul nu se afișează până nu se știe ce date are de primit: își
 * copiază valorile inițiale în starea proprie la montare, deci randat mai
 * devreme ar rămâne gol chiar dacă datele sosesc imediat după.
 *
 * Pentru vizitatorii fără cont nu există nimic de așteptat, deci formularul
 * apare imediat, cu câmpuri goale - exact ca înainte.
 */
export default function CheckoutLoader() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [address, setAddress] = useState<Address>(null);

  useEffect(() => {
    const supabase = createClient();
    let activ = true;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Vizitator: nu avem ce pre-completa.
        if (activ) setProfile(PROFIL_GOL);
        return;
      }

      const [{ data: profil }, { data: adresa }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'shipping')
          .single(),
      ]);

      if (!activ) return;

      setProfile(
        profil
          ? {
              first_name: profil.first_name || '',
              last_name: profil.last_name || '',
              phone: profil.phone || '',
              email: user.email || '',
            }
          : PROFIL_GOL
      );

      setAddress(
        adresa
          ? {
              street: adresa.street,
              city: adresa.city,
              county: adresa.county,
              postal_code: adresa.postal_code,
            }
          : null
      );
    })();

    return () => {
      activ = false;
    };
  }, []);

  if (!profile) return null;

  return <CheckoutClient profile={profile} address={address} />;
}
