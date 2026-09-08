import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteUrl } from '@/lib/site';
import { createStaticClient } from '@/lib/supabase/static';
import styles from './ProductPage.module.css';
import ProductCarousel from '../../../components/ProductCarousel';
import ProductImageZoom from '@/components/ProductImageZoom';
import FAQAccordion from './FAQAccordion';
import AddToCartButton from '@/components/AddToCartButton';
import FavoriteButton from '@/components/FavoriteButton';

// Lista de produse se citeste o singura data, la build, si genereaza cate o
// pagina HTML pentru fiecare. Fara asta, Next.js ar trebui sa randeze pagina
// la fiecare cerere, pe un server Node - ceea ce gazduirea Hostico Start nu are.
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from('products').select('slug');
  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
}

// Un slug care nu exista la momentul build-ului returneaza 404, in loc sa fie
// randat la cerere. Obligatoriu pentru export static.
export const dynamicParams = false;


// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const supabase = createStaticClient();
  const { data: product } = await supabase.from('products').select('*').eq('slug', decodedSlug).single();

  if (!product) {
    return { title: 'Produs Neregasit | Longevity Pharma' };
  }

  return {
    title: `${product.name} | Longevity Pharma`,
    description: product.description || `Comandă ${product.name} la doar ${product.price} RON. Livrare rapidă.`,
    // URL-ul canonic: spune motoarelor de căutare care este adresa "oficială" a paginii.
    // Fără el, o vizită venită din reclamă (/produs/x?utm_source=google) ar putea fi
    // indexată ca pagină separată, ceea ce înseamnă conținut duplicat.
    alternates: {
      canonical: `/produs/${encodeURIComponent(decodedSlug)}`,
    },
    openGraph: {
      title: `${product.name} | Longevity Pharma`,
      description: product.description,
      images: [product.image_url],
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const supabase = createStaticClient();
  const { data: product } = await supabase.from('products').select('*').eq('slug', decodedSlug).single();

  if (!product) {
    notFound();
  }

  // Categoria produsului, pentru firul Ariadnei (breadcrumb) și datele structurate.
  // Dacă lipsește, firul rămâne Acasă / Produs, fără link mort.
  const { data: category } = product.category_slug
    ? await supabase.from('categories').select('name, slug').eq('slug', product.category_slug).single()
    : { data: null };

  // Fetch similar products for the carousel based on category_slug
  let similarProductsQuery = supabase.from('products').select('*').neq('slug', product.slug);
  
  if (product.category_slug) {
    similarProductsQuery = similarProductsQuery.eq('category_slug', product.category_slug);
  }
  
  // Fetch more items than needed to shuffle them in JavaScript
  const { data: rawSimilarProducts } = await similarProductsQuery.limit(20);
  
  // Amestecăm (shuffle) produsele pentru a fi random la fiecare încărcare
  const shuffledProducts = rawSimilarProducts ? [...rawSimilarProducts].sort(() => 0.5 - Math.random()) : [];
  const similarProducts = shuffledProducts.slice(0, 8);

  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/produs/${encodeURIComponent(decodedSlug)}`;

  // Generate Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image_url,
    "description": product.description || `Descoperă beneficiile ${product.name}.`,
    "url": productUrl,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Longevity Pharma"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "RON",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      // Disponibilitatea reală, nu "InStock" fix: datele structurate false
      // sunt penalizate de Google.
      "availability": product.in_stock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock"
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews_count || 1
    } : undefined
  };

  // Firul Ariadnei, în format înțeles de Google: poate afișa
  // "Acasă › Categorie › Produs" direct în rezultatele căutării.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Acasă", "item": siteUrl },
      ...(category
        ? [{
            "@type": "ListItem",
            "position": 2,
            "name": category.name,
            "item": `${siteUrl}/categorie/${encodeURIComponent(category.slug)}`,
          }]
        : []),
      {
        "@type": "ListItem",
        "position": category ? 3 : 2,
        "name": product.name,
        "item": productUrl,
      },
    ],
  };

  const tags = product.tags || [];

  // Secțiunea de recenzii se randează condiționat mai jos; folosim aceeași
  // verificare ca să decidem dacă numărul de recenzii devine link către ea.
  const hasReviews = Boolean(product.rich_content?.reviews?.length);

  return (
    <main className={styles.productPage}>
      {/* Inject JSON-LD Script for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="container">
        {/* BREADCRUMB */}
        <div className={styles.breadcrumb}>
          <Link href="/">Acasă</Link>
          {category ? (
            <>
              {' / '}
              <Link href={`/categorie/${encodeURIComponent(category.slug)}`}>{category.name}</Link>
            </>
          ) : null}
          {' / '}
          <span>{product.name}</span>
        </div>

        {/* MAIN SECTION (2 COLUMNS) */}
        <section className={styles.mainSection}>
          {/* LEFT: IMAGE */}
          <div className={styles.imageColumn}>
            {product.tags && product.tags.length > 0 && (
              <div className={styles.tagsContainer}>
                {[...product.tags].sort((a: string, b: string) => b.length - a.length).map((tag: string, idx: number) => (
                  <span key={idx} className={`${styles.tag} ${tag.includes('%') || tag.toLowerCase().includes('reducere') ? styles.tagDiscount : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <ProductImageZoom 
              src={product.image_url || '/placeholder.png'} 
              alt={product.name} 
            />
          </div>

          {/* RIGHT: DETAILS */}
          <div className={styles.detailsColumn}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            
            <div className={styles.ratingContainer}>
              <div className={styles.stars}>
                {/* 5 Stars */}
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < Math.round(product.rating || 5) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              {/* Devine link doar dacă există efectiv o secțiune de recenzii mai jos,
                  ca să nu ducem utilizatorul spre o ancoră inexistentă. */}
              {hasReviews ? (
                <a href="#recenzii" className={`${styles.reviewsCount} ${styles.reviewsLink}`}>
                  {product.rating || "5.0"} ({product.reviews_count || "0"} review-uri)
                </a>
              ) : (
                <span className={styles.reviewsCount}>
                  {product.rating || "5.0"} ({product.reviews_count || "0"} review-uri)
                </span>
              )}
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.price}>{product.price}</span>
              <span className={styles.currency}> Lei</span>
            </div>

            {/* INSTALLMENT BOX */}
            <div className={styles.installmentBox}>
              <div className={styles.installmentText}>
                <span className={styles.installmentTitle}>Plătește în 4 rate egale</span>
                <span className={styles.installmentSub}>de la {(product.price / 4).toFixed(2)} Lei / lună</span>
              </div>
              <span className={styles.installmentBadge}>0% Dobândă</span>
            </div>

            {/* BUTTONS */}
            <div className={styles.actionsBlock}>
              <AddToCartButton productSlug={product.slug} price={product.price} />
              <FavoriteButton productSlug={product.slug} className={styles.btnFav} />
            </div>

            {/* INFO & LOGISTICS */}
            <div className={styles.infoNotice}>
              <svg className={styles.infoIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Ofertă exclusivă online. Prețurile din farmaciile fizice pot fi diferite.</span>
            </div>

            <div className={styles.logisticsBlock}>
              <div className={styles.logisticRow}>
                <svg className={styles.logisticIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <span>{product.in_stock !== false ? 'Disponibil în stoc cu livrare rapidă' : 'Stoc epuizat temporar'}</span>
              </div>
              <div className={styles.logisticRow}>
                <svg className={styles.logisticIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                <span>Fără costuri de transport la ridicarea din farmacie</span>
              </div>
            </div>

          </div>
        </section>

        {/* FULL WIDTH STORY/DESCRIPTION */}
        <section className={styles.fullDescriptionSection}>
          {product.rich_content ? (
            <div className={styles.richContentWrapper}>
              
              {/* 1. Descriere Extinsă */}
              {product.rich_content.intro_description && (
                <div className={styles.richBlock}>
                  <h3 className={styles.richTitle}>Despre Produs</h3>
                  <div 
                    className={styles.richText}
                    dangerouslySetInnerHTML={{ __html: product.rich_content.intro_description }}
                  />
                </div>
              )}

              {/* 2. Tabel Nutrițional / Ingrediente */}
              {product.rich_content.ingredients_table && product.rich_content.ingredients_table.length > 0 && (
                <div className={styles.richBlock}>
                  <h3 className={styles.richTitle}>Ingrediente & Compoziție</h3>
                  <div className={styles.tableWrapper}>
                    <table className={styles.ingredientsTable}>
                      <thead>
                        <tr>
                          <th>Ingredient Activ</th>
                          <th>Cantitate / Doză</th>
                          <th>VNR %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.rich_content.ingredients_table.map((row: any, idx: number) => (
                          <tr key={idx}>
                            <td>{row.name}</td>
                            <td>{row.quantity}</td>
                            <td>{row.vnr || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. Imagine Secundară Contextuală */}
              {product.rich_content.content_image && (
                <div className={styles.richImageWrapper}>
                  <Image 
                    src={product.rich_content.content_image} 
                    alt="Prezentare produs"
                    fill
                    className={styles.richImage}
                  />
                </div>
              )}

              {/* 4. Banner Comercial */}
              {product.rich_content.banner_text && (
                <div className={styles.richBanner}>
                  <h4 className={styles.bannerText}>{product.rich_content.banner_text}</h4>
                </div>
              )}

              {/* 5. De ce recomandăm? */}
              {product.rich_content.why_recommend && product.rich_content.why_recommend.length > 0 && (
                <div className={styles.richBlockCentered}>
                  <h3 className={styles.richTitle}>De ce recomandăm acest produs?</h3>
                  <ul className={styles.recommendList}>
                    {product.rich_content.why_recommend.map((reason: string, idx: number) => (
                      <li key={idx} className={styles.recommendItem}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 6. FAQ (Întrebări frecvente) */}
              {product.rich_content.faq && product.rich_content.faq.length > 0 && (
                <div className={styles.richBlock}>
                  <h3 className={styles.richTitle}>Întrebări Frecvente</h3>
                  <div className={styles.faqContainer}>
                    <FAQAccordion faqs={product.rich_content.faq} />
                  </div>
                </div>
              )}

              {/* 7. Recenzii Clienți (Infinite Marquee) */}
              {product.rich_content.reviews && product.rich_content.reviews.length > 0 && (
                <div className={`${styles.richBlock} ${styles.reviewsAnchor}`} id="recenzii">
                  <h3 className={styles.richTitle}>Părerile Clienților</h3>
                  <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrack}>
                      {/* Generăm 6 seturi identice (grupuri) pentru a ne asigura că acoperim lățimea oricărui ecran, 
                          chiar dacă produsul are doar 1 sau 2 recenzii în baza de date. 
                          Deoarece fiecare grup se mișcă la stânga exact cu lățimea sa, bucla va fi perfect infinită. */}
                      {[...Array(6)].map((_, groupIndex) => (
                        <div key={`group-${groupIndex}`} className={styles.marqueeGroup} aria-hidden={groupIndex > 0 ? "true" : "false"}>
                          {product.rich_content.reviews.map((rev: any, idx: number) => (
                            <div key={`rev-${groupIndex}-${idx}`} className={styles.reviewCard}>
                              <div className={styles.reviewHeader}>
                                <div className={styles.reviewStars}>
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < (rev.rating || 5) ? "#FFC107" : "#E0E0E0"} stroke="none">
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                  ))}
                                </div>
                                <span className={styles.reviewDate}>{rev.date}</span>
                              </div>
                              <div className={styles.reviewAuthorBlock}>
                                <span className={styles.reviewAuthor}>{rev.author}</span>
                                <span className={styles.verifiedBadge}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                  Cumpărător Verificat
                                </span>
                              </div>
                              <p className={styles.reviewText}>"{rev.comment}"</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* FALLBACK Dacă nu există rich_content */
            <div className={styles.descriptionBlock}>
              <h3 className={styles.descriptionTitle}>Informații Produs</h3>
              <p className={styles.descriptionText}>
                {product.description || "Informațiile detaliate despre acest produs urmează a fi actualizate în curând. Formulele Longevity Pharma sunt dezvoltate pentru eficiență și puritate maximă."}
              </p>
            </div>
          )}
        </section>

        {/* SIMILAR PRODUCTS */}
        <ProductCarousel 
          title={<>Produse <span>Similare</span></>}
          products={similarProducts || []}
        />
      </div>
    </main>
  );
}
