import FavoritesClient from './FavoritesClient';

export const metadata = {
  title: 'Produse Favorite | Longevity Pharma',
};

// Invelisul ramane componenta de server doar ca sa poata exporta `metadata`.
export default function FavoritesPage() {
  return <FavoritesClient />;
}
