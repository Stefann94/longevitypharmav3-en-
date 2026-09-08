'use client';

import React, { useState } from 'react';
import { toggleNewsletter } from '../actions';

export default function NewsletterSwitch({ initialSubscribed }: { initialSubscribed: boolean }) {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newState = !isSubscribed;
    // Optimistic UI update
    setIsSubscribed(newState);
    
    const result = await toggleNewsletter(newState);
    if (result?.error) {
      // Revert if error
      setIsSubscribed(!newState);
      alert('Eroare: ' + result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', backgroundColor: '#f9faf9', borderRadius: '12px', border: '1px solid #eaeaea' }}>
      <div>
        <div style={{ fontWeight: 500, color: 'var(--color-primary)', marginBottom: '4px' }}>Newsletter LongevityPharma</div>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          {isSubscribed ? 'Ești abonat! Vei primi oferte exclusive pe email.' : 'Nu ești abonat. Activează pentru a primi informații pe email.'}
        </div>
      </div>
      
      <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
        <input 
          type="checkbox" 
          checked={isSubscribed}
          onChange={handleToggle}
          disabled={loading}
          style={{ opacity: 0, width: 0, height: 0 }} 
        />
        <span style={{ 
          position: 'absolute', cursor: loading ? 'not-allowed' : 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: isSubscribed ? 'var(--color-primary)' : '#ccc', 
          transition: '.4s', borderRadius: '34px' 
        }}>
          <span style={{ 
            position: 'absolute', content: '""', height: '20px', width: '20px', left: '4px', bottom: '4px', 
            backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
            transform: isSubscribed ? 'translateX(22px)' : 'translateX(0)'
          }}></span>
        </span>
      </label>
    </div>
  );
}
