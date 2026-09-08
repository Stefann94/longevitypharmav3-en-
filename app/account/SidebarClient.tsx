"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Account.module.css';
import { logout } from '@/app/auth/actions';

const MENU_ITEMS = [
  { label: 'Dashboard', href: '/account' },
  { label: 'Account details', href: '/account/details' },
  { label: 'Address book', href: '/account/addresses' },
  { label: 'My orders', href: '/account/orders' },
  { label: 'Favorite products', href: '/account/favorites' },
  { label: 'Saved payment methods', href: '/account/payment' },
  { label: 'My reviews', href: '/account/reviews' },
  { label: 'Newsletter subscription', href: '/account/newsletter' },
  { label: 'Medical details', href: '/account/medical' },
  { label: 'Invoices', href: '/account/invoices' },
];

export default function SidebarClient() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>My Account</h2>
      
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
          Sign out
        </button>
      </nav>
    </aside>
  );
}
