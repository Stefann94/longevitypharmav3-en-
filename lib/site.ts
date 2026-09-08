/**
 * Adresa publică a site-ului, folosită de sitemap, robots.txt și metadatele Open Graph.
 *
 * Se rezolvă în ordinea priorității, ca să funcționeze corect în orice mediu
 * fără să fie nevoie de modificări în cod la schimbarea domeniului:
 *
 *   1. NEXT_PUBLIC_SITE_URL  — domeniul propriu, când va fi cumpărat (ex: https://longevitypharma.ro)
 *   2. VERCEL_PROJECT_PRODUCTION_URL — domeniul stabil de producție de pe Vercel
 *   3. VERCEL_URL — deployment-ul curent (folosit la preview-urile de pe branch-uri)
 *   4. localhost — development local
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    const withProtocol = explicit.startsWith('http') ? explicit : `https://${explicit}`;
    return withProtocol.replace(/\/+$/, '');
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}
