-- Migração para importar clientes do CSV
-- Gerado automaticamente

BEGIN;

INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('01494179-4b8a-498b-a4ce-ecc3cdbd799a'::uuid, 'GBARBOSA LUZIA', '39.346.861/0451-81', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: R MINISTRO NELSON HUNGRIA 155 | Bairro: LUZIA | CEP: 49045-510 | Vendedor: VINICIUS | Loja: 73 | Região: Aracaju e regiao | Código: 82 | IE: 271491647', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('014bda1a-d235-4033-ab80-7f6d1be76327'::uuid, 'MATEUS VITORIA DA CONQUISTA', '03.995.515/0244-22', 'VITORIA DA CONQUISTA', 'BA', 'Mateus', 'Endereço: AV JURACY MAGALHAES 701 | Bairro: BOA VISTA | CEP: 45026-090 | Vendedor: RICARDO | Loja: 49 | Região: Conquista e regiao | Código: 2459 | IE: 189.370.255', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('01597b98-55ae-48a3-af61-948f657d4602'::uuid, 'ATAKAREJO ITACIMIRIM', '73.849.952/0031-73', 'CAMACARI', 'BA', 'Atakarejo', 'Endereço: ROD RODOVIA BA 099 DO COCO SN | Bairro: ITACIMIRIM (MONTE GORDO) | Complemento: KM 64 | CEP: 42840-660 | Vendedor: RICARDO | Loja: 16 | Região: Camacari e regiao | Código: 213 | IE: 180.419.133', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('0189f554-99aa-432c-ba5a-9480fc53c291'::uuid, 'ATAC LAURO FREITAS', '75.315.333/0052-59', 'LAURO DE FREITAS', 'BA', 'Atacadao', 'Endereço: AV SANTOS DUMONT SN | Bairro: LAURO DE FREITAS | CEP: 42700-000 | Vendedor: NIXON | Loja: 26 | Região: Lauro e regiao | Código: 2 | IE: 64111216', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('0381a7c5-f034-4e24-8e30-40a84708ecde'::uuid, 'GBARBOSA-151 - ILHEUS', '39.346.861/0211-69', 'ILHEUS', 'BA', 'Gbarbosa', 'Endereço: AV LOMANTO JUNIOR 786 | Bairro: CENTRO | CEP: 45654-000 | Vendedor: VINICIUS | Loja: 43 | Região: Ilheus e regiao | Código: 82 | IE: 12.808.263', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('054d9fa6-91e9-4b7c-a2ab-939033c2d1ac'::uuid, 'CARREFOUR ATRAS DA BANCA', '13.004.510/0256-88', 'PETROLINA', 'PE', 'Bompreco', 'Endereço: R SAO VICENTE DE PAULA 219 | Bairro: ATRAS DA BANCA | CEP: 56308-050 | Vendedor: VINICIUS | Loja: 42 | Região: Petrolina e regiao | Código: 4 | IE: 0141835-10', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('059b79b3-91de-4ec4-a5d5-083a415743a6'::uuid, 'ATAKAREJO - ESTANCIA ARACAJU', '73.849.952/0048-11', 'ESTANCIA', 'SE', 'Atakarejo', 'Endereço: AVENIDA RUBENS ALVES DA SILVA 1.132 | Bairro: SANTA CRUZ | CEP: 49200-000 | Vendedor: RICARDO | Loja: 47 | Região: Aracaju e regiao | Código: 213 | IE: 27.223.877-5', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('05a83e48-c382-4c2b-9805-e44f1f278ba3'::uuid, 'G. BARBOSA  CENTRO', '39.346.861/0034-20', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV COELHO E CAMPOS 215 | Bairro: CENTRO | CEP: 49010-720 | Vendedor: VINICIUS | Loja: 62 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.249-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('061df365-1bc7-4618-b678-184fe9008347'::uuid, 'ATAKAREJO CD VITORIA DA CONQUISTA', '73.849.952/0050-36', 'VITORIA DA CONQUISTA', 'BA', 'Atakarejo', 'Endereço: ROD BR 116 830 | Bairro: AYRTON SENNA | CEP: 45058-000 | Vendedor: RICARDO | Loja: 18 | Região: Conquista e regiao | Código: 213 | IE: 220.842.714', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('07a12c3e-6c2b-4355-ab42-4d01c0f93145'::uuid, 'ASSAI TOMBA', '06.057.223/0451-91', 'FEIRA DE SANTANA', 'BA', 'Assai', 'Endereço: AV EDUARDO FROES DA MOTA 2500 | Bairro: TOMBA | CEP: 44090-156 | Vendedor: NIXON | Loja: 75 | Região: Feira e regiao | Código: 1899 | IE: 178197353', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('07d427c5-25db-430b-9bac-008a52f5c673'::uuid, 'ASSAI AEROPORTO', '06.057.223/0404-75', 'ARACAJU', 'SE', 'Assai', 'Endereço: AV MELICIO MACHADO 240 | Bairro: AEROPORTO | Complemento: LOTE 01 | CEP: 49038-443 | Vendedor: NIXON | Loja: 43 | Região: Aracaju e regiao | Código: 1899 | IE: 27.166.581-5', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('09e6e042-648e-4288-8cc5-b85a9cb7bce0'::uuid, 'GRAL PANIFICACAO', '23.793.817/0001-60', 'SALVADOR', 'BA', 'Outros', 'Endereço: ALAMEDA PADUA N 126 | Bairro: PITUBA | CEP: 41830-480 | Vendedor: RICARDO | Loja: 1 | Região: Pituba e regiao | Código: 1824 | IE: 129254610', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('0ba766d1-76ff-466c-b621-544e23fcc030'::uuid, 'MIX MATEUS', '03.995.515/0335-02', 'FEIRA DE SANTANA', 'BA', 'Mateus', 'Endereço: AVENIDA EDUARDO FROES DA MOTA SN | Bairro: CASEB | CEP: 44052-151 | Vendedor: RICARDO | Loja: D6 | Região: Feira e regiao | Código: 2459 | IE: 223.300.361', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('0bba8c27-fdaa-4407-b19a-499a28e6ba56'::uuid, 'ATACADAO MATA ESCURA', '75.315.333/0342-75', 'SALVADOR', 'BA', 'Atacadao', 'Endereço: AV CARDEAL AVELAR BRANDAO VILLELA 000279 | Bairro: MATA ESCURA | CEP: 41219-600 | Vendedor: NIXON | Loja: 77 | Região: Vila Canaria e regiao | Código: 2 | IE: 207120099', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('0ce11907-cfde-49e0-bc9c-3786d9916e4b'::uuid, 'SERRANA  ITAIGARA', '02.212.937/0023-61', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R ANISIO TEIXEIRA 347 | Bairro: ITAIGARA | CEP: 41815-060 | Vendedor: RICARDO | Loja: 16 | Região: Pituba e regiao | Código: 2613 | IE: 147578585', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('0d7f9e29-8837-4483-82a4-7122ac6246e3'::uuid, 'ATAKAREJO AMARALINA', '73.849.952/0011-20', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: R JANIO QUADROS, 390 | Bairro: AMARALINA | CEP: 41900-340 | Vendedor: RICARDO | Loja: 8 | Região: Vasco e regiao | Código: 213 | IE: 134196754', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('0de180ab-a749-4715-a7b9-a59a64f5ef7f'::uuid, 'COM DE ALIMENTOS FLOR DA CHAPADA', '03.451.160/0001-45', 'ITABERABA', 'BA', 'Outros', 'Endereço: PC FLAVIO SILVANY 162 | Bairro: CENTRO | CEP: 46880-000 | Vendedor: RICARDO | Loja: 1 | Região: Itaberaba e regiao | Código: 4236 | IE: 52.529.593', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('10d359fe-a11c-415d-9d4a-00be65319c30'::uuid, 'CESTA DO POVO', '32.819.547/0001-00', 'SALVADOR', 'BA', 'Outros', 'Endereço: AV GENERAL GRACA LESSA  888 | Bairro: ACUPE DE BROTAS | CEP: 40290-110 | Vendedor: NIXON | Loja: 1 | Região: Brotas e regiao | Código: 2644 | IE: 155.765.209', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1156d4ba-7b9b-42a4-9e62-7bf5008b15f1'::uuid, 'ATACADAO CAMINHO DAS ARVORES', '75.315.333/0301-05', 'SALVADOR', 'BA', 'Atacadao', 'Endereço: AV TANCREDO NEVES 3413 | Bairro: CAMINHO DAS ARVORES | Complemento: LOJA | CEP: 41820-021 | Vendedor: NIXON | Loja: 73 | Região: Pituba e regiao | Código: 2 | IE: 174.476.636', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('11813e04-3d67-4ed2-8996-ce8a7c603606'::uuid, 'ATACADAO BROTAS', '75.315.333/0252-84', 'SALVADOR', 'BA', 'Atacadao', 'Endereço: AV MARIO LEAL FERREIRA 500 | Bairro: BROTAS | CEP: 40285-600 | Vendedor: NIXON | Loja: 72 | Região: Brotas e regiao | Código: 2 | IE: 163.465.702', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('11de019b-c885-4f5b-a399-108e775f9139'::uuid, 'FRUTOS DA TERRA', '05.370.733/0001-31', 'PETROLINA', 'PE', 'Outros', 'Endereço: R DR JULIO DE MELO , 538 | Bairro: CENTRO | CEP: 56302-150 | Vendedor: ANTONIO | Loja: 1 | Região: Petrolina e regiao | Código: 259 | IE: 29649536', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('11f87a20-c819-46ba-88b0-97f9164f8c67'::uuid, 'ASSAI INACIO BARBOSA', '06.057.223/0518-33', 'ARACAJU', 'SE', 'Assai', 'Endereço: AV ADELIA FRANCO 3736 | Bairro: INACIO BARBOSA | CEP: 49040-020 | Vendedor: NIXON | Loja: 65 | Região: Aracaju e regiao | Código: 1899 | IE: 27.182.055-1', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('12ac905b-2fe8-4bcb-947d-d190ebd4963c'::uuid, 'CARBALLO FARO - PITUBA', '12.765.924/0002-49', 'SALVADOR', 'BA', 'Carballo', 'Endereço: AV. PAULO VI   N1498 | Bairro: PITUBA | CEP: 41810-001 | Vendedor: RICARDO | Loja: 1 | Região: Pituba e regiao | Código: 1872 | IE: 126624748', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('12d8c651-e1fb-4048-a6c5-a076095acfad'::uuid, 'GBARBOSA-137-JUAZEIRO', '39.346.861/0197-76', 'JUAZEIRO', 'BA', 'Gbarbosa', 'Endereço: RUA PADRE ANCHIETA | Bairro: centro | CEP: 45998-002 | Vendedor: ANTONIO | Loja: 38 | Região: Petrolina e regiao | Código: 82 | IE: 19.675.174', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('14b85471-f153-4558-8c46-76b66f32d96a'::uuid, 'PERINI VASCO DA GAMA', '11.965.515/0003-04', 'SALVADOR', 'BA', 'Perini', 'Endereço: AVENIDA VASCO DA GAMA 3051 | Bairro: FEDERACAO | CEP: 40230-731 | Vendedor: VINICIUS | Loja: 3 | Região: Vasco e regiao | Código: 69 | IE: 88290698', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1704d814-f5ed-4b84-a9f0-66c713171f38'::uuid, 'SERRANA STELLA MARIS', '02.212.937/0017-13', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R CAPITAO MELO 1118 | Bairro: STELLA MARIS | CEP: 41600-610 | Vendedor: RICARDO | Loja: 5 | Região: Lauro e regiao | Código: 2613 | IE: 13638117', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('178ac022-6849-41c4-adc5-f8f2325b8572'::uuid, 'ASSAI LAURO DE FREITAS', '06.057.223/0324-56', 'LAURO DE FREITAS', 'BA', 'Assai', 'Endereço: AV SANTOS DUMONT 2239 | Bairro: ESTRADA DO COCO | CEP: 42700-130 | Vendedor: NIXON | Loja: 34 | Região: Lauro e regiao | Código: 1899 | IE: 133.122.260', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('17dde88f-23c6-4833-9f17-c6af316c0c06'::uuid, 'SERRANA GUARAJUBA (MONTE GORDO)', '02.212.937/0030-90', 'CAMACARI', 'BA', 'Hiperideal', 'Endereço: ROD BA 099 ESTRADA DO COCO KM 42 | Bairro: GUARAJUBA (MONTE GORDO) | Complemento: TERRENO | CEP: 42840-310 | Vendedor: RICARDO | Loja: 22 | Região: Camacari e regiao | Código: 2613 | IE: 168988933', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1813e8a0-b778-4347-8868-d5c6748170e5'::uuid, 'ECONOMART BARREIRAS', '28.548.486/0027-55', 'BARREIRAS', 'BA', 'Economart', 'Endereço: AVENIDA AHYLON MACEDO 745 | Bairro: MORADA NOBRE | CEP: 47810-035 | Vendedor: NIXON | Loja: 5 | Região: Barreiras e regiao | Código: 6049 | IE: 225.786.505', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('19e6199a-b44c-4dda-979a-589143585536'::uuid, 'RMIX HORTO', '06.337.087/0008-40', 'SALVADOR', 'BA', 'Redemix', 'Endereço: R WALDEMAR FALCAO 1017 | Bairro: HORTO FLORESTAL | CEP: 40285-885 | Vendedor: VINICIUS | Loja: 8 | Região: Vasco e regiao | Código: 186 | IE: 152.457.790', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1a0bbbc1-6707-41fd-ae1e-a31f94f6f503'::uuid, 'COAGELI LJ 2 CENTRO', '07.348.911/0002-34', 'LAURO DE FREITAS', 'BA', 'Redemix', 'Endereço: PC MARTINIANO MAIA. 93 | Bairro: CENTRO | CEP: 42702-720 | Vendedor: VINICIUS | Loja: 2 | Região: Lauro e regiao | Código: 208 | IE: 149362221', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1a5b20d0-7c4d-416e-a082-bf5e910d588c'::uuid, 'CBD - COSTA AZUL', '47.508.411/2588-38', 'SALVADOR', 'BA', 'Cdb', 'Endereço: R ARTHUR DE AZEVEDO MACHADO, S/N | Bairro: COSTA AZUL | Complemento: LOTE 60 61 62 | CEP: 41760-000 | Vendedor: RICARDO | Loja: 33 | Região: Pituba e regiao | Código: 11 | IE: 143288374', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1ba826ac-c33e-42f4-9b40-430962f55fd7'::uuid, 'MATEUS PETROLINA', '03.995.515/0232-99', 'PETROLINA', 'PE', 'Mateus', 'Endereço: R O SN | Bairro: DISTRITO INDUSTRIAL | Complemento: GLEBA 1 REMANESCENTE | CEP: 56310-770 | Vendedor: ANTONIO | Loja: 33 | Região: Petrolina e regiao | Código: 2459 | IE: 0981067-67', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1babd471-0e8f-44a8-a8b8-69544f9302e6'::uuid, 'ECONOMART SANTO ANTONIO', '28.548.486/0029-17', 'SANTO ANTONIO DE JESUS', 'BA', 'Economart', 'Endereço: AVENIDA COSME E DAMIAO 555 | Bairro: ANDAIA | CEP: 44434-040 | Vendedor: NIXON | Loja: 6 | Região: Feira e regiao | Código: 6049 | IE: 229.648.036', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1c35e658-67e3-4663-ac7f-4ac750f53f53'::uuid, 'ATACADAO SUBAE', '75.315.333/0191-28', 'FEIRA DE SANTANA', 'BA', 'Atacadao', 'Endereço: AV DEPUTADO LUIS EDUARDO MAGALHAES SN | Bairro: SUBAE | CEP: 44079-002 | Vendedor: NIXON | Loja: 70 | Região: Feira e regiao | Código: 2 | IE: 133.521.087', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1c9437c2-d976-4aba-bd6c-5be5100efa45'::uuid, 'GBARBOSA 035 COSTA AZUL', '39.346.861/0078-40', 'SALVADOR', 'BA', 'Gbarbosa', 'Endereço: RUA ARTHUR AZEVEDO MACHADO 3443 | Bairro: COSTA AZUL | CEP: 41760-000 | Vendedor: VINICIUS | Loja: 9 | Região: Pituba e regiao | Código: 82 | IE: 68.833.574', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1e8ff571-bf5a-4793-a6e1-df21b0452966'::uuid, 'CARAVELAS COMERCIAL DE ALIMENTOS LTDA', '00.291.853/0001-20', 'FEIRA DE SANTANA', 'BA', 'Outros', 'Endereço: RUA MARECHAL DEODORO 240 | Bairro: CENTRO | CEP: 44002-064 | Vendedor: RICARDO | Loja: 1 | Região: Feira e regiao | Código: 6007 | IE: 29.207.325', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1ee26e26-b619-4e48-ac9f-64a693b055aa'::uuid, 'MERCADINHO ECONOMICO  CENTRO', '24.333.585/0002-00', 'JUAZEIRO', 'BA', 'Outros', 'Endereço: TRAVESSA DA MARAVILHA 836 | Bairro: CENTRO | CEP: 48901-774 | Vendedor: ANTONIO | Loja: 2 | Região: Petrolina e regiao | Código: 5079 | IE: 86616292', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1fc0b3dd-1b9f-4043-8442-ede92cbed644'::uuid, 'ATAKAREJO PERNAMBUES', '73.849.952/0015-53', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: AV TRANQUEDO NEVES, 3290 | Bairro: PERNAMBUES | CEP: 41100-800 | Vendedor: RICARDO | Loja: 11 | Região: Pituba e regiao | Código: 213 | IE: 142437117', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('1fd41c4b-e243-4495-833b-da41ab876079'::uuid, 'CDP CENTRO - SEDE', '43.941.941/0016-19', 'MATA DE SAO JOAO', 'BA', 'Cdp', 'Endereço: RUA SANTOS DUMONT S/N | Bairro: CENTRO - SEDE | CEP: 48280-000 | Vendedor: NIXON | Loja: 16 | Região: Alagoinhas e regiao | Código: 4245 | IE: 219.955.171', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('20ab33d3-a997-48ce-829b-44908bff8b62'::uuid, 'ATAKAREJO SALVADOR', '73.849.952/0017-15', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: AV SAO CRISTOVAO, 301 | Bairro: SALVADOR | CEP: 41510-333 | Vendedor: RICARDO | Loja: 9 | Região: Paralela e regiao | Código: 213 | IE: 144638996', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('247cc98e-3b72-488f-a09e-548b3620faea'::uuid, 'ATAKAREJO CAMINHO DE AREIA', '73.849.952/0006-62', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: AV TIRADENTES 88 | Bairro: CAMINHO DE AREIA | CEP: 40440-360 | Vendedor: RICARDO | Loja: 3 | Região: Suburbio e regiao | Código: 213 | IE: 82462062', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('251c50da-97b6-4d32-af82-02d63c4cdac5'::uuid, 'CDP SAO CAETANO LOJA 15', '38.109.000/0001-05', 'SALVADOR', 'BA', 'Cdp', 'Endereço: ESTRADA DE CAMPINAS 0 | Bairro: SAO CAETANO | CEP: 40391-160 | Vendedor: NIXON | Loja: 10 | Região: Vila Canaria e regiao | Código: 4245 | IE: 170.141.430', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('253b3310-64a7-461a-a984-896c21c89993'::uuid, 'CESTA DO POVO BOCA DO RIO', '43.941.941/0014-57', 'SALVADOR', 'BA', 'Cdp', 'Endereço: RUA PROFESSOR PINTO DE AGUIAR 00592A | Bairro: BOCA DO RIO | CEP: 41710-000 | Vendedor: NIXON | Loja: 17 | Região: Paralela e regiao | Código: 4245 | IE: 219.955.063', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('268d55a8-077a-459f-a34c-98fd91cd27eb'::uuid, 'GBARBOSA 032 RIBEIRA DO POMBAL', '39.346.861/0055-54', 'RIBEIRA DO POMBAL', 'BA', 'Gbarbosa', 'Endereço: AV.EVENCIA BRITO S/N | Bairro: CENTRO | CEP: 48400-000 | Vendedor: VINICIUS | Loja: 20 | Região: Paulo Afonso e regiao | Código: 82 | IE: 56.626.799', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('27322ed5-7554-49ab-a571-4f61b2db6eb9'::uuid, 'SAMS LAURO DE FREITAS', '00.063.960/0578-01', 'LAURO DE FREITAS', 'BA', 'Sams', 'Endereço: AV SANTOS DUMONT 7552 | Bairro: BURAQUINHO | CEP: 42710-860 | Vendedor: VINICIUS | Loja: 9 | Região: Lauro e regiao | Código: 47 | IE: 198087309', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('27fca973-eea6-428b-866f-50059c3bb37d'::uuid, 'FEIRAO DAS FRUTAS ATRAS DA BANCA', '08.473.979/0001-27', 'PETROLINA', 'PE', 'Outros', 'Endereço: RUA SAO FRANCISCO N 559 | Bairro: ATRAS DA BANCA | CEP: 56308-060 | Vendedor: ANTONIO | Loja: 1 | Região: Petrolina e regiao | Código: 1926 | IE: 34541349', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('28bfddf3-4150-4aa6-a192-779a0c1383e1'::uuid, 'ASSAI JOSE CONRADO DE ARAUJO', '06.057.223/0299-00', 'ARACAJU', 'SE', 'Assai', 'Endereço: R SIMEAO AGUIAR 430 | Bairro: JOSE CONRADO DE ARAUJO | CEP: 49085-410 | Vendedor: NIXON | Loja: 42 | Região: Aracaju e regiao | Código: 1899 | IE: 27.152.081-7', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('2943c9ad-d7e3-4bd1-ada5-ff4c79d0bf71'::uuid, 'ECONOMART JEQUIE', '28.548.486/0021-60', 'JEQUIE', 'BA', 'Economart', 'Endereço: AVENIDA GOVERNADOR LOMANTO JUNIOR 1981 | Bairro: JOAQUIM ROMAO | CEP: 45200-565 | Vendedor: NIXON | Loja: 3 | Região: Conquista e regiao | Código: 6049 | IE: 208.394.013', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('2986536c-520e-4b8a-b2dc-0f7d2a6a3590'::uuid, 'FEIRAO DAS FRUTAS MARIA AUXILIADORA', '08.473.979/0002-08', 'PETROLINA', 'PE', 'Outros', 'Endereço: AV MONSENHOR ANGELO SAMPAIO 487 | Bairro: MARIA AUXILIADORA | CEP: 56330-300 | Vendedor: ANTONIO | Loja: 2 | Região: Petrolina e regiao | Código: 1926 | IE: 111128161', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('2a7162ba-e148-4e73-8fae-56fed47cb06c'::uuid, 'CDP MARECHAL RONDON LOJA 13', '43.941.941/0005-66', 'SALVADOR', 'BA', 'Cdp', 'Endereço: RUA VICENTE CELESTINO 000009 | Bairro: MARECHAL RONDON | CEP: 41280-000 | Vendedor: NIXON | Loja: 9 | Região: Vila Canaria e regiao | Código: 4245 | IE: 192.339.773', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('2bc86717-366c-4b1a-902e-e99f9e2df810'::uuid, 'ATAC CANABRAVA', '93.209.765/0560-90', 'SALVADOR', 'BA', 'Atacadao', 'Endereço: RUA ARTEMIO CASTRO VALENTE 000396 | Bairro: CANABRAVA | CEP: 41260-300 | Vendedor: NIXON | Loja: 35 | Região: Vila Canaria e regiao | Código: 48 | IE: 211958914', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('2c2e383f-9ee3-4a1f-8322-651050256bb0'::uuid, 'ATACADAO PARQUE BELA VISTA', '75.315.333/0313-30', 'SALVADOR', 'BA', 'Atacadao', 'Endereço: AV ANTONIO CARLOS MAGALHAES SN | Bairro: PARQUE BELA VISTA | CEP: 40280-000 | Vendedor: NIXON | Loja: 75 | Região: Pituba e regiao | Código: 2 | IE: 180.594.779', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('2c5b15e1-2dc8-4249-860a-4e3b7adb5a0a'::uuid, 'PERINI PITUBA', '11.965.515/0009-08', 'SALVADOR', 'BA', 'Perini', 'Endereço: RUA MARANHAO 64 | Bairro: PITUBA | CEP: 41830-260 | Vendedor: VINICIUS | Loja: 5 | Região: Pituba e regiao | Código: 69 | IE: 88293659', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('2df06397-f8f5-493a-8744-095609b3a23b'::uuid, 'BONTEMPO SUPERMERCADOS', '00.889.627/0001-45', 'PETROLINA', 'PE', 'Outros', 'Endereço: R DOM TOMAS 80 | Bairro: COHAB SAO FRANCISCO | CEP: 56309-020 | Vendedor: ANTONIO | Loja: 1 | Região: Petrolina e regiao | Código: 4290 | IE: 0216797-20', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('2ede23fb-5160-43d9-95b0-62880f8beec7'::uuid, 'REDEMIX RIO VERMELHO', '06.337.087/0017-30', 'SALVADOR', 'BA', 'Redemix', 'Endereço: RUA OSWALDO CRUZ 000564 | Bairro: RIO VERMELHO | CEP: 41940-000 | Vendedor: VINICIUS | Loja: 13 | Região: Vasco e regiao | Código: 186 | IE: 201.193.400', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('2f794e0f-d094-4e8c-bcdf-0cf3af666ec2'::uuid, 'CDP ENTRE RIOS CENTRO', '43.941.941/0020-03', 'ENTRE RIOS', 'BA', 'Cdp', 'Endereço: PRACA BARAO DO RIO BRANCO | Bairro: CENTRO | Complemento: 97, CENTRO | CEP: 48180-000 | Vendedor: NIXON | Loja: 13 | Região: Alagoinhas e regiao | Código: 4245 | IE: 222.072.564', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('2ffbf456-d24e-41d8-8344-348a61fa198c'::uuid, 'ATAKAREJO CD SIMOES FILHO', '73.849.952/0021-00', 'SIMOES FILHO', 'BA', 'Atakarejo', 'Endereço: V DE PENETRACAO I 690 | Bairro: CIA SUL | CEP: 43700-000 | Vendedor: RICARDO | Loja: 12 | Região: Simoes Filho e regiao | Código: 213 | IE: 159.338.218', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('30dd4d30-2a0b-4bf9-b04f-130ecea4aa64'::uuid, 'ASSAI CALCADA', '06.057.223/0361-09', 'SALVADOR', 'BA', 'Assai', 'Endereço: R LUIZ REGIS PACHECO 368 | Bairro: URUGUAI | CEP: 40451-360 | Vendedor: NIXON | Loja: 39 | Região: Suburbio e regiao | Código: 1899 | IE: 143296032', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('311b08cc-fd2a-4f9b-a0c1-ab4413208a98'::uuid, 'HIPERIDEAL PIATA OTAVIO MANGABEIRA', '02.212.937/0007-41', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV OCTAVIO MANGABEIRA  10241 | Bairro: PIATA | CEP: 41650-000 | Vendedor: RICARDO | Loja: 7 | Região: Paralela e regiao | Código: 2613 | IE: 62.191.021', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('315aeec0-7878-4a4d-9ead-57b5aaf987f1'::uuid, 'MULTI FRIOS PREMIUM', '02.423.862/0005-86', 'JUAZEIRO', 'BA', 'Outros', 'Endereço: AV MIGUEL SILVA SOUZA | Bairro: PALMARES | CEP: 48901-765 | Vendedor: ANTONIO | Loja: 1 | Região: Petrolina e regiao | Código: 4469 | IE: 148.798.247', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('319f419d-e77b-4286-bf15-3dbe2f68649f'::uuid, 'MERCADINHO ECONOMICO  QUATI', '06.077.025/0001-70', 'PETROLINA', 'PE', 'Outros', 'Endereço: AVENIDA DOIS 166 | Bairro: JARDIM SAO PAULO | CEP: 56314-440 | Vendedor: ANTONIO | Loja: 1 | Região: Petrolina e regiao | Código: 5080 | IE: 30926904', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('31db32e7-0939-43da-9b80-a391306308ee'::uuid, 'CDP ARMACAO STIEP LOJA 14', '43.941.941/0002-13', 'SALVADOR', 'BA', 'Cdp', 'Endereço: AV PROFESSOR MANOEL RIBEIRO | Bairro: ARMACAO | Complemento: LOJA TERREO | CEP: 41750-160 | Vendedor: NIXON | Loja: 1 | Região: Paralela e regiao | Código: 4245 | IE: 189.576.699', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('32eed8ae-3b08-4565-b778-de1cfd1cd710'::uuid, 'CENTRO DE DISTRIBUICAO BRASIL', '09.081.924/0005-68', 'CAPIM GROSSO', 'BA', 'Outros', 'Endereço: FAZENDA NOVILHAS SN | Bairro: ZONA RURAL | CEP: 44695-000 | Vendedor: ANTONIO | Loja: 1 | Região: Sr Bonfim e regiao | Código: 4585 | IE: 119.996.032', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('34418ee4-8108-4889-889e-038aec95a42d'::uuid, 'GBARBOSA 074 SOBRADINHO', '39.346.861/0111-04', 'FEIRA DE SANTANA', 'BA', 'Gbarbosa', 'Endereço: R.DR ARIOVALDO DE CARVALHO 780 | Bairro: SOBRADINHO | CEP: 44020-010 | Vendedor: VINICIUS | Loja: 25 | Região: Feira e regiao | Código: 82 | IE: 77.013.096', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('349c9bb5-c9ea-4be1-a4ae-4b1385977b0b'::uuid, 'GBARBOSA-127-PETROLINA', '39.346.861/0179-94', 'PETROLINA', 'PE', 'Gbarbosa', 'Endereço: AV.DOS TROPEIROS N 10 | Bairro: PEDRO RAIMUNDO | CEP: 56316-140 | Vendedor: ANTONIO | Loja: 34 | Região: Petrolina e regiao | Código: 82 | IE: 42.381.509', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('349fe190-b548-4bda-81ac-39264abd7edf'::uuid, 'G. BARBOSA ARACAJU II', '39.346.861/0016-48', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV AUGUSTO FRANCO 3280 | Bairro: PONTO NOVO | CEP: 49047-040 | Vendedor: VINICIUS | Loja: 57 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.252-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('352b6eaf-5943-4b96-a240-c6cb9ae7695f'::uuid, 'MIX MATEUS SALAVDOR SAO CRISTOVAO', '03.995.515/0348-19', 'SALVADOR', 'BA', 'Mateus', 'Endereço: RODOVIA BA 526 000305 | Bairro: CASSANGE | CEP: 41505-220 | Vendedor: RICARDO | Loja: E2 | Região: Paralela e regiao | Código: 2459 | IE: 227.036.352', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('359b113c-ee0e-41df-8337-80efb703b926'::uuid, 'SAO ROQUE ARTEMIA PIRES', '03.705.630/0014-74', 'FEIRA DE SANTANA', 'BA', 'Sao Roque', 'Endereço: AVENIDA ARTEMIA PIRES FREITAS 9000 | Bairro: SIM | CEP: 44085-370 | Vendedor: VINICIUS | Loja: 8 | Região: Feira e regiao | Código: 1600 | IE: 211.679.978', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('361186d4-f1f2-441e-a918-bd1caf5cd572'::uuid, 'CBD PARALELA', '47.508.411/0892-03', 'SALVADOR', 'BA', 'Cdb', 'Endereço: AV GOVERNADOR LUIZ VIANA BFILHO 3056 | Bairro: PARALELA | CEP: 40301-155 | Vendedor: RICARDO | Loja: 24 | Região: Paralela e regiao | Código: 11 | IE: 42601557', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('3631ce66-ef02-4083-98a6-a56ea1e23e3e'::uuid, 'ATAKAREJO ARACAJU ADELIA', '73.849.952/0044-98', 'ARACAJU', 'SE', 'Atakarejo', 'Endereço: AVENIDA ADELIA FRANCO 2350 | Bairro: LUZIA | CEP: 49048-010 | Vendedor: RICARDO | Loja: 21 | Região: Aracaju e regiao | Código: 213 | IE: 27.216.861-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('365dbd1b-c80e-4811-802b-4aa764fea3a4'::uuid, 'RMIX SIMOES FILHO', '06.337.087/0001-73', 'SIMOES FILHO', 'BA', 'Redemix', 'Endereço: AV WASHINGTON LUIZ | Bairro: CENTRO | CEP: 43700-000 | Vendedor: VINICIUS | Loja: 3 | Região: Simoes Filho e regiao | Código: 186 | IE: 64.076.451', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('37b7ff2e-5265-4716-b5b9-f5eb205935d1'::uuid, 'ATAKAREJO CAMACARI', '73.849.952/0013-91', 'CAMACARI', 'BA', 'Atakarejo', 'Endereço: JD LIMOEIRO S/N | Bairro: LIMOEIRO | CEP: 42800-681 | Vendedor: RICARDO | Loja: 13 | Região: Camacari e regiao | Código: 213 | IE: 140.557.666', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('388fa9e1-11af-4f58-b26c-16f9800f5ff8'::uuid, 'MERCADINHO ECONOMICO', '24.333.585/0001-20', 'PETROLINA', 'PE', 'Outros', 'Endereço: AVENIDA DA INTEGRACAO AYRTON SENNA 484 | Bairro: DOM MALAN | CEP: 56328-010 | Vendedor: ANTONIO | Loja: 1 | Região: Petrolina e regiao | Código: 5079 | IE: 14687747', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('39270c88-a77d-484e-97d1-cf6f0f73867d'::uuid, 'MATEUS EUNAPOLIS', '03.995.515/0297-34', 'EUNAPOLIS', 'BA', 'Mateus', 'Endereço: AVENIDA ANTONIO CARLOS MAGALHAES 844 | Bairro: IVAN MOURA | Complemento: LOJA 01 | CEP: 45830-602 | Vendedor: RICARDO | Loja: 97 | Região: Porto Seguro e regiao | Código: 2459 | IE: 209.091.531', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('3a3c3ff4-40b4-41e5-b680-aa01ca84198f'::uuid, 'MATEUS JACOBINA', '03.995.515/0246-94', 'JACOBINA', 'BA', 'Mateus', 'Endereço: AV CENTENARIO 532 | Bairro: NAZARE | CEP: 44700-000 | Vendedor: ANTONIO | Loja: 34 | Região: Sr Bonfim e regiao | Código: 2459 | IE: 189709394', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('3b5684dc-c894-413a-9751-271048fe1adc'::uuid, 'GBARBOSA 038 ALAGOINHAS', '39.346.861/0052-01', 'ALAGOINHAS', 'BA', 'Gbarbosa', 'Endereço: PRACA DA BANDEIRA 01 | Bairro: CENTRO | CEP: 48005-170 | Vendedor: VINICIUS | Loja: 23 | Região: Alagoinhas e regiao | Código: 82 | IE: 56.626.807', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('3bdfb739-a34c-4206-b17c-800aa2fb35f4'::uuid, 'RMIX ALPHAVILLE 1', '06.337.087/0004-16', 'SALVADOR', 'BA', 'Redemix', 'Endereço: AV LUIZ VIANA, 7876 | Bairro: ALPHAVILLE 1 | CEP: 41701-005 | Vendedor: VINICIUS | Loja: 4 | Região: Paralela e regiao | Código: 186 | IE: 128981786', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('3ce8ff1a-6b38-417d-8326-2a39a048058d'::uuid, 'GBARBOSA CAMACARI', '39.346.861/0379-10', 'CAMACARI', 'BA', 'Gbarbosa', 'Endereço: VIA DE LIGACAO CAMACARI S/N | Bairro: POLO PETROQUIMICO | CEP: 42810-260 | Vendedor: VINICIUS | Loja: 86 | Região: Camacari e regiao | Código: 82 | IE: 102.946.189', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('3ecf6718-0025-4d5f-90ba-0c9f80ae6881'::uuid, 'ATAKAREJO', '73.849.952/0052-06', 'DIAS D''AVILA', 'BA', 'Atakarejo', 'Endereço: RUA SEM DENOMINACAO 251 | Bairro: CENTRO | CEP: 42850-000 | Vendedor: RICARDO | Loja: 38 | Região: Alagoinhas e regiao | Código: 213 | IE: 225.505.894', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('3f8107d1-19b3-4870-a0a1-7635ddc41050'::uuid, 'GBARBOSA CENTRO', '39.346.861/0039-34', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: R JOSE DO PRADO FRANCO 148 | Bairro: CENTRO | CEP: 49010-110 | Vendedor: VINICIUS | Loja: 67 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.235-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('404248d4-e8b0-452c-b020-263274222342'::uuid, 'HIPERIDEAL BURAQUINHO', '02.212.937/0008-22', 'LAURO DE FREITAS', 'BA', 'Hiperideal', 'Endereço: AV SANTOS DUMONT 7410 | Bairro: BURAQUINHO | Complemento: LJ 07 ESTRADA DO COCO AREA 01 | CEP: 42710-860 | Vendedor: RICARDO | Loja: 8 | Região: Lauro e regiao | Código: 2613 | IE: 62920003', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('42172db0-d52a-480a-ae75-549450d1a55a'::uuid, 'ATAC FEIRA SANTANA', '75.315.333/0066-54', 'FEIRA DE SANTANA', 'BA', 'Atacadao', 'Endereço: AV EDUARDO FROES DA MOTA 5500 | Bairro: MORADA DAS ARVORES | CEP: 44021-210 | Vendedor: NIXON | Loja: 28 | Região: Feira e regiao | Código: 2 | IE: 76229052', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('424615eb-25d6-4fb5-94c7-38811574809f'::uuid, 'CDP SUPER MATA LOJA 02', '43.941.941/0009-90', 'MATA DE SAO JOAO', 'BA', 'Cdp', 'Endereço: RUA ARTUR TORRES 17 | Bairro: CENTRO - SEDE | CEP: 48280-000 | Vendedor: NIXON | Loja: 11 | Região: Alagoinhas e regiao | Código: 4245 | IE: 195.180.350', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('42e3d865-9aaa-452d-890f-cdcd01f285f1'::uuid, 'GBARBOSA-315-SERRINHA', '39.346.861/0446-14', 'SERRINHA', 'BA', 'Gbarbosa', 'Endereço: RUA LAURO MOTA, SN | Bairro: GINASIO | CEP: 48700-000 | Vendedor: VINICIUS | Loja: 51 | Região: Feira e regiao | Código: 82 | IE: 109277725', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4402de09-7ee7-4dd1-82d6-52bc498c21c0'::uuid, 'G BARBOSA ARACAJU I', '39.346.861/0118-72', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV ALEXANDRO ALCINO 2155 | Bairro: SANTA MARIA | CEP: 49044-090 | Vendedor: VINICIUS | Loja: 54 | Região: Aracaju e regiao | Código: 82 | IE: 27.122.117-8', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4475c674-84db-4f79-90f8-d5ec3f75c77a'::uuid, 'HIPERIDEAL PARQUE SHOPPING', '02.212.937/0028-76', 'LAURO DE FREITAS', 'BA', 'Hiperideal', 'Endereço: AV SANTOS DUMONT 4360 | Bairro: CENTRO | CEP: 42702-400 | Vendedor: RICARDO | Loja: 21 | Região: Lauro e regiao | Código: 2613 | IE: 164428685', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('452af8d5-c98d-4f08-97bc-8d9b1d24719a'::uuid, 'ASSAI NOSSA SRA DO SOCORRO', '06.057.223/0478-01', 'NOSSA SENHORA DO SOCORRO', 'SE', 'Assai', 'Endereço: AV EIXO ESTRUTURAL B SN | Bairro: DISTRITO | Complemento: QUADRA 2 LOTE 1 | CEP: 49160-000 | Vendedor: NIXON | Loja: 66 | Região: Aracaju e regiao | Código: 1899 | IE: 27.179.082-2', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4681bfbc-9f7c-48a1-a928-6595f015eb1d'::uuid, 'GBARBOSA 018 ESPLANADA', '39.346.861/0045-82', 'ESPLANADA', 'BA', 'Gbarbosa', 'Endereço: PRACA.LADISLAU CAVALCANTE,18 | Bairro: CENTRO | CEP: 48370-000 | Vendedor: VINICIUS | Loja: 18 | Região: Alagoinhas e regiao | Código: 82 | IE: 56.626.573', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('47e6e5ae-9735-49ee-a347-ba5aa1539144'::uuid, 'REDEMIX CHAME-CHAME', '06.337.087/0016-50', 'SALVADOR', 'BA', 'Redemix', 'Endereço: RUA PROFESSOR SABINO SILVA 179 | Bairro: CHAME-CHAME | CEP: 40157-250 | Vendedor: VINICIUS | Loja: 12 | Região: Suburbio e regiao | Código: 186 | IE: 177.157.844', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4819f659-a4a5-462c-8a12-006a48306d38'::uuid, 'CDP MANOEL DIA D''AVILA LOJA 04', '43.941.941/0008-09', 'DIAS D''AVILA', 'BA', 'Cdp', 'Endereço: AVENIDA BRASIL 09 | Bairro: CENTRO | Complemento: CENTRO | CEP: 42850-000 | Vendedor: NIXON | Loja: 6 | Região: Alagoinhas e regiao | Código: 4245 | IE: 195.180.261', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('489ff42c-89e6-47e4-8f79-948122d61722'::uuid, 'HIPER UNIMAR PARQUE NASC DA CAPIVARA', '07.896.520/0003-35', 'CAMACARI', 'BA', 'Unimar', 'Endereço: R DOM PEDRO 1 SN | Bairro: PARQUE NASC DA CAPIVARA | Complemento: QUADRA LOTE 08 | CEP: 42800-970 | Vendedor: NIXON | Loja: 3 | Região: Camacari e regiao | Código: 203 | IE: 158.767.411', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('48bb281c-96fa-489f-8545-93f5a42479a6'::uuid, 'ATAKAREJO PATAMARES PINTO DE AGUIAR', '73.849.952/0039-20', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: RUA CARIMBAMBA 0000SN | Bairro: PITUACU | CEP: 41740-010 | Vendedor: RICARDO | Loja: 31 | Região: Paralela e regiao | Código: 213 | IE: 210.184.400', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4933d749-64a1-4904-8ffc-f5adb2b92213'::uuid, 'CESTA DO POVO', '31.434.425/0001-32', 'SALVADOR', 'BA', 'Cdp', 'Endereço: R DOUTOR ARTHUR COUTO 3 | Bairro: MUSSURUNGA I | CEP: 41490-350 | Vendedor: NIXON | Loja: 1 | Região: Paralela e regiao | Código: 2646 | IE: 151.634.587', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('49c49782-3dc3-4335-918a-6b8ff42aca35'::uuid, 'ASSAI VITORIA CONQUISTA', '06.057.223/0317-27', 'VITORIA DA CONQUISTA', 'BA', 'Assai', 'Endereço: AVENIDA ANEL DE CONTORNO SN | Bairro: FELICIA | CEP: 45055-686 | Vendedor: NIXON | Loja: 12 | Região: Conquista e regiao | Código: 1899 | IE: 131807514', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('49e629e5-05b1-48ae-812d-4fc64af32fc2'::uuid, 'SERRANA  BARRA', '02.212.937/0011-28', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R MARQUES DE CARAVELAS 171 | Bairro: BARRA | CEP: 40140-241 | Vendedor: RICARDO | Loja: 11 | Região: Suburbio e regiao | Código: 2613 | IE: 68.794.073', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4b81372f-7ff8-4c37-b45f-45000d47fc23'::uuid, 'LE DELIS', '57.845.048/0001-18', 'SALVADOR', 'BA', NULL, 'Endereço: AVENIDA LUIS VIANA FILHO 6312 | Bairro: PATAMARES | Complemento: EMPRESARIAL WALL STREET - LOJA 16 TERREO - PARALEL | CEP: 41680-400 | Vendedor: NIXON | Loja: 1 | Código: 4561 | IE: 223.833.973', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4baf6702-2905-4e14-9888-e54fe7e06b0b'::uuid, 'CBD CIDADE NOVA', '47.508.411/0446-09', 'SALVADOR', 'BA', 'Cdb', 'Endereço: AVN ACM SN | Bairro: CIDADE NOVA | CEP: 40315-340 | Vendedor: RICARDO | Loja: 22 | Região: Suburbio e regiao | Código: 11 | IE: 22420046', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4bb5dff7-54e0-4453-9bb8-ff41e64546bc'::uuid, 'ASSAI CIDADE NOVA', '06.057.223/0406-37', 'SERRINHA', 'BA', 'Assai', 'Endereço: AV LOMANTO JUNIOR MARGEM BR 116 SN | Bairro: CIDADE NOVA | CEP: 48700-000 | Vendedor: NIXON | Loja: 41 | Região: Feira e regiao | Código: 1899 | IE: 162.235.030', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4bd2e889-5342-4220-82e0-c8e84526900c'::uuid, 'GBARBOSA 106 BROTAS', '39.346.861/0138-16', 'SALVADOR', 'BA', 'Gbarbosa', 'Endereço: FREDERICA COSTA 534 | Bairro: BROTAS | CEP: 40243-045 | Vendedor: VINICIUS | Loja: 29 | Região: Brotas e regiao | Código: 82 | IE: 84.605.683', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4c67b7c6-d89b-40a7-9902-f32ef71aa08c'::uuid, 'GBARBOSA-088 - SAN MARTIN', '39.346.861/0119-53', 'SALVADOR', 'BA', 'Gbarbosa', 'Endereço: AV SAO MARTINS SN | Bairro: SAN MARTIN | CEP: 40355-015 | Vendedor: VINICIUS | Loja: 10 | Região: Suburbio e regiao | Código: 82 | IE: 77.079.509', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4c9f99b4-1690-417a-82cb-876359c72595'::uuid, 'GBARBOSA 039 ALAGOINHAS', '39.346.861/0051-20', 'ALAGOINHAS', 'BA', 'Gbarbosa', 'Endereço: PRACA PADRE ALFREDO,86 | Bairro: CENTRO | CEP: 48050-010 | Vendedor: VINICIUS | Loja: 24 | Região: Alagoinhas e regiao | Código: 82 | IE: 56.626.681', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4d0fe801-f338-4b2b-8e97-06eb6e471770'::uuid, 'GBARBOSA 108 LAURO DE FREITAS', '39.346.861/0143-83', 'LAURO DE FREITAS', 'BA', 'Gbarbosa', 'Endereço: AV LUIS TARQUINIO 1686 | Bairro: CENTRO | CEP: 42700-000 | Vendedor: VINICIUS | Loja: 11 | Região: Lauro e regiao | Código: 82 | IE: 87892394', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4d21abf6-7dd2-4187-9e32-cadcf1ba2b4d'::uuid, 'BOMPRECO - PITUBA', '97.422.620/0009-08', 'SALVADOR', 'BA', 'Bompreco', 'Endereço: R PERNAMBUCO 510 | Bairro: PITUBA | CEP: 41830-391 | Vendedor: VINICIUS | Loja: 10 | Região: Pituba e regiao | Código: 1647 | IE: 000.106.959', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('4e2e3602-3620-4978-b7e3-78e3e6fbd851'::uuid, 'ATAC CAMACARI', '75.315.333/0165-36', 'CAMACARI', 'BA', 'Atacadao', 'Endereço: V PARAFUSO (ANTIGA BA-535) | Bairro: POLO PETROQUIMICO | CEP: 42810-200 | Vendedor: NIXON | Loja: 38 | Região: Camacari e regiao | Código: 2 | IE: 117480207', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5076a2da-ce1c-48b4-814e-375a8cc80ec4'::uuid, 'GBARBOSA CD BAHIA', '39.346.861/0364-33', 'SIMOES FILHO', 'BA', 'Gbarbosa', 'Endereço: RODOVIA BA 093 4120 | Bairro: PALMARES | Complemento: PALMARES | CEP: 43700-000 | Vendedor: VINICIUS | Loja: 85 | Região: Simoes Filho e regiao | Código: 82 | IE: 100.082.388', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('50889b14-859d-4fcc-bd46-52e759e01493'::uuid, 'SERRANA - GRACA', '02.212.937/0010-47', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV EUCLYDES DA CUNHA 08 | Bairro: GRACA | Complemento: LOJA 08 | CEP: 40150-122 | Vendedor: RICARDO | Loja: 10 | Região: Suburbio e regiao | Código: 2613 | IE: 64.455.531', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('509fc179-5414-4e3d-a789-bc86f084e864'::uuid, 'ATAKAREJO BAIXA DE QUINTAS', '73.849.952/0019-87', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: ESTRADA DA RAINHA 000646 | Bairro: BAIXA DE QUINTAS | CEP: 40300-035 | Vendedor: RICARDO | Loja: 28 | Região: Suburbio e regiao | Código: 213 | IE: 155.323.173', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('50eec516-83a8-4e76-be54-c157446bf0c7'::uuid, 'ATAKAREJO POJUCA', '73.849.952/0049-00', 'POJUCA', 'BA', 'Atakarejo', 'Endereço: VIA BA 533 SN | Bairro: STAR | CEP: 48120-000 | Vendedor: RICARDO | Loja: 33 | Região: Alagoinhas e regiao | Código: 213 | IE: 220.799.768', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('51264725-4311-48e1-8151-bac0618d4075'::uuid, 'HIPER IDEAL CD', '02.212.937/0033-33', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R DA GRATIDAO 00 | Bairro: PIATA | CEP: 41650-195 | Vendedor: RICARDO | Loja: 24 | Região: Paralela e regiao | Código: 2613 | IE: 177.537.392', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5199ffed-581c-46e6-8c63-a20aa543a84e'::uuid, 'SERRANA - PATAMARES', '02.212.937/0013-90', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV LUIS VIANA FILHO 8544 | Bairro: PATAMARES | Complemento: ED SHOPPING PARALELA  SALA 109 E 110 | CEP: 41680-400 | Vendedor: RICARDO | Loja: 13 | Região: Paralela e regiao | Código: 2613 | IE: 79431702', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('52b7849a-4ba2-4c3c-bc3b-a00c389ae884'::uuid, 'ATAKAREJO PIATA', '73.849.952/0009-05', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: AV OCTAVIO MANGABEIRA | Bairro: PIATA | CEP: 41650-000 | Vendedor: RICARDO | Loja: 5 | Região: Paralela e regiao | Código: 213 | IE: 112613736', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('54056de1-7591-4f92-a182-cb6a5d8c3da8'::uuid, 'CDP OGUNJA LOJA 08', '43.941.941/0004-85', 'SALVADOR', 'BA', 'Cdp', 'Endereço: AVENIDA GENERAL GRACA LESSA 000888 | Bairro: ACUPE DE BROTAS | Complemento: N 8888 | CEP: 40290-110 | Vendedor: NIXON | Loja: 8 | Região: Brotas e regiao | Código: 4245 | IE: 192.339.665', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('540f2e73-b26c-438c-8cf8-7bff90aee571'::uuid, 'SUPERMERCADO NUNES PEIXOTO NOVO HORIZONT', '13.152.186/0002-27', 'NOSSA SENHORA DA GLORIA', 'SE', 'Sao Lucas', 'Endereço: RUA MONTE ALEGRE  N 78 | Bairro: NOVO HORIZONTE | CEP: 49680-000 | Vendedor: VINICIUS | Loja: 2 | Região: Gloria e regiao | Código: 2997 | IE: 271029609', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('54db5c55-36ad-4dcc-a8f6-0c8d1ecd7f2b'::uuid, 'ASSAI VASCO DA GAMA', '06.057.223/0484-50', 'SALVADOR', 'BA', 'Assai', 'Endereço: AV VASCO DA GAMA 4049 | Bairro: FEDERACAO | CEP: 40230-731 | Vendedor: NIXON | Loja: 63 | Região: Vasco e regiao | Código: 1899 | IE: 188.455.405', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('56a05eee-8098-488b-9660-c3ce2cbafe07'::uuid, 'RMIX PITUBA- PITUBINHA', '06.337.087/0002-54', 'SALVADOR', 'BA', 'Redemix', 'Endereço: RUA ARTUR GOMES DE CARVALHO 246 | Bairro: PITUBA | CEP: 41810-640 | Vendedor: VINICIUS | Loja: 1 | Região: Pituba e regiao | Código: 186 | IE: 83816004', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('573877ef-b8ac-4ccd-9b0d-d1445cee0b74'::uuid, 'GBARBOSA-302 - HORTO BELA VISTA', '39.346.861/0432-19', 'SALVADOR', 'BA', 'Gbarbosa', 'Endereço: ALAMEDA EUVALDO LUZ N92 | Bairro: HORTO BELA VISTA | CEP: 41098-020 | Vendedor: VINICIUS | Loja: 49 | Região: Vasco e regiao | Código: 82 | IE: 105.678.580', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('57c3c7cf-1051-4bb0-ad5a-c2219f4f094b'::uuid, 'SAMS COSME DE FARIAS', '00.063.960/0574-70', 'SALVADOR', 'BA', 'Sams', 'Endereço: AV MARIO LEAL FERREIRA 000780 | Bairro: COSME DE FARIAS | CEP: 40252-390 | Vendedor: VINICIUS | Loja: 10 | Região: Brotas e regiao | Código: 47 | IE: 187.549.772', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('582911d0-1b49-4234-a81f-bcc731650252'::uuid, 'ASSAI PETROLINA', '06.057.223/0477-20', 'PETROLINA', 'PE', 'Assai', 'Endereço: AV SETE DE SETEMBRO SN | Bairro: ANTONIO CASSIMIRO | Complemento: ANEXO AREA 2 A 1 | CEP: 56330-900 | Vendedor: ANTONIO | Loja: 79 | Região: Petrolina e regiao | Código: 1899 | IE: 0985934-98', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('590e179a-2fd4-4a08-93df-740ca2802e27'::uuid, 'ECONOMART VITORIA DA CONQUISTA', '28.548.486/0014-30', 'VITORIA DA CONQUISTA', 'BA', 'Economart', 'Endereço: AVENIDA BRUMADO 2295 | Bairro: BATEIAS | CEP: 45052-000 | Vendedor: NIXON | Loja: 2 | Região: Conquista e regiao | Código: 6049 | IE: 194.507.387', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5ad91c69-4683-4d3f-af60-6cd8703f5c84'::uuid, 'RMIX ONDINA', '06.337.087/0011-45', 'SALVADOR', 'BA', 'Redemix', 'Endereço: AV ADHEMAR DE BARROS 392 | Bairro: ONDINA | CEP: 40170-110 | Vendedor: VINICIUS | Loja: 9 | Região: Suburbio e regiao | Código: 186 | IE: 171.197.990', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5b72f2bd-f137-45fa-913e-44248dbf057e'::uuid, 'GBARBOSA SAO JOSE', '39.346.861/0038-53', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: R GONCALO R. DO PRADO 142 | Bairro: SAO JOSE | CEP: 49010-410 | Vendedor: VINICIUS | Loja: 66 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.238-4', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5c32358b-e734-490b-8952-66b9142836ee'::uuid, 'ATAC BARROS REIS', '75.315.333/0016-95', 'SALVADOR', 'BA', 'Atacadao', 'Endereço: AV BARROS REIS 1579 | Bairro: CABULA | CEP: 40310-010 | Vendedor: NIXON | Loja: 25 | Região: Brotas e regiao | Código: 2 | IE: 57746966', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5d14422e-f8d3-446a-8058-62c70659fbba'::uuid, 'HIPERIDEAL CAMINHO DAS ARVORES', '02.212.937/0032-52', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AL DOS SOMBREIROS 170 | Bairro: CAMINHO DAS ARVORES | CEP: 41820-420 | Vendedor: RICARDO | Loja: 25 | Região: Pituba e regiao | Código: 2613 | IE: 174.055.722', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5d8ffdfc-2bfc-4374-b876-06d3ad9116d4'::uuid, 'RMIX BURAQUINHO', '06.337.087/0007-69', 'LAURO DE FREITAS', 'BA', 'Redemix', 'Endereço: R PRISCILA B DUTRA 1278 | Bairro: BURAQUINHO | Complemento: QUADRAR LOTE 00001 LOTEAMENTO MIRAGEM | CEP: 42709-200 | Vendedor: VINICIUS | Loja: 7 | Região: Lauro e regiao | Código: 186 | IE: 145.512.921', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5e474339-a7f5-4559-82b3-80b250d014b0'::uuid, 'ATAKAREJO SIMOES FILHO', '73.849.952/0014-72', 'SIMOES FILHO', 'BA', 'Atakarejo', 'Endereço: AVENIDA ENG ELMO SEREJO DE FARIAS 2073 | Bairro: CIA I | CEP: 43700-000 | Vendedor: RICARDO | Loja: 30 | Região: Simoes Filho e regiao | Código: 213 | IE: 140557774', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5efd695c-a602-44f4-97cd-ef999405a75e'::uuid, 'GBARBOSA-306  - PAULO AFONSO', '39.346.861/0427-51', 'PAULO AFONSO', 'BA', 'Gbarbosa', 'Endereço: AV JOSE HEMETERIO DE CARVALHO | Bairro: PAULO AFONSO | CEP: 48601-320 | Vendedor: VINICIUS | Loja: 50 | Região: Paulo Afonso e regiao | Código: 82 | IE: 105.528.487', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5f5eb311-56eb-4f0c-9701-c17d9383449e'::uuid, 'ATAKAREJO NOSSA SENHORA DA GLORIA', '73.849.952/0051-17', 'NOSSA SENHORA DA GLORIA', 'SE', 'Atakarejo', 'Endereço: RUA FRANCISCO VIEIRA DOS SANTOS 86 | Bairro: JOVIANO BARBOSA | CEP: 49680-000 | Vendedor: RICARDO | Loja: 43 | Região: Gloria e regiao | Código: 213 | IE: 27.223.761-2', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('5f683b1f-5b63-4322-a16a-217a053bed14'::uuid, 'G BARBOSA  CJ. AUGUSTO FRANCO', '39.346.861/0044-00', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV HERACLITO ROLLEMBERG 2676 | Bairro: CJ. AUGUSTO FRANCO | CEP: 49030-640 | Vendedor: VINICIUS | Loja: 58 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.251-1', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('602ba112-fd4b-45ad-9343-ef5a7c17cbf9'::uuid, 'MIX MATEUS BOA VISTA', '03.995.515/0323-60', 'ILHEUS', 'BA', 'Mateus', 'Endereço: AVENIDA MILTON SANTOS 1904 | Bairro: BOA VISTA | CEP: 45652-565 | Vendedor: RICARDO | Loja: D7 | Região: Ilheus e regiao | Código: 2459 | IE: 216.513.219', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('60575739-3c18-4f0d-9821-2fe7ee58e135'::uuid, 'CDP RODOVIARIA LOJA 17', '43.941.941/0013-76', 'SALVADOR', 'BA', 'Cdp', 'Endereço: AVENIDA ANTONIO CARLOS MAGALHAES 4362 | Bairro: PERNAMBUES | CEP: 41110-700 | Vendedor: NIXON | Loja: 5 | Região: Pituba e regiao | Código: 4245 | IE: 219.947.521', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('615d08c2-931f-47e0-abdc-7a3486ae9958'::uuid, 'HIPER UNIMAR BARRA DO POJUCA', '07.896.520/0001-73', 'CAMACARI', 'BA', 'Unimar', 'Endereço: R FILOGONIO DE OLIVEIRA 141 | Bairro: BARRA DO POJUCA | CEP: 42825-000 | Vendedor: NIXON | Loja: 1 | Região: Camacari e regiao | Código: 203 | IE: 68554400', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('6286eba4-5271-45a8-80d0-1bd1906d016d'::uuid, 'MIX MATEUS DA GLORIA', '03.995.515/0271-03', 'NOSSA SENHORA DA GLORIA', 'SE', 'Mateus', 'Endereço: RUA PADRE JOSE  DE ANCHIETA SN | Bairro: PORTAL DO SERTAO | CEP: 49680-000 | Vendedor: RICARDO | Loja: 96 | Região: Gloria e regiao | Código: 2459 | IE: 27.188.710-9', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('6384b6f4-19ff-4c7b-8c24-c3c74d309aa9'::uuid, 'CDP CASTELO BRANCO LOJA 05', '31.360.337/0001-33', 'SALVADOR', 'BA', 'Cdp', 'Endereço: RUA VITORINO ALVES MOITINHO S/N | Bairro: CASTELO BRANCO | CEP: 41320-600 | Vendedor: NIXON | Loja: 7 | Região: Vila Canaria e regiao | Código: 4245 | IE: 151.428.991', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('65b332aa-fb15-4209-9864-c74bcc3b5cf2'::uuid, 'EXITO SUPERMERCADO', '34.811.344/0001-00', 'LAGARTO', 'SE', 'Outros', 'Endereço: RUA DR  LAUDELINO FREIRE 390 | Bairro: CENTRO | CEP: 49400-000 | Vendedor: NIXON | Loja: 1 | Região: Aracaju e regiao | Código: 6123 | IE: 27188389-8', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('68a93f99-9455-4bf9-8d64-cacb2e99fde9'::uuid, 'ASSAI LUIS ANSELMO', '06.057.223/0552-35', 'SALVADOR', 'BA', 'Assai', 'Endereço: AV ANTONIO CARLOS MAGALHAES 001400 | Bairro: LUIS ANSELMO | CEP: 40260-700 | Vendedor: NIXON | Loja: 67 | Região: Brotas e regiao | Código: 1899 | IE: 193.972.607', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('6b65b3a7-72ef-490f-86fb-a208587332b6'::uuid, 'DIST SAO ROQUE CALUMBI', '03.705.630/0011-21', 'FEIRA DE SANTANA', 'BA', 'Sao Roque', 'Endereço: R TOME DE SOUZA 259 | Bairro: CALUMBI | CEP: 44008-405 | Vendedor: VINICIUS | Loja: 4 | Região: Feira e regiao | Código: 1600 | IE: 183.298.450', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('6b950517-419e-4501-8516-cf3828ce4f15'::uuid, 'ASSAI PAU DA LIMA', '06.057.223/0381-44', 'SALVADOR', 'BA', 'Assai', 'Endereço: AV ALIOMAR BALEEIRO  2249 | Bairro: VILA CANARIA | Complemento: TR | CEP: 41390-710 | Vendedor: NIXON | Loja: 38 | Região: Vila Canaria e regiao | Código: 1899 | IE: 152.849.650', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('6c4658fe-d3cb-4c29-87d2-69cee5ad98ec'::uuid, 'CENCOSUD CD SERGIPE 2', '39.346.861/0527-14', 'NOSSA SENHORA DO SOCORRO', 'SE', 'Gbarbosa', 'Endereço: RODOVIA BR 235 S/N | Bairro: SOBRADO | CEP: 49158-622 | Vendedor: VINICIUS | Loja: 87 | Região: Aracaju e regiao | Código: 82 | IE: 27.207.487-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('6c47e9af-8ffd-4c82-a412-b68c7fa272aa'::uuid, 'SERRANA VILA LAURA', '02.212.937/0021-08', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R RAUL LEITE 46 | Bairro: VILA LAURA | CEP: 40270-010 | Vendedor: RICARDO | Loja: 15 | Região: Vila Canaria e regiao | Código: 2613 | IE: 145929622', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('6c4869d0-e979-46d1-b3d6-3f8d70f71e6a'::uuid, 'PAJEU PETROLINA FILIAL 15', '02.814.573/0017-41', 'PETROLINA', 'PE', 'Outros', 'Endereço: AVENIDA DOUTOR ULISSES GUIMARAES 110 | Bairro: JARDIM AMAZONAS | CEP: 56318-525 | Vendedor: ANTONIO | Loja: 11 | Região: Petrolina e regiao | Código: 2088 | IE: 0440481-57', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('6f48ce5a-b30c-4b7e-8e0e-a05b073d8b50'::uuid, 'GBARBOSA-158-JEQUIE', '39.346.861/0265-51', 'JEQUIE', 'BA', 'Gbarbosa', 'Endereço: RUA FRANCISCO AMEIRA | Bairro: CENTRO | CEP: 45200-090 | Vendedor: VINICIUS | Loja: 46 | Região: Conquista e regiao | Código: 82 | IE: 13.505.231', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('7024c4a0-b5a7-4b54-98d8-f5f3966c4cf6'::uuid, 'TRIELO CEASA BA', '44.459.499/0003-37', 'SALVADOR', 'BA', 'Trielo', 'Endereço: ROD. BA 526, Nº 1, BOX 15/16, GALPAO 05 | Bairro: CEASA | CEP: 41404-000 | Vendedor: TRIELO | Loja: 3 | Região: Ceasa Salvador | Código: 3081 | IE: 191217804', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('70b93f58-14b6-45c8-957a-fce19f9345b4'::uuid, 'HIPERIDEAL - VITORIA', '02.212.937/0027-95', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV SETE DE SETEMBRO, 304 | Bairro: CAMPO GRANDE | CEP: 40080-001 | Vendedor: RICARDO | Loja: 4 | Região: Suburbio e regiao | Código: 2613 | IE: 160.671.462', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('71df129d-f14c-430c-9789-cc8728b52faf'::uuid, 'DIST SAO ROQUE STO ESTEVAO', '03.705.630/0015-55', 'SANTO ESTEVAO', 'BA', 'Sao Roque', 'Endereço: AVENIDA GETULIO VARGAS 197 | Bairro: CENTRO | CEP: 44190-000 | Vendedor: VINICIUS | Loja: 6 | Região: Feira e regiao | Código: 1600 | IE: 211.680.039', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('71fe9bda-4f54-41da-8fad-17943057c0ed'::uuid, 'BIG BOMPRECO PORTAO', '97.422.620/0068-68', 'LAURO DE FREITAS', 'BA', 'Bompreco', 'Endereço: AV SANTOS DUMONT 7650 | Bairro: LAURO DE FREITAS | Complemento: PORTAO | CEP: 42700-130 | Vendedor: VINICIUS | Loja: 8 | Região: Lauro e regiao | Código: 1647 | IE: 50807172', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('745f2ace-221e-44a9-b604-f18ec6ba1d7a'::uuid, 'ATAKAREJO', '73.849.952/0024-44', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: AVENIDA AFRANIO PEIXOTO 003913 | Bairro: LOBATO | CEP: 40470-630 | Vendedor: RICARDO | Loja: 37 | Região: Suburbio e regiao | Código: 213 | IE: 161.502.404', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('74af37b2-fabc-4f0c-8d4b-fbd064bf01d5'::uuid, 'ECONOMART LUIS EDUARDO', '28.548.486/0023-21', 'LUIS EDUARDO MAGALHAES', 'BA', 'Economart', 'Endereço: AVENIDA ARNALDO HORACIO FERREIRA 228 | Bairro: BOA VISTA | CEP: 47853-054 | Vendedor: NIXON | Loja: 4 | Código: 6049 | IE: 217.312.158', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('75180f81-214c-42c9-9150-d85df3f79d69'::uuid, 'MATEUS JUAZEIRO', '03.995.515/0231-08', 'JUAZEIRO', 'BA', 'Mateus', 'Endereço: ROD BR 407 SN | Bairro: DISTRITO INDUSTRIAL | CEP: 48909-725 | Vendedor: ANTONIO | Loja: 41 | Região: Petrolina e regiao | Código: 2459 | IE: 183.305.794', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('7584f92c-8a6a-4c14-b2a2-78f3a4714e5d'::uuid, 'ATAKAREJO CABULA', '73.849.952/0008-24', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: ESTRADA DAS BARREIRAS | Bairro: CABULA | CEP: 41195-001 | Vendedor: RICARDO | Loja: 6 | Região: Brotas e regiao | Código: 213 | IE: 111689374', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('75b7bd04-8833-4f70-bec8-1f2a1916b1dd'::uuid, 'ATAKAREJO ALAGOINHA', '73.849.952/0012-00', 'ALAGOINHAS', 'BA', 'Atakarejo', 'Endereço: ALAMEDA DAS AGUAS SN | Bairro: NOVO HORIZONTE | CEP: 48009-886 | Vendedor: RICARDO | Loja: 29 | Região: Alagoinhas e regiao | Código: 213 | IE: 140.557.558', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('75c921e8-dec9-45f8-b872-096ee04ea949'::uuid, 'DELI E CIA GRACA', '08.957.752/0001-57', 'SALVADOR', 'BA', 'Outros', 'Endereço: AV EUCLIDES DA CUNHA 79 | Bairro: GRACA | CEP: 40150-120 | Vendedor: RICARDO | Loja: 1 | Região: Suburbio e regiao | Código: 218 | IE: 74571398', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('75de86c6-2ad9-43d9-9daa-dbe47a357b8c'::uuid, 'ROCHA CARNES - ARACAJU', '16.918.263/0001-14', 'ARACAJU', 'SE', 'Outros', 'Endereço: R MARIA VASCONCELOS DE ANDRADE 506 | Bairro: ARUANA | Complemento: LOTE 116 QD 05 LOT RES AR | CEP: 49000-626 | Vendedor: VINICIUS | Loja: 1 | Região: Aracaju e regiao | Código: 4237 | IE: 27.139.228-2', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('7677e9a5-05c2-4ee5-b5c0-97983ba42a88'::uuid, 'CDP SUPERMERCADOS  7 PORTAS NOVO', '43.941.941/0025-00', 'SALVADOR', 'BA', 'Cdp', 'Endereço: R CONEGO PEREIRA SN | Bairro: MACAUBAS | CEP: 40301-155 | Vendedor: NIXON | Loja: 19 | Região: Suburbio e regiao | Código: 4245 | IE: 237.159.373', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('77281877-d1d3-4126-a9b5-9de8b2a67d43'::uuid, 'G BARBOSA CJ ORLANDO DANTAS', '39.346.861/0022-96', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV FRANCISCO JOSE FONSECA 1337 | Bairro: CJ. ORLANDO DANTAS | CEP: 49042-000 | Vendedor: VINICIUS | Loja: 56 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.237-6', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('7755309f-6c99-4568-8c01-7574a3ee23cc'::uuid, 'GBARBOSA 015 FEIRA DE SANTANA', '39.346.861/0048-25', 'FEIRA DE SANTANA', 'BA', 'Gbarbosa', 'Endereço: RUA VASCO FILHO S/N | Bairro: CENTRO | CEP: 44025-290 | Vendedor: VINICIUS | Loja: 15 | Região: Feira e regiao | Código: 82 | IE: 56.626.465', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('77a12d80-7fef-4688-8ec8-7ec4e0ed18ce'::uuid, 'GBARBOSA HIPER SUL', '39.346.861/0072-55', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV MELICIO MACHADO 1060 | Bairro: ATALAIA | CEP: 49037-445 | Vendedor: VINICIUS | Loja: 70 | Região: Aracaju e regiao | Código: 82 | IE: 27.112.394-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('77c93742-4a88-4937-a5c1-328c3c60eccb'::uuid, 'MAXXI LAURO', '93.209.765/0304-58', 'LAURO DE FREITAS', 'BA', 'Atacadao', 'Endereço: AV SANTOS DUMONT KM 3 E5 3423 | Bairro: CENTRO | CEP: 42700-000 | Vendedor: NIXON | Loja: 7 | Região: Lauro e regiao | Código: 48 | IE: 76895315', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('781d43bb-b588-4949-9ebb-a92de53da5dd'::uuid, 'GBARBOSA-145 - FEIRA DE SANTANA', '39.346.861/0208-63', 'FEIRA DE SANTANA', 'BA', 'Gbarbosa', 'Endereço: AV JOSE FALCAO DA SILVA 150 | Bairro: QUEIMADINHA | CEP: 44050-512 | Vendedor: VINICIUS | Loja: 42 | Região: Feira e regiao | Código: 82 | IE: 12.598.654', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('785a11f3-16d8-45ee-ab48-925e29d0ca48'::uuid, 'ECONOMART  ITABUNA', '28.548.486/0030-50', 'ITABUNA', 'BA', 'Economart', 'Endereço: AVENIDA IBICARAI S/N | Bairro: NOVA ITABUNA | CEP: 45611-000 | Vendedor: NIXON | Loja: 7 | Região: Ilheus e regiao | Código: 6049 | IE: 232.811.210', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('78666fb0-9672-4d48-993f-6d05b568f881'::uuid, 'SUPERMERCADO JL', '05.743.186/0001-92', 'ITABERABA', 'BA', 'Outros', 'Endereço: RUA MANOEL FLORENCIO 434 | Bairro: SAO JOAO | CEP: 46880-000 | Vendedor: RICARDO | Loja: 1 | Região: Itaberaba e regiao | Código: 6020 | IE: 59.899.578', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('79a54700-e6eb-43ef-ac3b-908fb992a293'::uuid, 'HIPERIDEAL ORLA', '02.212.937/0029-57', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV OCTAVIO MANGABEIRA, ARMACAO | Bairro: ARMACAO | Complemento: LOJA 4435 | CEP: 41750-240 | Vendedor: RICARDO | Loja: 28 | Região: Paralela e regiao | Código: 2613 | IE: 168.988.825', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('7a928b8b-697e-4cce-bdf2-93a5b2cb5884'::uuid, 'ATACADAO  CANABRAVA', '75.315.333/0311-79', 'SALVADOR', 'BA', 'Atacadao', 'Endereço: R ART MIO CASTRO VALENTE 1 | Bairro: CANABRAVA | CEP: 41260-300 | Vendedor: NIXON | Loja: 76 | Região: Vila Canaria e regiao | Código: 2 | IE: 180.594.661', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('7b5f3f89-4b78-4237-a0b4-020f54d34286'::uuid, 'ATAC EUNAPOLIS', '75.315.333/0093-27', 'EUNAPOLIS', 'BA', 'Atacadao', 'Endereço: AV ANTONIO CARLOS MAGALHAES SN | Bairro: RECANTO DAS ARVORES | CEP: 45825-580 | Vendedor: NIXON | Loja: 31 | Região: Porto Seguro e regiao | Código: 2 | IE: 82440840', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('7bcc284c-6050-449e-9c49-c47e4c4194fb'::uuid, 'GBARBOSA-123-BROTAS', '39.346.861/0193-42', 'SALVADOR', 'BA', 'Gbarbosa', 'Endereço: VALE DO OGUNJA 304 | Bairro: BROTAS | CEP: 40290-500 | Vendedor: VINICIUS | Loja: 32 | Região: Brotas e regiao | Código: 82 | IE: 81.846.878', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('7e6ed9fa-9633-47fb-afe6-71eeac92fd0b'::uuid, 'GBARBOSA 029 BROTAS', '39.346.861/0059-88', 'SALVADOR', 'BA', 'Gbarbosa', 'Endereço: AV ANTONIO CARLOS MAGALHAES, 4479 | Bairro: BROTAS | CEP: 40280-000 | Vendedor: VINICIUS | Loja: 8 | Região: Brotas e regiao | Código: 82 | IE: 56.625.880', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('7faaa33d-e79b-4568-a4de-7acc00abaf83'::uuid, 'RMIX IMBUI', '06.337.087/0003-35', 'SALVADOR', 'BA', 'Redemix', 'Endereço: AV JORGE AMADO 980 | Bairro: IMBUI | CEP: 41720-040 | Vendedor: VINICIUS | Loja: 2 | Região: Paralela e regiao | Código: 186 | IE: 80826204', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('813e6685-1477-44ac-bffb-a9971bc0b275'::uuid, 'GBARBOSA-125-JUAZEIRO SANTO ANTONIO', '39.346.861/0182-90', 'JUAZEIRO', 'BA', 'Gbarbosa', 'Endereço: RUA PRINCESA ISABEL | Bairro: SANTO ANTONIO | CEP: 48903-130 | Vendedor: VINICIUS | Loja: 33 | Região: Petrolina e regiao | Código: 82 | IE: 81.359.536', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('81901d59-a4ee-4b38-9bee-0de47e1408df'::uuid, 'GBARBOSA JARDINS', '39.346.861/0040-78', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV DEP SILVIO TEIXEIRA 831 | Bairro: JARDINS | CEP: 49025-100 | Vendedor: VINICIUS | Loja: 68 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.239-2', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('82fea524-b119-4baf-8bdf-5fbe55dd9b41'::uuid, 'ASSAI CAMACARI', '06.057.223/0383-06', 'CAMACARI', 'BA', 'Assai', 'Endereço: AVENIDA JORGE AMADO | Bairro: INDUSTRIAL | Complemento: LOTE 02 A | CEP: 42800-311 | Vendedor: NIXON | Loja: 35 | Região: Camacari e regiao | Código: 1899 | IE: 152.922.810', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('834341b2-e70d-4fbe-98ce-5b8e5788b526'::uuid, 'ATAC PETROLINA', '75.315.333/0244-74', 'PETROLINA', 'PE', 'Atacadao', 'Endereço: AV DR. ULYSSES GUIMARAES SN | Bairro: JARDIM AMAZONAS | Complemento: QUADRA142 LOTES 120/183 | CEP: 56318-525 | Vendedor: ANTONIO | Loja: 51 | Região: Petrolina e regiao | Código: 2 | IE: 83831037', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('84715c46-50cb-43cf-b380-4a8dc30e1c7e'::uuid, 'MABENI ARACAJU', '57.924.925/0001-46', 'ARACAJU', 'SE', 'Outros', 'Endereço: RUA MANOEL MESSIAS MELO 676 | Bairro: ARUANA | CEP: 49000-179 | Vendedor: VINICIUS | Loja: 1 | Região: Aracaju e regiao | Código: 4607 | IE: 27.221.763-8', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('86c284c9-688f-4f33-8d11-7fb4f666b0e7'::uuid, 'CDP SUPER CENTRO MATA LOJA 10', '43.941.941/0006-47', 'MATA DE SAO JOAO', 'BA', 'Cdp', 'Endereço: PC BARAO ACU DA TORRE 41 | Bairro: CENTRO - SEDE | CEP: 48280-000 | Vendedor: NIXON | Loja: 2 | Região: Alagoinhas e regiao | Código: 4245 | IE: 195180153', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('87784171-1c89-4c3c-83f4-038a866fe08c'::uuid, 'G. BARBOSA J. C. DE ARAUJO', '39.346.861/0023-77', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV OSVALDO ARANHA 1240 | Bairro: J. C. DE ARAUJO | CEP: 49085-410 | Vendedor: VINICIUS | Loja: 63 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.260-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('87adf8fc-3fc4-4af4-9e4f-d63d22d22156'::uuid, 'ATAKAREJO CALCADA', '73.849.952/0004-09', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: R ELIAS NAZARE 22 | Bairro: CALCADA | CEP: 40411-000 | Vendedor: RICARDO | Loja: 4 | Região: Suburbio e regiao | Código: 213 | IE: 78213995', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('87d6aa10-7f13-49d7-be5a-20ba99c77b21'::uuid, 'RMIX  STELLA MARIS', '06.337.087/0015-79', 'SALVADOR', 'BA', 'Redemix', 'Endereço: R RUBEM VALENTIM 459 | Bairro: STELLA MARIS | CEP: 41600-685 | Vendedor: VINICIUS | Loja: 11 | Região: Lauro e regiao | Código: 186 | IE: 176.848.181', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('87e8c870-cd83-48fc-8732-2ed5c6f86a67'::uuid, 'ASSAI JEQUIE', '06.057.223/0313-01', 'JEQUIE', 'BA', 'Assai', 'Endereço: AVENIDA CESAS BORGES SN | Bairro: SAO JUDAS TADEU | Complemento: PARTE1 | CEP: 45203-830 | Vendedor: ANTONIO | Loja: 15 | Região: Conquista e regiao | Código: 1899 | IE: 131656891', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('8872c06b-52ab-4912-beff-7405dc311cf4'::uuid, 'RMIX VITORIA', '06.337.087/0009-20', 'SALVADOR', 'BA', 'Redemix', 'Endereço: AV SETE DE SETEMBRO 1839 | Bairro: VITORIA | Complemento: TERREO | CEP: 40080-002 | Vendedor: VINICIUS | Loja: 10 | Região: Suburbio e regiao | Código: 186 | IE: 157.653.968', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('88e63c8b-b93a-41e3-9576-d4dae5f56e5c'::uuid, 'HIPER CARNE JABOTIANA', '50.747.044/0001-58', 'ARACAJU', 'SE', 'Bombom', 'Endereço: RUA MAJ JOAO TELES 44 | Bairro: JABOTIANA | CEP: 49095-230 | Vendedor: VINICIUS | Loja: 1 | Região: Aracaju e regiao | Código: 4582 | IE: 27.192.235-4', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('8af9213d-96ad-4ddc-a4f2-30b1c8687420'::uuid, 'ASSAI SR DO BONFIM', '06.057.223/0407-18', 'SENHOR DO BONFIM', 'BA', 'Assai', 'Endereço: RUA OTAVIO JOSE DE CARVALHO 650 | Bairro: UMBURANA | CEP: 48970-000 | Vendedor: ANTONIO | Loja: 80 | Região: Sr Bonfim e regiao | Código: 1899 | IE: 162.235.149', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('8afb4a8e-d6ba-4162-bf91-7497f4394b31'::uuid, 'CDP BOCA DO RIO LOJA 07', '31.977.294/0001-30', 'SALVADOR', 'BA', 'Cdp', 'Endereço: R PROFESSOR PINTO DE AGUIAR SN | Bairro: BOCA DO RIO | CEP: 41710-000 | Vendedor: NIXON | Loja: 1 | Região: Paralela e regiao | Código: 2647 | IE: 153.232.707', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('8bdd8dee-7d4c-4bc2-9d97-25e7ec598b2e'::uuid, 'ATAKAREJO  CATU', '73.849.952/0054-60', 'CATU', 'BA', 'Atakarejo', 'Endereço: AVENIDA PADRE CUPERTINO 00 | Bairro: CENTRO | Complemento: CENTRO NUMERO 00 | CEP: 48110-000 | Vendedor: RICARDO | Loja: 41 | Região: Alagoinhas e regiao | Código: 213 | IE: 225533622', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('8beb607d-0afc-4ab8-8db1-c6a60e05cc8f'::uuid, 'GBARBOSA  SAO CRISTOVAO', '39.346.861/0043-10', 'SAO CRISTOVAO', 'SE', 'Gbarbosa', 'Endereço: AVENIDA AYRTON SENNA S/N | Bairro: CONJ. ROSA MARIA | CEP: 49100-000 | Vendedor: VINICIUS | Loja: 74 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.258-9', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('8bef9cc8-b94d-40f1-86a2-2237cd417244'::uuid, 'GBARBOSA-272- CABULA', '39.346.861/0429-13', 'SALVADOR', 'BA', 'Gbarbosa', 'Endereço: RUA ESTRADA DAS BARREIRAS N°992 | Bairro: CABULA | CEP: 41185-500 | Vendedor: VINICIUS | Loja: 47 | Região: Brotas e regiao | Código: 82 | IE: 105.585.178', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('8db410bd-783e-49f7-bb63-a5e62c9868ee'::uuid, 'PERINI GRACA', '11.965.515/0008-19', 'SALVADOR', 'BA', 'Perini', 'Endereço: AVENIDA PRINCESA LEOPOLDINA 398 | Bairro: GRACA | CEP: 40150-080 | Vendedor: VINICIUS | Loja: 4 | Região: Suburbio e regiao | Código: 69 | IE: 88293217', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('8ebdb877-0127-4ed1-af9c-ae429f2daa1f'::uuid, 'ATAKAREJO IGUATEMI', '73.849.952/0001-58', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: AV SANTIAGO DE COMPOSTELA 425 | Bairro: PARQUE BELA VISTA | CEP: 40279-150 | Vendedor: RICARDO | Loja: 1 | Região: Pituba e regiao | Código: 213 | IE: 38971309', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('9093c21f-7ebb-4214-a301-c4845aa776b2'::uuid, 'SERRANA - TORORO', '02.212.937/0009-03', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV VALE DO TORORO SN | Bairro: TORORO | Complemento: LOJA 36 | CEP: 40050-290 | Vendedor: RICARDO | Loja: 9 | Região: Suburbio e regiao | Código: 2613 | IE: 69096102', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('90e0cb88-1193-48f7-8ac7-f67756634825'::uuid, 'PONTO VERDE VILA LAURA', '00.658.059/0003-33', 'SALVADOR', 'BA', 'Redemix', 'Endereço: RUA RAUL LEITE, 116 | Bairro: VILA LAURA | CEP: 40270-010 | Vendedor: VINICIUS | Loja: 3 | Região: Vila Canaria e regiao | Código: 1763 | IE: 50009088', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('91deda9b-1420-4412-92c3-6d789dd5a6a5'::uuid, 'HIPER UNIMAR AREMBEPE', '07.896.520/0005-05', 'CAMACARI', 'BA', 'Unimar', 'Endereço: R ALTO DA CONCEICAO SN | Bairro: AREMBEPE (ABRANTES) | CEP: 42830-570 | Vendedor: NIXON | Loja: 2 | Região: Camacari e regiao | Código: 203 | IE: 166.387.904', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('9240abf4-d4d6-4ad6-9b38-e452dce3ab31'::uuid, 'DIST SAO ROQUE CENTRO', '03.705.630/0002-30', 'FEIRA DE SANTANA', 'BA', 'Sao Roque', 'Endereço: R CASTRO ALVES 1473 | Bairro: CENTRO | CEP: 44001-184 | Vendedor: VINICIUS | Loja: 2 | Região: Feira e regiao | Código: 1600 | IE: 65.232.825', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('926ebb66-c282-4db5-a85f-f61d864f8e2c'::uuid, 'ASSAI JUAZEIRO', '06.057.223/0315-65', 'JUAZEIRO', 'BA', 'Assai', 'Endereço: AVENIDA SAO JOAO 1947 | Bairro: JARDIM VITORIA | CEP: 48900-441 | Vendedor: ANTONIO | Loja: 81 | Região: Petrolina e regiao | Código: 1899 | IE: 131.710.674', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('94639b66-bf4f-4307-870c-8cde6cd35390'::uuid, 'ASSAI PORTO', '06.057.223/0364-43', 'ITABAIANA', 'SE', 'Assai', 'Endereço: AV EDUARDO PAIXAO ROCHA 1667 | Bairro: PORTO | CEP: 49510-190 | Vendedor: NIXON | Loja: 44 | Região: Itabaiana e regiao | Código: 1899 | IE: 27.158.258-8', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('95ba04c8-21b9-4871-ac77-3286544189b4'::uuid, 'GBARBOSA-144 - FEIRA DE SANTANA', '39.346.861/0207-82', 'FEIRA DE SANTANA', 'BA', 'Gbarbosa', 'Endereço: AV GETULIO VARGAS 523 | Bairro: CENTRO | CEP: 44001-525 | Vendedor: VINICIUS | Loja: 41 | Região: Feira e regiao | Código: 82 | IE: 12.598.320', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('960cd7d9-232b-4a7c-9672-81d09c0f1d17'::uuid, 'HIPERIDEAL PRAIA DO FORTE', '02.212.937/0014-70', 'MATA DE SAO JOAO', 'BA', 'Hiperideal', 'Endereço: ROD BA 099 KM 54 S/N | Bairro: PRAIA DO FORTE | Complemento: LOTE 04 | CEP: 48280-000 | Vendedor: RICARDO | Loja: 3 | Região: Alagoinhas e regiao | Código: 2613 | IE: 82.707.448', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('969b5a28-2a4c-4f81-9699-156993f21866'::uuid, 'SAMS PITUBA', '00.063.960/0048-64', 'SALVADOR', 'BA', 'Sams', 'Endereço: AV ANTONIO CARLOS MAGALHAES 3410 | Bairro: PITUBA | CEP: 41810-150 | Vendedor: VINICIUS | Loja: 5 | Região: Pituba e regiao | Código: 47 | IE: 68090489', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('96d3e14c-b65d-4bb5-b639-506ebe425d2b'::uuid, 'DIST SAO ROQUE CONCEICAO', '03.705.630/0013-93', 'FEIRA DE SANTANA', 'BA', 'Sao Roque', 'Endereço: RUA CALAMAR 267 | Bairro: CONCEICAO | CEP: 44065-104 | Vendedor: VINICIUS | Loja: 7 | Região: Feira e regiao | Código: 1600 | IE: 211.679.860', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('97e007f0-0b8e-4ca7-817b-2e5e6271df4b'::uuid, 'ATACADAO KM 25', '75.315.333/0225-01', 'SIMOES FILHO', 'BA', 'Atacadao', 'Endereço: AV ENGENHEIRO WALTER ARAGAO DE SOUZA 473 | Bairro: KM 25 | CEP: 43700-000 | Vendedor: NIXON | Loja: 71 | Região: Simoes Filho e regiao | Código: 2 | IE: 149.788.599', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('989ef914-c730-4e82-b218-917cfc785596'::uuid, 'SUPERMERCADO BOMBOM LTDA GRAGERU', '04.136.442/0003-82', 'ARACAJU', 'SE', 'Bombom', 'Endereço: AVENIDA DEP PEDRO VALADARES 780 | Bairro: GRAGERU | CEP: 49026-115 | Vendedor: VINICIUS | Loja: 3 | Região: Aracaju e regiao | Código: 4234 | IE: 27.228.488-2', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('9991330e-2303-474a-b652-017fc5a58265'::uuid, 'PGA VILLA MIX II', '21.553.781/0004-64', 'PETROLINA', 'PE', 'Outros', 'Endereço: AVENIDA AVENIDA JOAO PERNAMBUCO 120 | Bairro: JATOBA | CEP: 56332-360 | Vendedor: ANTONIO | Loja: 2 | Região: Petrolina e regiao | Código: 2860 | IE: 114510334', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('9a80d0ce-3f66-47a9-820d-9eee788b174f'::uuid, 'GBARBOSA CONJ BUGIO', '39.346.861/0042-30', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV POCO DO MERO 285 | Bairro: CONJUNTO BUGIO | CEP: 49090-000 | Vendedor: VINICIUS | Loja: 71 | Região: Aracaju e regiao | Código: 82 | IE: 271052481', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('9ad6eac5-20c5-486e-8c92-f55c7e7f2d90'::uuid, 'GBARBOSA 029 CIDADE NOVA', '39.346.861/0091-18', 'FEIRA DE SANTANA', 'BA', 'Gbarbosa', 'Endereço: AV.EDUARDO FROES DA MOTA,6281 | Bairro: CIDADE NOVA | CEP: 44030-730 | Vendedor: VINICIUS | Loja: 19 | Região: Feira e regiao | Código: 82 | IE: 73.286.576', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('9b41561b-08cb-4207-9c54-01d886959362'::uuid, 'SAMS ARACAJU', '00.063.960/0561-55', 'ARACAJU', 'SE', 'Sams', 'Endereço: AV DEP SILVIO TEIXEIRA, 870 | Bairro: JARDINS | CEP: 49025-100 | Vendedor: VINICIUS | Loja: 7 | Região: Aracaju e regiao | Código: 47 | IE: 27165570-4', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('9e80c5f3-4f97-4353-9e48-dfb9e43f716a'::uuid, 'CDP SETE PORTAS LOJA 09', '36.613.171/0001-33', 'SALVADOR', 'BA', 'Cdp', 'Endereço: R CONEGO PEREIRA SN | Bairro: BARBALHO | CEP: 40300-756 | Vendedor: NIXON | Loja: 1 | Região: Suburbio e regiao | Código: 2797 | IE: 166.113.202', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('9f2ffa47-42b2-4d2f-8652-bb57c6a6e706'::uuid, 'GBARBOSA SIQUEIRA CAMPOS', '39.346.861/0036-91', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: R CARLOS CORREIA 453 | Bairro: SIQUEIRA CAMPOS | Complemento: LOJA 05 | CEP: 49075-160 | Vendedor: VINICIUS | Loja: 69 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.240-6', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('a0bcf7f3-db80-41e7-9ede-d675de80b05b'::uuid, 'GBARBOSA 076 TOMBA', '39.346.861/0113-68', 'FEIRA DE SANTANA', 'BA', 'Gbarbosa', 'Endereço: RUA COMENDADOR GOMES S/N | Bairro: TOMBA | CEP: 44064-000 | Vendedor: VINICIUS | Loja: 26 | Região: Feira e regiao | Código: 82 | IE: 77.013.310', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('a4b0dda3-a89f-471d-a043-cb576c31bbb7'::uuid, 'ROSELLY FERREIRA SALES DA SILVA LTDA', '12.138.732/0003-93', 'SALVADOR', 'BA', 'Outros', 'Endereço: RUA JUVENCIO ERUDILHO SN | Bairro: CENTRO | CEP: 44002-528 | Vendedor: VINICIUS | Loja: 1 | Região: Feira e regiao | Código: 6041 | IE: 203.518.975', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('a4c7e8f7-d659-4c4e-8b1e-c9c0c11ad848'::uuid, 'ATAKAREJO BOCA DO RIO', '73.849.952/0002-39', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: R ABELARDO ANDRADE DE CARVALHO,472 | Bairro: BOCA DO RIO | CEP: 41706-710 | Vendedor: RICARDO | Loja: 7 | Região: Paralela e regiao | Código: 213 | IE: 72567935', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('a5d9ceb9-f0b7-49c5-9631-93b314466887'::uuid, 'ATAKAREJO', '73.849.952/0054-60', 'CATU', 'BA', 'Atakarejo', 'Endereço: AVENIDA PADRE CUPERTINO 00 | Bairro: CENTRO | CEP: 48110-000 | Vendedor: RICARDO | Loja: 42 | Região: Alagoinhas e regiao | Código: 213 | IE: 225533622', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('a6927a57-9d00-4e02-b551-6ceafed51e89'::uuid, 'HIPERIDEAL FEIRA DE SANTANA', '02.212.937/0042-24', 'FEIRA DE SANTANA', 'BA', 'Hiperideal', 'Endereço: AVENIDA NOIDE FERREIRA DE CERQUEIRA S/N | Bairro: LAGOA SALGADA | CEP: 44082-225 | Vendedor: RICARDO | Loja: 31 | Região: Feira e regiao | Código: 2613 | IE: 216.851.764', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('a8d0b0dc-c1a4-4cd8-8dd1-f2f6a0643337'::uuid, 'ATACADAO', '93.209.765/0550-19', 'CAMACARI', 'BA', 'Atacadao', 'Endereço: RODOVIA BA 535  VIA PARAFUSO S/N | Bairro: INDUSTRIAL | CEP: 42800-937 | Vendedor: NIXON | Loja: 26 | Região: Camacari e regiao | Código: 48 | IE: 211956538', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('a9acb7b2-8d4c-4f58-978f-c8358d8146f0'::uuid, 'ATAKAREJO ILHEUS', '73.849.952/0042-26', 'ILHEUS', 'BA', 'Atakarejo', 'Endereço: AVENIDA TANCREDO NEVES SN | Bairro: OLIVENCA | CEP: 45660-500 | Vendedor: RICARDO | Loja: 20 | Região: Ilheus e regiao | Código: 213 | IE: 214.063.932', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('a9d32c9f-9452-4d8d-a02d-2ac58ca9cc52'::uuid, 'KI DISTRIBUIDORA E ATACADO', '43.506.193/0001-60', 'NOSSA SENHORA DA GLORIA', 'SE', 'Outros', 'Endereço: RODOVIA JUSCELINO KUBITSCHEK S/N | Bairro: ZONA RURAL | CEP: 49680-000 | Vendedor: VINICIUS | Loja: 1 | Região: Gloria e regiao | Código: 4586 | IE: 27.179.394-5', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('aa69c868-aa23-4f1e-9a50-60481a7b0473'::uuid, 'GBARBOSA 037 ALAGOINHAS', '39.346.861/0056-35', 'ALAGOINHAS', 'BA', 'Gbarbosa', 'Endereço: RUA DR.DANTAS BIAO S/N | Bairro: CENTRO | CEP: 48000-000 | Vendedor: VINICIUS | Loja: 22 | Região: Alagoinhas e regiao | Código: 82 | IE: 56.627.266', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('aa6f7bdf-77df-4dd9-beaa-6e7823fa3e57'::uuid, 'ASSAI BARRIS', '06.057.223/0470-54', 'SALVADOR', 'BA', 'Assai', 'Endereço: R DO SALETE 30 | Bairro: BARRIS | CEP: 40070-200 | Vendedor: NIXON | Loja: 51 | Região: Paralela e regiao | Código: 1899 | IE: 183.250.038', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ab67e053-e87f-4bd9-87c3-fb090a0487b1'::uuid, 'DIST SAO ROQUE  MANGABEIRA', '03.705.630/0004-00', 'FEIRA DE SANTANA', 'BA', 'Sao Roque', 'Endereço: AV FRANCISCO FRAGA MAIA SN | Bairro: MANGABEIRA | CEP: 44056-232 | Vendedor: VINICIUS | Loja: 3 | Região: Feira e regiao | Código: 1600 | IE: 96.631.649', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ab7b9cd9-f854-49fd-a108-ea378570f35e'::uuid, 'GBARBOSA 112 VITORIA DA CONQUISTA', '39.346.861/0144-64', 'VITORIA DA CONQUISTA', 'BA', 'Gbarbosa', 'Endereço: AV.OLIVIA FLORES S/N | Bairro: CANDEIAS | CEP: 45028-100 | Vendedor: VINICIUS | Loja: 30 | Região: Conquista e regiao | Código: 82 | IE: 87.989.892', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('aba2c6a0-85c0-4f84-9e48-242f8d2d99c8'::uuid, 'ATAC MARES', '93.209.765/0315-00', 'SALVADOR', 'BA', 'Atacadao', 'Endereço: AV COMENDADOR BASTOS SN | Bairro: MARES | CEP: 40445-211 | Vendedor: NIXON | Loja: 8 | Região: Suburbio e regiao | Código: 48 | IE: 77998249', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('acb52f6e-3038-4b57-9e75-e6448ab9e617'::uuid, 'GBARBOSA-133 -JUAZEIRO CENTRO', '39.346.861/0194-23', 'JUAZEIRO', 'BA', 'Gbarbosa', 'Endereço: TRAVESSA MATATU S/N | Bairro: CENTRO | CEP: 48904-570 | Vendedor: ANTONIO | Loja: 37 | Região: Petrolina e regiao | Código: 82 | IE: 11.731.665', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('adc93998-748b-4f06-b147-cc4af5362be5'::uuid, 'GBARBOSA 104 VALENCA', '39.346.861/0136-54', 'VALENCA', 'BA', 'Gbarbosa', 'Endereço: AV.INDL MARITA ALMEIDA S/N | Bairro: CENTRO | CEP: 45400-000 | Vendedor: VINICIUS | Loja: 28 | Região: Ilheus e regiao | Código: 82 | IE: 84.248.482', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ae2ff15e-e9b4-42ac-b198-2b28ddfd94ab'::uuid, 'ATAKAREJO  LAGARTO', '73.849.952/0055-40', 'LAGARTO', 'SE', 'Atakarejo', 'Endereço: AVENIDA SIN ANTONIO FRANCISCO DA ROCHA-L | Bairro: EXPOSICAO | CEP: 49400-000 | Vendedor: RICARDO | Loja: 44 | Região: Aracaju e regiao | Código: 213 | IE: 27.225.678-1', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('aeb70e93-b5a9-4b77-b7b7-396db818fd09'::uuid, 'PONTO VERDE SETE PORTAS', '00.658.059/0001-71', 'SALVADOR', 'BA', 'Redemix', 'Endereço: LRG DAS SETE PORTAS, 06 | Bairro: SETE PORTAS | Complemento: ED EL CIDADE TERREO SOBRE LOJA | CEP: 40040-375 | Vendedor: VINICIUS | Loja: 1 | Região: Suburbio e regiao | Código: 1763 | IE: 41985878', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('af2f6cee-5058-44ee-8bc9-8c9bc3315d95'::uuid, 'ATAKAREJO ARACAJU PARAISO', '73.849.952/0060-08', 'ARACAJU', 'SE', 'Atakarejo', 'Endereço: AVENIDA PRES TANCREDO NEVES 8050 | Bairro: NOVO PARAISO | CEP: 49082-005 | Vendedor: RICARDO | Loja: 46 | Região: Aracaju e regiao | Código: 213 | IE: 27.232.185-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b138829c-45fc-4b47-91bd-71fecf4d8650'::uuid, 'GBARBOSA-274-GUARAJUBA', '39.346.861/0415-18', 'CAMACARI', 'BA', 'Gbarbosa', 'Endereço: RODOVIA BA 099,KM 42 S/N | Bairro: GUARAJUBA | CEP: 42827-000 | Vendedor: VINICIUS | Loja: 48 | Região: Camacari e regiao | Código: 82 | IE: 103.870.056', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b1d4d315-0c6a-495a-a010-531efd9a6697'::uuid, 'ASSAI VASCO DA GAMA 4049', '06.057.223/0484-50', 'SALVADOR', 'BA', 'Assai', 'Endereço: AV VASCO DA GAMA 4049 | Bairro: FEDERACAO | CEP: 40230-731 | Vendedor: NIXON | Loja: 53 | Região: Vasco e regiao | Código: 1899 | IE: 188.455.405', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b2a58381-1cad-40bc-8db7-8ca937423643'::uuid, 'ATAKAREJO  FEIRA SIM', '73.849.952/0059-74', 'FEIRA DE SANTANA', 'BA', 'Atakarejo', 'Endereço: AVENIDA FERNANDO PINTO DE QUEIROZ S/N | Bairro: SIM | CEP: 44085-620 | Vendedor: RICARDO | Loja: 40 | Região: Feira e regiao | Código: 213 | IE: 228.338.707', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b2f16f97-9686-43f6-8169-2f9170ef1cc2'::uuid, 'CBD-CAMINHO DAS ARVO', '47.508.411/2551-46', 'SALVADOR', 'BA', 'Cdb', 'Endereço: AVENIDA TANCREDO NEVES N 148 | Bairro: CAMINHO DAS ARVORES | CEP: 41820-908 | Vendedor: RICARDO | Loja: 31 | Região: Pituba e regiao | Código: 11 | IE: 131800575', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b301e7e3-489e-4027-b3eb-12936869109d'::uuid, 'ATAKAREJO DISTRIBUIDOR DE ALIMENTOS E BE', '73.849.952/0028-78', 'JEQUIE', 'BA', 'Atakarejo', 'Endereço: AVENIDA PRESIDENTE JOAO GOULART 171 | Bairro: CENTRO | CEP: 45200-070 | Vendedor: RICARDO | Loja: 26 | Região: Conquista e regiao | Código: 213 | IE: 174.964.200', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b31309b7-ab37-4ce8-a390-a178d8739e5c'::uuid, 'HIPERIDEAL LJ 108 - PITUBA', '02.212.937/0012-09', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R RUA CEARA 339 | Bairro: PITUBA | Complemento: LOTEAMENTO VELA BRANCA | CEP: 41830-450 | Vendedor: RICARDO | Loja: 1 | Região: Pituba e regiao | Código: 2613 | IE: 74346983', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b31515e7-905f-4c4c-8564-3e11ac663192'::uuid, 'COGEALI LJ 01 PARIPE', '07.348.911/0001-53', 'SALVADOR', 'BA', 'Redemix', 'Endereço: RUA DR EDUARDO DOTTO 81 | Bairro: PARIPE | CEP: 40800-010 | Vendedor: VINICIUS | Loja: 1 | Região: Suburbio e regiao | Código: 208 | IE: 66578354', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b57fb967-d588-4b29-b3f0-ac09ed367526'::uuid, 'GBARBOSA CD SERGIPE', '39.346.861/0001-61', 'NOSSA SENHORA DO SOCORRO', 'SE', 'Gbarbosa', 'Endereço: RODOVIA BR 235 S/N | Bairro: SOBRADO | Complemento: KM 04 ANEXO I | CEP: 49158-622 | Vendedor: VINICIUS | Loja: 84 | Região: Aracaju e regiao | Código: 82 | IE: 271052104', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b5cc84c6-f7e4-489d-8624-5d4f5ee65252'::uuid, 'CDP ESPLANADA', '43.941.941/0019-61', 'DIAS D''AVILA', 'BA', 'Cdp', 'Endereço: AVENIDA MARIO ANDREAZZA - 60 CENTRO, ESP | Bairro: ESPALANADA | Complemento: 60 CENTRO | CEP: 48370-000 | Vendedor: NIXON | Loja: 12 | Região: Alagoinhas e regiao | Código: 4245 | IE: 222.072.348', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b66f4312-c503-4f26-9f4f-4b0d841fe8fb'::uuid, 'ROCHA CARNES - NOSSA SENHORA DO SOCORRO', '16.918.263/0003-86', 'NOSSA SENHORA DO SOCORRO', 'SE', 'Outros', 'Endereço: AV A 58 | Bairro: MARCOS FREIRE | CEP: 49160-000 | Vendedor: VINICIUS | Loja: 3 | Região: Aracaju e regiao | Código: 4237 | IE: 27.180.095-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b7424318-9749-46c8-a556-bb32ab57c81a'::uuid, 'SERRANA CANELA', '02.212.937/0019-85', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV REITOR MIGUEL CALMON 1977 | Bairro: CANELA | Complemento: EDIF HIPERHIDEAL SUPERMERCADOS LOJA | CEP: 40110-100 | Vendedor: RICARDO | Loja: 26 | Região: Suburbio e regiao | Código: 2613 | IE: 140.382.679', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b765b285-3673-4ec2-96c9-a8a320b29d61'::uuid, 'ASSAI INACIO BARBOSA', '06.057.223/0518-33', 'ARACAJU', 'SE', 'Assai', 'Endereço: AV ADELIA FRANCO 3735 | Bairro: INACIO BARBOSA | CEP: 49040-020 | Vendedor: NIXON | Loja: 54 | Região: Aracaju e regiao | Código: 1899 | IE: 27.182.055-1', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b80c434f-01bc-4fc0-82c1-72b15cdfe84b'::uuid, 'SERRANA STELLA MARIS II', '02.212.937/0006-60', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R MISSIONARIO OTTO NELSON 100 | Bairro: STELLA MARIS | CEP: 41600-650 | Vendedor: RICARDO | Loja: 6 | Região: Lauro e regiao | Código: 2613 | IE: 58.387.333', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b92c00af-183a-4383-90d1-216e8e79b0a6'::uuid, 'TOTAL ATACADO', '05.466.724/0003-00', 'LAURO DE FREITAS', 'BA', NULL, 'Endereço: AVENIDA LUIZ TARQUINIO PONTES 827 | Bairro: CENTRO | CEP: 42702-420 | Vendedor: NIXON | Loja: 1 | Região: Lauro e regiao | Código: 5116 | IE: 157.994.708', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('b9713c48-3ea8-4e14-8c0b-26044b7f2423'::uuid, 'CESTA DO POVO', '43.941.941/0003-02', 'CATU', 'BA', 'Cdp', 'Endereço: RUA DESEMBARGADOR PEDRO RIBEIRO 62 | Bairro: CENTRO | CEP: 48110-000 | Vendedor: NIXON | Loja: 18 | Região: Alagoinhas e regiao | Código: 4245 | IE: 189.576.707', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('baeafc8e-172b-4d60-8585-70a2ddffa4a2'::uuid, 'HIPERIDEAL HORTO JARDINS ACM', '02.212.937/0022-80', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AVENIDA JURACY MAGALHAES JUNIOR 1034 | Bairro: HORTO FLORESTAL | CEP: 40295-140 | Vendedor: RICARDO | Loja: 30 | Região: Vasco e regiao | Código: 2613 | IE: 147.186.841', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('baf477ee-a664-4621-8c22-9910e787d3e5'::uuid, 'MASSIMO LUZIA', '31.432.054/0001-50', 'ARACAJU', 'SE', 'Massimo', 'Endereço: AV HERMES FONTES  1568 | Bairro: LUZIA | CEP: 49045-760 | Vendedor: VINICIUS | Loja: 1 | Região: Aracaju e regiao | Código: 2652 | IE: 271618353', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('bbdd5687-eec4-4437-9704-3a9f205ba567'::uuid, 'ATAC CAJAZEIRAS', '75.315.333/0058-44', 'SALVADOR', 'BA', 'Atacadao', 'Endereço: R COQUEIRO GRANDE 614 | Bairro: CAJAZEIRAS | CEP: 41342-840 | Vendedor: NIXON | Loja: 27 | Região: Brotas e regiao | Código: 2 | IE: 69287831', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('bd02a4de-da0a-410a-9b24-39879163deaa'::uuid, 'GBARBOSA 036 PAULO AFONSO', '39.346.861/0061-00', 'PAULO AFONSO', 'BA', 'Gbarbosa', 'Endereço: AV.APOLONIO SALE | Bairro: CENTRO | CEP: 48608-100 | Vendedor: VINICIUS | Loja: 21 | Região: Paulo Afonso e regiao | Código: 82 | IE: 56.627.266', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('bd9574f4-d3f1-4e6c-b874-c9407b19867d'::uuid, 'ATAKAREJO ILHA', '73.849.952/0034-16', 'VERA CRUZ', 'BA', 'Atakarejo', 'Endereço: RODOVIA BA 001 8765 | Bairro: COROA | CEP: 44470-000 | Vendedor: RICARDO | Loja: 17 | Região: Ilha Itaparica | Código: 213 | IE: 186650482', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('bd9798dd-f606-4aaf-9fce-4c8a94e3317e'::uuid, 'ROCHA CARNES - BARRA DOS COQUEIROS', '16.918.263/0002-03', 'BARRA DOS COQUEIROS', 'SE', 'Outros', 'Endereço: AV GAL ANTONIO S. B. PIRRO 14 | Bairro: CONJUNTO PRISCO VIANA | CEP: 49140-000 | Vendedor: VINICIUS | Loja: 2 | Região: Aracaju e regiao | Código: 4237 | IE: 27.180.097-6', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('bdce83b0-faae-4bc1-a418-d4ef72e2778a'::uuid, 'SERRANA  PATAMARES', '02.212.937/0031-71', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV IBIRAPITANGA 374 | Bairro: PATAMARES | Complemento: LOJA 374 | CEP: 41680-360 | Vendedor: RICARDO | Loja: 23 | Região: Paralela e regiao | Código: 2613 | IE: 171286107', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('be008ae8-a768-463d-9329-b7c1dee82bce'::uuid, 'GBARBOSA 102 F GRANDE', '39.346.861/0125-00', 'SALVADOR', 'BA', 'Gbarbosa', 'Endereço: RUA MELLO MORAES 475 | Bairro: F. GRANDE | CEP: 40352-000 | Vendedor: VINICIUS | Loja: 27 | Região: Vila Canaria e regiao | Código: 82 | IE: 77.594.552', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('be40bdac-4790-41a3-ab32-dae61a7d84af'::uuid, 'PAJEU PETROLINA KM2', '02.814.573/0009-31', 'PETROLINA', 'PE', 'Outros', 'Endereço: R ANIZIO MOURA LEAL AV CEAP 86 | Bairro: km2 | CEP: 56306-475 | Vendedor: ANTONIO | Loja: 6 | Região: Petrolina e regiao | Código: 2088 | IE: 0308834-07', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('bec72394-d325-4982-8a65-0f222c252961'::uuid, 'MATEUS CD - FEIRA DE SANTANA/BA', '23.439.441/0058-25', 'SAO GONCALO DOS CAMPOS', 'BA', 'Mateus', 'Endereço: ROD BA 502 SN | Bairro: BOA HORA | CEP: 44330-000 | Vendedor: RICARDO | Loja: 12 | Região: Feira e regiao | Código: 1456 | IE: 203.844.342', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('bee7dfec-93c3-468d-865d-753a3970a734'::uuid, 'ARMAZEM CECILIO MOTA', '09.506.050/0002-09', 'JACOBINA', 'BA', 'Outros', 'Endereço: RUA J J SEABRA 126 | Bairro: ESTACAO | Complemento: ESTACAO-JACOBINA | CEP: 44700-000 | Vendedor: ANTONIO | Loja: 1 | Região: Sr Bonfim e regiao | Código: 6006 | IE: 128.165.674', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c0ac65f5-f8fc-4352-9f2f-5ddf225ae2d3'::uuid, 'ATAC CABULA', '93.209.765/0529-31', 'SALVADOR', 'BA', 'Atacadao', 'Endereço: R SILVEIRA MARTINS 2233 | Bairro: CABULA | Complemento: OUTROS LOJA | CEP: 41150-000 | Vendedor: NIXON | Loja: 20 | Região: Brotas e regiao | Código: 48 | IE: 198308960', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c0ec139c-431b-400c-b35f-9ec307a6eb3e'::uuid, 'RMIX PITUBA - AMAZONAS', '06.337.087/0010-64', 'SALVADOR', 'BA', 'Redemix', 'Endereço: R AMAZONAS 883 | Bairro: PITUBA | CEP: 41830-380 | Vendedor: VINICIUS | Loja: 6 | Região: Pituba e regiao | Código: 186 | IE: 162.154.581', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c15df8ed-80dc-4b26-b421-61e3ebddd165'::uuid, 'ATAKAREJO SAO CAETANO', '73.849.952/0035-05', 'ITABUNA', 'BA', 'Atakarejo', 'Endereço: AVENIDA PRINCESA ISABEL SN | Bairro: SAO CAETANO | CEP: 45607-003 | Vendedor: RICARDO | Loja: 27 | Região: Ilheus e regiao | Código: 213 | IE: 202.731.258', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c1b7aaf1-639e-4cde-b702-f6f1107581f2'::uuid, 'MULTI FRIOS PREMIUM', '02.423.862/0004-03', 'PETROLINA', 'PE', 'Outros', 'Endereço: AV DA INTEGRACAO AYRTON SENNA 782 A | Bairro: DOM MALAN | CEP: 56330-290 | Vendedor: ANTONIO | Loja: 2 | Região: Petrolina e regiao | Código: 4469 | IE: 0745146-60', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c209a08f-dadb-4dbb-b075-533c1d7a7ad3'::uuid, 'CDP GENARO DIAS DAVILA', '43.941.941/0017-08', 'DIAS D''AVILA', 'BA', 'Cdp', 'Endereço: AVENIDA GARCIA D AVILA - S/N, GENARO | Bairro: GENARO | Complemento: S/N, GENARO | CEP: 42850-000 | Vendedor: NIXON | Loja: 14 | Região: Alagoinhas e regiao | Código: 4245 | IE: 222.072.122', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c393953a-7853-450b-bd5f-3721fd960894'::uuid, 'MEL DISTRIBUIDORA', '50.911.223/0001-89', 'ARACAJU', 'SE', 'Outros', 'Endereço: RUA BOSCO SCAFFS 95 | Bairro: INACIO BARBOSA | CEP: 49041-060 | Vendedor: VINICIUS | Loja: 1 | Região: Aracaju e regiao | Código: 4575 | IE: 27.192.804-2', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c56b147f-ada5-4e9e-acc0-8f97a5a51ccd'::uuid, 'MATEUS CONCEICAO DO COITE', '03.995.515/0258-28', 'CONCEICAO DO COITE', 'BA', 'Mateus', 'Endereço: AV OLDACK AMANCIO ARAUJO 2135 | Bairro: OLHOS D AGUA | CEP: 48730-000 | Vendedor: ANTONIO | Loja: 53 | Região: Sr Bonfim e regiao | Código: 2459 | IE: 196.521.866', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c62703d9-46c4-49cd-b573-5c63d82e3475'::uuid, 'ASSAI MUSSURUNGA', '06.057.223/0424-19', 'SALVADOR', 'BA', 'Assai', 'Endereço: R PROFESSOR PLINIO GARCEZ DE SENA  1240 | Bairro: MUSSURUNGA I | CEP: 41490-340 | Vendedor: NIXON | Loja: 37 | Região: Paralela e regiao | Código: 1899 | IE: 168.999.879', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c7f3c6bf-3121-429f-8e1e-92291c4a7278'::uuid, 'HIPERIDEAL ARMACAO', '02.212.937/0018-02', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV SIMON BOLIVAR 558 | Bairro: ARMACAO | CEP: 41750-230 | Vendedor: RICARDO | Loja: 2 | Região: Paralela e regiao | Código: 2613 | IE: 128.045.677', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c84d5c12-1f6a-4b7d-9a2b-a5ded7b46fe0'::uuid, 'ATAKAREJO CASTELO BRANCO', '73.849.952/0018-04', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: R GENARO DE CARVALHO,150 | Bairro: CASTELO BRANCO | CEP: 41320-100 | Vendedor: RICARDO | Loja: 10 | Região: Vila Canaria e regiao | Código: 213 | IE: 145559100', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c8fc9857-3aef-4118-af8c-b5e00012a9f8'::uuid, 'CARBALLO FARO ALPHAVILLE', '12.765.924/0004-00', 'SALVADOR', 'BA', 'Carballo', 'Endereço: AV ALPHAVILLE, 199 | Bairro: ALPHAVILLE I | Complemento: EDIF CARLOS FABRICIO LEITE COSTA SL 01 | CEP: 41701-015 | Vendedor: RICARDO | Loja: 4 | Região: Paralela e regiao | Código: 1872 | IE: 152426901', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c9b41fe0-2c39-4254-b9be-adcae1558c18'::uuid, 'CDP CENTRO DIAS DAVILA', '43.941.941/0018-80', 'DIAS D''AVILA', 'BA', 'Cdp', 'Endereço: AVENIDA BRASIL- 164, CENTRO | Bairro: DIAS DAVILA | Complemento: 164 CENTRO | CEP: 42850-000 | Vendedor: NIXON | Loja: 15 | Região: Alagoinhas e regiao | Código: 4245 | IE: 222.072.230', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('c9bad3c4-c1c4-46c7-8f12-2e7e635d25bc'::uuid, 'ATAKAREJO ITABUNA', '73.849.952/0043-07', 'ITABUNA', 'BA', 'Atakarejo', 'Endereço: RUA B SN | Bairro: NOVA CALIFORNIA | CEP: 45604-400 | Vendedor: RICARDO | Loja: 34 | Região: Ilheus e regiao | Código: 213 | IE: 214.064.067', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ca2fe0cb-31ca-4003-9778-ea25fed57f7a'::uuid, 'G. BARBOSA  - RIO MAR', '39.346.861/0116-00', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV LUIZ LUA GONZAGA 400 | Bairro: COROA DO MEIO | CEP: 49035-500 | Vendedor: VINICIUS | Loja: 53 | Região: Aracaju e regiao | Código: 82 | IE: 27.122.169-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('caab3b4f-998b-42aa-abca-ca032a9c2e6d'::uuid, 'G BARBOSA HIPER NORTE', '39.346.861/0023-77', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV OSVALDO ARANHA 1240 | Bairro: J. C. DE ARAUJO | CEP: 49085-410 | Vendedor: VINICIUS | Loja: 55 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.260-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('cc50d8f9-6105-44b2-817c-5b50d68460b6'::uuid, 'GBARBOSA-156 -JEQUIE', '39.346.861/0263-90', 'JEQUIE', 'BA', 'Gbarbosa', 'Endereço: PRACA DA BANDEIRA S/N | Bairro: CENTRO | CEP: 45200-310 | Vendedor: VINICIUS | Loja: 45 | Região: Conquista e regiao | Código: 82 | IE: 13.504.872', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('cec93774-de94-4e13-80a0-dad68a5fce08'::uuid, 'CDP ALAGOINHAS LOJA 11', '43.941.941/0007-28', 'ALAGOINHAS', 'BA', 'Cdp', 'Endereço: AVENIDA 24 DE MAIO 17 | Bairro: CENTRO | CEP: 48000-127 | Vendedor: NIXON | Loja: 4 | Região: Alagoinhas e regiao | Código: 4245 | IE: 195.180.488', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d051e0eb-a240-42fb-aaae-3c136cd9acc9'::uuid, 'GBARBOSA-131-PETROLINA', '39.346.861/0178-03', 'PETROLINA', 'PE', 'Gbarbosa', 'Endereço: RUA DA INTEGRACAO 583 | Bairro: vila eduardo | CEP: 56328-010 | Vendedor: ANTONIO | Loja: 36 | Região: Petrolina e regiao | Código: 82 | IE: 42.381.762', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d1295243-b63d-46a7-bed9-ed2d07a43eff'::uuid, 'HIPERIDEAL PIATA ORLANDO GOMES', '02.212.937/0026-04', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R DA GRATIDAO SN | Bairro: PIATA | Complemento: ESQUINA AVENIDA ORLANDO GOMES | CEP: 41650-195 | Vendedor: RICARDO | Loja: 19 | Região: Paralela e regiao | Código: 2613 | IE: 159469934', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d1b79ef2-2b1a-4b31-9ed3-e79a07917bf6'::uuid, 'WALMART - CHAME CHAME', '97.422.620/0010-41', 'SALVADOR', 'BA', 'Bompreco', 'Endereço: AV CENTENARIO 2786 | Bairro: CHAME-CHAME | Complemento: LOJA B515 | CEP: 40157-151 | Vendedor: VINICIUS | Loja: 5 | Região: Suburbio e regiao | Código: 1647 | IE: 000.118.145', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d1d4194d-3188-48b3-9de0-ed71491bd8a1'::uuid, 'ATAKAREJO', '73.849.952/0023-63', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: RUA FREDERICO COSTA 000146 | Bairro: PERIPERI | CEP: 40725-620 | Vendedor: RICARDO | Loja: 36 | Região: Vila Canaria e regiao | Código: 213 | IE: 161.502.396', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d1eae98d-2840-485c-8702-48a409fd1666'::uuid, 'CBD VASCO', '47.508.411/0193-37', 'SALVADOR', 'BA', 'Cdb', 'Endereço: VASCO DA GAMA 828 0 | Bairro: FEDERACAO | CEP: 40230-731 | Vendedor: RICARDO | Loja: 21 | Região: Vasco e regiao | Código: 11 | IE: 56308648', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d27b056f-b1e4-4a9a-a545-2dad11c8da66'::uuid, 'EKO EXPRESS MINIMERCADO LTDA', '61.851.780/0001-78', 'ARACAJU', 'SE', 'Outros', 'Endereço: AVENIDA PRES TANCREDO NEVES 670 | Bairro: JARDINS | CEP: 49025-620 | Vendedor: VINICIUS | Loja: 1 | Região: Aracaju e regiao | Código: 4640 | IE: 27.236.176-3', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d29a695c-f5f3-47e6-9d28-f0e156c52ab7'::uuid, 'ATAKAREJO ITABAINA', '73.849.952/0058-93', 'ITABAIANA', 'SE', 'Atakarejo', 'Endereço: AVENIDA NIVALDA LIMA FIGUEIREDO 867 | Bairro: ANIZIO AMANCIO DE OLIVEIRA | CEP: 49503-396 | Vendedor: RICARDO | Loja: 45 | Região: Itabaiana e regiao | Código: 213 | IE: 272283894', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d38c21b7-4c59-411a-a875-4092d62c6618'::uuid, 'REDEMIX SALVADOR SHOPPING', '06.337.087/0020-36', 'SALVADOR', 'BA', 'Redemix', 'Endereço: AVENIDA TANCREDO NEVES 003133 | Bairro: CAMINHO DAS ARVORES | CEP: 41820-021 | Vendedor: VINICIUS | Loja: 14 | Região: Pituba e regiao | Código: 186 | IE: 232.415.238', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d4228c4c-4814-4632-a7c1-3f893cec4bd7'::uuid, 'DIST SAO ROQUE STA MONICA', '03.705.630/0001-50', 'FEIRA DE SANTANA', 'BA', 'Sao Roque', 'Endereço: AV EDUARDO FROES DA MOTA | Bairro: SANTA MONICA | CEP: 44078-015 | Vendedor: VINICIUS | Loja: 1 | Região: Feira e regiao | Código: 1600 | IE: 53234111', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d4c66f06-f7e8-49f1-9630-7db5da0e5cfb'::uuid, 'CDP CATU LOJA 12', '39.869.867/0001-13', 'CATU', 'BA', 'Cdp', 'Endereço: R DESEMBARGADOR PEDRO RIBEIRO 62 | Bairro: CENTRO | CEP: 48110-000 | Vendedor: NIXON | Loja: 1 | Região: Alagoinhas e regiao | Código: 4382 | IE: 173607144', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d4e7d763-4128-456a-8d65-c67606bff66c'::uuid, 'PONTO VERDE IAPI', '00.658.059/0002-52', 'SALVADOR', 'BA', 'Redemix', 'Endereço: RUA CONDE DE PORTO ALEGRE, SN | Bairro: IAPI | Complemento: QUADRA 01 LOTE 02 | CEP: 40330-201 | Vendedor: VINICIUS | Loja: 2 | Região: Pituba e regiao | Código: 1763 | IE: 49394407', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d63f85d5-90a8-4f90-8623-f943fb76501f'::uuid, 'ATAKAREJO NOSSA SENHORA', '73.849.952/0051-17', 'NOSSA SENHORA APARECIDA', 'SE', 'Atakarejo', 'Endereço: RUA FRANCISCO VIEIRA DOS SANTOS 86 | Bairro: JOVIANO BARBOSA | CEP: 49680-000 | Vendedor: RICARDO | Loja: 1 | Região: Gloria e regiao | Código: OV067M | IE: 27.223.761-2', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d68f034e-a16e-419f-845e-3f29971cd239'::uuid, 'MATEUS TEIXEIRA DE FREITAS', '03.995.515/0240-07', 'TEIXEIRA DE FREITAS', 'BA', 'Mateus', 'Endereço: AV PRESIDENTE GETULIO VARGAS 7979 | Bairro: SETOR BAHIA SUL | CEP: 45986-330 | Vendedor: RICARDO | Loja: 52 | Região: Porto Seguro e regiao | Código: 2459 | IE: 187.196.927', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d7001b31-efd0-4e57-8b38-7ba23dc959c9'::uuid, 'MASSIMO FAROLANDIA', '31.432.054/0002-30', 'ARACAJU', 'SE', 'Massimo', 'Endereço: AV DR ADEL NUNES 1059 | Bairro: FAROLANDIA | CEP: 49032-100 | Vendedor: VINICIUS | Loja: 2 | Região: Aracaju e regiao | Código: 2652 | IE: 27.173.095-1', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d71919cb-2ed5-4f27-82ff-f99ffe65f16e'::uuid, 'GBARBOSA-154 - JEQUIEZINHA', '39.346.861/0261-28', 'JEQUIE', 'BA', 'Gbarbosa', 'Endereço: AV CESAR BORGES 212 ANEXO 01 | Bairro: JEQUIEZINHA | CEP: 45200-970 | Vendedor: VINICIUS | Loja: 44 | Região: Conquista e regiao | Código: 82 | IE: 13.504.656', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d71b5fcc-29f3-4bf6-9dba-fc5a01124433'::uuid, 'G. BARBOSA FRANCISCO PORTO', '39.346.861/0033-49', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV FRANCISCO PORTO 250 | Bairro: SALGADO FILHO | Complemento: LOJA 20 | CEP: 49020-120 | Vendedor: VINICIUS | Loja: 61 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.245-7', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d748f831-c314-4545-94d6-a5a542bc7b26'::uuid, 'SUP BOMBOM ESTANCIA CENTRO', '04.136.442/0001-10', 'ESTANCIA', 'SE', 'Bombom', 'Endereço: RUA DA LIBERDADE 162 | Bairro: CENTRO | CEP: 49200-000 | Vendedor: VINICIUS | Loja: 2 | Região: Aracaju e regiao | Código: 4234 | IE: 27.101.934-4', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d82c3020-3f2f-4a3c-9516-571274cff4e7'::uuid, 'ROCHA CARNES - ARACAJU SANTOS DUMONT', '16.918.263/0004-67', 'ARACAJU', 'SE', 'Outros', 'Endereço: R MAJ AURELIANO 123 | Bairro: SANTOS DUMONT | CEP: 49087-400 | Vendedor: VINICIUS | Loja: 4 | Região: Aracaju e regiao | Código: 4237 | IE: 27.185.559-2', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('d863f141-5d9e-42fe-b541-d272ecc42631'::uuid, 'G. BARBOSA SANTOS DUMONT', '39.346.861/0017-29', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: R MAJOR AURELIANO 305 | Bairro: SANTOS DUMONT | CEP: 49087-400 | Vendedor: VINICIUS | Loja: 59 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.246-5', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('da15cc36-5e10-42a8-b434-d55a257390ca'::uuid, 'ATAC JUAZEIRO BA', '75.315.333/0073-83', 'JUAZEIRO', 'BA', 'Atacadao', 'Endereço: ROD BR 407 KM 06 AREA 01 A SN | Bairro: ZONA URBANA | CEP: 48900-000 | Vendedor: NIXON | Loja: 30 | Região: Petrolina e regiao | Código: 2 | IE: 77552288', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('da5a3145-d463-4ee7-9b7a-d546a9593c72'::uuid, 'ATAC CAMACARI CENTRO', '93.209.765/0500-50', 'CAMACARI', 'BA', 'Atacadao', 'Endereço: AV DEPUTADO LUIS EDUARDO MAGALHAES | Bairro: CENTRO | CEP: 42800-071 | Vendedor: NIXON | Loja: 17 | Região: Camacari e regiao | Código: 48 | IE: 166.374.042', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('da905172-e7c9-413b-9d4f-3f2917aa2671'::uuid, 'HIPERIDEAL HORTO VASCO DA GAMA', '02.212.937/0034-14', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV VASCO DA GAMA 864 | Bairro: FEDERACAO | Complemento: LOJA 864 | CEP: 40230-731 | Vendedor: RICARDO | Loja: 29 | Região: Vasco e regiao | Código: 2613 | IE: 187430052', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('da993c12-381d-4d2e-ba1b-7938bd270b0d'::uuid, 'GBARBOSA CONJ. MARCOS FREIRE I', '39.346.861/0148-98', 'NOSSA SENHORA DO SOCORRO', 'SE', 'Gbarbosa', 'Endereço: AVENIDA COLETORA A S/N | Bairro: CONJ. MARCOS FREIRE I | CEP: 49160-000 | Vendedor: VINICIUS | Loja: 82 | Região: Aracaju e regiao | Código: 82 | IE: 271311479', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('dc1cc928-8295-4733-84d8-77b194c27b54'::uuid, 'CARBALLO FARO - HORTO', '12.765.924/0003-20', 'SALVADOR', 'BA', 'Carballo', 'Endereço: AV SANTA LUZIA, 985 | Bairro: FORTO FLORESTAL | Complemento: LOJA LOT PARQUE FLORESTAL LOTE 0073 | CEP: 40295-050 | Vendedor: RICARDO | Loja: 3 | Região: Vasco e regiao | Código: 1872 | IE: 134311791', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('dc5bd621-a155-456b-aa6b-f995eeea71a4'::uuid, 'GBARBOSA BARRA DOS COQUEIROS', '39.346.861/0377-58', 'BARRA DOS COQUEIROS', 'SE', 'Gbarbosa', 'Endereço: AV OCEANICA 1025 | Bairro: CENTRO | CEP: 49140-970 | Vendedor: VINICIUS | Loja: 72 | Região: Aracaju e regiao | Código: 82 | IE: 271381850', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('dc988b81-7afc-4205-8d31-56209612c510'::uuid, 'SUP BOMBOM LAGARTO CENTRO', '04.136.442/0002-00', 'LAGARTO', 'SE', 'Bombom', 'Endereço: AV ZACARIAS JUNIOR 100 | Bairro: CENTRO | CEP: 49400-000 | Vendedor: VINICIUS | Loja: 1 | Região: Aracaju e regiao | Código: 4234 | IE: 27.184.977-0', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('dd0d9c0c-546c-40b2-bd44-d29c0691b780'::uuid, 'SERRANA PITUBA', '02.212.937/0024-42', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV MANOEL DIAS DA SILVA 1175 | Bairro: PITUBA | CEP: 41830-000 | Vendedor: RICARDO | Loja: 18 | Região: Pituba e regiao | Código: 2613 | IE: 158864161', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('deaae7ff-dbe9-468f-8b9d-4f7d93c41adc'::uuid, 'MIX MATEUS PETROLINA', '59.008.895/0016-30', 'PETROLINA', 'PE', 'Mateus', 'Endereço: AV DOUTOR ULISSES GUIMARAES 501 | Bairro: DISTRITO INDUSTRIAL | CEP: 56310-770 | Vendedor: RICARDO | Loja: A1 | Região: Petrolina e regiao | Código: 2459 | IE: 123345707', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('df06a2bd-9b5c-4e15-af7d-d8648770d79a'::uuid, 'SERRANA - PRAIA DO FORTE', '02.212.937/0014-70', 'MATA DE SAO JOAO', 'BA', 'Hiperideal', 'Endereço: ROD BA 099 KM 54 SN | Bairro: PRAIA DO FORTE | Complemento: LOTE 04 | CEP: 48280-000 | Vendedor: VINICIUS | Loja: 14 | Região: Alagoinhas e regiao | Código: 2613 | IE: 82707448', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('df1aa892-b961-4e38-af2d-ebc68f49bfb9'::uuid, 'SUPERMERCADO NUNES PEIXOTO CENTRO', '13.152.186/0001-46', 'ITABAIANA', 'SE', 'Sao Lucas', 'Endereço: PC JOAO PESSOA 99 | Bairro: CENTRO | CEP: 49500-070 | Vendedor: VINICIUS | Loja: 1 | Região: Itabaiana e regiao | Código: 2997 | IE: 27.057.989-3', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e19e2ece-241c-4d0c-999f-5e47c060b345'::uuid, 'ATAKAREJO LAURO', '73.849.952/0003-10', 'LAURO DE FREITAS', 'BA', 'Atakarejo', 'Endereço: AV SANTOS DUMONT 5772 | Bairro: ESTRADA DO COCO | CEP: 42700-000 | Vendedor: RICARDO | Loja: 2 | Região: Lauro e regiao | Código: 213 | IE: 77593840', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e1dbffd7-24d1-4e44-84d8-fc7956daa780'::uuid, 'GBARBOSA 121 PIRAJA', '39.346.861/0424-09', 'SALVADOR', 'BA', 'Gbarbosa', 'Endereço: RUA OITO DE NOVEMBRO 06 | Bairro: PIRAJA | CEP: 41290-200 | Vendedor: VINICIUS | Loja: 31 | Região: Vila Canaria e regiao | Código: 82 | IE: 105.405.861', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e25de7fb-a92c-4f55-9e28-f65677f94f84'::uuid, 'RMIX ITAPUA', '06.337.087/0005-05', 'SALVADOR', 'BA', 'Redemix', 'Endereço: AV DORIVAL CAYMMI, 107 | Bairro: ITAPUA | CEP: 41635-152 | Vendedor: VINICIUS | Loja: 5 | Região: Paralela e regiao | Código: 186 | IE: 142824072', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e3b254e1-f527-4660-9b0d-027ecaa34274'::uuid, 'PAJEU MONSENHOR ANGELO', '44.846.016/0002-76', 'PETROLINA', 'PE', NULL, 'Endereço: AVENIDA MONSENHOR ANGELO SAMPAIO 432 | Bairro: VILA EDUARDO | CEP: 56328-000 | Vendedor: ANTONIO | Loja: 1 | Código: 4673 | IE: 1151224-51', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e4176749-8465-4cb3-bd54-249c65ed4452'::uuid, 'ATAKAREJO VITORIA DA CONQUISTA', '73.849.952/0036-88', 'VITORIA DA CONQUISTA', 'BA', 'Atakarejo', 'Endereço: AVENIDA OLIVIA FLORES SN | Bairro: CANDEIAS | CEP: 45028-100 | Vendedor: RICARDO | Loja: 23 | Região: Conquista e regiao | Código: 213 | IE: 202.731.366', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e536f9f2-0e57-40a1-b863-6dce3831adb7'::uuid, 'ATAKAREJO FEIRA BARAUNA', '73.849.952/0016-34', 'FEIRA DE SANTANA', 'BA', 'Atakarejo', 'Endereço: AVENIDA JOSE FALCAO DA SILVA 150 | Bairro: BARAUNA | CEP: 44020-122 | Vendedor: RICARDO | Loja: 19 | Região: Feira e regiao | Código: 213 | IE: 144.638.888', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e5c69ec0-44b0-42e2-85de-c2c053661e19'::uuid, 'ASSAI CABULA', '06.057.223/0483-79', 'SALVADOR', 'BA', 'Assai', 'Endereço: R SILVEIRA MARTINS 000119 | Bairro: CABULA | CEP: 41150-000 | Vendedor: NIXON | Loja: 52 | Região: Brotas e regiao | Código: 1899 | IE: 188.374.289', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e5efbf53-5b06-4ca0-801b-9c7c5a200a09'::uuid, 'SAMS FEIRA DE SANTANA', '00.063.960/0600-04', 'FEIRA DE SANTANA', 'BA', 'Sams', 'Endereço: RUA CORONEL JOSE PINTO DOS SANTOS S/N | Bairro: SAO JOAO | Complemento: S/N | CEP: 44051-568 | Vendedor: VINICIUS | Loja: 12 | Região: Feira e regiao | Código: 47 | IE: 213.090.131', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e5fa4a75-e436-447b-918e-818331d54554'::uuid, 'G. BARBOSA  SANTO ANTONIO', '39.346.861/0035-00', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: R MURIBECA 310 | Bairro: SANTO ANTONIO | CEP: 49060-470 | Vendedor: VINICIUS | Loja: 60 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.244-9', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e678c754-59ec-4a39-bce0-7b3633812483'::uuid, 'DIST SAO ROQUE SIM', '03.705.630/0005-83', 'FEIRA DE SANTANA', 'BA', 'Sao Roque', 'Endereço: AV ARTEMIA PIRES FREITAS CN | Bairro: SIM | CEP: 44085-370 | Vendedor: VINICIUS | Loja: 5 | Região: Feira e regiao | Código: 1600 | IE: 9.958.135', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e752f154-0c60-4b59-8127-05efca9a553f'::uuid, 'GBARBOSA-143 - FEIRA DE SANTANA', '39.346.861/0206-00', 'FEIRA DE SANTANA', 'BA', 'Gbarbosa', 'Endereço: AV GOV JOAO DE CARNEIRO 970 | Bairro: n.brasilia | CEP: 44088-031 | Vendedor: VINICIUS | Loja: 40 | Região: Feira e regiao | Código: 82 | IE: 12.598.212', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e7723e99-f6f6-440b-a52d-ec5a91155d6b'::uuid, 'ECONOMART FEIRA DE SANTANA', '28.548.486/0024-02', 'FEIRA DE SANTANA', 'BA', 'Economart', 'Endereço: RUA PASSO ALEGRE S/N | Bairro: LAGOA SALGADA | CEP: 44082-150 | Vendedor: NIXON | Loja: 1 | Região: Feira e regiao | Código: 6049 | IE: 217.398.226', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e8e8301b-4f0a-489a-b0ad-fae4dfb79728'::uuid, 'MASANI COM', '00.813.880/0001-15', 'SALVADOR', 'BA', 'Redemix', 'Endereço: AV PAULO VI 1932 PARQUE FLAMBOYANT | Bairro: PITUBA | CEP: 41810-001 | Vendedor: VINICIUS | Loja: 1 | Região: Pituba e regiao | Código: 209 | IE: 42630410', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e949429e-f1a5-4cc1-a990-301243748778'::uuid, 'ATAKAREJO PATAMARES', '73.849.952/0029-59', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: AV LUIS VIANA FILHO 6282 | Bairro: PATAMARES | CEP: 41680-400 | Vendedor: RICARDO | Loja: 14 | Região: Paralela e regiao | Código: 213 | IE: 179.439.821', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('e9eed7cc-2597-41ab-b21e-a909a0ccbff2'::uuid, 'GBARBOSA PAU DA LIMA', '39.346.861/0444-52', 'SALVADOR', 'BA', 'Gbarbosa', 'Endereço: RUA JAYME VIEIRA LIMA, S/N | Bairro: PAU LIMA | CEP: 41235-000 | Vendedor: VINICIUS | Loja: 12 | Região: Vila Canaria e regiao | Código: 82 | IE: 108.955.192', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ea323bce-d6c8-4515-bdfc-9511aa8c7c0c'::uuid, 'PGA COMERCIO ATACADISTA DE FRUTAS E VERD', '21.553.781/0001-11', 'JUAZEIRO', 'BA', 'Outros', 'Endereço: ROD BR 235 SN | Bairro: TANCREDO NEVES | Complemento: MERC DO PRODUTOR BOX 01 C PAVILHAO C | CEP: 48906-726 | Vendedor: ANTONIO | Loja: 1 | Região: Petrolina e regiao | Código: 2860 | IE: 121518705', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ea41574d-e971-4756-a477-bf6d64687688'::uuid, 'ASSAI CABULA', '06.057.223/0483-79', 'SALVADOR', 'BA', 'Assai', 'Endereço: R SILVEIRA MARTINS 000119 | Bairro: CABULA | CEP: 41150-000 | Vendedor: NIXON | Loja: 62 | Região: Brotas e regiao | Código: 1899 | IE: 188.374.289', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ea5429ee-9077-4753-ad56-202d1778a0c9'::uuid, 'ASSAI IMBUI', '06.057.223/0541-82', 'SALVADOR', 'BA', 'Assai', 'Endereço: AV LUIS VIANA FILHO 3056 | Bairro: IMBUI | Complemento: LOJA TRECHO A | CEP: 41720-200 | Vendedor: NIXON | Loja: 74 | Região: Paralela e regiao | Código: 1899 | IE: 191902820', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ebe38df0-9c93-4c1d-8fcb-284dd4ddba1b'::uuid, 'SERRANA  CAMPO GRANDE', '02.212.937/0027-95', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AV SETE DE SETEMBRO 304 | Bairro: CAMPO GRANDE | CEP: 40080-001 | Vendedor: RICARDO | Loja: 20 | Região: Suburbio e regiao | Código: 2613 | IE: 158864161', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ec57cde3-b6a9-439f-adce-de833bfe2a64'::uuid, 'HIPER CARNES BARRA DOS COQUEIROS', '44.069.669/0001-05', 'BARRA DOS COQUEIROS', 'SE', 'Outros', 'Endereço: AV OCEANICA 835 | Bairro: CENTRO | CEP: 49140-000 | Vendedor: VINICIUS | Loja: 1 | Região: Aracaju e regiao | Código: 4130 | IE: 271805323', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ee8e52fb-7148-4150-acf9-b8e34b798053'::uuid, 'ATAKAREJO  SETE DE ABRIL', '73.849.952/0025-25', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: AVENIDA MARIA LUCIA 001015 | Bairro: SETE DE ABRIL | CEP: 41385-445 | Vendedor: RICARDO | Loja: 32 | Região: Vila Canaria e regiao | Código: 213 | IE: 168.523.388', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ee9a8e95-46c0-4fb6-8874-183017d663ac'::uuid, 'MATEUS PORTO SEGURO', '03.995.515/0248-56', 'PORTO SEGURO', 'BA', 'Mateus', 'Endereço: AV DOS TRABALHADORES SN | Bairro: OUTEIRO DA GLORIA - SEDE | CEP: 45810-000 | Vendedor: RICARDO | Loja: 51 | Região: Porto Seguro e regiao | Código: 2459 | IE: 190.428.776', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ef0bf7ee-ae3c-43cf-86c9-a9bc21a158d0'::uuid, 'GBARBOSA 017 FEIRA DE SANTANA', '39.346.861/0047-44', 'FEIRA DE SANTANA', 'BA', 'Gbarbosa', 'Endereço: RUA MARECHAL DEODORO,245 | Bairro: CENTRO | CEP: 44010-250 | Vendedor: VINICIUS | Loja: 17 | Região: Feira e regiao | Código: 82 | IE: 56.626.357', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ef59db2e-54ee-4f6f-a69e-e3f024a6c35a'::uuid, 'GBARBOSA 016 FEIRA DE SANTANA', '39.346.861/0070-93', 'FEIRA DE SANTANA', 'BA', 'Gbarbosa', 'Endereço: RUA BARAO DE COTEGIPE, 1106 | Bairro: CENTRO | CEP: 44025-030 | Vendedor: VINICIUS | Loja: 16 | Região: Feira e regiao | Código: 82 | IE: 65.936.960', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('efe23b32-b951-4347-b3af-7a8fa949be09'::uuid, 'G BARBOSA FAROLANDIA', '39.346.861/0103-96', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: AV JOSE THOMAZ D AVILA NABUCO 945 | Bairro: FAROLANDIA | CEP: 49030-270 | Vendedor: VINICIUS | Loja: 64 | Região: Aracaju e regiao | Código: 82 | IE: 27.121.526-7', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f026a5c8-01e2-41d9-a8f8-1f157a9beedd'::uuid, 'ASSAI FEIRA SOBRADINHO', '06.057.223/0314-84', 'FEIRA DE SANTANA', 'BA', 'Assai', 'Endereço: AVENIDA EDUARDO FROES DE MOTA  SN | Bairro: SOBRADINHO | CEP: 44021-215 | Vendedor: NIXON | Loja: 13 | Região: Feira e regiao | Código: 1899 | IE: 131694439', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f0aa300c-a088-4f7e-bd72-1bfc1d07f373'::uuid, 'SUPERMERCADO ARUANA', '50.747.044/0002-39', 'ARACAJU', 'SE', 'Bombom', 'Endereço: RUA MARIA VASCONCELOS DE ANDRADE 536 | Bairro: ARUANA | CEP: 49000-626 | Vendedor: VINICIUS | Loja: 2 | Região: Aracaju e regiao | Código: 4582 | IE: 27.239.224-3', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f19e8c3d-6d00-48c2-a392-2112f1ebdbbf'::uuid, 'GRAN HORTIFRUTI', '39.303.338/0001-58', 'SALVADOR', 'BA', 'Outros', 'Endereço: AL DOS UMBUZEIROS 128 | Bairro: CAMINHO DAS ARVORES | CEP: 41820-680 | Vendedor: RICARDO | Loja: 1 | Região: Pituba e regiao | Código: 2821 | IE: 171.980.602', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f2051376-b703-49bc-aebd-d12a0f55cb16'::uuid, 'SUPERMERCADO JHONES', '04.462.862/0001-97', 'ITABERABA', 'BA', 'Outros', 'Endereço: AVENIDA MEDEIROS NETO 258 | Bairro: CENTRO | Complemento: Nº 258 TERREO | CEP: 46880-000 | Vendedor: RICARDO | Loja: 1 | Região: Itaberaba e regiao | Código: 5095 | IE: 55417080', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f2f22747-e055-465f-af75-5bdbea7393e2'::uuid, 'GBARBOSA-129-JUAZEIRO', '39.346.861/0184-51', 'JUAZEIRO', 'BA', 'Gbarbosa', 'Endereço: TRAVESSA MARAVILHA 418 | Bairro: CENTRO | CEP: 48904-140 | Vendedor: ANTONIO | Loja: 35 | Região: Petrolina e regiao | Código: 82 | IE: 81.359.978', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f41b06e1-7f7b-45d0-a4a4-c6b3058c02d9'::uuid, 'ATAKAREJO FEIRA MANGABEIRA', '73.849.952/0057-02', 'FEIRA DE SANTANA', 'BA', 'Atakarejo', 'Endereço: RUA EUNAPOLIS S/N | Bairro: MANGABEIRA | CEP: 44056-684 | Vendedor: RICARDO | Loja: 39 | Região: Feira e regiao | Código: 213 | IE: 227.985.340', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f4aa521a-b3f5-4dc7-a065-6901e6c6130f'::uuid, 'ATAKAREJO PORTO SEGURO', '73.849.952/0040-64', 'PORTO SEGURO', 'BA', 'Atakarejo', 'Endereço: AVENIDA IVAN COSTA RODRIGUES SN | Bairro: CIDADE ALTA - SEDE | CEP: 45810-000 | Vendedor: RICARDO | Loja: 22 | Região: Porto Seguro e regiao | Código: 213 | IE: 210184518', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f565b015-6743-41c1-848a-f4e098f08050'::uuid, 'ATAKAREJO QUINTAS DO MORUMBI', '73.849.952/0046-50', 'ITAPETINGA', 'BA', 'Atakarejo', 'Endereço: AVENIDA DAS PALMEIRAS S/N | Bairro: QUINTAS DO MORUMBI | CEP: 45700-000 | Vendedor: RICARDO | Loja: 24 | Região: Conquista e regiao | Código: 213 | IE: 216.572.944', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f63e7f65-19f7-4d15-b723-c9cb363f9f79'::uuid, 'BOM PRECO BA', '97.422.620/0146-15', 'SIMOES FILHO', 'BA', 'Bompreco', 'Endereço: RODOVIA BA 093 - 4120 | Bairro: PALMARES | CEP: 43700-000 | Vendedor: VINICIUS | Loja: 2 | Região: Simoes Filho e regiao | Código: 1647 | IE: 134883850', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f6db55b4-0b91-4020-8f89-5e2f80ad74e2'::uuid, 'SERRANA PITUBA', '02.212.937/0012-09', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R RUA CEARA 339 | Bairro: PITUBA | Complemento: LOTEAMENTO BARRA BRANCA | CEP: 41830-450 | Vendedor: VINICIUS | Loja: 12 | Região: Pituba e regiao | Código: 2613 | IE: 74.346.983', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f7c9614a-5ea7-4441-98a3-9c7d059a5b4f'::uuid, 'MATEUS JOSE CONRADO DE ARAUJO', '03.995.515/0237-01', 'ARACAJU', 'SE', 'Mateus', 'Endereço: AV CHANC OSVALDO ARANHA 1110 | Bairro: JOSE CONRADO DE ARAUJO | CEP: 49085-100 | Vendedor: RICARDO | Loja: 42 | Região: Aracaju e regiao | Código: 2459 | IE: 271803487', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f837c180-4172-4bff-9b54-e09aec143fd2'::uuid, 'HIPERIDEAL AMAZONAS', '02.212.937/0036-86', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R AMAZONAS 1541 | Bairro: PITUBA | Complemento: EDIF RIVIERA LOJA | CEP: 41830-380 | Vendedor: RICARDO | Loja: 27 | Região: Pituba e regiao | Código: 2613 | IE: 193.103.105', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f8606526-6935-4f16-9cca-5f7ec71fd270'::uuid, 'MATEUS ARACAJU SANTA MONICA', '03.995.515/0325-22', 'ARACAJU', 'SE', 'Mateus', 'Endereço: AVENIDA JOAO RODRIGUES 582 | Bairro: INDUSTRIAL | CEP: 49065-450 | Vendedor: RICARDO | Loja: D5 | Região: Aracaju e regiao | Código: 2459 | IE: 272133809', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('f93bf315-b298-4827-a553-72b3cf5c9a63'::uuid, 'ATAKAREJO', '73.849.952/0022-82', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: RUA VEREADOR ZEZEU RIBEIRO 000111 | Bairro: FAZENDA GRANDE II | CEP: 41342-153 | Vendedor: RICARDO | Loja: 35 | Região: Vila Canaria e regiao | Código: 213 | IE: 161.502.288', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('fa32a83f-0741-4e69-b156-93bce458432e'::uuid, 'GBARBOSA-139-VITORIA DA CONQUISTA', '39.346.861/0196-95', 'VITORIA DA CONQUISTA', 'BA', 'Gbarbosa', 'Endereço: AV.JURACI MAGALHAES 3340 | Bairro: centro | CEP: 45023-490 | Vendedor: VINICIUS | Loja: 39 | Região: Conquista e regiao | Código: 82 | IE: 19.674.265', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('fa450c35-9fd5-4d03-8558-15cd6359ff99'::uuid, 'MATEUS ITABUNA', '03.995.515/0282-58', 'ITABUNA', 'BA', 'Mateus', 'Endereço: RODOVIA BR 415 SN | Bairro: PARQUE VERDE | CEP: 45604-811 | Vendedor: RICARDO | Loja: 98 | Região: Ilheus e regiao | Código: 2459 | IE: 203.268.450', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('fa85a260-4a3a-468a-9bc8-cb2d0b98692e'::uuid, 'GBARBOSA ATALAIA VELHA', '39.346.861/0037-72', 'ARACAJU', 'SE', 'Gbarbosa', 'Endereço: R LUIZ CHAGAS 55 | Bairro: ATALAIA VELHA | CEP: 49037-430 | Vendedor: VINICIUS | Loja: 65 | Região: Aracaju e regiao | Código: 82 | IE: 27.105.247-3', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('fab9449b-d756-4fe0-b559-3ce39abe0d3a'::uuid, 'HIPERIDEAL ALPHAVILLE', '02.212.937/0044-96', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: AVENIDA ALPHAVILLE L. 03 | Bairro: ALPHAVILLE I | CEP: 41701-015 | Vendedor: RICARDO | Loja: 32 | Região: Paralela e regiao | Código: 2613 | IE: 232.166.514', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('fc6674b7-1bc9-4a68-a7e6-c11b9bd88eb4'::uuid, 'SERRANA  JARDIM APIPEMA', '02.212.937/0025-23', 'SALVADOR', 'BA', 'Hiperideal', 'Endereço: R PROFESSOR SABINO SILVA 607 | Bairro: JARDIM APIPEMA | CEP: 40155-250 | Vendedor: RICARDO | Loja: 17 | Região: Suburbio e regiao | Código: 2613 | IE: 159.469.826', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('fc73f26e-3617-4f07-a25b-69844ad209d7'::uuid, 'CDP MATA PREMIUM LJ 01', '43.941.941/0010-23', 'MATA DE SAO JOAO', 'BA', 'Cdp', 'Endereço: RUA LUIZ ANTONIO GARCEZ S/N | Bairro: CENTRO - SEDE | CEP: 48280-000 | Vendedor: NIXON | Loja: 3 | Região: Alagoinhas e regiao | Código: 4245 | IE: 195718346', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('fcf2fe7f-aa45-4d0f-9e4a-56b67016447e'::uuid, 'ATAKAREJO  SAO GONCALO DOS CAMPOS', '73.849.952/0047-30', 'SAO GONCALO DOS CAMPOS', 'BA', 'Atakarejo', 'Endereço: AVENIDA JOSE CARLOS DE LACERDA S/N | Bairro: LUIZ EDUARDO MAGALHAES | CEP: 44330-000 | Vendedor: RICARDO | Loja: 25 | Região: Feira e regiao | Código: 213 | IE: 216.573.079', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('fe53c8aa-1931-434b-bd0f-cc4d0d3fe090'::uuid, 'PARIS DELICATESSEN', '29.590.340/0001-00', 'SALVADOR', 'BA', 'Outros', 'Endereço: AV PROFESSOR PINTO DE AGUIAR, 293 | Bairro: PITUACU | Complemento: CS | CEP: 41740-090 | Vendedor: RICARDO | Loja: 1 | Região: Paralela e regiao | Código: 2399 | IE: 146347870', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ff7f2b22-5a05-4ea2-bf11-a2934349c26c'::uuid, 'ATAKAREJO ENGENHO VELHO DE BROTAS', '73.849.952/0032-54', 'SALVADOR', 'BA', 'Atakarejo', 'Endereço: AV VASCO DA GAMA 437 | Bairro: ENGENHO VELHO DE BROTAS | Complemento: TODO IMOVEL | CEP: 40240-090 | Vendedor: RICARDO | Loja: 15 | Região: Vasco e regiao | Código: 213 | IE: 185825759', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ffa7b477-52ff-46a0-94e4-1215fa48c08d'::uuid, 'ASSAI PARIPE', '06.057.223/0322-94', 'SALVADOR', 'BA', 'Assai', 'Endereço: AV AFRANIO PEIXOTO  SN | Bairro: PARIPE | CEP: 40800-570 | Vendedor: NIXON | Loja: 36 | Região: Suburbio e regiao | Código: 1899 | IE: 133.095.856', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());
INSERT INTO public.clientes (id, nome, cnpj, cidade, uf, rede, observacoes, ativo, created_at, updated_at)
VALUES ('ffe3922d-f843-4680-9fcf-c0edef9e219b'::uuid, 'CDP CD MONTE LIBANO', '07.803.111/0001-85', 'MATA DE SAO JOAO', 'BA', 'Outros', 'Endereço: RODOVIA BA 093, DISTRITO INDUSTRIAL SN | Bairro: MONTE LIBANO | CEP: 48280-000 | Vendedor: NIXON | Loja: 1 | Região: Alagoinhas e regiao | Código: 5085 | IE: 68.114.699', true, '2025-12-21 17:26:38.840624+00', '2025-12-21 17:26:38.840624+00')
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  cnpj = EXCLUDED.cnpj,
  cidade = EXCLUDED.cidade,
  uf = EXCLUDED.uf,
  rede = EXCLUDED.rede,
  observacoes = EXCLUDED.observacoes,
  updated_at = timezone('utc'::text, now());

COMMIT;