"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Account.module.css';
import { logout } from '@/app/auth/actions';

const MENU_ITEMS = [
  { label: 'Tablou de bord', href: '/account' },
  { label: 'Informații cont', href: '/account/informatii' },
  { label: 'Agenda de adrese', href: '/account/adrese' },
  { label: 'Comenzile mele', href: '/account/comenzi' },
  { label: 'Produse favorite', href: '/account/favorite' },
  { label: 'Metode de plată memorate', href: '/account/plata' },
  { label: 'Recenziile mele', href: '/account/recenzii' },
  { label: 'Abonare la newsletter', href: '/account/newsletter' },
  { label: 'Informații medicale', href: '/account/medical' },
  { label: 'Facturi', href: '/account/facturi' },
];

export default function SidebarClient() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Contul meu</h2>
      
      <nav className={styles.sidebarMenu}>
        {MENU_ITEMS.map((item) => {
          // Exact match for the dashboard, otherwise starts-with match for sub-pages if we had deep nesting (but exact is better here)
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={isActive ? styles.menuLinkActive : styles.menuLink}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarDivider}></div>

      <nav className={styles.sidebarMenu}>
        <button onClick={() => logout()} className={styles.logoutLink} style={{ textAlign: 'left', width: '100%', cursor: 'pointer', border: 'none' }}>
          Deconectare
        </button>
      </nav>
    </aside>
  );
}
