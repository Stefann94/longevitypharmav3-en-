"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useFavorites } from '@/app/context/FavoritesContext';
import styles from '@/app/produs/[slug]/ProductPage.module.css';

interface FavoriteButtonProps {
  productSlug: string;
  className?: string;
  /** Text afișat lângă inimă. Fără el, butonul rămâne doar iconiță. */
  label?: string;
  /** Text folosit când produsul este deja la favorite. */
  activeLabel?: string;
}

export default function FavoriteButton({ productSlug, className, label, activeLabel }: FavoriteButtonProps) {
  const { favoriteItems, toggleFavorite } = useFavorites();
  const isFav = favoriteItems.some(f => f.product_slug === productSlug);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Închidere cu tasta Escape, cât timp modalul este deschis
  useEffect(() => {
    if (!showAuthModal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAuthModal(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showAuthModal]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await toggleFavorite(productSlug);

    if (result?.notAuthenticated) {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <button
        className={`${className || ''} ${isFav ? 'is-favorite-active' : ''}`}
        aria-label={isFav ? 'Elimină de la favorite' : 'Adaugă la favorite'}
        onClick={handleClick}
      >
        <svg
          /* Cu text alături, iconița se scalează după mărimea fontului,
             ca să se alinieze cu celelalte acțiuni din rând. */
          width={label ? '1em' : 18}
          height={label ? '1em' : 18}
          viewBox="0 0 24 24"
          fill={isFav ? "var(--color-primary)" : "none"}
          stroke={isFav ? "var(--color-primary)" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        {label ? <span>{isFav ? (activeLabel ?? label) : label}</span> : null}
      </button>

      {showAuthModal && mounted && createPortal(
        <div className={styles.modalOverlay} onClick={() => setShowAuthModal(false)}>
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="fav-auth-title"
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3 className={styles.modalTitle} id="fav-auth-title">Păstrează-ți produsele favorite</h3>
              <p className={styles.modalText}>
                Ai nevoie de un cont pentru a salva produsele care îți plac.
                Le vei regăsi oricând, de pe orice dispozitiv.
              </p>
            </div>

            <div className={styles.modalButtons}>
              <Link href="/login" className={styles.btnCart}>
                Autentifică-te
              </Link>
              <Link href="/signup" className={`${styles.btnContinue} ${styles.btnAsLink}`}>
                Creează cont nou
              </Link>
              <button
                type="button"
                className={styles.modalDismiss}
                onClick={() => setShowAuthModal(false)}
              >
                Poate mai târziu
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
