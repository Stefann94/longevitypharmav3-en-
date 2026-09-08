import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMagneziu() {
  // Fetch an esentiale product that has rich content
  const { data: sourceProduct, error: fetchErr } = await supabase
    .from('products')
    .select('rich_content')
    .eq('category_slug', 'esentiale')
    .neq('slug', 'magneziu-bisglicinat')
    .limit(1)
    .single();

  if (fetchErr || !sourceProduct) {
    console.error('Failed to fetch source product:', fetchErr);
    return;
  }

  const { error: updateErr } = await supabase
    .from('products')
    .update({ rich_content: sourceProduct.rich_content })
    .eq('slug', 'magneziu-bisglicinat');

  if (updateErr) {
    console.error('Failed to update magneziu:', updateErr);
  } else {
    console.log('Successfully updated Magneziu Bisglicinat with full rich content!');
  }
}

fixMagneziu();
