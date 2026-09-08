-- Creăm tabelul contact_messages pentru a salva mesajele trimise din formular
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activăm RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Permitem inserarea mesajelor de către oricine (public)
CREATE POLICY "Anyone can insert a contact message." 
ON contact_messages FOR INSERT 
WITH CHECK (true);

-- Doar tu poți citi mesajele (policy-ul by default de deny all la select dacă nu ești admin / service role acoperă asta)
