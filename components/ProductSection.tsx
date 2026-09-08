"use client";

import Image from "next/image";
import styles from "../app/page.module.css";
import AddToCartButton from './AddToCartButton';
import FavoriteButton from './FavoriteButton';
import { useFavorites } from '@/app/context/FavoritesContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  price: number;
}

interface ProductSectionProps {
  title: React.ReactNode;
  products: Product[];
  viewAllLink?: string;
  badgeText?: string;
}

export default function ProductSection({ title, products, viewAllLink, badgeText }: ProductSectionProps) {
  const { favoriteItems, toggleFavorite } = useFavorites();

  if (!products || products.length === 0) return null;

  return (
    <section className={styles.productsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {viewAllLink && (
            <a href={viewAllLink} className={styles.viewAllLink}>
              Vezi toate <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          )}
        </div>

        <div className={styles.productsGrid}>
          {products.map((product) => {
            const isFav = favoriteItems.some(f => f.product_slug === product.slug);
            return (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImageWrapper}>
                {badgeText && <div className={styles.productBadge}>{badgeText}</div>}
                <FavoriteButton 
                  className={styles.favoriteBtn} 
                  productSlug={product.slug} 
                />
                <a href={`/produs/${product.slug}`} style={{ display: 'block' }}>
                  <Image 
                    src={product.image_url || '/placeholder.png'} 
                    alt={product.name}
                    fill
                    className={styles.productImage}
                  />
                </a>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>
                  <a href={`/produs/${product.slug}`}>{product.name}</a>
                </h3>
                <div className={styles.productFooter}>
                  <div className={styles.productPrice}>{product.price} <span className={styles.currency}>RON</span></div>
                  <AddToCartButton 
                    productSlug={product.slug}
                    price={product.price}
                    variant="icon"
                  />
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
