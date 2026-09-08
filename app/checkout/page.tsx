import React from 'react'
import CheckoutLoader from './CheckoutLoader'

export const metadata = {
  title: 'Finalizare Comandă | Longevity Pharma',
}

// Învelișul rămâne componentă de server doar ca să poată exporta `metadata`.
export default function CheckoutPage() {
  return <CheckoutLoader />
}
