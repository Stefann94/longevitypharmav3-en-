'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Pachete.module.css';
import pageStyles from '../page.module.css';
import AddToCartButton from '../../components/AddToCartButton';
import FavoriteButton from '../../components/FavoriteButton';

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  price: number;
}

interface PacheteClientProps {
  products: Product[];
}

export default function PacheteClient({ products }: PacheteClientProps) {
  const [sortOption, setSortOption] = useState('price-desc');

  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    switch (sortOption) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
      default:
        sorted.sort((a, b) => b.price - a.price);
        break;
    }
    return sorted;
  }, [products, sortOption]);

  return (
    <main>
      <div className="container">
        {/* BREADCRUMBS */}
        <nav className={styles.breadcrumbs} style={{ paddingBottom: '16px' }}>
          <Link href="/">Acasă</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Pachete & Oferte</span>
        </nav>

        {/* PROMO BANNER AS HEADER */}
        <section className={pageStyles.promoBannerSection} style={{ padding: '0 0 32px 0', backgroundColor: 'transparent' }}>
            <div className={pageStyles.promoBannerLink} style={{ cursor: 'default' }}>
              <Image 
                src="/images/banners/banner_pachete.png" 
                alt="Protocoale & Pachete"
                fill 
                className={pageStyles.promoBannerImage}
              />
              <div className={pageStyles.promoBannerOverlay} style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)', textShadow: '0 2px 15px rgba(0,0,0,0.8)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0 0 8px 0' }}>
                  Protocoale & Pachete
                </h1>
                <p style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Alege formulele complete concepute special pentru susținerea vitalității tale zilnice.</p>
                <span style={{ fontSize: '0.95rem', fontWeight: 500, opacity: 0.8 }}>({products.length} pachete)</span>
              </div>
            </div>
        </section>

        {/* CONTROLS (FILTER / SORT) */}
        {products.length > 0 && (
          <div className={styles.toolbar}>
            <div className={styles.productCount}>
              Afișăm <strong>{products.length}</strong> pachete
            </div>
            <div className={styles.sortOptions}>
              <span className={styles.sortLabel}>Sortează:</span>
              <button
                className={`${styles.sortBtn} ${sortOption === 'price-desc' ? styles.sortBtnActive : ''}`}
                onClick={() => setSortOption('price-desc')}
              >
                Preț ↓
              </button>
              <button
                className={`${styles.sortBtn} ${sortOption === 'price-asc' ? styles.sortBtnActive : ''}`}
                onClick={() => setSortOption('price-asc')}
              >
                Preț ↑
              </button>
              <button
                className={`${styles.sortBtn} ${sortOption === 'name-asc' ? styles.sortBtnActive : ''}`}
                onClick={() => setSortOption('name-asc')}
              >
                A-Z
              </button>
              <button
                className={`${styles.sortBtn} ${sortOption === 'name-desc' ? styles.sortBtnActive : ''}`}
                onClick={() => setSortOption('name-desc')}
              >
                Z-A
              </button>
            </div>
          </div>
        )}

        {/* PRODUCTS GRID */}
        {sortedProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Momentan nu avem pachete promoționale disponibile.</p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {sortedProducts.map((product) => (
              <div key={product.id} className={pageStyles.productCard}>
                <div className={pageStyles.productImageWrapper}>
                  <div className={styles.discountBadge}>
                    -15% EXTRA
                  </div>
                  <FavoriteButton className={pageStyles.favoriteBtn} productSlug={product.slug} />
                  <a href={`/produs/${product.slug}`} style={{ display: 'block' }}>
                    <Image
                      src={product.image_url || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className={pageStyles.productImage}
                    />
                  </a>
                </div>
                <div className={pageStyles.productInfo}>
                  <h3 className={pageStyles.productName}>
                    <a href={`/produs/${product.slug}`}>{product.name}</a>
                  </h3>
                  <div className={pageStyles.productFooter}>
                    <div className={pageStyles.productPrice}>
                      {product.price} <span className={pageStyles.currency}>RON</span>
                    </div>
                    <AddToCartButton
                      productSlug={product.slug}
                      price={product.price}
                      variant="icon"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
