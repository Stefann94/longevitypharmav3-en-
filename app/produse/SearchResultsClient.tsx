'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AddToCartButton from '@/components/AddToCartButton';
import FavoriteButton from '@/components/FavoriteButton';
// Aceleași stiluri ca pagina de categorie: grila și cardurile arată identic și
// moștenesc automat comportamentul responsive deja existent.
import styles from '../categorie/[slug]/Category.module.css';
import pageStyles from '../page.module.css';

type Product = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  price: number;
  is_bestseller?: boolean;
};

/**
 * Căutarea se face acum în browser, nu pe server.
 *
 * Pagina citea termenul din `searchParams`, ceea ce o obliga să fie randată la
 * fiecare cerere — imposibil fără un server Node. Termenul se ia acum din bara
 * de adrese cu `useSearchParams`, iar aceeași funcție `search_products` se
 * apelează direct din browser.
 *
 * Markup-ul și clasele CSS sunt neschimbate față de versiunea de server.
 */
export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const term = (searchParams.get('q') ?? '').trim();

  const [products, setProducts] = useState<Product[]>([]);
  const [seIncarca, setSeIncarca] = useState(false);

  useEffect(() => {
    if (!term) {
      setProducts([]);
      setSeIncarca(false);
      return;
    }

    let activ = true;
    setSeIncarca(true);

    const supabase = createClient();
    // Aceeași funcție folosită de sugestiile din antet, ca rezultatele să fie
    // identice cu cele văzute în timp ce se scrie.
    supabase.rpc('search_products', { search_term: term }).then(({ data, error }) => {
      if (!activ) return;

      if (error) {
        console.error('Eroare la cautarea produselor:', error);
        setProducts([]);
      } else {
        setProducts(data ?? []);
      }
      setSeIncarca(false);
    });

    return () => {
      activ = false;
    };
  }, [term]);

  return (
    <main className="container">
      <div className={styles.breadcrumbs}>
        <Link href="/">Acasă</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>Căutare</span>
      </div>

      <header className={styles.categoryHeader}>
        <h1 className={styles.categoryTitle}>
          {term ? <>Rezultate pentru „{term}&rdquo;</> : 'Caută un produs'}
        </h1>
        {term && !seIncarca && (
          <p className={styles.categoryDescription}>
            {products.length === 0
              ? 'Niciun produs găsit.'
              : `Am găsit ${products.length} ${products.length === 1 ? 'produs' : 'produse'}.`}
          </p>
        )}
      </header>

      <div style={{ padding: '8px 0 64px' }}>
        {!term ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🔍</div>
            <p>Scrie ce cauți în câmpul de căutare din partea de sus.</p>
          </div>
        ) : seIncarca ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🔍</div>
            <p>Se caută…</p>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🔬</div>
            <p>Nu am găsit niciun produs pentru „{term}&rdquo;.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
              Încearcă un alt termen sau <Link href="/bestsellers" style={{ textDecoration: 'underline' }}>vezi cele mai vândute produse</Link>.
            </p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} className={pageStyles.productCard}>
                <div className={pageStyles.productImageWrapper}>
                  {product.is_bestseller && <div className={pageStyles.productBadge}>Bestseller</div>}
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
