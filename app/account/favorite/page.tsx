import FavoritesClient from './FavoritesClient';

export const metadata = {
  title: 'Favorite Products | Longevity Pharma',
};

// Invelisul ramane componenta de server doar ca sa poata exporta `metadata`.
export default function FavoritesPage() {
  return <FavoritesClient />;
}
