'use client'

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { fetchCart, addToCartDB, removeCartItemDB, updateCartItemQuantityDB, fetchProductsDetailsBySlugs } from '@/app/cart/actions'

export type CartItem = {
  id: string
  product_slug: string
  quantity: number
  price: number
  name?: string
  image_url?: string
}

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  isLoading: boolean
  addToCart: (productSlug: string, price: number, quantity?: number) => Promise<{ error?: string; success?: boolean; notAuthenticated?: boolean }>
  removeFromCart: (productSlug: string) => Promise<{ error?: string; success?: boolean; notAuthenticated?: boolean }>
  updateQuantity: (productSlug: string, quantity: number) => Promise<{ error?: string; success?: boolean; notAuthenticated?: boolean }>
  refreshCart: () => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const GUEST_CART_KEY = 'farmashop_guest_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  const getLocalCart = (): CartItem[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(GUEST_CART_KEY)
      if (stored) return JSON.parse(stored)
    }
    return []
  }

  const saveLocalCart = (items: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
    }
  }

  // Fuziunea are voie să pornească o singură dată per montare a providerului.
  // Fără această poartă s-ar executa de două ori în development, unde React
  // rulează efectele dublu, iar `addToCartDB` adună cantitatea la cea existentă
  // — deci produsele chiar s-ar dubla.
  const mergeAttempted = useRef(false)

  /**
   * Mută coșul strâns înainte de autentificare din localStorage în contul
   * utilizatorului. Fără asta, produsele adăugate ca vizitator dispăreau din
   * ochii lui în momentul autentificării: rămâneau în localStorage, dar coșul
   * afișat era cel din baza de date.
   *
   * Refolosește `addToCartDB`, exact acțiunea pe care o folosește butonul de
   * adăugare în coș. Nu introduce niciun tipar nou de acces la baza de date,
   * deci nu poate da peste o politică lipsă.
   *
   * Întoarce `true` dacă cel puțin un produs a fost mutat.
   */
  const mergeGuestCart = async (): Promise<boolean> => {
    const localCart = getLocalCart()
    if (localCart.length === 0) return false

    // Produsele care nu au putut fi mutate rămân în localStorage; cele reușite
    // sunt scoase. Astfel o eventuală reluare nu le adaugă a doua oară, dar
    // nici nu pierdem ceva ce nu a ajuns în cont.
    const notMerged: CartItem[] = []

    for (const item of localCart) {
      const result = await addToCartDB(item.product_slug, item.price, item.quantity)
      if (!result.success) {
        console.warn('Produsul nu a putut fi mutat in cont:', item.product_slug, result.error)
        notMerged.push(item)
      }
    }

    saveLocalCart(notMerged)
    return notMerged.length < localCart.length
  }

  // `silent` sare peste starea de încărcare: o folosim după o modificare,
  // când coșul este deja actualizat optimist. Altfel, `isLoading` înlocuiește
  // tot conținutul paginii cu un schelet, ceea ce arată ca o reîncărcare.
  const refreshCart = async (options?: { silent?: boolean }) => {
    if (!options?.silent) setIsLoading(true)
    const result = await fetchCart()
    
    if (result.notAuthenticated || result.error === 'Not authenticated') {
      setIsGuest(true)
      const localCart = getLocalCart()
      
      // Fetch fresh details (name, image, price) for local cart items
      if (localCart.length > 0) {
        const slugs = localCart.map(item => item.product_slug)
        const productsDetails = await fetchProductsDetailsBySlugs(slugs)
        const productsMap = new Map(productsDetails.map((p: any) => [p.slug, p]))
        
        const enrichedLocalCart = localCart.map(item => {
          const product = productsMap.get(item.product_slug)
          return {
            ...item,
            name: product?.name || 'Produs',
            image_url: product?.image_url || '/placeholder.png',
            price: product?.price || item.price // keep price synced with DB
          }
        })
        setCartItems(enrichedLocalCart)
        saveLocalCart(enrichedLocalCart) // resave with updated prices
      } else {
        setCartItems([])
      }
    } else {
      setIsGuest(false)

      // Prima citire după autentificare: dacă a rămas un coș de vizitator, îl
      // mutăm în cont înainte de a afișa ceva. Altfel utilizatorul ar vedea
      // pentru o clipă coșul din bază, fără produsele lui.
      if (!mergeAttempted.current) {
        mergeAttempted.current = true
        const merged = await mergeGuestCart()

        if (merged) {
          const afterMerge = await fetchCart()
          setCartItems(afterMerge.items || [])
          if (!options?.silent) setIsLoading(false)
          return
        }
      }

      setCartItems(result.items || [])
    }
    if (!options?.silent) setIsLoading(false)
  }

  useEffect(() => {
    refreshCart()
  }, [])

  const addToCart = async (productSlug: string, price: number, quantity: number = 1) => {
    const result = await addToCartDB(productSlug, price, quantity)
    
    // Fallback to guest cart if not authenticated
    if (result.notAuthenticated) {
      let localCart = getLocalCart()
      const existing = localCart.find(item => item.product_slug === productSlug)
      if (existing) {
        existing.quantity += quantity
      } else {
        localCart.push({
          id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          product_slug: productSlug,
          quantity,
          price
        })
      }
      saveLocalCart(localCart)
      await refreshCart({ silent: true }) // completează nume/imagine
      return { success: true }
    }

    if (result.success) {
      await refreshCart({ silent: true })
    }
    return result
  }

  const removeFromCart = async (productSlug: string) => {
    const stareAnterioara = cartItems

    // Actualizare optimistă, la fel ca la modificarea cantității: produsul
    // dispare imediat, fără schelet de încărcare peste tot coșul.
    setCartItems(prev => prev.filter(item => item.product_slug !== productSlug))

    const result = await removeCartItemDB(productSlug)

    if (result.notAuthenticated) {
      let localCart = getLocalCart()
      localCart = localCart.filter(item => item.product_slug !== productSlug)
      saveLocalCart(localCart)
      return { success: true }
    }

    if (!result.success) {
      // Serverul a refuzat: punem produsul la loc.
      setCartItems(stareAnterioara)
    }
    return result
  }

  const updateQuantity = async (productSlug: string, quantity: number) => {
    // Optimistic UI update
    setCartItems(prev => prev.map(item => item.product_slug === productSlug ? { ...item, quantity } : item).filter(item => item.quantity > 0));
    
    const result = await updateCartItemQuantityDB(productSlug, quantity)
    
    if (result.notAuthenticated) {
      let localCart = getLocalCart()
      if (quantity <= 0) {
        localCart = localCart.filter(item => item.product_slug !== productSlug)
      } else {
        localCart = localCart.map(item => item.product_slug === productSlug ? { ...item, quantity } : item)
      }
      saveLocalCart(localCart)
      return { success: true }
    }

    if (!result.success) {
      // Revert if error
      await refreshCart()
    }
    return result
  }

  const clearCart = () => {
    if (isGuest) {
      saveLocalCart([])
    }
    setCartItems([])
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, isLoading, addToCart, removeFromCart, updateQuantity, refreshCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
