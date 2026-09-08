import { createStaticClient } from '@/lib/supabase/static';
import BestsellersClient from "./BestsellersClient";


export const metadata = {
  title: 'Bestsellers | Longevity Pharma',
  description: 'Descoperă cele mai vândute suplimente premium din magazinul nostru. Produse testate și apreciate de mii de clienți.',
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
