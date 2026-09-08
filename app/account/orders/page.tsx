import OrdersClient from './OrdersClient';

export const metadata = {
  title: 'My Orders | Longevity Pharma',
};

// Invelisul ramane componenta de server doar ca sa poata exporta `metadata`.
export default function OrdersPage() {
  return <OrdersClient />;
}
