import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

// La export static nu exista server care sa genereze fisierul la cerere:
// trebuie scris o singura data, la build.
export const dynamic = 'force-static';


export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/checkout/', '/api/'], // Pages not to be indexed
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
