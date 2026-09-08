'use client';

import React, { useState } from 'react';
import styles from '../Account.module.css';
import { updateMedicalProfile } from '../actions';

type MedicalFormProps = {
  initialData: {
    allergies: string;
    current_treatments: string;
  };
};

export default function MedicalForm({ initialData }: MedicalFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    allergies: initialData.allergies,
    current_treatments: initialData.current_treatments,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAction = async (data: FormData) => {
    setLoading(true);
    setError('');
    
    const result = await updateMedicalProfile(data);
    
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
    resize: 'vertical' as const,
    backgroundColor: isEditing ? '#fff' : '#f9f9f9',
    color: isEditing ? '#333' : '#666',
    transition: 'all 0.3s ease',
    cursor: isEditing ? 'text' : 'default'
  };

  return (
    <div className={styles.premiumCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div className={styles.cardHeader} style={{ marginBottom: 0 }}>Profil de sănătate și alergii</div>
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
            Editează informațiile
          </button>
        )}
      </div>
      
      <p className={styles.cardContent} style={{ marginBottom: '30px' }}>
        {isEditing 
          ? "Actualizează profilul tău medical mai jos." 
          : "Aceste informații ne ajută să ne asigurăm că suplimentele recomandate sunt 100% sigure pentru tine."}
      </p>

      {error && <div style={{ color: '#e53935', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

      <form action={handleAction} style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Alergii cunoscute (ex: gluten, soia, nuci)</label>
          <textarea 
            rows={3} 
            name="allergies"
            placeholder={isEditing ? "Enumeră alergiile tale aici..." : "Nu ai specificat alergii"} 
            style={inputStyle}
            value={formData.allergies}
            onChange={handleChange}
            readOnly={!isEditing}
          ></textarea>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Tratamente curente (interacțiuni posibile)</label>
          <textarea 
            rows={3} 
            name="current_treatments"
            placeholder={isEditing ? "Ex: medicamente pentru tensiune..." : "Nu ai specificat tratamente"} 
            style={inputStyle}
            value={formData.current_treatments}
            onChange={handleChange}
            readOnly={!isEditing}
          ></textarea>
        </div>

        {isEditing && (
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button type="submit" className={styles.actionLink} disabled={loading}>
              {loading ? 'Se salvează...' : 'Salvează profilul'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  allergies: initialData.allergies,
                  current_treatments: initialData.current_treatments,
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
    </div>
  );
}
