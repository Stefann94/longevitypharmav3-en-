'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchFavorites, toggleFavoriteDB } from '@/app/favorites/actions'

export type FavoriteItem = {
  id: string
  product_slug: string
  name?: string
  image_url?: string
  price?: number
}

interface FavoritesContextType {
  favoriteItems: FavoriteItem[]
  favoriteCount: number
  isLoading: boolean
  toggleFavorite: (productSlug: string) => Promise<{ error?: string; success?: boolean; action?: string; notAuthenticated?: boolean }>
  refreshFavorites: () => Promise<void>
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // `silent` sare peste starea de încărcare: o folosim după o modificare,
  // când lista este deja actualizată optimist și un schelet ar fi doar o clipire.
  const refreshFavorites = async (options?: { silent?: boolean }) => {
    if (!options?.silent) setIsLoading(true)
    const result = await fetchFavorites()
    setFavoriteItems(result.items || [])
    if (!options?.silent) setIsLoading(false)
  }

  useEffect(() => {
    refreshFavorites()
  }, [])

  const toggleFavorite = async (productSlug: string) => {
    const eraFavorit = favoriteItems.some(f => f.product_slug === productSlug)
    const stareAnterioara = favoriteItems

    // Actualizare optimistă: inima și insigna din antet reacționează imediat,
    // fără să aștepte răspunsul serverului.
    setFavoriteItems(prev =>
      eraFavorit
        ? prev.filter(f => f.product_slug !== productSlug)
        : [...prev, { id: `pending-${productSlug}`, product_slug: productSlug }]
    )

    const result = await toggleFavoriteDB(productSlug)

    if (!result.success) {
      // Serverul a refuzat (inclusiv cazul „neautentificat"): revenim la starea reală.
      setFavoriteItems(stareAnterioara)
      return result
    }

    // Detaliile complete (nume, imagine, preț) pentru panoul din antet vin în
    // fundal. Interfața nu mai așteaptă după acest al doilea drum la server.
    void refreshFavorites({ silent: true })
    return result
  }

  const clearFavorites = () => {
    setFavoriteItems([])
  }

  return (
    <FavoritesContext.Provider value={{
      favoriteItems,
      favoriteCount: favoriteItems.length,
      isLoading,
      toggleFavorite,
      refreshFavorites,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
