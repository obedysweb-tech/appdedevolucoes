-- 1. Garantir que a tabela profiles existe e tem as permissões corretas
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  email text,
  role text DEFAULT 'COMERCIAL',
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS (Segurança) mas criar políticas permissivas para corrigir o problema
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Criar políticas novas e abertas (para garantir que funcione)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Recriar a função e o trigger de criação automática de usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'COMERCIAL')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    name = EXCLUDED.name,
    email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir que o trigger está limpo antes de criar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. [CRÍTICO] Forçar a criação de perfil para usuários que já existem no Auth mas não no Profiles
-- Isso pega todos os usuários da tabela auth.users e insere na profiles se não existir
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'name', email), 
  email, 
  COALESCE(raw_user_meta_data->>'role', 'COMERCIAL')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 5. Garantir que o seu usuário específico seja ADMIN
UPDATE public.profiles
SET role = 'ADMIN'
WHERE email = 'obedysweb@gmail.com';
