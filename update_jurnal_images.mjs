import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateImages() {
  await supabase.from('journal_articles').update({ image_url: '/images/jurnal/nmn.png' }).eq('slug', 'cum-functioneaza-nmn-ul-la-nivel-celular');
  await supabase.from('journal_articles').update({ image_url: '/images/jurnal/colagen.png' }).eq('slug', 'colagen-hidrolizat-vs-colagen-nativ');
  await supabase.from('journal_articles').update({ image_url: '/images/jurnal/inflamatie.png' }).eq('slug', 'protocol-reducere-inflamatie-stres-oxidativ');
  await supabase.from('journal_articles').update({ image_url: '/images/jurnal/testare.png' }).eq('slug', 'testare-lot-productie-laborator-tert');
  console.log('Done updating images!');
}

updateImages();
