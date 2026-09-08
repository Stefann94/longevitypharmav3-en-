import React from 'react'
import { createStaticClient } from '@/lib/supabase/static'
import CartClient from './CartClient'
import ProductCarousel from '@/components/ProductCarousel'
import styles from './Cart.module.css'

export const metadata = {
  title: 'Coșul meu | Longevity Pharma',
  description: 'Coșul tău de cumpărături Longevity Pharma',
}

/**
 * Pagina cere doar produsele recomandate, care sunt aceleași pentru oricine,
 * deci se citesc o singură dată, la build.
 *
 * Sesiunea era citită aici, dar nu era folosită nicăieri: coșul funcționează
 * și pentru vizitatori, iar conținutul lui este gestionat integral de
 * CartClient, în browser. Apelul a fost scos - era singurul lucru care forța
 * randarea la cerere.
 */
export default async function CartPage() {
  const supabase = createStaticClient()

  const { data: recommendedProducts } = await supabase
    .from('products')
    .select('id, name, slug, image_url, price')
    .limit(8)

  return (
    <div>
      <CartClient />
      
      {recommendedProducts && recommendedProducts.length > 0 && (
        <div className={styles.cartWrapper} style={{ paddingTop: 0 }}>
          <div className={styles.recommendedSection}>
            <ProductCarousel 
              title={<span className={styles.recommendedTitle}>Produse alese pentru tine</span>} 
              products={recommendedProducts} 
            />
          </div>
        </div>
      )}
    </div>
  )
}
