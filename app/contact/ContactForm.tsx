'use client';

import React, { useState, useEffect, useRef } from 'react';
import authStyles from '../auth/Auth.module.css';
import { submitContactMessage } from './actions';

export default function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({
    type: null,
    message: ''
  });
  
  const subjectOptions = [
    'Suport Comandă',
    'Întrebare Medicală / Suplimente',
    'Colaborare B2B / Distribuție',
    'Altele'
  ];
  
  const [subject, setSubject] = useState(subjectOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setStatus({ type: null, message: '' });

    const formData = new FormData(e.currentTarget);
    const result = await submitContactMessage(formData);

    if (result.success) {
      setStatus({ type: 'success', message: 'Mesajul tău a fost trimis cu succes! Te vom contacta în scurt timp.' });
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus({ type: 'error', message: result.error || 'A apărut o eroare.' });
    }
    
    setIsPending(false);
  }

  return (
    <form className={authStyles.classicForm} onSubmit={handleSubmit}>
      <div className={authStyles.formSection}>
        <h2>Trimite un mesaj</h2>
        
        {status.type === 'success' && (
          <div style={{ backgroundColor: '#e6f4ea', color: '#1e4620', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.95rem' }}>
            {status.message}
          </div>
        )}

        {status.type === 'error' && (
          <div className={authStyles.errorAlert}>
            {status.message}
          </div>
        )}

        <div className={authStyles.formGroup}>
          <label htmlFor="name">Nume complet <span>*</span></label>
          <input type="text" id="name" name="name" required disabled={isPending} />
        </div>

        <div className={authStyles.formGroup}>
          <label htmlFor="email">E-mail <span>*</span></label>
          <input type="email" id="email" name="email" required disabled={isPending} />
        </div>

        <div className={authStyles.formGroup} style={{ position: 'relative' }} ref={dropdownRef}>
          <label>Subiect <span>*</span></label>
          
          <input type="hidden" name="subject" value={subject} />
          
          <div 
            onClick={() => !isPending && setIsDropdownOpen(!isDropdownOpen)}
            style={{ 
              width: '100%', 
              padding: '12px 14px', 
              border: `1px solid ${isDropdownOpen ? 'var(--color-primary)' : '#ccc'}`, 
              borderRadius: '4px', 
              backgroundColor: '#fff', 
              fontSize: '1rem',
              cursor: isPending ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#333',
              boxShadow: isDropdownOpen ? '0 0 0 4px rgba(39, 79, 56, 0.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {subject}
            <svg 
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginTop: '4px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              zIndex: 10,
              overflow: 'hidden'
            }}>
              {subjectOptions.map(option => (
                <div 
                  key={option}
                  onClick={() => {
                    setSubject(option);
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    padding: '12px 14px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: subject === option ? '#f4f8f1' : '#fff',
                    color: subject === option ? 'var(--color-primary-dark)' : '#333',
                    fontWeight: subject === option ? '600' : '400',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#e8f3e5';
                    e.currentTarget.style.color = 'var(--color-primary-dark)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = subject === option ? '#f4f8f1' : '#fff';
                    e.currentTarget.style.color = subject === option ? 'var(--color-primary-dark)' : '#333';
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={authStyles.formGroup}>
          <label htmlFor="message">Mesaj <span>*</span></label>
          <textarea id="message" name="message" required disabled={isPending} style={{ width: '100%', padding: '12px 14px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '150px', fontFamily: 'inherit' }}></textarea>
        </div>

        <div className={authStyles.formActions}>
          <button type="submit" className={authStyles.submitBtn} disabled={isPending} style={{ width: '100%' }}>
            {isPending ? 'Se trimite...' : 'Trimite mesaj'}
          </button>
        </div>
      </div>
    </form>
  );
}
