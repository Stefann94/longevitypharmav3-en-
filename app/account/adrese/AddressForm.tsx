'use client';

import React, { useState } from 'react';
import styles from '../Account.module.css';
import { updateAddress } from '../actions';

interface AddressData {
  street?: string;
  city?: string;
  postal_code?: string;
  county?: string;
};

type AddressFormProps = {
  type: 'shipping' | 'billing';
  title: string;
  description: string;
  initialData?: AddressData;
};

export default function AddressForm({ type, title, description, initialData }: AddressFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    street: initialData?.street || '',
    city: initialData?.city || '',
    zip: initialData?.postal_code || '',
    county: initialData?.county || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAction = async (data: FormData) => {
    setLoading(true);
    setError('');
    
    // Add type to formData before submitting
    data.append('type', type);

    const result = await updateAddress(data);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: isEditing ? '#fff' : '#f9f9f9',
    color: isEditing ? '#333' : '#666',
    transition: 'all 0.3s ease',
    cursor: isEditing ? 'text' : 'default'
  };

  const hasData = !!initialData?.street;

  return (
    <div className={styles.premiumCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div className={styles.cardHeader} style={{ marginBottom: 0 }}>{title}</div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            style={{ 
              color: '#fff', 
              fontWeight: 600, 
              border: 'none', 
              background: 'var(--color-primary)', 
              cursor: 'pointer', 
              fontSize: '0.9rem',
              padding: '10px 20px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(39, 79, 56, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {hasData ? 'Editează adresa' : 'Adaugă adresa'}
          </button>
        )}
      </div>
      
      {!isEditing && !hasData && (
        <p className={styles.cardContent} style={{ flexGrow: 1 }}>
          {description}
        </p>
      )}

      {(isEditing || hasData) && (
        <form action={handleAction} style={{ display: 'grid', gap: '20px', maxWidth: '600px', marginTop: '20px' }}>
          {error && <div style={{ color: '#e53935', fontSize: '0.9rem' }}>{error}</div>}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Stradă și Număr</label>
            <input 
              type="text" 
              name="street"
              placeholder="Ex: Str. Florilor, Nr. 10, Ap. 4" 
              style={inputStyle}
              value={formData.street}
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Oraș</label>
              <input 
                type="text" 
                name="city"
                placeholder="Ex: București" 
                style={inputStyle} 
                value={formData.city}
                onChange={handleChange}
                readOnly={!isEditing}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Județ</label>
              <input 
                type="text" 
                name="county"
                placeholder="Ex: Ilfov" 
                style={inputStyle} 
                value={formData.county}
                onChange={handleChange}
                readOnly={!isEditing}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Cod Poștal</label>
            <input 
              type="text" 
              name="zip"
              placeholder="Ex: 012345" 
              style={inputStyle} 
              value={formData.zip}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button type="submit" className={styles.actionLink} disabled={loading}>
                {loading ? 'Se salvează...' : 'Salvează adresa'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    street: initialData?.street || '',
                    city: initialData?.city || '',
                    zip: initialData?.postal_code || '',
                    county: initialData?.county || '',
                  });
                  setError('');
                }} 
                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', color: '#666', fontWeight: 500 }}
              >
                Anulează
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
