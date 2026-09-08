import Script from 'next/script';

/**
 * Google Analytics 4.
 *
 * ID-ul de măsurare nu este un secret — apare oricum în sursa paginii, la orice
 * site care folosește GA. Îl păstrăm ca valoare implicită, dar poate fi
 * suprascris prin variabila de mediu NEXT_PUBLIC_GA_ID (util dacă se folosesc
 * proprietăți separate pentru staging și producție).
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-T6L04HQ20D';

export default function GoogleAnalytics() {
  // Nu încărcăm analytics în development: altfel propriile teste de pe localhost
  // ar apărea ca trafic real și ar denatura statisticile.
  if (process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
