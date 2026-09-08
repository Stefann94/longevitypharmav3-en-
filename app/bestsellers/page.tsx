import { createStaticClient } from '@/lib/supabase/static';
import BestsellersClient from "./BestsellersClient";


export const metadata = {
  title: 'Bestsellers | Longevity Pharma',
  description: 'Discover the best-selling premium supplements in our shop. Products tested and loved by thousands of customers.',
};

export default async function BestsellersPage() {
  const supabase = createStaticClient();

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_bestseller', true)
    .order('price', { ascending: false });

  return <BestsellersClient products={products || []} />;
}
