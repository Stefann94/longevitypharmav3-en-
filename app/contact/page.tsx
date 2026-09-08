import React from 'react';
import authStyles from '../auth/Auth.module.css';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact | Longevity Pharma',
  description: 'Ai întrebări despre suplimentele noastre sau despre comanda ta? Contactează echipa Longevity Pharma.',
};

// Aceleași date ca în subsolul site-ului. Ținute într-un singur loc aici, ca la
// o eventuală schimbare de telefon sau adresă să nu rămână o pagină în urmă.
const eticheta: React.CSSProperties = {
  display: 'block',
  color: '#333',
  marginBottom: '5px',
};

const legatura: React.CSSProperties = {
  color: '#2e8b57',
  textDecoration: 'none',
};

export default function ContactPage() {
  return (
    <main className={authStyles.pageWrapper}>
      <h1 className={authStyles.pageTitle}>Contact</h1>

      <div className={authStyles.formColumns}>

        {/* INFO PANEL */}
        <div>
          <div className={authStyles.formSection}>
            <h2>Informații de Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.95rem', color: '#555' }}>
              <div>
                <strong style={eticheta}>Email</strong>
                <a href="mailto:contact@avogrupinvest.ro" style={legatura}>contact@avogrupinvest.ro</a>
                <br />
                <a href="mailto:ic@solarone.ro" style={legatura}>ic@solarone.ro</a>
              </div>
              <div>
                <strong style={eticheta}>Telefon</strong>
                {/* tel: fără spații — așa formează corect de pe telefon */}
                <a href="tel:+40721233544" style={legatura}>+40 721 233 544</a>
              </div>
              <div>
                <strong style={eticheta}>Adresă Sediu</strong>
                Str. Nordului 8A, Piatra Neamț, jud. Neamț
              </div>
              <div>
                <strong style={eticheta}>Site-uri</strong>
                <a href="https://www.avogrupinvest.ro/" target="_blank" rel="noopener noreferrer" style={legatura}>www.avogrupinvest.ro</a>
                <br />
                <a href="https://www.solarone.ro/" target="_blank" rel="noopener noreferrer" style={legatura}>www.solarone.ro</a>
              </div>
              <div>
                <strong style={eticheta}>Program</strong>
                Luni - Vineri: 09:00 - 17:00
              </div>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '18px', fontSize: '0.85rem', color: '#777', lineHeight: 1.7 }}>
                <strong style={{ ...eticheta, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Date comerciale
                </strong>
                S.C. AVO GRUP INVEST S.R.L.<br />
                Sediu social: Str. Nordului 8A, Piatra Neamț, jud. Neamț<br />
                Nr. reg. com.: J27/1242/2006<br />
                C.I.F.: RO19135483<br />
                Administrator persoană juridică: Ionuț Ciocodan
              </div>
            </div>
          </div>
        </div>

        {/* FORM PANEL */}
        <div>
          <ContactForm />
        </div>

      </div>
    </main>
  );
}
