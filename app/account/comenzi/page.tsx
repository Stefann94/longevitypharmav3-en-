import OrdersClient from './OrdersClient';

export const metadata = {
  title: 'Comenzile Mele | Longevity Pharma',
};

// Invelisul ramane componenta de server doar ca sa poata exporta `metadata`.
export default function OrdersPage() {
  return <OrdersClient />;
}
