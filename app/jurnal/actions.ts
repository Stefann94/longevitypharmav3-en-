import { createStaticClient } from '@/lib/supabase/static';

/**
 * Citirile din jurnal sunt publice: aceleași articole pentru orice vizitator.
 *
 * Fișierul era marcat `'use server'` și folosea clientul cu cookie-uri, ceea ce
 * obliga paginile de jurnal să fie randate la fiecare cerere, pe un server
 * Node. Sunt însă simple citiri, fără nimic personal, deci se pot face o
 * singură dată, la build.
 *
 * Ambele funcții sunt apelate doar din componente de server
 * (app/jurnal/page.tsx și app/jurnal/[slug]/page.tsx), deci scoaterea
 * directivei `'use server'` nu rupe niciun apel din browser.
 */

export type JournalArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string;
  author: string;
  tags: string[];
  published_at: string;
};

// Toate articolele, cel mai recent primul
export async function getJournalArticles(): Promise<JournalArticle[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('journal_articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Eroare la citirea articolelor din jurnal:', error);
    return [];
  }

  return data as JournalArticle[];
}

// Un singur articol, după slug
export async function getJournalArticleBySlug(slug: string): Promise<JournalArticle | null> {
  const decodedSlug = decodeURIComponent(slug);
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('journal_articles')
    .select('*')
    .eq('slug', decodedSlug)
    .single();

  if (error) {
    console.error(`Eroare la citirea articolului cu slug-ul ${slug}:`, error);
    return null;
  }

  return data as JournalArticle;
}
