-- ==============================================================================
-- FIX AUTH & PROFILES SYNC
-- Descrição: Corrige a tabela profiles, recria triggers e sincroniza usuários órfãos
-- ==============================================================================

-- 1. Garantir que a tabela profiles existe e tem a estrutura correta
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  role text default 'COMERCIAL',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar RLS (Segurança)
alter table public.profiles enable row level security;

-- 3. Políticas de Acesso (Permitir que o sistema e usuários acessem seus dados)
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" on profiles for select using ( true );

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile" on profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using ( auth.uid() = id );

-- 4. Função de Gatilho (Trigger) Robusta
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'COMERCIAL')
  )
  on conflict (id) do update
  set 
    email = excluded.email,
    name = excluded.name,
    role = coalesce(excluded.role, profiles.role); -- Mantém role existente se não vier novo
  return new;
end;
$$;

-- 5. Recriar o Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. SINCRONIZAÇÃO DE EMERGÊNCIA (Recupera usuários que estão no Auth mas sem Perfil)
insert into public.profiles (id, email, name, role)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  'ADMIN' -- Força ADMIN para usuários recuperados agora
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;

-- 7. Forçar seu usuário específico para ADMIN (caso já exista)
update public.profiles
set role = 'ADMIN'
where email = 'obedysweb@gmail.com';
