'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { useCart } from '@/app/context/CartContext'
import FavoriteButton from '@/components/FavoriteButton'
import styles from './Cart.module.css'

export default function CartClient() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, isLoading } = useCart()
  const [voucherOpen, setVoucherOpen] = useState(false)

  if (isLoading) {
    return (
      <div className={styles.cartWrapper}>
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>Se încarcă...</div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.cartWrapper}>
        <h1 className={styles.cartTitle}>Coșul meu</h1>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>Coșul tău este gol</h2>
          <p className={styles.emptyDesc}>Pentru a adăuga produse în coș, te rugăm să te întorci în magazin.</p>
          <Link href="/" className={styles.shopButton}>
            Întoarce-te la magazin
          </Link>
        </div>
      </div>
    )
  }

  // Calculate Shipping
  const FREE_SHIPPING_THRESHOLD = 200
  const STANDARD_SHIPPING_COST = 19.99
  
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD
  const shippingCost = isFreeShipping ? 0 : STANDARD_SHIPPING_COST
  const finalTotal = cartTotal + shippingCost
  
  const shippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100)
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal)

  return (
    <div className={styles.cartWrapper}>
      <h1 className={styles.cartTitle}>Coșul meu</h1>
      
      <div className={styles.cartGrid}>
        <div className={styles.leftColumn}>
          {/* Free Shipping Banner */}
          <div className={styles.freeShippingBanner}>
            {isFreeShipping ? (
              <div className={styles.freeShippingText}>
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ color: '#2e8b57', marginRight: '5px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                Ai <span>livrare gratuită!</span>
              </div>
            ) : (
              <div className={styles.freeShippingText}>
                Mai adaugă produse de <span>{amountToFreeShipping.toFixed(2)} Lei</span> pentru <span>livrare gratuită!</span>
              </div>
            )}
            
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${shippingProgress}%` }}
              ></div>
            </div>
            
            <div className={styles.deliveryCostText}>
              Cost livrare: {isFreeShipping ? <span>GRATUIT</span> : `${STANDARD_SHIPPING_COST} Lei`}
            </div>
          </div>

          {/* Cart Items */}
          <div className={styles.cartItemsList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImageContainer}>
                  <Image 
                    src={item.image_url || '/placeholder.png'} 
                    alt={item.name || 'Produs'} 
                    fill
                    className={styles.itemImage}
                  />
                </div>
                
                <div className={styles.itemDetails}>
                  <Link href={`/produs/${item.product_slug}`} className={styles.itemTitle}>
                    {item.name}
                  </Link>
                  <div className={styles.itemStock}>Disponibilitate: În stoc</div>
                  
                  <div className={styles.itemActions}>
                    <button 
                      onClick={() => removeFromCart(item.product_slug)} 
                      className={styles.actionButton}
                    >
                      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Șterge
                    </button>
                    {/* Butonul era decorativ, fără acțiune. Acum refolosește
                        componenta de favorite, împreună cu modalul de
                        autentificare pentru vizitatorii nelogați. */}
                    <FavoriteButton
                      productSlug={item.product_slug}
                      className={`${styles.actionButton} ${styles.favorite}`}
                      label="Adaugă la favorite"
                      activeLabel="Salvat la favorite"
                    />
                  </div>
                </div>

                <div className={styles.itemPriceSection}>
                  <div className={styles.itemPrice}>
                    {item.price.toFixed(2)} Lei
                  </div>
                  
                  <div className={styles.quantityControl}>
                    <button 
                      className={styles.qtyButton} 
                      onClick={() => updateQuantity(item.product_slug, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <div className={styles.qtyValue}>{item.quantity}</div>
                    <button 
                      className={styles.qtyButton}
                      onClick={() => updateQuantity(item.product_slug, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Summary Column */}
        <div className={styles.summaryContainer}>
          <h2 className={styles.summaryTitle}>Sumar comandă</h2>
          
          <div className={styles.summaryRow}>
            <span>Cost produse:</span>
            <span>{cartTotal.toFixed(2)} Lei</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Cost livrare:</span>
            <span>{isFreeShipping ? <span className={styles.freeText}>GRATUIT</span> : `${STANDARD_SHIPPING_COST} Lei`}</span>
          </div>
          
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <div className={styles.totalRowInner}>
              <span>Total:</span>
              <span>{finalTotal.toFixed(2)} Lei</span>
            </div>
          </div>

          <Link href="/checkout" className={styles.checkoutButton}>
            Continuă <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className={styles.checkoutIcon}><polyline points="9 18 15 12 9 6"></polyline></svg>
          </Link>
          
          {/* Voucher */}
          <div className={styles.voucherSection}>
            <div 
              className={styles.voucherHeader} 
              onClick={() => setVoucherOpen(!voucherOpen)}
            >
              <span>% Vezi/adaugă vouchere</span>
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ transform: voucherOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            {voucherOpen && (
              <div className={styles.voucherContent}>
                <div>Ai un cod de reducere?</div>
                <div className={styles.voucherInputGroup}>
                  <input type="text" placeholder="Introdu codul" className={styles.voucherInput} />
                  <button className={styles.voucherApply}>Aplică</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
