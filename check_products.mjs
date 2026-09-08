import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: ANON_KEY might not have UPDATE permissions due to RLS.
// Wait, typically ANON_KEY allows public read. To update, we might need SERVICE_ROLE_KEY.
// Let's check if the user has a service role key in .env.local

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, category_slug, rich_content');
    
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  console.log(`Found ${products.length} products.`);
  
  products.forEach(p => {
    const hasRich = p.rich_content ? true : false;
    const hasFaq = p.rich_content?.faq ? true : false;
    const hasReviews = p.rich_content?.reviews ? true : false;
    const ingredientsRows = p.rich_content?.ingredients_table?.length || 0;
    
    console.log(`- [${p.category_slug}] ${p.name} (slug: ${p.slug})`);
    console.log(`  RichContent: ${hasRich} | FAQ: ${hasFaq} | Reviews: ${hasReviews} | TableRows: ${ingredientsRows}`);
  });
}

checkProducts();
