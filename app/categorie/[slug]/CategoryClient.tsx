'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Category.module.css';
import pageStyles from '../../page.module.css';
import AddToCartButton from '../../../components/AddToCartButton';
import FavoriteButton from '../../../components/FavoriteButton';

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  price: number;
  is_bestseller?: boolean;
  brand?: string;
  created_at?: string;
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
}

interface CategoryClientProps {
  category: Category;
  products: Product[];
  allCategories: Category[];
}

type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'newest';

export default function CategoryClient({ category, products, allCategories }: CategoryClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter states
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');

  // Panoul de filtre este `position: fixed` peste pagină; fără asta, derularea
  // cu degetul peste el mișca lista de produse din spate. Se aplică doar când
  // panoul e deschis, deci pe desktop (unde nu se deschide) nu are efect.
  useEffect(() => {
    if (!sidebarOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [sidebarOpen]);

  // Filter and Sort products client-side
  const sortedProducts = useMemo(() => {
    if (!products) return [];
    
    // 1. Filter
    const filtered = products.filter(p => {
      // Tags filter
      if (selectedTags.length > 0) {
        const hasBestseller = selectedTags.includes('Bestseller') && p.is_bestseller;
        const hasProdusNou = selectedTags.includes('Produs Nou') && p.tags?.includes('Produs Nou');
        const hasTransportGratuit = selectedTags.includes('Transport Gratuit') && p.tags?.includes('Transport Gratuit');
        
        // Match ANY selected tag
        if (!hasBestseller && !hasProdusNou && !hasTransportGratuit) return false;
      }

      // Brands filter
      if (selectedBrands.length > 0) {
        if (!p.brand || !selectedBrands.includes(p.brand)) return false;
      }

      // Price filter
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

      return true;
    });

    // 2. Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
      case 'popular':
      default:
        // Bestsellers first, then by price desc
        sorted.sort((a, b) => {
          if (a.is_bestseller && !b.is_bestseller) return -1;
          if (!a.is_bestseller && b.is_bestseller) return 1;
          return b.price - a.price;
        });
        break;
    }
    return sorted;
  }, [products, sortBy, selectedTags, selectedBrands, priceRange]);

  // Dynamic Tags calculation
  const tagsCount = useMemo(() => {
    let newCount = 0;
    let freeShippingCount = 0;

    products?.forEach(p => {
      // Consider a product "Nou" if it has the tag 'Produs Nou'
      if (p.tags && Array.isArray(p.tags) && p.tags.includes('Produs Nou')) {
        newCount++;
      }
      // Consider it has free shipping if it has the tag 'Transport Gratuit'
      if (p.tags && Array.isArray(p.tags) && p.tags.includes('Transport Gratuit')) {
        freeShippingCount++;
      }
    });

    return {
      new: newCount,
      freeShipping: freeShippingCount
    };
  }, [products]);

  // Dynamic Brands calculation
  const dynamicBrands = useMemo(() => {
    const brandMap = new Map<string, number>();
    products?.forEach(p => {
      if (p.brand) {
        brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1);
      }
    });

    return Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [products]);

  return (
    <main>
      <div className="container">
        {/* BREADCRUMBS */}
        <nav className={styles.breadcrumbs}>
          <Link href="/">Acasă</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link href="/">Categorii</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{category.name}</span>
        </nav>

        {/* CATEGORY HEADER */}
        <header className={styles.categoryHeader}>
          <h1 className={styles.categoryTitle}>{category.name}</h1>
          <p className={styles.categoryDescription}>
            {getCategoryDescription(category.slug)}
          </p>
        </header>

        {/* MOBILE FILTER BUTTON */}
        <div style={{ paddingTop: '20px' }}>
          <button
            className={styles.mobileFilterBtn}
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="14" y2="12" />
              <line x1="4" y1="18" x2="10" y2="18" />
            </svg>
            Filtre
          </button>
        </div>

        {/* MAIN 2-COLUMN LAYOUT */}
        <div className={styles.mainLayout}>
          {/* SIDEBAR OVERLAY (mobile) */}
          <div
            className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.sidebarOverlayOpen : ''}`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* SIDEBAR */}
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
            {/* Close button (mobile only) */}
            <button className={styles.sidebarCloseBtn} onClick={() => setSidebarOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>



            {/* ETICHETE */}
            <div className={styles.filterSection}>
              <div className={styles.filterTitle}>
                Etichete
                <span className={styles.filterToggle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
              </div>
              <div className={styles.filterList}>
                <label className={styles.filterItem}>
                  <input type="checkbox" style={{ display: 'none' }} checked={selectedTags.includes('Bestseller')} onChange={(e) => {
                    if (e.target.checked) setSelectedTags([...selectedTags, 'Bestseller']);
                    else setSelectedTags(selectedTags.filter(t => t !== 'Bestseller'));
                  }} />
                  <span className={`${styles.customCheckbox} ${selectedTags.includes('Bestseller') ? styles.customCheckboxChecked : ''}`} />
                  Bestseller
                  <span className={styles.filterItemCount}>({products?.filter(p => p.is_bestseller).length || 0})</span>
                </label>
                <label className={styles.filterItem}>
                  <input type="checkbox" style={{ display: 'none' }} checked={selectedTags.includes('Produs Nou')} onChange={(e) => {
                    if (e.target.checked) setSelectedTags([...selectedTags, 'Produs Nou']);
                    else setSelectedTags(selectedTags.filter(t => t !== 'Produs Nou'));
                  }} />
                  <span className={`${styles.customCheckbox} ${selectedTags.includes('Produs Nou') ? styles.customCheckboxChecked : ''}`} />
                  Produs Nou
                  <span className={styles.filterItemCount}>({tagsCount.new})</span>
                </label>
                <label className={styles.filterItem}>
                  <input type="checkbox" style={{ display: 'none' }} checked={selectedTags.includes('Transport Gratuit')} onChange={(e) => {
                    if (e.target.checked) setSelectedTags([...selectedTags, 'Transport Gratuit']);
                    else setSelectedTags(selectedTags.filter(t => t !== 'Transport Gratuit'));
                  }} />
                  <span className={`${styles.customCheckbox} ${selectedTags.includes('Transport Gratuit') ? styles.customCheckboxChecked : ''}`} />
                  Transport Gratuit
                  <span className={styles.filterItemCount}>({tagsCount.freeShipping})</span>
                </label>
              </div>
            </div>

            {/* BRAND */}
            <div className={styles.filterSection}>
              <div className={styles.filterTitle}>
                Brand
                <span className={styles.filterToggle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
              </div>
              <div className={styles.brandSearchWrapper}>
                <span className={styles.brandSearchIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Caută brand..."
                  className={styles.brandSearchInput}
                  value={brandSearchTerm}
                  onChange={(e) => setBrandSearchTerm(e.target.value)}
                />
              </div>
              <div className={styles.brandList}>
                {dynamicBrands
                  .filter(b => b.name.toLowerCase().includes(brandSearchTerm.toLowerCase()))
                  .map((brandObj) => (
                  <label key={brandObj.name} className={styles.filterItem}>
                    <input type="checkbox" style={{ display: 'none' }} checked={selectedBrands.includes(brandObj.name)} onChange={(e) => {
                      if (e.target.checked) setSelectedBrands([...selectedBrands, brandObj.name]);
                      else setSelectedBrands(selectedBrands.filter(b => b !== brandObj.name));
                    }} />
                    <span className={`${styles.customCheckbox} ${selectedBrands.includes(brandObj.name) ? styles.customCheckboxChecked : ''}`} />
                    {brandObj.name}
                    <span className={styles.filterItemCount}>({brandObj.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PREȚ */}
            <div className={styles.filterSection}>
              <div className={styles.filterTitle}>
                Preț
                <span className={styles.filterToggle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
              </div>
              <div className={styles.priceRangeWrapper}>
                <div className={styles.priceInputRow}>
                  <input type="text" className={styles.priceInput} value={priceRange[0]} onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setPriceRange([val, priceRange[1]]);
                  }} />
                  <span className={styles.priceSeparator}>—</span>
                  <input type="text" className={styles.priceInput} value={priceRange[1]} onChange={(e) => {
                    const val = parseInt(e.target.value) || 500;
                    setPriceRange([priceRange[0], val]);
                  }} />
                </div>
                <input type="range" className={styles.priceSlider} min="0" max="500" value={priceRange[1]} onChange={(e) => {
                  setPriceRange([priceRange[0], parseInt(e.target.value)]);
                }} />
              </div>
            </div>

            {/* ALTE CATEGORII */}
            <div className={styles.filterSection}>
              <div className={styles.filterTitle}>
                Categorii
              </div>
              <div className={styles.brandList}>
                {allCategories.map((cat) => {
                  const isActive = cat.slug === category.slug;
                  return (
                    <Link
                      key={cat.id}
                      href={`/categorie/${cat.slug}`}
                      className={styles.filterItem}
                      style={{ textDecoration: 'none' }}
                    >
                      <span className={`${styles.customCheckbox} ${isActive ? styles.customCheckboxChecked : ''}`} />
                      <span className={isActive ? styles.sidebarCategoryActive : ''}>{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* PRODUCTS AREA */}
          <div className={styles.productsArea}>
            {/* TOOLBAR */}
            <div className={styles.toolbar}>
              <div className={styles.productCount}>
                Afișăm <strong>{sortedProducts.length}</strong> produse
              </div>
              <div className={styles.sortOptions}>
                <span className={styles.sortLabel}>Sortează:</span>
                <button
                  className={`${styles.sortBtn} ${sortBy === 'popular' ? styles.sortBtnActive : ''}`}
                  onClick={() => setSortBy('popular')}
                >
                  Populare
                </button>
                <button
                  className={`${styles.sortBtn} ${sortBy === 'price_asc' ? styles.sortBtnActive : ''}`}
                  onClick={() => setSortBy('price_asc')}
                >
                  Preț ↑
                </button>
                <button
                  className={`${styles.sortBtn} ${sortBy === 'price_desc' ? styles.sortBtnActive : ''}`}
                  onClick={() => setSortBy('price_desc')}
                >
                  Preț ↓
                </button>
                <button
                  className={`${styles.sortBtn} ${sortBy === 'newest' ? styles.sortBtnActive : ''}`}
                  onClick={() => setSortBy('newest')}
                >
                  Noi
                </button>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {sortedProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🔬</div>
                <p>Momentan nu avem produse disponibile în această categorie.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Te rugăm să revii în curând!</p>
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {sortedProducts.map((product) => (
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
        </div>
      </div>
    </main>
  );
}

/* Category descriptions dictionary */
function getCategoryDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    'longevitate': 'Explorează gama noastră de suplimente premium pentru longevitate și anti-aging. Formule avansate bazate pe cercetări științifice recente, create pentru regenerare celulară și vitalitate de durată.',
    'focus': 'Suplimente premium pentru performanță mentală superioară. Nootropice și extracte standardizate care susțin concentrarea, claritatea mentală și energia cognitivă fără crash.',
    'somn': 'Descoperă secretul unui somn restaurativ. Formule naturale care promovează adormirea rapidă, somnul adânc și reducerea stresului pentru o recuperare completă.',
    'pachete': 'Protocoale complete și pachete sinergice create de specialiști. Combină mai multe suplimente într-un singur program optimizat pentru rezultate maxime.',
    'esentiale': 'Nutrienții fundamentali pe care corpul tău îi necesită zilnic. Vitamine, minerale și cofactori esențiali în formele cele mai biodisponibile.',
    'imunitate': 'Întărește bariera ta naturală de protecție. Antioxidanți puternici, vitamine și extracte botanice care susțin un sistem imunitar robust.',
    'energie': 'Energie curată și susținută pe tot parcursul zilei. Fără crash, fără stimulente agresive — doar nutrienți care susțin producția naturală de energie celulară.',
  };
  return descriptions[slug] || 'Explorează colecția noastră de suplimente premium, selectate cu grijă pentru un stil de viață sănătos și echilibrat.';
}
