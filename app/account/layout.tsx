'use client';

import SidebarClient from './SidebarClient';
import styles from './Account.module.css';
import { useUtilizatorCurent } from './useUtilizatorCurent';

/**
 * Poarta de acces în zona de cont.
 *
 * Verifica înainte sesiunea pe server și apela `redirect('/login')`. Ambele cer
 * un server Node, deci verificarea s-a mutat în browser.
 *
 * Cât timp sesiunea nu e cunoscută, se afișează aceeași structură de pagină cu
 * zona de conținut goală. Astfel bara laterală și grila apar exact în aceleași
 * poziții, iar la sosirea datelor nu sare nimic pe ecran.
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, seIncarca } = useUtilizatorCurent();

  return (
    <div className={styles.pageBackground}>
      <div className={styles.accountWrapper}>

        <div className={styles.accountGrid}>
          <SidebarClient />

          <main className={styles.contentArea}>
            {seIncarca || !user ? null : children}
          </main>
        </div>
      </div>
    </div>
  );
}
