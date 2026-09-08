'use client';

import React, { useState } from 'react';
import styles from '../Account.module.css';
import { updateProfile } from '../actions';

type ProfileFormProps = {
  initialData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
};

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Local state for optimistic updates / form control
  const [formData, setFormData] = useState({
    first_name: initialData.first_name,
    last_name: initialData.last_name,
    phone: initialData.phone,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAction = async (data: FormData) => {
    setLoading(true);
    setError('');
    
    const result = await updateProfile(data);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setIsEditing(false); // Switch back to view mode on success
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

  return (
    <div className={styles.premiumCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div className={styles.cardHeader} style={{ marginBottom: 0 }}>Date Personale</div>
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
            Edit details
          </button>
        )}
      </div>

      <p className={styles.cardContent} style={{ marginBottom: '30px' }}>
        {isEditing
          ? "Update your personal details below."
          : "Manage the personal details used to fill in your information quickly at checkout."}
      </p>

      {error && <div style={{ color: '#e53935', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

      <form action={handleAction} style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>First name</label>
            <input
              type="text"
              name="first_name"
              placeholder="e.g. Stefan"
              style={inputStyle}
              value={formData.first_name}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Last name</label>
            <input
              type="text"
              name="last_name"
              placeholder="e.g. Cozma"
              style={inputStyle} 
              value={formData.last_name}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Email</label>
          <input 
            type="email" 
            value={initialData.email} 
            readOnly
            style={{ ...inputStyle, cursor: 'not-allowed', backgroundColor: '#f5f5f5' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Phone number</label>
          <input 
            type="tel" 
            name="phone"
            placeholder="07xx xxx xxx" 
            style={inputStyle} 
            value={formData.phone}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>

        {isEditing && (
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button type="submit" className={styles.actionLink} disabled={loading}>
              {loading ? 'Saving…' : 'Save changes'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsEditing(false);
                // Reset form to initial data
                setFormData({
                  first_name: initialData.first_name,
                  last_name: initialData.last_name,
                  phone: initialData.phone,
                });
                setError('');
              }} 
              style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', color: '#666', fontWeight: 500 }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
