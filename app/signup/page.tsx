'use client'

import styles from '../auth/Auth.module.css'
import { useState, useTransition } from 'react'
import { signup } from '../auth/actions'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    setError(null)
    
    // Quick client-side validation
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    
    if (password !== confirmPassword) {
      setError('Parolele nu coincid.')
      return
    }

    startTransition(async () => {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <main className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>Create a new account</h1>
      
      {error && (
        <div className={styles.errorAlert} style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form action={handleSubmit} className={styles.classicForm}>
        <div className={styles.formColumns}>
          
          <div className={styles.formSection}>
            <h2>Personal details</h2>

            <div className={styles.formGroup}>
              <label htmlFor="firstName">First name <span>*</span></label>
              <input type="text" id="firstName" name="firstName" required disabled={isPending} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last name <span>*</span></label>
              <input type="text" id="lastName" name="lastName" required disabled={isPending} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone number</label>
              <input type="tel" id="phone" name="phone" disabled={isPending} />
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Sign-in details</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail <span>*</span></label>
              <input type="email" id="email" name="email" required disabled={isPending} />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password <span>*</span></label>
              <input type="password" id="password" name="password" required disabled={isPending} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm password <span>*</span></label>
              <input type="password" id="confirmPassword" name="confirmPassword" required disabled={isPending} />
            </div>
          </div>
          
        </div>
        
        <div className={styles.formActions}>
          <a href="/login" className={styles.backLink}>Back</a>
          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? 'Creating your account…' : 'Create account'}
          </button>
        </div>
      </form>
    </main>
  );
}
