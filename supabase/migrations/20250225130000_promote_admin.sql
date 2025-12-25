/*
  # Promote User to Admin
  Promotes the user 'obedysweb@gmail.com' to ADMIN role.

  ## Metadata:
  - Schema-Category: "Data"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true
*/

-- Atualiza a role do usuário para ADMIN na tabela de perfis
UPDATE public.profiles
SET role = 'ADMIN'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'obedysweb@gmail.com'
);

-- Garante que o usuário exista na tabela de profiles (caso o trigger tenha falhado ou atrasado)
INSERT INTO public.profiles (id, name, email, role)
SELECT id, 'obedys', email, 'ADMIN'
FROM auth.users
WHERE email = 'obedysweb@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN';
