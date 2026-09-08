"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Account.module.css';
import { logout } from '@/app/auth/actions';

// Etichetele sunt traduse, adresele raman cele romanesti: sunt cai de fisiere
// din exportul static, iar redenumirea lor ar insemna mutarea folderelor si
// actualizarea fiecarui link din site.
const MENU_ITEMS = [
  { label: 'Dashboard', href: '/account' },
  { label: 'Account details', href: '/account/informatii' },
  { label: 'Address book', href: '/account/adrese' },
  { label: 'My orders', href: '/account/comenzi' },
  { label: 'Favorite products', href: '/account/favorite' },
  { label: 'Saved payment methods', href: '/account/plata' },
  { label: 'My reviews', href: '/account/recenzii' },
  { label: 'Newsletter subscription', href: '/account/newsletter' },
  { label: 'Medical details', href: '/account/medical' },
  { label: 'Invoices', href: '/account/facturi' },
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
