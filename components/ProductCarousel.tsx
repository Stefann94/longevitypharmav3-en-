"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './ProductCarousel.module.css';
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

interface ProductCarouselProps {
  title: React.ReactNode;
  products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const { favoriteItems, toggleFavorite } = useFavorites();

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      // Două carduri pe telefon, la fel ca grilele de produse.
      if (window.innerWidth < 900) setItemsPerView(2);
      else if (window.innerWidth < 1200) setItemsPerView(3);
      else setItemsPerView(4);
    };
    
    handleResize(); // set initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!products || products.length === 0) return null;

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll effect (pauses on hover)
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex, isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      prevSlide();
    }
  };

  return (
    <section className={styles.carouselSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.navArrows}>
            <button className={styles.arrowBtn} onClick={prevSlide} aria-label="Înapoi">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button className={styles.arrowBtn} onClick={nextSlide} aria-label="Înainte">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        <div 
          className={styles.carouselContainer}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className={styles.carouselTrack}
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {products.map((product) => {
              const isFav = favoriteItems.some(f => f.product_slug === product.slug);
              return (
              <div 
                key={product.id} 
                className={styles.carouselSlide} 
                style={{ flex: `0 0 ${100 / itemsPerView}%` }}
              >
                <div className={styles.productCard}>
                  <div className={styles.productImageWrapper}>
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
              </div>
              );
            })}
          </div>
        </div>

        {/* INDICATOR DOTS */}
        <div className={styles.dotsContainer}>
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Mergi la pagina ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
