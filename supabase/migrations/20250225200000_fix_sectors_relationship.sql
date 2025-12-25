-- 1. Criar a tabela de setores se não existir
CREATE TABLE IF NOT EXISTS public.sectors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar Segurança (RLS)
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;

-- 3. Criar Política de Leitura (Permitir que todos leiam os setores para filtros)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.sectors;
CREATE POLICY "Enable read access for all users" ON public.sectors
    FOR SELECT USING (true);

-- 4. Adicionar a coluna 'sector_id' na tabela 'returns' para criar o relacionamento
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'returns' AND column_name = 'sector_id') THEN
        ALTER TABLE public.returns 
        ADD COLUMN sector_id UUID REFERENCES public.sectors(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 5. Popular com os setores da DOCE MEL
INSERT INTO public.sectors (name) VALUES 
    ('Vendas'),
    ('Qualidade'),
    ('Logistica'),
    ('Compras'),
    ('Exportacoes'),
    ('Central Administrativa'),
    ('Cliente')
ON CONFLICT (name) DO NOTHING;

-- 6. Garantir que a tabela return_reasons também exista e tenha relacionamento (Prevenção)
CREATE TABLE IF NOT EXISTS public.return_reasons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sector_id UUID REFERENCES public.sectors(id),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.return_reasons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.return_reasons;
CREATE POLICY "Enable read access for all users" ON public.return_reasons FOR SELECT USING (true);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'returns' AND column_name = 'reason_id') THEN
        ALTER TABLE public.returns 
        ADD COLUMN reason_id UUID REFERENCES public.return_reasons(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 7. Forçar atualização do cache do esquema no Supabase
NOTIFY pgrst, 'reload config';
