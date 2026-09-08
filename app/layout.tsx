import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SessionProviders from "./SessionProviders";
import ScrollToTop from "@/components/ScrollToTop";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import BackToTopButton from "@/components/BackToTopButton";
import { getSiteUrl } from '@/lib/site';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Baza pentru toate URL-urile relative din metadate (og:image, og:url etc.).
  // Fără ea, imaginile Open Graph rămân căi relative pe care Facebook/WhatsApp
  // nu le pot rezolva, iar previzualizarea la distribuire apare goală.
  metadataBase: new URL(getSiteUrl()),
  title: "Longevity Pharma | Suplimente Premium pentru Sănătate",
  description: "Investește Astăzi în Ziua de Mâine. Suplimente alimentare premium, formulate științific pentru vitalitate, energie și funcția cognitivă.",
  keywords: ["suplimente", "longevitate", "anti-aging", "nootropice", "sanatate", "vitamine premium"],
  openGraph: {
    title: "Longevity Pharma | Suplimente Premium",
    description: "Investește Astăzi în Ziua de Mâine cu cele mai bune suplimente pentru corpul tău.",
    url: "/",
    siteName: "Longevity Pharma",
    locale: "ro_RO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Sesiunea nu se mai citește aici. Un singur `auth.getUser()` în layout
  // citea cookie-uri și forța Next.js să randeze la cerere fiecare pagină din
  // site, inclusiv cele de catalog care nu au nevoie de nimic personal.
  // Detecția utilizatorului s-a mutat în SessionProviders, în browser.
  return (
    <html lang="ro">
      <body className={`${outfit.variable}`}>
        <GoogleAnalytics />
        <ScrollToTop />
        <SessionProviders>
          <Header />
          {children}
          <Footer />
          <BackToTopButton />
        </SessionProviders>
      </body>
    </html>
  );
}
