-- Adicionar colunas finalizada_por e data_finalizacao na tabela devolucoes
ALTER TABLE public.devolucoes
ADD COLUMN IF NOT EXISTS finalizada_por TEXT,
ADD COLUMN IF NOT EXISTS data_finalizacao TIMESTAMP WITH TIME ZONE;

-- Comentários nas colunas
COMMENT ON COLUMN public.devolucoes.finalizada_por IS 'Nome do usuário que finalizou a nota (LANÇADA ou ANULADA/CANCELADA)';
COMMENT ON COLUMN public.devolucoes.data_finalizacao IS 'Data e hora da finalização da nota (LANÇADA ou ANULADA/CANCELADA)';

