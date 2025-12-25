-- 1. Garantir que o tipo ENUM existe
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('GESTOR', 'COMERCIAL', 'LOGISTICA', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Recriar a função do Trigger com conversão de tipo SEGURA
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário'),
    -- Conversão explícita e segura para o ENUM
    COALESCE(
      (new.raw_user_meta_data->>'role')::public.user_role, 
      'COMERCIAL'::public.user_role
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar o Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. RECUPERAÇÃO DE EMERGÊNCIA
-- Se o usuário já existe no Auth mas não no Profile, cria agora como ADMIN
INSERT INTO public.profiles (id, email, name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', 'Admin Recuperado'), 
  'ADMIN'::public.user_role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT DO NOTHING;
