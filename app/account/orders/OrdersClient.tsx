'use client';

import React, { useEffect, useState } from 'react';
import styles from '../Account.module.css';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useCurrentUser } from '../useCurrentUser';

export default function OrdersClient() {
  const { user } = useCurrentUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    let activ = true;

    (async () => {
      const [{ data: comenzi }, { data: allProducts }] = await Promise.all([
        supabase
          .from('orders')
          .select(`*, order_items(*)`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase.from('products').select('slug, image_url'),
      ]);

      if (!activ) return;
      setOrders(comenzi ?? []);
      setProductImages(Object.fromEntries(allProducts?.map(p => [p.slug, p.image_url]) || []));
    })();

    return () => {
      activ = false;
    };
  }, [user]);

  if (!user) return null;

  const hasOrders = orders.length > 0;
  return (
    <div>
      <h2 className={styles.heroTitle} style={{ marginBottom: '30px' }}>My <strong>orders</strong></h2>
      
      {!hasOrders ? (
        <div className={styles.premiumCard} style={{ textAlign: 'center', padding: '60px 20px', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#f4f8f1', border: '1px solid #d6e4d9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: 'var(--color-primary)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
          <div className={styles.cardHeader}>You have not placed any orders yet</div>
          <p className={styles.cardContent} style={{ maxWidth: '400px', margin: '0 auto 25px auto' }}>
            Once you place your first order with LongevityPharma, its history and tracking details will appear here.
          </p>
          <Link href="/" className={styles.actionLink}>
            Start shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => {
            // Data se scrie in engleza: „8 September 2026", nu „8 septembrie 2026".
            const date = new Date(order.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric'
            });
            const orderIdShort = order.id.split('-')[0].toUpperCase();

            // Dacă order_items e gol, afișăm un fallback. Aceasta se poate întâmpla dacă politica RLS le ascunde sau la o comandă parțială.
            const items = order.order_items || [];

            return (
              <div key={order.id} className={styles.premiumCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a2b22' }}>
                      Order #{orderIdShort}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                      Placed on {date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      // Valoarea vine din app/checkout/actions.ts. Cele doua
                      // trebuie sa ramana identice, altfel insigna ramane mereu
                      // pe varianta „livrata".
                      backgroundColor: order.status === 'Processing' ? '#fff3cd' : '#e6f4ea',
                      color: order.status === 'Processing' ? '#856404' : '#1e7e34'
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {items.length === 0 && (
                    <div style={{ fontSize: '0.9rem', color: '#888', fontStyle: 'italic' }}>The items in this order cannot be displayed right now.</div>
                  )}
                  {items.map((item: any) => {
                    const imageUrl = productImages[item.product_slug] || '/placeholder.png'; // Fallback la un placeholder

                    return (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          
                          {/* Poza produsului.
                              Învelișul exterior nu taie nimic: el este doar
                              reperul de poziționare pentru badge. Tăierea la
                              colțuri rotunjite se face în cadrul interior,
                              altfel `overflow: hidden` ar reteza badge-ul, care
                              iese intenționat în afara imaginii. */}
                          <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }}>
                            <div style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: '#f9f9f9',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: '1px solid #eee',
                              boxSizing: 'border-box'
                            }}>
                              <img src={imageUrl} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>

                            {/* Badge cu cantitatea */}
                            <div style={{
                              position: 'absolute',
                              top: '-7px',
                              right: '-7px',
                              backgroundColor: '#2e8b57',
                              color: 'white',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              lineHeight: 1,
                              minWidth: '22px',
                              height: '22px',
                              padding: '0 5px',
                              borderRadius: '999px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxSizing: 'border-box',
                              border: '2px solid #fff',
                              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.18)'
                            }}>
                              {item.quantity}
                            </div>
                          </div>

                          <Link href={`/product/${item.product_slug}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }} className={styles.itemLink}>
                            {item.product_name}
                          </Link>
                        </div>
                        <div style={{ fontWeight: 600, color: '#1a2b22' }}>
                          {(item.price_at_time * item.quantity).toFixed(2)} €
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Shipping: {order.shipping_cost === 0 ? 'Free' : `${order.shipping_cost} €`}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '2px' }}>Total paid</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a2b22' }}>
                      {order.total_amount.toFixed(2)} €
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
