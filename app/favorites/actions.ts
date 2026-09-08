
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

export async function fetchFavorites() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { items: [] }

  const { data: favItems, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch Favorites Error:', error)
    return { items: [] }
  }

  if (!favItems || favItems.length === 0) {
    return { items: [] }
  }

  // Fetch product details
  const slugs = favItems.map(item => item.product_slug)
  const { data: products } = await supabase
    .from('products')
    .select('slug, name, image_url, price')
    .in('slug', slugs)

  const productsMap = new Map(products?.map(p => [p.slug, p]))

  const enrichedItems = favItems.map(item => {
    const product = productsMap.get(item.product_slug)
    return {
      ...item,
      name: product?.name || item.product_slug,
      image_url: product?.image_url || '/placeholder.png',
      price: product?.price || 0
    }
  })

  return { items: enrichedItems }
}

export async function toggleFavoriteDB(productSlug: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Indicatorul explicit evită verificarea după textul erorii — același
  // tipar folosit deja de acțiunile coșului.
  if (!user) return { error: 'Trebuie să fii autentificat pentru a adăuga la favorite.', notAuthenticated: true }

  // Check if item already exists
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_slug', productSlug)
    .single()

  if (existing) {
    // Remove it
    const { error: removeError } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existing.id)
      
    if (removeError) {
      return { error: `Eroare ștergere: ${removeError.message}` }
    }
    // Fără revalidatePath: starea favoritelor este ținută în context, pe client.
    // Nicio pagină randată pe server nu depinde de ea, iar pagina principală
    // este oricum dinamică — deci revalidarea era muncă pură în plus, care
    // forța o reîncărcare a rutei curente la fiecare click pe inimă.
    return { success: true, action: 'removed' }
  } else {
    // Add it
    const { error: insertError } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        product_slug: productSlug
      })
      
    if (insertError) {
      return { error: `Eroare adăugare: ${insertError.message}` }
    }
    // Fără revalidatePath: starea favoritelor este ținută în context, pe client.
    // Nicio pagină randată pe server nu depinde de ea, iar pagina principală
    // este oricum dinamică — deci revalidarea era muncă pură în plus, care
    // forța o reîncărcare a rutei curente la fiecare click pe inimă.
    return { success: true, action: 'added' }
  }
}
