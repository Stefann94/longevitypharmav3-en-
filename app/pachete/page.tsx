import { createStaticClient } from '@/lib/supabase/static';
import PacheteClient from "./PacheteClient";


export const metadata = {
  title: 'Pachete & Oferte | Longevity Pharma',
  description: 'Descoperă protocoalele și pachetele noastre premium de suplimente cu reducere garantată.',
};

export default async function PachetePage() {
  const supabase = createStaticClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_premium_bundle', true)
    .order('price', { ascending: false });

  return <PacheteClient products={products || []} />;
}
