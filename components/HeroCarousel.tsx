"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroCarousel.module.css';

export type Slide = {
  id: string | number;
  image: string;
  label: string;
  title: string;
  description: string;
};

interface HeroCarouselProps {
  slides: Slide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Ref for actions container to match width for indicators
  const actionsRef = useRef<HTMLDivElement>(null);
  const [actionsWidth, setActionsWidth] = useState(420); // Fallback

  useEffect(() => {
    if (!actionsRef.current) return;

    // Use ResizeObserver for perfect tracking even after web fonts load
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setActionsWidth(entry.contentRect.width);
      }
    });

    observer.observe(actionsRef.current);
    return () => observer.disconnect();
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide, slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const slide = slides[currentSlide] || slides[0];

  if (!slide) return null;

  return (
    <section
      className={styles.heroWrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows (Positioned relative to the full viewport width) */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevSlide} aria-label="Slide anterior">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={nextSlide} aria-label="Următorul slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

      <div className={styles.hero}>
        <div className={styles.heroContainer}>
        {/* Text Content */}
        <div className={styles.textBlock}>
          <div className={styles.textBlockInner}>
            <span className={styles.label} key={slide.id + '-l'}>{slide.label}</span>

            <h1 className={styles.title} key={slide.id + '-t'}>
              {slide.title}
            </h1>

            <p className={styles.description} key={slide.id + '-d'}>
              {slide.description}
            </p>

            <div className={styles.actions} ref={actionsRef}>
              <Link href="/bestsellers" className={styles.ctaPrimary}>
                Descoperă Produsele
              </Link>
              <Link href="/calitate" className={styles.ctaOutline}>Calitate & Ingrediente</Link>
            </div>
          </div>

          {/* Slide indicators perfectly centered matching actions width, pushed to bottom naturally */}
          <div className={styles.indicatorsWrapper} style={{ width: `${actionsWidth}px` }}>
            <div className={styles.indicators}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className={styles.imageBlock}>
          <div className={styles.imageContainer}>
            <div className={styles.imageInner}>
              {slides.map((s, index) => (
                <div
                  key={s.id}
                  className={`${styles.imageWrapper} ${index === currentSlide ? styles.imageActive : ''}`}
                >
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className={styles.image}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Trust badges floating over the image */}
            <div className={styles.floatingBadges}>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Formule curate
              </div>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Fără alergeni
              </div>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Validat științific
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
