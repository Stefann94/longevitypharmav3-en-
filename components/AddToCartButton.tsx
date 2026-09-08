'use client'

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import styles from '@/app/produs/[slug]/ProductPage.module.css';

import stylesCarousel from '@/components/ProductCarousel.module.css';

interface AddToCartButtonProps {
  productSlug: string;
  price: number;
  variant?: 'full' | 'icon';
}

export default function AddToCartButton({ productSlug, price, variant = 'full' }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    e.stopPropagation();
    
    setLoading(true);
    const result = await addToCart(productSlug, price, 1);
    
    if (result.error && !result.notAuthenticated) {
      alert(result.error);
    } else {
      setShowPopup(true);
    }
    
    setLoading(false);
  };

  return (
    <>
      {variant === 'icon' ? (
        <button 
          className={stylesCarousel.addToCartBtn} 
          onClick={handleAddToCart}
          disabled={loading}
          aria-label="Adaugă în coș"
          style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          )}
        </button>
      ) : (
        <button 
          className={styles.btnAddToCart} 
          onClick={handleAddToCart}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {loading ? 'Se adaugă...' : 'Adaugă în Coș'}
        </button>
      )}

      {showPopup && mounted && createPortal(
        <div className={styles.modalOverlay} onClick={() => setShowPopup(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className={styles.modalTitle}>Produs adăugat în coș!</h3>
            </div>
            
            <div className={styles.modalButtons}>
              {/* Închiderea explicită este necesară pentru cazul în care
                  utilizatorul este deja pe /cart (de exemplu, adaugă din
                  caruselul de recomandări): acolo nu are loc nicio navigare
                  care să demonteze modalul, deci ar rămâne pe ecran.
                  Tot atunci derulăm sus, ca să vadă coșul actualizat. */}
              <Link
                href="/cart"
                className={styles.btnCart}
                onClick={() => {
                  setShowPopup(false);
                  if (pathname === '/cart') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                Spre coșul meu
              </Link>
              <button className={styles.btnContinue} onClick={() => setShowPopup(false)}>
                Continuă cumpărăturile
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
