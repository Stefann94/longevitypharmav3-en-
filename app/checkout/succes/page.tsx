import CheckoutSuccessClient from './CheckoutSuccessClient'

export const metadata = {
  title: 'Comandă finalizată | Longevity Pharma',
}

// Învelișul rămâne componentă de server doar ca să poată exporta `metadata`.
export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />
}
