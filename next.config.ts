import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export static: `next build` scrie în folderul `out/` un site din fișiere
  // HTML, CSS și JavaScript, care poate fi servit de orice server web obișnuit.
  //
  // Este singura formă în care site-ul poate rula pe găzduirea Hostico Start,
  // care nu include Node.js. Toate cele 29 de rute sunt pre-generate, iar
  // datele care depind de vizitator (coșul, contul, comenzile) se cer direct de
  // la Supabase din browser.
  output: 'export',

  // Ascunde headerul "X-Powered-By: Next.js" (nu mai anunțăm tehnologia folosită)
  poweredByHeader: false,

  images: {
    // Optimizarea imaginilor este făcută la cerere, de un server care
    // redimensionează și convertește fișierele. Nu există un astfel de server
    // aici, deci imaginile sunt servite așa cum sunt.
    //
    // Componenta `next/image` continuă să funcționeze - păstrează dimensiunile
    // rezervate, încărcarea leneșă și atributele - doar că nu mai rescrie
    // fișierul. Aspectul rămâne neschimbat.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Anteturile de securitate (CSP, HSTS, X-Frame-Options și celelalte) se
  // adăugau aici, prin funcția `headers()`. La export static nu mai există
  // niciun server Node care să le pună pe răspuns, așa că au fost mutate în
  // `public/.htaccess`, de unde le aplică Apache pe serverul Hostico.
  //
  // Valorile sunt identice, cu o singură excepție: `unsafe-eval` a fost scos
  // din `script-src`, pentru că era necesar doar reîncărcării la cald din
  // timpul dezvoltării.
};

export default nextConfig;
