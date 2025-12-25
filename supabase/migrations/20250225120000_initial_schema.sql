/*
  # Initial Schema for Returns Management System

  ## Query Description:
  Creates the complete database structure including:
  - Profiles (linked to auth.users)
  - Master Data (Sectors, Return Reasons)
  - Core Data (Returns, Return Items, Imports)
  - Triggers for automatic profile creation
  - RLS Policies (Basic setup)

  ## Metadata:
  - Schema-Category: Structural
  - Impact-Level: High
  - Requires-Backup: false
  - Reversible: true
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('GESTOR', 'COMERCIAL', 'LOGISTICA', 'ADMIN');
CREATE TYPE return_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- 1. Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role user_role DEFAULT 'COMERCIAL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Master Data: Sectors
CREATE TABLE public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Master Data: Return Reasons
CREATE TABLE public.return_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id UUID REFERENCES public.sectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(sector_id, name)
);

-- 4. Imports History
CREATE TABLE public.imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  status TEXT NOT NULL, -- 'SUCCESS', 'ERROR'
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  total_records INTEGER DEFAULT 0
);

-- 5. Returns (Main Table)
CREATE TABLE public.returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- NFe Data (Visible in App)
  nome_filial TEXT,
  nome_cliente TEXT,
  cidade_origem TEXT,
  uf_origem TEXT,
  data_emissao DATE,
  numero TEXT,
  valor_total_nota NUMERIC(15, 2),
  sincronizacao_erp TEXT,
  finalidade_nfe TEXT,
  dados_adicionais TEXT,
  
  -- NFe Data (Hidden in App, kept for DB)
  cnpj_destinatario TEXT,
  destinatario TEXT,
  cidade_destino TEXT,
  uf_destino TEXT,
  cnpj_emitente TEXT,
  nome_pj_emitente TEXT,
  chave_acesso TEXT,
  serie TEXT,
  peso_liquido NUMERIC(10, 3),
  tipo TEXT,
  status_nfe TEXT,
  nome_usuario_sync TEXT,
  data_sync TIMESTAMP WITH TIME ZONE,
  natureza_operacao TEXT,
  cfops TEXT,
  etiquetas TEXT,
  
  -- Process Data
  vendedor TEXT,
  motivo_id UUID REFERENCES public.return_reasons(id),
  justificativa TEXT,
  resultado TEXT,
  status return_status DEFAULT 'PENDING',
  
  -- Link to Import
  import_id UUID REFERENCES public.imports(id)
);

-- 6. Return Items
CREATE TABLE public.return_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id UUID REFERENCES public.returns(id) ON DELETE CASCADE,
  item_number TEXT,
  description TEXT,
  unit TEXT,
  quantity NUMERIC(10, 3),
  unit_value NUMERIC(15, 2),
  total_value NUMERIC(15, 2)
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imports ENABLE ROW LEVEL SECURITY;

-- Simple policies for now (Open for authenticated users, refine later based on Role)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Sectors viewable by auth users" ON public.sectors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Reasons viewable by auth users" ON public.return_reasons FOR SELECT TO authenticated USING (true);

CREATE POLICY "Returns viewable by auth users" ON public.returns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Returns insertable by auth users" ON public.returns FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Returns updatable by auth users" ON public.returns FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Items viewable by auth users" ON public.return_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Items insertable by auth users" ON public.return_items FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Imports viewable by auth users" ON public.imports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Imports insertable by auth users" ON public.imports FOR INSERT TO authenticated WITH CHECK (true);

-- Trigger for Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'COMERCIAL')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SEED DATA
INSERT INTO public.sectors (name) VALUES
('Vendas'),
('Qualidade'),
('Logistica'),
('Compras'),
('Exportacoes'),
('Central Administrativa'),
('Cliente');

-- Seed Reasons (Using DO block to look up IDs)
DO $$
DECLARE
  v_id uuid;
  q_id uuid;
  l_id uuid;
  c_id uuid;
  e_id uuid;
  ca_id uuid;
  cl_id uuid;
BEGIN
  SELECT id INTO v_id FROM public.sectors WHERE name = 'Vendas';
  SELECT id INTO q_id FROM public.sectors WHERE name = 'Qualidade';
  SELECT id INTO l_id FROM public.sectors WHERE name = 'Logistica';
  SELECT id INTO c_id FROM public.sectors WHERE name = 'Compras';
  SELECT id INTO e_id FROM public.sectors WHERE name = 'Exportacoes';
  SELECT id INTO ca_id FROM public.sectors WHERE name = 'Central Administrativa';
  SELECT id INTO cl_id FROM public.sectors WHERE name = 'Cliente';

  INSERT INTO public.return_reasons (sector_id, name) VALUES
  (v_id, 'Acordo Comercial'),
  (v_id, 'Devolucao Por Refaturamento Comercial'),
  (v_id, 'Avaria'),
  (v_id, 'Produto Em Desacordo Com O Pedido'),
  (v_id, 'Diferenca De Preco'),
  (v_id, 'Sem Devolutiva Comercial'),
  (v_id, 'Excesso Mercadoria'),
  (v_id, 'Mercadoria De Analise'),
  
  (q_id, 'Div. Padrao Qualidade'),
  (q_id, 'Falha Na Producao/Repasse: Selecao Incorreta Dos Frutos'),
  (q_id, 'Acordo De Qualidade'),
  
  (l_id, 'Falta Da Mercadoria'),
  (l_id, 'Falta De Peso'),
  (l_id, 'Falha Operacional'),
  (l_id, 'Devolucao Por Refaturamento Operacional'),
  (l_id, 'Atraso Na Entrega'),
  (l_id, 'Falha No Transporte'),
  (l_id, 'Sinistro'),
  (l_id, 'Erro De Separacao'),
  (l_id, 'Acordo Operacional'),
  
  (c_id, 'Compra Nao Conforme'),
  (c_id, 'Acordo De Compra'),
  
  (e_id, 'Devolucao Exportacao'),
  
  (ca_id, 'Devolucao Por Refaturamento Erro De Cadastro'),
  
  (cl_id, 'Devolucao Indevida');
END $$;
