'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/app/context/FavoritesContext';
import styles from './RemoveFavoriteButton.module.css';

interface RemoveFavoriteButtonProps {
  productSlug: string;
  productName: string;
}

export default function RemoveFavoriteButton({ productSlug, productName }: RemoveFavoriteButtonProps) {
  const { toggleFavorite } = useFavorites();
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRemove = async () => {
    setIsRemoving(true);

    // Trecem prin context, ca să se actualizeze și numărul din antet,
    // nu doar lista din pagină.
    const result = await toggleFavorite(productSlug);

    if (result?.error) {
      setIsRemoving(false);
      return;
    }

    // Pagina este randată pe server, deci o reîmprospătăm ca să dispară cardul
    // (și ca să apară starea goală dacă era ultimul produs).
    startTransition(() => router.refresh());
    setIsRemoving(false);
  };

  const busy = isRemoving || isPending;

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={busy}
      className={styles.button}
      aria-label={`Elimină ${productName} de la favorite`}
    >
      {busy ? (
        <>
          <svg className={styles.spinner} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          Se elimină
        </>
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Elimină
        </>
      )}
    </button>
  );
}
