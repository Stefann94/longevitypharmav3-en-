'use client'; // Error boundaries trebuie să fie Client Components

/**
 * Ultima plasă de siguranță: se activează doar dacă eroarea apare chiar în
 * layout-ul rădăcină, caz în care `error.tsx` nu mai poate fi randat.
 *
 * Acest fișier înlocuiește complet layout-ul, deci trebuie să își definească
 * propriile tag-uri <html> și <body>. Stilurile globale NU sunt disponibile aici,
 * motiv pentru care culorile temei sunt scrise inline.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="ro">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: '#fbfdfa',
          color: '#1d3324',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          lineHeight: 1.6,
        }}
      >
        <title>Eroare | Longevity Pharma</title>

        <div
          style={{
            maxWidth: '520px',
            width: '100%',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e6e2',
            borderRadius: '16px',
            padding: '48px 32px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px auto',
              borderRadius: '50%',
              backgroundColor: '#f4f8f1',
              border: '1px solid #d6e4d9',
              color: '#274f38',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>

          <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '14px' }}>
            Site-ul întâmpină o problemă
          </h1>
          <p style={{ color: '#5c6f61', marginBottom: '32px' }}>
            Lucrăm la remedierea ei. Te rugăm să încerci din nou în câteva momente.
          </p>

          <button
            onClick={() => unstable_retry()}
            style={{
              width: '100%',
              maxWidth: '280px',
              padding: '14px 24px',
              backgroundColor: '#274f38',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reîncarcă pagina
          </button>

          {error.digest && (
            <div style={{ marginTop: '20px', fontSize: '0.72rem', color: '#a3b0a7', fontFamily: 'monospace' }}>
              Cod referință: {error.digest}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
