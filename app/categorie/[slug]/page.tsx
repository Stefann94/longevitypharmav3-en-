import { createStaticClient } from '@/lib/supabase/static';
import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";

// Cate o pagina pre-generata pentru fiecare categorie. Vezi comentariul din
// app/produs/[slug]/page.tsx pentru motiv.
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from('categories').select('slug');
  return (data ?? []).map((c: { slug: string }) => ({ slug: c.slug }));
}

export const dynamicParams = false;



// Fără asta, toate cele 12 pagini de categorie moșteneau titlul și descrierea
// din layout-ul principal — adică Google le vedea ca pagini identice.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const supabase = createStaticClient();

  // select('*') în loc de coloane numite: dacă tabelul nu are coloana
  // `description`, o interogare explicită ar eșua și titlul ar fi greșit.
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', decodedSlug)
    .single();

  if (!category) {
    return { title: 'Categorie negăsită | Longevity Pharma' };
  }

  const description =
    category.description ||
    `Descoperă gama ${category.name} de la Longevity Pharma: suplimente premium, formulate științific. Livrare rapidă și transport gratuit peste 200 RON.`;

  return {
    title: `${category.name} | Longevity Pharma`,
    description,
    alternates: {
      canonical: `/categorie/${encodeURIComponent(decodedSlug)}`,
    },
    openGraph: {
      title: `${category.name} | Longevity Pharma`,
      description,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = createStaticClient();
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 1. Fetch current category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', decodedSlug)
    .single();

  if (!category) {
    notFound();
  }

  // 2. Fetch products for this category
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_slug', decodedSlug)
    .order('created_at', { ascending: false });

  // 3. Fetch all categories (for subcategory chips navigation)
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .order('sort_order');

  return (
    <CategoryClient
      category={category}
      products={products || []}
      allCategories={allCategories || []}
    />
  );
}
