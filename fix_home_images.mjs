import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
    // 1. Fetch Essentials (is_bestseller = true)
    const { data: essentials } = await supabase.from('products').select('id, name, slug, rich_content').eq('is_bestseller', true).limit(8);
    const longevitateImages = ['/longevitate1.png', '/longevitate2.png', '/longevitate3.png', '/longevitate4.png'];
    
    // 2. Fetch Focus (is_focus_energy = true)
    const { data: focus } = await supabase.from('products').select('id, name, slug, rich_content').eq('is_focus_energy', true).limit(8);
    const claritateImages = ['/claritate1.png', '/claritate2.png', '/claritate3.png'];
    
    // 3. Fetch Bundles (is_premium_bundle = true)
    const { data: bundles } = await supabase.from('products').select('id, name, slug, rich_content').eq('is_premium_bundle', true).limit(8);
    const bundleImages = ['/7.png', '/8.png', '/9.png'];
    
    // We will update each product. 
    // To ensure alternating, we just use modulo operator.
    
    let updates = [];
    
    const assignImages = (items, imageArray) => {
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const imageName = imageArray[i % imageArray.length];
            const imageUrl = '/images' + imageName;
            
            // update rich_content if exists
            let rc = item.rich_content || {};
            rc.content_image = imageName;
            
            updates.push(
                supabase.from('products')
                .update({ 
                    image_url: imageUrl,
                    rich_content: rc
                })
                .eq('id', item.id)
            );
            console.log(`Assigned ${imageName} to ${item.name} (${item.slug})`);
        }
    };
    
    console.log("--- ESSENTIALS (Longevitate) ---");
    assignImages(essentials, longevitateImages);
    
    console.log("--- FOCUS ---");
    assignImages(focus, claritateImages);
    
    console.log("--- BUNDLES ---");
    assignImages(bundles, bundleImages);
    
    await Promise.all(updates);
    console.log("Done updating all home products!");
}

fix();
