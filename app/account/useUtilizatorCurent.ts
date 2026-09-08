'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

/**
 * Utilizatorul conectat, aflat din browser.
 *
 * Fiecare pagină de cont făcea pe server același lucru:
 *
 *     const { data: { user } } = await supabase.auth.getUser();
 *     if (!user) redirect('/login');
 *
 * Ambele operațiuni cer un server Node, pe care găzduirea Hostico Start nu îl
 * are. Verificarea se face acum în browser, iar redirecționarea prin router.
 *
 * `seIncarca` rămâne `true` până se știe sigur dacă există sesiune, ca paginile
 * să nu afișeze pentru o clipă date goale înainte de a primi răspunsul.
 */
export function useUtilizatorCurent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [seIncarca, setSeIncarca] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let activ = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!activ) return;

      if (!data.user) {
        // `replace`, nu `push`: pagina de cont nu trebuie să rămână în istoric,
        // altfel butonul "înapoi" ar readuce vizitatorul aici după delogare.
        router.replace('/login');
        return;
      }

      setUser(data.user);
      setSeIncarca(false);
    });

    return () => {
      activ = false;
    };
  }, [router]);

  return { user, seIncarca };
}
