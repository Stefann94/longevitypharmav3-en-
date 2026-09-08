'use client';

import React, { useEffect, useState } from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import RemoveFavoriteButton from './RemoveFavoriteButton';
import { useUtilizatorCurent } from '../useUtilizatorCurent';

export default function FavoritesClient() {
  const { user } = useUtilizatorCurent();
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    let activ = true;

    (async () => {
      const { data: favorites } = await supabase
        .from('favorites')
        .select('product_slug, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      let rezultat: any[] = [];

      if (favorites && favorites.length > 0) {
        const slugs = favorites.map(f => f.product_slug);
        const { data: products } = await supabase
          .from('products')
          .select('slug, name, image_url, price')
          .in('slug', slugs);

        if (products) {
          // Pastram ordinea din favorite, nu pe cea returnata de products
          const productMap = new Map(products.map(p => [p.slug, p]));
          rezultat = favorites
            .map(f => ({ ...f, ...productMap.get(f.product_slug) }))
            .filter(p => p.name); // scoatem produsele intre timp sterse
        }
      }

      if (activ) setFavoriteProducts(rezultat);
    })();

    return () => {
      activ = false;
    };
  }, [user]);

  if (!user) return null;

  const hasFavorites = favoriteProducts.length > 0;
  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>Produse <strong>favorite</strong></h2>
      
      {!hasFavorites ? (
        <div className={styles.premiumCard} style={{ textAlign: 'center', padding: '60px 20px', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#f4f8f1', border: '1px solid #d6e4d9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: 'var(--color-primary)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <div className={styles.cardHeader}>Nu ai adăugat niciun produs la favorite.</div>
          <p className={styles.cardContent} style={{ maxWidth: '400px', margin: '0 auto 25px auto' }}>
            Aici vei găsi produsele pe care le-ai marcat cu inimă pentru a le recumpăra ușor mai târziu.
          </p>
          <Link href="/" className={styles.actionLink}>
            Începe cumpărăturile
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {favoriteProducts.map((product) => (
            <div key={product.product_slug} className={styles.premiumCard} style={{ display: 'flex', flexDirection: 'column', padding: '20px', border: '2px solid var(--color-primary)' }}>
              <Link href={`/produs/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', height: '150px', marginBottom: '15px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={product.image_url || '/placeholder.png'} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
              </Link>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{product.price} Lei</span>
                <RemoveFavoriteButton productSlug={product.product_slug} productName={product.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
