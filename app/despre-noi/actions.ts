
import { createClient } from '@/lib/supabase/client';

/**
 * Operatiuni pe datele utilizatorului, mutate din server in browser.
 *
 * Fisierul era marcat cu directiva de actiuni de server, care nu exista in
 * export static: nu ramane niciun server Node care sa le execute. Fiind doar
 * apeluri Supabase, ruleaza la fel de bine direct din browser - politicile RLS
 * filtreaza dupa auth.uid(), deci fiecare client vede si modifica strict
 * randurile lui.
 *
 * Semnaturile si valorile returnate sunt neschimbate, deci componentele care
 * apeleaza aceste functii nu au avut nevoie de nicio modificare.
 */

export type AboutUsSection = {
  id: string;
  section_key: string;
  title: string;
  description: string;
  label: string | null;
  image_url: string;
};

export async function getAboutUsContent(): Promise<AboutUsSection[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('about_us_content')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching about us content:', error);
    return [];
  }

  return data as AboutUsSection[];
}
