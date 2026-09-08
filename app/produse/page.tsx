import React, { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient';

export const metadata = {
  title: 'Rezultatele căutării | Longevity Pharma',
  // Pagina depinde de ce caută fiecare vizitator, deci nu are ce oferi
  // motoarelor de căutare.
  robots: { index: false, follow: true },
};

/**
 * Învelișul rămâne componentă de server, doar ca să poată exporta `metadata`
 * (un component de client nu are voie). Căutarea propriu-zisă e în
 * SearchResultsClient.
 *
 * `Suspense` este obligatoriu: `useSearchParams` îl cere atunci când pagina
 * este pre-generată la build.
 */
export default function SearchResultsPage() {
  return (
    <Suspense>
      <SearchResultsClient />
    </Suspense>
  );
}
