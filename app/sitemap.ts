import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getSiteUrl } from '@/lib/site';

// La export static nu exista server care sa genereze fisierul la cerere:
// trebuie scris o singura data, la build.
export const dynamic = 'force-static';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Standardul sitemap cere ca URL-urile să fie percent-encoded.
// Slug-urile pot conține diacritice, deci codificăm fiecare segment.
const encodeSlug = (slug: string) => encodeURIComponent(slug);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  // Static routes
  const routes = [
    '',
    '/jurnal',
    '/contact',
    '/abonamente',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch categories
  const { data: categories } = await supabase.from('categories').select('slug');
  const categoryRoutes = (categories || []).map((cat) => ({
    url: `${baseUrl}/categorie/${encodeSlug(cat.slug)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch products
  const { data: products } = await supabase.from('products').select('slug');
  const productRoutes = (products || []).map((prod) => ({
    url: `${baseUrl}/produs/${encodeSlug(prod.slug)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Fetch articles (jurnal) — tabelul se numește `journal_articles`, nu `articles`
  const { data: articles } = await supabase.from('journal_articles').select('slug');
  const articleRoutes = (articles || []).map((article) => ({
    url: `${baseUrl}/jurnal/${encodeSlug(article.slug)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes, ...productRoutes, ...articleRoutes];
}
