'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Checkout.module.css'
import { processCheckout } from './actions'
import { useCart } from '@/app/context/CartContext'

interface ProfileData {
  first_name: string
  last_name: string
  phone: string
  email: string
}

interface AddressData {
  street: string
  city: string
  county: string
  postal_code: string
}

interface CheckoutClientProps {
  profile: ProfileData
  address: AddressData | null
}

export default function CheckoutClient({ profile, address }: CheckoutClientProps) {
  const router = useRouter()
  const { cartItems, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const itemsTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  // Aceleasi valori ca in cos, convertite din RON la 1 EUR = 5.25 RON:
  // pragul de 200 RON devine 40 EUR, transportul de 19.99 RON devine 3.90 EUR.
  const FREE_SHIPPING_THRESHOLD = 40
  const STANDARD_SHIPPING_COST = 3.90
  const shippingCost = itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
  const finalTotal = itemsTotal + shippingCost

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const result = await processCheckout(formData)

    if (result.error) {
      setErrorMsg(result.error)
      setIsSubmitting(false)
    } else if (result.success) {
      clearCart()
      router.push('/checkout/success')
    }
  }

  // If cart is completely empty, it might be better to let context redirect or show empty msg.
  if (cartItems.length === 0) {
    return (
      <div className={styles.checkoutWrapper}>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>Your cart is empty.</h2>
          <button onClick={() => router.push('/cart')} className={styles.confirmButton} style={{ marginTop: '20px', maxWidth: '200px' }}>
            Go to cart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.checkoutWrapper}>
      <h1 className={styles.checkoutTitle}>Checkout</h1>

      <form onSubmit={handleSubmit} className={styles.checkoutGrid}>
        {/* Hidden field for guest cart items */}
        <input type="hidden" name="guestCartItems" value={JSON.stringify(cartItems)} />

        {/* Left Form */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Shipping details</h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First name</label>
              <input type="text" name="first_name" defaultValue={profile.first_name} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Last name</label>
              <input type="text" name="last_name" defaultValue={profile.last_name} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input type="tel" name="phone" defaultValue={profile.phone} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail</label>
              <input type="email" name="email" defaultValue={profile.email} required className={styles.input} readOnly={!!profile.email} />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Address (street, number, building, flat)</label>
              <input type="text" name="street" defaultValue={address?.street || ''} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>City</label>
              <input type="text" name="city" defaultValue={address?.city || ''} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              {/* „County" acopera si judetul romanesc, si diviziunile
                  administrative din alte tari europene. */}
              <label className={styles.label}>County / Region</label>
              <input type="text" name="county" defaultValue={address?.county || ''} required className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Postal code</label>
              <input type="text" name="zip" defaultValue={address?.postal_code || ''} required className={styles.input} />
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>Order summary</h2>

          <div className={styles.summaryList}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.summaryItem}>
                <span className={styles.itemName}>{item.quantity}x {item.name || 'Product'}</span>
                <span className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <div className={styles.divider}></div>

          <div className={styles.totalsRow}>
            <span>Subtotal:</span>
            <span>{itemsTotal.toFixed(2)} €</span>
          </div>

          <div className={styles.totalsRow}>
            <span>Shipping:</span>
            <span>{shippingCost === 0 ? <span className={styles.freeText}>FREE</span> : `${shippingCost} €`}</span>
          </div>

          <div className={`${styles.totalsRow} ${styles.grandTotal}`}>
            <span>Total to pay:</span>
            <span>{finalTotal.toFixed(2)} €</span>
          </div>

          {errorMsg && (
            <div className={styles.errorBox}>{errorMsg}</div>
          )}

          <button type="submit" disabled={isSubmitting} className={styles.confirmButton}>
            {isSubmitting ? 'Processing…' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  )
}
