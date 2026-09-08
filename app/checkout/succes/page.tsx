import CheckoutSuccessClient from './CheckoutSuccessClient'

export const metadata = {
  title: 'Order complete | Longevity Pharma',
}

// Învelișul rămâne componentă de server doar ca să poată exporta `metadata`.
export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />
}
