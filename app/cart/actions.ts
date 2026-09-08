
import { createClient } from '@/lib/supabase/client'

/**
 * Operatiuni pe datele utilizatorului, mutate din server in browser.
 *
 * Fisierul era marcat cu directiva de actiuni de server, care nu exista in
 * export static: nu ramane niciun server Node care sa le execute. Fiind doar
 * apeluri Supabase, ruleaza la fel de bine direct din browser - politicile RLS
 * filtreaza dupa auth.uid(), deci fiecare client vede si modifica strict
 * randurile lui.
 *
 * Semnaturile si valorile returnate sunt neschimbate, deci componentele care
 * apeleaza aceste functii nu au avut nevoie de nicio modificare.
 */

// Tipul returnat de fetchCart. `notAuthenticated` era deja citit în CartContext,
// dar nu apărea în tipul inferat — de aici eroarea de compilare.
type FetchCartResult = {
  items: any[]
  error?: string
  notAuthenticated?: boolean
}

export async function fetchCart(): Promise<FetchCartResult> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { items: [], error: 'Not authenticated' }

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch Cart Error:', error)
    return { items: [] }
  }

  if (!cartItems || cartItems.length === 0) {
    return { items: [] }
  }

  // Fetch product details
  const slugs = cartItems.map(item => item.product_slug)
  const { data: products } = await supabase
    .from('products')
    .select('slug, name, image_url')
    .in('slug', slugs)

  const productsMap = new Map(products?.map(p => [p.slug, p]))

  const enrichedItems = cartItems.map(item => {
    const product = productsMap.get(item.product_slug)
    return {
      ...item,
      name: product?.name || 'Produs',
      image_url: product?.image_url || '/placeholder.png'
    }
  })

  return { items: enrichedItems }
}

export async function addToCartDB(productSlug: string, price: number, quantity: number = 1) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Trebuie să fii autentificat pentru a adăuga în coș.', notAuthenticated: true }

  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_slug', productSlug)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('cart_items')
      .update({
        quantity: existing.quantity + quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_slug: productSlug,
        quantity: quantity,
        price: price,
        updated_at: new Date().toISOString()
      })
      
    if (error) return { error: error.message }
  }

  // Fără revalidatePath: coșul este ținut în context, pe client, și nicio
  // pagină randată pe server nu citește `cart_items`. Revalidarea rutei
  // curente era muncă în plus care, pe pagina de produs, demonta caruselul de
  // recomandate în timpul re-randării — iar odată cu el dispărea și fereastra
  // de confirmare tocmai deschisă. Același raționament ca la favorite.
  return { success: true }
}

export async function removeCartItemDB(productSlug: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated', notAuthenticated: true }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
    .eq('product_slug', productSlug)

  if (error) return { error: error.message }
  return { success: true }
}

export async function updateCartItemQuantityDB(productSlug: string, quantity: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated', notAuthenticated: true }

  if (quantity <= 0) {
    return removeCartItemDB(productSlug)
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('product_slug', productSlug)

  if (error) return { error: error.message }
  return { success: true }
}

export async function fetchProductsDetailsBySlugs(slugs: string[]) {
  if (!slugs || slugs.length === 0) return [];
  
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('slug, name, image_url, price')
    .in('slug', slugs)

  return products || [];
}
