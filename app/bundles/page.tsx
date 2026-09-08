import { createStaticClient } from '@/lib/supabase/static';
import BundlesClient from "./BundlesClient";


export const metadata = {
  title: 'Bundles & Offers | Longevity Pharma',
  description: 'Discover our premium supplement protocols and bundles, with guaranteed savings.',
};

export default async function PachetePage() {
  const supabase = createStaticClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_premium_bundle', true)
    .order('price', { ascending: false });

  return <BundlesClient products={products || []} />;
}
