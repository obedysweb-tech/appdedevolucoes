/*
  # Audit Logs & User Management

  ## Query Description:
  Creates a table to track validation actions (approvals/rejections) for audit purposes.
  Also ensures the profiles table has the correct policies for Admin management.

  ## Metadata:
  - Schema-Category: "Safe"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - New Table: validation_logs
  - Foreign Keys: return_id (returns), user_id (profiles)
*/

-- Create Validation Logs table
CREATE TABLE IF NOT EXISTS public.validation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id uuid REFERENCES public.returns(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id),
  action text NOT NULL, -- 'APPROVED' | 'REJECTED'
  previous_status text,
  new_status text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.validation_logs ENABLE ROW LEVEL SECURITY;

-- Policies for validation_logs
CREATE POLICY "Admins and Managers can view logs"
  ON public.validation_logs
  FOR SELECT
  USING (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role IN ('ADMIN', 'GESTOR')
    )
  );

CREATE POLICY "Users can insert logs"
  ON public.validation_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update Profiles policies to allow Admins to update other users (Role/Name)
CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'ADMIN'
    )
  );

-- Ensure the new user is ADMIN (Trigger might have set it to COMERCIAL)
UPDATE public.profiles
SET role = 'ADMIN'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'obedysweb@gmail.com'
);
