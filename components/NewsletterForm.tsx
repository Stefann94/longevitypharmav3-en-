'use client';

import React, { useState } from 'react';
import styles from './Footer.module.css';
import { subscribeToNewsletter } from '@/app/newsletter/actions';

export default function NewsletterForm() {
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const result = await subscribeToNewsletter(formData);

    if (result.error) {
      setStatus({ type: 'err', text: result.error });
    } else if (result.alreadySubscribed) {
      setStatus({ type: 'ok', text: 'Ești deja abonat/ă. Îți mulțumim!' });
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus({ type: 'ok', text: 'Te-ai abonat cu succes. Îți mulțumim!' });
      (e.target as HTMLFormElement).reset();
    }

    setIsPending(false);
  }

  return (
    <>
      <form className={styles.newsInputForm} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Adresa ta de email"
          className={styles.newsInput}
          required
          disabled={isPending}
          aria-label="Adresa ta de email"
        />
        <button className={styles.newsBtn} type="submit" disabled={isPending} aria-label="Abonează-te">
          {isPending ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          )}
        </button>
      </form>

      {status && (
        <p className={status.type === 'ok' ? styles.newsMsgOk : styles.newsMsgErr}>
          {status.text}
        </p>
      )}
    </>
  );
}
