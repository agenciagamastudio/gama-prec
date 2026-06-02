-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Fixed Costs Table
CREATE TABLE fixed_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE fixed_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own fixed costs"
  ON fixed_costs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fixed costs"
  ON fixed_costs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fixed costs"
  ON fixed_costs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fixed costs"
  ON fixed_costs FOR DELETE
  USING (auth.uid() = user_id);

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  sku TEXT,
  cost_price NUMERIC NOT NULL,
  desired_margin NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Variable Costs Table
CREATE TABLE variable_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percent', 'fixed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE variable_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view variable costs for their products"
  ON variable_costs FOR SELECT
  USING (product_id IN (SELECT id FROM products WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert variable costs for their products"
  ON variable_costs FOR INSERT
  WITH CHECK (product_id IN (SELECT id FROM products WHERE user_id = auth.uid()));

CREATE POLICY "Users can update variable costs for their products"
  ON variable_costs FOR UPDATE
  USING (product_id IN (SELECT id FROM products WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete variable costs for their products"
  ON variable_costs FOR DELETE
  USING (product_id IN (SELECT id FROM products WHERE user_id = auth.uid()));
