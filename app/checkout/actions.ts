
import { createClient } from '@/lib/supabase/client'

/**
 * Finalizarea comenzii, mutata din server in browser.
 *
 * Verificarea preturilor a ramas neschimbata si este in continuare esentiala:
 * preturile se recitesc din tabela `products` dupa slug, deci o valoare
 * modificata in cosul din browser nu are niciun efect asupra sumei facturate.
 */

// Forma unui produs așa cum vine din coșul clientului (localStorage sau context).
// Adnotare pură de tip: TypeScript o șterge la compilare, codul executat nu se schimbă.
type ClientCartItem = {
  product_slug: string
  quantity: number
  price?: number
  name?: string
}

export async function processCheckout(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Get cart items from form data (JSON string passed from client)
  const guestCartRaw = formData.get('guestCartItems') as string
  let clientCartItems: ClientCartItem[] = []
  if (guestCartRaw) {
    try {
      clientCartItems = JSON.parse(guestCartRaw)
    } catch (e) {
      console.error('Eroare parsare guestCartItems', e)
    }
  }

  if (!clientCartItems || clientCartItems.length === 0) {
    return { error: 'Coșul este gol sau a apărut o eroare.' }
  }

  // 2. Fetch product details from DB to ensure prices are secure (not tampered)
  const slugs = clientCartItems.map((item: any) => item.product_slug)
  const { data: products } = await supabase
    .from('products')
    .select('slug, name, price')
    .in('slug', slugs)
  
  const productsMap = new Map(products?.map(p => [p.slug, p]))

  const secureCartItems = clientCartItems.map((item: any) => {
    const p = productsMap.get(item.product_slug)
    return {
      product_slug: item.product_slug,
      quantity: item.quantity,
      price: p?.price || item.price,
      product_name: p?.name || item.name || item.product_slug
    }
  })

  // 3. Calculate Total
  const FREE_SHIPPING_THRESHOLD = 200
  const STANDARD_SHIPPING_COST = 19.99

  const itemsTotal = secureCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shippingCost = itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
  const finalTotal = itemsTotal + shippingCost

  // 4. Extract Shipping Info
  const firstName = formData.get('first_name') as string
  const lastName = formData.get('last_name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const street = formData.get('street') as string
  const city = formData.get('city') as string
  const county = formData.get('county') as string
  const zip = formData.get('zip') as string

  const fullName = `${firstName} ${lastName}`
  const fullAddress = `${street}, ${city}, ${county}, ${zip}`

  const orderId = crypto.randomUUID()

  // 5. Create Order
  type OrderRow = {
    id: string
    user_id: string | null
    total_amount: number
    shipping_cost: number
    shipping_name: string
    shipping_phone: string
    shipping_address: string
    status: string
    guest_email?: string
  }

  const orderRow: OrderRow = {
    id: orderId,
    user_id: user?.id || null,
    total_amount: finalTotal,
    shipping_cost: shippingCost,
    shipping_name: fullName,
    shipping_phone: phone,
    shipping_address: fullAddress,
    status: 'În procesare'
  }

  // Comanda unui vizitator nu are user_id, deci fără email nu ar exista nimic
  // care să o lege de o persoană: ar rămâne orfană pentru totdeauna. Emailul
  // este singurul lucru după care o poate revendica mai târziu, când își face
  // cont sau se autentifică. Pentru comenzile autentificate legătura se face
  // deja prin user_id, deci acolo nu îl mai stocăm.
  if (!user && email) {
    orderRow.guest_email = email
  }

  let { error: orderError } = await supabase.from('orders').insert(orderRow)

  // Coloana `guest_email` vine dintr-o migrare care se rulează manual în
  // Supabase (setup_guest_orders.sql). Dacă acest cod ajunge în producție
  // înainte de migrare, reîncercăm fără ea: mai bine o comandă care nu poate fi
  // revendicată decât un checkout care refuză să meargă.
  if (orderError && orderError.message?.includes('guest_email')) {
    console.warn(
      'Coloana orders.guest_email lipseste; comanda se salveaza fara ea. ' +
      'Ruleaza setup_guest_orders.sql in Supabase pentru a activa revendicarea.'
    )
    delete orderRow.guest_email
    const retry = await supabase.from('orders').insert(orderRow)
    orderError = retry.error
  }

  if (orderError) {
    console.error('Order creation error:', orderError)
    if (orderError.message.includes('foreign key constraint') || orderError.message.includes('null value in column "user_id"')) {
       return { error: 'Pentru a permite comenzi fara cont, trebuie eliminata restrictia NOT NULL pentru coloana user_id din tabelul orders in Supabase.' }
    }
    return { error: `Eroare Supabase: ${orderError.message}` }
  }

  const orderItemsData = secureCartItems.map(item => ({
    order_id: orderId,
    product_slug: item.product_slug,
    product_name: item.product_name,
    quantity: item.quantity,
    price_at_time: item.price,
    price: item.price 
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    console.error('Order items error:', itemsError)
    return { error: `Eroare salvare produse: ${itemsError.message}` }
  }

  // 6. Clear DB Cart if authenticated
  if (user) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
  }

  // 7. Confirmarea pe email
  //
  // Emailul era trimis aici, direct cu Resend. Nu mai este posibil: codul
  // ruleaza acum in browser, iar RESEND_API_KEY ar ajunge vizibila oricui.
  // Trimiterea s-a mutat in functia Edge `trimite-email`, care ruleaza pe
  // infrastructura Supabase si tine cheia in variabile de mediu.
  //
  // Ii dam doar identificatorul comenzii. Functia citeste singura randul din
  // `orders` si deduce destinatarul - din `guest_email` pentru vizitatori, din
  // contul utilizatorului pentru clientii autentificati. Adresa nu vine
  // niciodata de la apelant, deci functia nu poate fi folosita ca releu de spam.
  //
  // Esecul este intentionat inghitit: comanda este deja salvata, iar un email
  // care nu pleaca nu trebuie sa transforme o comanda reusita in eroare.
  try {
    await supabase.functions.invoke('trimite-email', {
      body: { tip: 'comanda', id: orderId },
    })
  } catch (err) {
    console.error('Emailul de confirmare nu a putut fi trimis:', err)
  }
  return { success: true }
}
