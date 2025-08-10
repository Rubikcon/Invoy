/*
  # User Profiles, Wallet Authentication, and Preferences

  1. New Tables
    - `user_profiles` - Extended user profile information
    - `user_wallets` - User wallet addresses with verification status
    - `user_preferences` - User settings and preferences
    - `wallet_auth_challenges` - Wallet signature challenges for authentication

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data
    - Wallet verification tracking

  3. Features
    - Wallet address storage with consent tracking
    - Signature verification for wallet authentication
    - User preferences for networks and notifications
    - Profile management with avatar and bio
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  bio text DEFAULT '',
  location text DEFAULT '',
  website text DEFAULT '',
  timezone text DEFAULT 'UTC',
  profile_visibility text DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'contacts')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- User Wallets Table
CREATE TABLE IF NOT EXISTS user_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  network text NOT NULL DEFAULT 'ethereum',
  is_primary boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  consent_given boolean DEFAULT false,
  consent_date timestamptz,
  verification_signature text,
  verification_message text,
  verification_date timestamptz,
  label text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, wallet_address, network)
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  preferred_network text DEFAULT 'ethereum',
  preferred_currency text DEFAULT 'ETH',
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  invoice_notifications boolean DEFAULT true,
  payment_notifications boolean DEFAULT true,
  marketing_emails boolean DEFAULT false,
  security_alerts boolean DEFAULT true,
  theme text DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  date_format text DEFAULT 'MM/DD/YYYY',
  currency_display text DEFAULT 'symbol' CHECK (currency_display IN ('symbol', 'code', 'name')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Wallet Authentication Challenges Table
CREATE TABLE IF NOT EXISTS wallet_auth_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  challenge_message text NOT NULL,
  nonce text NOT NULL,
  expires_at timestamptz NOT NULL,
  is_used boolean DEFAULT false,
  used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  INDEX(wallet_address),
  INDEX(nonce),
  INDEX(expires_at)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_auth_challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_wallets
CREATE POLICY "Users can read own wallets"
  ON user_wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wallets"
  ON user_wallets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for wallet_auth_challenges
CREATE POLICY "Anyone can read unexpired challenges"
  ON wallet_auth_challenges
  FOR SELECT
  TO anon, authenticated
  USING (expires_at > now() AND NOT is_used);

CREATE POLICY "Anyone can create challenges"
  ON wallet_auth_challenges
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update challenges"
  ON wallet_auth_challenges
  FOR UPDATE
  TO anon, authenticated
  USING (expires_at > now());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wallets_address ON user_wallets(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_challenges_address ON wallet_auth_challenges(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_challenges_nonce ON wallet_auth_challenges(nonce);
CREATE INDEX IF NOT EXISTS idx_wallet_challenges_expires ON wallet_auth_challenges(expires_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_wallets_updated_at
  BEFORE UPDATE ON user_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();