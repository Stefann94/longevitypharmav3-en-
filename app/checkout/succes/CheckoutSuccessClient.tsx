'use client';

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

/**
 * Sesiunea se afla acum din browser.
 *
 * Pagina alege intre doua mesaje: unul pentru clientul conectat, altul pentru
 * vizitator. Cat timp raspunsul nu a sosit, se afiseaza doar bifa verde si
 * titlul - partile comune ambelor variante. Asa nimeni nu vede o pagina goala
 * imediat dupa plasarea comenzii si nu apare mesajul gresit pentru o clipa.
 */
export default function CheckoutSuccessClient() {
  const [user, setUser] = useState<User | null>(null);
  const [seIncarca, setSeIncarca] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let activ = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!activ) return;
      setUser(data.user ?? null);
      setSeIncarca(false);
    });

    return () => {
      activ = false;
    };
  }, []);
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="80" width="80" xmlns="http://www.w3.org/2000/svg" style={{ color: '#2e8b57', marginBottom: '20px' }}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h1 style={titleStyle}>Comanda a fost înregistrată!</h1>

        {seIncarca ? null : user ? (
          /* Utilizator autentificat: comanda este deja legată de contul lui. */
          <>
            <p style={descStyle}>
              Îți mulțumim pentru cumpărături. Un email de confirmare a fost trimis către adresa ta de email.
            </p>
            <Link href="/account/comenzi" style={btnStyle}>
              Vezi comenzile tale
            </Link>
          </>
        ) : (
          /* Vizitator: nu are un cont în care să vadă comanda, deci butonul
             către istoric l-ar trimite într-un perete de autentificare. Îi
             spunem unde găsește detaliile și îi oferim contul ca opțiune, nu
             ca obligație. */
          <>
            <p style={descStyle}>
              Îți mulțumim pentru cumpărături. Am trimis confirmarea cu toate
              detaliile comenzii pe adresa de email completată la finalizare.
            </p>
            <p style={noteStyle}>
              Creează-ți un cont cu <strong>aceeași adresă de email</strong> și
              comanda aceasta va apărea automat în istoricul tău.
            </p>
            <Link href="/signup" style={btnStyle}>
              Creează cont
            </Link>
            <Link href="/login" style={{ ...linkStyle, marginBottom: '15px' }}>
              Am deja cont
            </Link>
          </>
        )}

        <Link href="/" style={linkStyle}>
          Întoarce-te la magazin
        </Link>
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  padding: '20px',
  backgroundColor: '#fafafa',
}

/* Se ajunge aici prin navigare din pagina de checkout, iar la o navigare
   client-side bucata de CSS a rutei noi se incarca separat de HTML. De aceea
   stilurile stau inline: ele sosesc odata cu marcajul, deci nu exista niciun
   moment in care pagina sa fie randata fara ele.
   Din acelasi motiv, fiecare regula de care depinde asezarea este scrisa
   explicit — marginile, `boxSizing` si centrarea nu se lasa mostenite din
   `globals.css`, care este un fisier separat. */

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '50px 30px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  textAlign: 'center',
  maxWidth: '500px',
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  color: '#1a2b22',
  // Marginea implicita a browserului pentru <h1> ar impinge titlul daca
  // resetul din globals.css nu a apucat sa se aplice.
  margin: '0 0 15px 0',
  fontWeight: 700,
}

const descStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '1.1rem',
  lineHeight: '1.5',
  margin: '0 0 30px 0',
}

const btnStyle: React.CSSProperties = {
  backgroundColor: '#2e8b57',
  color: 'white',
  padding: '14px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1.05rem',
  marginBottom: '15px',
  width: '100%',
  // Un <a> este implicit inline. Fara aceste reguli, latimea si centrarea
  // textului depind de blocarea ca element flex si de `text-align` mostenit —
  // exact lucrurile care faceau butonul sa apara deplasat la inceput.
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  transition: 'background-color 0.2s',
}

const linkStyle: React.CSSProperties = {
  color: '#2e8b57',
  textDecoration: 'none',
  fontWeight: 600,
  display: 'block',
  textAlign: 'center',
}

const noteStyle: React.CSSProperties = {
  backgroundColor: '#f4f8f1',
  border: '1px solid #d6e4d9',
  borderRadius: '8px',
  padding: '14px 16px',
  color: '#4a5c51',
  fontSize: '0.95rem',
  lineHeight: '1.5',
  margin: '0 0 25px 0',
  boxSizing: 'border-box',
  width: '100%',
}
