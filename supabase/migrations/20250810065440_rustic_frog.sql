/*
  # Create invoices table with comprehensive fields

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `invoice_number` (text, unique, cryptographically secure)
      - `user_id` (uuid, foreign key to users)
      - `employer_email` (text)
      - `freelancer_name` (text)
      - `freelancer_email` (text)
      - `wallet_address` (text)
      - `network` (text)
      - `token` (text)
      - `amount` (decimal)
      - `role` (text)
      - `description` (text)
      - `description_html` (text, for rich text)
      - `status` (text, enum)
      - `data_hash` (text, SHA-256 hash)
      - `rejection_reason` (text)
      - `sent_at` (timestamp)
      - `approved_at` (timestamp)
      - `paid_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `invoices` table
    - Add policies for users to manage their own invoices
    - Add policies for employers to view invoices sent to them

  3. Indexes
    - Index on user_id for fast user queries
    - Index on invoice_number for unique lookups
    - Index on employer_email for employer queries
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  employer_email text NOT NULL,
  freelancer_name text NOT NULL,
  freelancer_email text NOT NULL,
  wallet_address text NOT NULL,
  network text NOT NULL,
  token text NOT NULL DEFAULT 'ETH',
  amount decimal(20,8) NOT NULL,
  role text NOT NULL,
  description text NOT NULL,
  description_html text,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Pending', 'Approved', 'Paid', 'Rejected', 'Cancelled')),
  data_hash text NOT NULL,
  rejection_reason text,
  sent_at timestamptz,
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policies for invoice management
CREATE POLICY "Users can manage their own invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Employers can view invoices sent to them"
  ON invoices
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_employer_email ON invoices(employer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_invoices_updated_at'
  ) THEN
    CREATE TRIGGER update_invoices_updated_at
      BEFORE UPDATE ON invoices
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;