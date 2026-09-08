import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, image_url, rich_content')
    .not('rich_content', 'is', null);

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Found ${products.length} products with rich_content.`);
  for (const p of products) {
      const rc = p.rich_content;
      let foundImage = 'None';
      if (typeof rc === 'string') {
          const match = rc.match(/<img[^>]+src="([^">]+)"/);
          if (match) foundImage = match[1];
      } else if (typeof rc === 'object') {
          const str = JSON.stringify(rc);
          const match = str.match(/\/images\/[^"'\\]+\.(png|jpg|jpeg|webp)/i);
          if (match) foundImage = match[0];
      }
      console.log(`- ${p.name} (${p.slug}): image_url='${p.image_url}', rich_content_image='${foundImage}'`);
  }
}

check();
