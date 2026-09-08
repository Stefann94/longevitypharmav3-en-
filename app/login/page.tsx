'use client'

import styles from '../auth/Auth.module.css'
import { useState, useTransition } from 'react'
import { login } from '../auth/actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <main className={`${styles.pageWrapper} ${styles.loginPageWrapper}`}>
      <div className={styles.loginContainer}>
        <h1 className={styles.pageTitle}>Sign in to your account</h1>
        
        <form action={handleSubmit} className={styles.classicForm}>
          <div className={styles.formSection}>
            <h2>Sign-in details</h2>
            
            {error && (
              <div className={styles.errorAlert}>
                {error}
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail <span>*</span></label>
              <input type="email" id="email" name="email" required disabled={isPending} />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password <span>*</span></label>
              <input type="password" id="password" name="password" required disabled={isPending} />
            </div>
            
            <div className={styles.formActions}>
              <a href="/signup" className={styles.backLink}>Create a new account</a>
              <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
