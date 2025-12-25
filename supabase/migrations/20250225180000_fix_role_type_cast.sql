/*
# Fix Role Type Casting
This migration fixes the error "column role is of type user_role but expression is of type text".
It updates the handle_new_user trigger function to explicitly cast the text input to the user_role enum type.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true
*/

-- 1. Ensure the type exists (just in case, though the error implies it does)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('GESTOR', 'COMERCIAL', 'LOGISTICA', 'ADMIN');
    END IF;
END$$;

-- 2. Update the Trigger Function with correct casting
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    -- CRITICAL FIX: Cast the text value to the enum type
    (COALESCE(new.raw_user_meta_data->>'role', 'COMERCIAL'))::public.user_role
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    -- Also update role if it changes in metadata, ensuring cast
    role = (COALESCE(new.raw_user_meta_data->>'role', profiles.role::text))::public.user_role;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Force Sync for existing users (Fixing the orphaned user issue)
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  email,
  -- Fix casting here too for the bulk insert
  (COALESCE(raw_user_meta_data->>'role', 'COMERCIAL'))::public.user_role
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
    role = EXCLUDED.role;

-- 4. Specifically ensure the admin user has the correct role
UPDATE public.profiles
SET role = 'ADMIN'::public.user_role
WHERE email = 'obedysweb@gmail.com';
