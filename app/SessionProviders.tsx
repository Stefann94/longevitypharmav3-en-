'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

/**
 * Ține coșul și favoritele legate de utilizatorul curent.
 *
 * Layout-ul citea înainte sesiunea pe server și folosea id-ul utilizatorului
 * drept `key` pe cele două contexte. Rolul acelui `key` este să golească
 * starea la schimbarea utilizatorului: altfel coșul unui client ar rămâne
 * afișat după ce se conectează altcineva pe același calculator.
 *
 * Comportamentul rămâne identic, doar că id-ul se află acum din browser.
 * `onAuthStateChange` acoperă și autentificarea, și delogarea, fără
 * reîncărcarea paginii.
 */
export default function SessionProviders({ children }: { children: React.ReactNode }) {
  const [userKey, setUserKey] = useState('guest');

  useEffect(() => {
    const supabase = createClient();
    let activ = true;

    supabase.auth.getUser().then(({ data }) => {
      if (activ) setUserKey(data.user?.id || 'guest');
    });

    const { data: abonament } = supabase.auth.onAuthStateChange((_eveniment, sesiune) => {
      if (activ) setUserKey(sesiune?.user?.id || 'guest');
    });

    return () => {
      activ = false;
      abonament.subscription.unsubscribe();
    };
  }, []);

  return (
    <FavoritesProvider key={userKey}>
      <CartProvider key={userKey}>
        {children}
      </CartProvider>
    </FavoritesProvider>
  );
}
