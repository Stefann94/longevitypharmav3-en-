
import { createClient } from '@/lib/supabase/client'

/**
 * Modificarile din contul clientului, mutate din server in browser.
 *
 * Erau actiuni de server, inexistente in export static. Fiind doar apeluri
 * Supabase, ruleaza direct din browser; RLS filtreaza dupa auth.uid().
 *
 * Apelurile revalidatePath au fost scoase: nu mai exista server care sa
 * reconstruiasca pagini. Nu se pierde nimic - paginile de cont isi citesc
 * datele la fiecare afisare, deci raman la zi oricum.
 *
 * Semnaturile si valorile returnate sunt neschimbate.
 */

export async function updateProfile(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const firstName = formData.get('first_name') as string
  const lastName = formData.get('last_name') as string
  const phone = formData.get('phone') as string
  
  // 1. Update Auth metadata
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName
    }
  })

  if (authError) return { error: authError.message }

  // 2. Update Profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      updated_at: new Date().toISOString()
    })

  if (profileError) return { error: profileError.message }

  
  return { success: true }
}

export async function toggleNewsletter(isSubscribed: boolean) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('newsletter_subscriptions')
    .upsert({
      user_id: user.id,
      email: user.email, // Am adăugat email-ul aici pentru a respecta constrângerea bazei de date!
      is_subscribed: isSubscribed,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })

  if (error) {
    console.error('Toggle Newsletter Error:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function updateMedicalProfile(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const allergies = formData.get('allergies') as string
  const current_treatments = formData.get('current_treatments') as string

  const { error } = await supabase
    .from('medical_profiles')
    .upsert({
      user_id: user.id,
      allergies,
      current_treatments,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })

  if (error) {
    console.error('Update Medical Error:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function updateAddress(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const type = formData.get('type') as string // 'shipping' or 'billing'
  const street = formData.get('street') as string
  const city = formData.get('city') as string
  const zip = formData.get('zip') as string
  const county = formData.get('county') as string

  // UPSERT requires conflict target if we want to update. 
  // Let's assume we want to update the default address for that type.
  // We'll check if there's an existing address of that type.
  const { data: existing } = await supabase
    .from('addresses')
    .select('id')
    .eq('user_id', user.id)
    .eq('type', type)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('addresses')
      .update({
        street, city, postal_code: zip, county,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
    if (error) {
      console.error('Update Address Error:', error)
      return { error: error.message }
    }
  } else {
    // `addresses` cere obligatoriu first_name, last_name și phone, dar
    // formularul de adresă nu le întreabă. Fără ele, orice adresă nouă era
    // respinsă de baza de date. Le luăm din profil, cu același lanț de
    // rezerve folosit deja de paginile de cont și de checkout.
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone')
      .eq('id', user.id)
      .maybeSingle()

    const { error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        type,
        street, city, postal_code: zip, county,
        first_name: profile?.first_name || user.user_metadata?.first_name || '',
        last_name: profile?.last_name || user.user_metadata?.last_name || '',
        phone: profile?.phone || user.user_metadata?.phone || '',
        is_default: true,
        updated_at: new Date().toISOString()
      })
    if (error) {
      console.error('Insert Address Error:', error)
      return { error: error.message }
    }
  }

  return { success: true }
}
