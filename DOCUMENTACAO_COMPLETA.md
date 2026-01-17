# Sistema de Gestão de Devoluções - Grupo Doce Mel

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Funcionalidades Completas](#funcionalidades-completas)
   - [Autenticação e Segurança](#autenticação-e-segurança)
   - [Dashboard Pendências](#dashboard-pendências)
   - [Dashboard Lançadas](#dashboard-lançadas)
   - [Validação de Devoluções](#validação-de-devoluções)
   - [Relatórios](#relatórios)
   - [Sincronização/Importação](#sincronizaçãoimportação)
   - [Configurações](#configurações)
   - [Perfil do Usuário](#perfil-do-usuário)
5. [Sistema de Permissões (RBAC)](#sistema-de-permissões-rbac)
6. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
7. [Configuração e Instalação](#configuração-e-instalação)
8. [Deploy](#deploy)
9. [PWA (Progressive Web App)](#pwa-progressive-web-app)
10. [Design System](#design-system)

---

## 🎯 Visão Geral do Sistema

O **Sistema de Gestão de Devoluções do Grupo Doce Mel** é uma aplicação web completa desenvolvida para automatizar e otimizar todo o ciclo de gestão de devoluções de produtos. O sistema oferece controle total sobre o processo de devolução, desde a importação de dados até a validação, análise estratégica e geração de relatórios executivos.

### Objetivos Principais

- **Automatização** do processo de importação e validação de devoluções
- **Rastreabilidade completa** de todas as ações através de logs detalhados
- **Análise estratégica** através de dashboards interativos e insights automáticos
- **Controle de acesso** granular baseado em perfis de usuário
- **Performance** através de otimizações de queries e cache inteligente

### Público-Alvo

- **ADMIN:** Gestão completa do sistema e usuários
- **GESTOR:** Análise estratégica e tomada de decisão
- **COMERCIAL:** Validação e acompanhamento de devoluções
- **LOGISTICA:** Validação, sincronização e gestão operacional
- **VENDEDOR:** Acompanhamento de próprias devoluções

---

## 🏗️ Arquitetura e Tecnologias

### Stack Tecnológica

#### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 19.1.0 | Biblioteca JavaScript para construção de interfaces |
| **TypeScript** | 5.8.3 | Tipagem estática para segurança e produtividade |
| **Vite** | 6.3.5 | Build tool moderno e otimizado |
| **React Router DOM** | 7.11.0 | Roteamento SPA (Single Page Application) |
| **Zustand** | 5.0.9 | Gerenciamento de estado global leve |
| **Tailwind CSS** | 3.4.1 | Framework CSS utilitário |
| **Shadcn UI** | Latest | Biblioteca de componentes acessíveis |
| **Radix UI** | Latest | Componentes primitivos acessíveis |
| **Recharts** | 3.6.0 | Biblioteca de gráficos e visualizações |
| **jsPDF + jsPDF-AutoTable** | 3.0.4 | Geração de documentos PDF |
| **XLSX (SheetJS)** | 0.18.5 | Manipulação e exportação Excel |
| **ExcelJS** | 4.4.0 | Processamento avançado de Excel |
| **date-fns** | 4.1.0 | Manipulação moderna de datas |
| **Sonner** | 2.0.7 | Sistema de notificações toast |
| **PapaParse** | 5.5.3 | Parser de arquivos CSV |

#### Backend e Infraestrutura

| Serviço | Descrição |
|---------|-----------|
| **Supabase** | Backend as a Service completo |
| **PostgreSQL** | Banco de dados relacional robusto |
| **Supabase Auth** | Sistema de autenticação JWT integrado |
| **Row Level Security (RLS)** | Segurança em nível de linha |
| **Edge Functions** | Funções serverless (envio de emails) |

### Arquitetura de Dados

- **SPA (Single Page Application):** Aplicação React com roteamento client-side
- **REST API:** Comunicação com Supabase via REST API
- **Real-time (Futuro):** Suporte a atualizações em tempo real
- **Cache:** LocalStorage para cache de perfis e otimização

---

## 📁 Estrutura do Projeto

```
appdedevolucoes/
├── public/                          # Arquivos públicos estáticos
│   ├── logo.png                     # Logo da aplicação
│   ├── manifest.json                # Manifesto PWA
│   ├── sw.js                        # Service Worker (PWA)
│   └── _redirects                   # Configurações de redirecionamento (Netlify)
│
├── src/                             # Código-fonte da aplicação
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── dashboard/               # Componentes específicos do dashboard
│   │   │   └── KPICard.tsx          # Card de KPI reutilizável
│   │   ├── filters/                 # Componentes de filtro
│   │   │   └── FilterBar.tsx        # Barra de filtros global
│   │   ├── layout/                  # Componentes de layout
│   │   │   ├── MainLayout.tsx       # Layout principal com sidebar
│   │   │   ├── PageHeader.tsx       # Cabeçalho padronizado de páginas
│   │   │   └── Sidebar.tsx          # Menu lateral navegável
│   │   ├── reports/                 # Componentes de relatórios
│   │   │   ├── ReportHTML.tsx       # Componente de relatório HTML
│   │   │   └── ReportHTMLPage.tsx   # Página de visualização de relatório
│   │   └── ui/                      # Componentes UI base (Shadcn)
│   │       ├── button.tsx           # Botões
│   │       ├── card.tsx             # Cards
│   │       ├── table.tsx            # Tabelas
│   │       ├── dialog.tsx           # Modais
│   │       ├── select.tsx           # Dropdowns
│   │       ├── input.tsx            # Campos de entrada
│   │       └── ...                  # Outros componentes UI
│   │
│   ├── pages/                       # Páginas da aplicação
│   │   ├── LoginPage.tsx            # Tela de autenticação
│   │   ├── DashboardPage.tsx        # Dashboard Pendências
│   │   ├── DashboardLancadasPage.tsx # Dashboard Lançadas
│   │   ├── ValidationPage.tsx       # Tela de validação de devoluções
│   │   ├── ReportsPage.tsx          # Tela de relatórios e exportações
│   │   ├── SyncPage.tsx             # Tela de sincronização/importação
│   │   ├── SettingsPage.tsx         # Tela de configurações (Admin)
│   │   ├── ProfilePage.tsx          # Tela de perfil do usuário
│   │   └── EmptyPage.tsx            # Página para usuários sem permissão
│   │
│   ├── lib/                         # Bibliotecas e utilitários
│   │   ├── supabase.ts              # Cliente Supabase configurado
│   │   ├── store.ts                 # Store Zustand (estado global)
│   │   ├── dateUtils.ts             # Utilitários de manipulação de datas
│   │   ├── utils.ts                 # Funções utilitárias gerais
│   │   └── mock-data.ts             # Dados mock para desenvolvimento
│   │
│   ├── hooks/                       # Custom hooks React
│   │   └── use-toast.ts             # Hook para notificações toast
│   │
│   ├── types/                       # Definições de tipos TypeScript
│   │   └── index.ts                 # Tipos globais e interfaces
│   │
│   ├── App.tsx                      # Componente principal da aplicação
│   ├── main.tsx                     # Entry point da aplicação
│   ├── index.css                    # Estilos globais e variáveis CSS
│   └── vite-env.d.ts                # Tipos do Vite
│
├── supabase/                        # Configurações do Supabase
│   ├── functions/                   # Edge Functions
│   │   └── send-validation-email/   # Função para envio de emails
│   │       └── index.ts
│   └── migrations/                  # Migrações do banco de dados
│       ├── 20250225120000_initial_schema.sql
│       ├── 20250225130000_promote_admin.sql
│       ├── 20250225140000_audit_logs.sql
│       └── ...                      # Outras migrações
│
├── scripts/                         # Scripts auxiliares
│   ├── create_admin.js              # Script para criar usuário admin
│   ├── import_clientes.cjs          # Script para importar clientes
│   └── apply_clientes_migration.cjs # Script para aplicar migração de clientes
│
├── arquivos/                        # Arquivos de referência/importação
│   ├── clientes_rows.csv            # Dados de clientes (CSV)
│   ├── emitentes_rows.csv           # Dados de emitentes (CSV)
│   └── ...                          # Outros arquivos de referência
│
├── index.html                       # HTML principal da aplicação
├── vite.config.ts                   # Configuração do Vite
├── tailwind.config.js               # Configuração do Tailwind CSS
├── postcss.config.js                # Configuração do PostCSS
├── tsconfig.json                    # Configuração do TypeScript
├── package.json                     # Dependências e scripts do projeto
├── vercel.json                      # Configuração do Vercel (deploy)
├── netlify.toml                     # Configuração do Netlify (deploy)
├── components.json                  # Configuração do Shadcn UI
├── eslint.config.js                 # Configuração do ESLint
├── CONFIGURACAO_EMAIL_VALIDACAO.md  # Documentação de configuração de email
├── DEPLOY.md                        # Documentação de deploy
├── TESTE_EDGE_FUNCTION.md           # Documentação de testes de Edge Functions
└── README.md                        # README básico do projeto
```

---

## 🚀 Funcionalidades Completas

### 🔐 Autenticação e Segurança

#### Tela de Login (`/login`)

**Características:**
- Autenticação via email e senha usando Supabase Auth
- Validação de credenciais em tempo real
- Mensagens de erro claras e específicas
- Interface responsiva e moderna
- Redirecionamento automático baseado no perfil do usuário

**Fluxo de Autenticação:**
1. Usuário insere credenciais (email e senha)
2. Sistema valida no Supabase Auth
3. Em caso de sucesso:
   - Carrega perfil do usuário da tabela `profiles`
   - Aplica cache em LocalStorage (24 horas)
   - Redireciona para dashboard apropriado
4. Em caso de erro, exibe mensagem específica

**Segurança:**
- Tokens JWT gerenciados automaticamente pelo Supabase
- Renovação automática de tokens
- Logout limpa sessão e cache
- Proteção contra ataques de força bruta (Supabase)

---

### 📊 Dashboard Pendências (`/dashboard`)

#### Visão Geral

O Dashboard Pendências fornece uma visão analítica completa de todas as devoluções com status **PENDENTE VALIDAÇÃO**, **TRATATIVA DE ANULAÇÃO** ou **VALIDADA**, permitindo tomada de decisão baseada em dados.

#### KPIs Principais

Exibidos em cards no topo da página:

1. **Valor Total Devolvido** (R$)
   - Soma de todos os valores de notas fiscais
   - Formato: R$ com separadores de milhar
   - Atualização em tempo real conforme filtros

2. **Total de Devoluções**
   - Contagem total de notas fiscais devolvidas
   - Indicador de volume

3. **Produtos Devolvidos** (Quantidade)
   - Soma total de quantidades de produtos
   - Calculado a partir dos itens de devolução

4. **Ticket Médio** (R$)
   - Valor médio por devolução
   - Cálculo: Valor Total / Total de Devoluções

5. **Fora do SLA**
   - Contagem de devoluções em atraso
   - Indicador de performance operacional

#### Central de Alertas

**Componente compacto e corporativo** que monitora situações críticas:

- **Notas em Atraso:** Alertas para notas que ultrapassaram o prazo
- **Notas Pendentes:** Alertas quando há mais de 20 notas pendentes
- **Valores Altos:** Alertas para notas acima de R$ 1.000,00
- **Cancelamentos:** Alertas para notas em tratativa de anulação
- **Clientes com Múltiplas Pendências:** Alertas para clientes com mais de 5 notas pendentes

**Design:**
- Ícones discretos e corporativos
- Cores sutis baseadas em HSL
- Fontes reduzidas para visualização compacta
- Badges numéricos para contagens

#### Status de Validação (Velocímetro)

**Gauge visual** mostrando o valor total de notas pendentes e em tratativa de anulação:

- **Normal (0 - R$ 10.000):** Verde - situação sob controle
- **Atenção (R$ 10.000 - R$ 20.000):** Laranja - requer monitoramento
- **Crítico (R$ 20.000 - R$ 40.000):** Vermelho - ação imediata necessária

**Características:**
- Visual compacto e corporativo
- Legenda clara de faixas de valores
- Cores discretas seguindo design system

#### Gráficos e Visualizações

**1. Evolução no Tempo**
- **Tipo:** Gráfico de Área
- **Eixos:** Datas (X) vs Valor em R$ (Y)
- **Dados:** Agrupamento diário do valor total devolvido
- **Interatividade:** Tooltip com valor exato ao hover

**2. Top Clientes (Valor)**
- **Tipo:** Gráfico de Colunas
- **Dados:** Top 10 clientes por valor total devolvido
- **Eixo X:** Nome do cliente (com quebra de linha automática)
- **Tooltip:** Detalhes de cliente e notas fiscais

**3. Top Vendedores (Valor)**
- **Tipo:** Gráfico de Colunas
- **Dados:** Top 5 vendedores por valor total
- **Visualização:** Similar ao gráfico de clientes

**4. Top Redes (Valor)**
- **Tipo:** Gráfico de Colunas
- **Dados:** Top 5 redes por valor total devolvido
- **Agrupamento:** Por rede do cliente

**5. Análise de Pareto (80/20)**
- **Tipo:** Gráfico Composto (Colunas + Linha)
- **Eixo Y Esquerdo:** Valor em R$ (colunas)
- **Eixo Y Direito:** Percentual acumulado (linha)
- **Objetivo:** Identificar concentração de valor em poucos clientes
- **Regra 80/20:** Mostra quantos clientes concentram 80% do valor

**6. Principais Motivos**
- **Tipo:** Gráfico de Pizza (Donut)
- **Dados:** Top 5 motivos mais frequentes
- **Visualização:** Distribuição percentual com legenda

**7. Distribuição por Município**
- **Tipo:** Lista com barras de progresso
- **Dados:** Top 6 municípios por valor total
- **Fonte:** `cidade_origem` (município do cliente/emitente)

**8. Produtos Críticos**
- **Tipo:** Lista ordenada separada por unidade (CX e UN)
- **Dados:** Top 5 produtos em CX e Top 5 em UN
- **Formato:** Nome reduzido (2 primeiras palavras) + quantidade
- **Normalização:** Unidades normalizadas (CX1, CXS → CX; UN, UND → UN)

**9. Heatmap: Produto × Rede**
- **Tipo:** Tabela com cores de intensidade
- **Dados:** Quantidades totais devolvidas por produto e rede
- **Filtro:** Apenas notas "PENDENTE VALIDAÇÃO"
- **Agrupamento:** Produtos pelas 2 primeiras palavras do nome
- **Visualização:** Células coloridas proporcionalmente à quantidade

**10. Notas em Cancelamento**
- **Tipo:** Gráfico de Colunas
- **Dados:** Notas com resultado "TRATATIVA DE ANULAÇÃO"
- **Agrupamento:** Por data (dd/MM)
- **Tooltip:** Detalhes de cliente e nota fiscal

**11. Notas Canceladas**
- **Tipo:** Gráfico de Colunas
- **Dados:** Notas com resultado "ANULADA/CANCELADA"
- **Visualização:** Similar ao gráfico de cancelamento

#### Insights Automáticos

Sistema inteligente que gera análises automáticas:

1. **Total de Devoluções:** Sempre presente quando há dados
2. **Cliente Concentrado:** Alerta quando um cliente concentra > 20% do valor
3. **Média de Produtos:** Média de produtos por devolução
4. **Vendedor Líder:** Identificação do vendedor com maior valor
5. **Regra 80/20:** Análise de concentração de valor
6. **Produto Mais Devolvido:** Identificação do produto mais problemático
7. **Taxa de Cancelamento:** Alerta quando taxa > 10%
8. **Motivo Mais Comum:** Identificação do motivo mais frequente
9. **Ticket Alto:** Identificação de devoluções acima de 150% da média
10. **Rede Problemática:** Alerta quando uma rede concentra > 15% do valor
11. **Tendência Temporal:** Análise de variação comparada ao período anterior

#### Filtros Disponíveis

A barra de filtros global (`FilterBar`) permite:

- **Período:** Seleção de período pré-definido ou intervalo customizado
  - Hoje, Ontem, Esta Semana, Semana Passada
  - Este Mês, Mês Passado, Este Trimestre
  - Este Semestre, Este Ano, Ano Passado e Este Ano
- **Data Específica:** Seleção de data única
- **Busca:** Pesquisa por cliente, vendedor ou número da nota
- **Resultado:** Filtro por status (PENDENTE VALIDAÇÃO, VALIDADA, etc.)
- **Motivo:** Filtro por motivo de devolução (multiseleção)
- **Cliente:** Filtro por cliente específico (multiseleção)
- **Vendedor:** Filtro por vendedor (multiseleção)
- **Setor:** Filtro por setor (multiseleção)

**Observação:** Usuários VENDEDOR veem automaticamente apenas seus próprios dados (filtro aplicado automaticamente).

---

### 📈 Dashboard Lançadas (`/dashboard-lancadas`)

#### Visão Geral

O Dashboard Lançadas fornece análise detalhada de todas as devoluções com status **LANÇADA**, permitindo análise histórica e comparativa.

#### KPIs Específicos

1. **Valor Total Devolvido Lançado** (R$)
   - Soma de valores de todas as notas lançadas

2. **Total de Devoluções Lançadas**
   - Contagem de notas com status LANÇADA

3. **Ticket Médio Lançado** (R$)
   - Média de valores das notas lançadas

4. **Taxa de Conversão**
   - Percentual de notas lançadas vs total processado

#### Gráficos Específicos

**1. Evolução Temporal de Lançadas**
- Gráfico de área mostrando tendência ao longo do tempo
- Comparação entre períodos

**2. Análise de Produtos Lançados**
- Top produtos mais lançados
- Análise de quantidade e valores

**3. Distribuição por Setor**
- Visualização da distribuição de notas lançadas por setor
- Identificação de setores com maior volume

**4. Análise de Motivos em Notas Lançadas**
- Distribuição dos motivos nas notas já processadas
- Identificação de padrões

**5. Comparativo Período Atual vs Anterior**
- Gráficos comparativos de evolução
- Identificação de tendências

#### Funcionalidades Especiais

- **Exportação de Dados:** Exportação de análises em Excel/PDF
- **Filtros Avançados:** Mesma barra de filtros do Dashboard Pendências
- **Insights Específicos:** Análises focadas em dados lançados

---

### ✅ Validação de Devoluções (`/validation`)

#### Visão Geral

A tela de Validação é o coração operacional do sistema, permitindo validação e gestão detalhada de devoluções.

#### Cards de Estatísticas

Exibidos no topo da página:

1. **NF Pendentes**
   - Contagem de notas pendentes de validação
   - Badge destacado

2. **Total Pendente** (R$)
   - Valor total em R$ das notas pendentes

3. **NF em Cancelamento**
   - Contagem de notas em processo de cancelamento

4. **Total Cancelamento** (R$)
   - Valor total em R$ das notas em cancelamento

5. **NF em Atraso**
   - Contagem de notas fora do prazo (SLA)
   - Indicador crítico

6. **Total em Atraso** (R$)
   - Valor total em R$ das notas em atraso

#### Tabela Principal de Devoluções

**Características:**
- Tabela expansível com todas as devoluções
- Ordenação por qualquer coluna (clique no cabeçalho)
- Paginação (100 itens por página)
- Modo de seleção múltipla para ações em lote
- Scroll horizontal quando necessário

**Colunas:**

1. **Expandir/Recolher:** Ícone para ver detalhes dos produtos
2. **Data Emissão:** Data de emissão da nota (dd/MM/yyyy)
3. **Nota Fiscal:** Número da nota fiscal
4. **Cliente:** Nome do cliente (truncado se muito longo)
5. **Origem:** Cidade/UF de origem (Cidade/UF)
6. **Vendedor:** Nome do vendedor
7. **Motivo:** Select dropdown para seleção de motivo
   - Exibe motivo e setor entre parênteses
   - Mostra setor abaixo quando selecionado
8. **Valor Total:** Valor total da nota em R$ (R$ X.XX)
9. **Dias:** Quantidade de dias desde a emissão
10. **Prazo:** Badge indicando status do prazo
    - **EM ATRASO** (vermelho): Nota fora do SLA
    - **NO PRAZO** (verde): Nota dentro do SLA
    - **Sem informação** (cinza): Quando não há data de emissão
11. **Resultado:** Botão para alterar resultado
    - Cores por status
    - Ciclo: PENDENTE VALIDAÇÃO → VALIDADA → LANÇADA → TRATATIVA DE ANULAÇÃO → ANULADA/CANCELADA
12. **Validado Por:** Nome do usuário que validou
    - Mostra "-" quando status é PENDENTE VALIDAÇÃO
    - Mostra nome do usuário para outros status
    - Baseado no último log de validação
13. **Comentário:** Campo de texto para adicionar comentários
    - Máximo de 500 caracteres
    - Botão de salvar ao lado
    - Persistido no banco de dados
14. **Ações:** Botões de ação
    - Compartilhar via WhatsApp
    - Editar registro completo
    - Excluir registro

#### Seção Expandida (Produtos)

Ao expandir uma linha, exibe tabela detalhada de produtos:

**Tabela de Itens:**
- **Número:** Número do item na nota fiscal
- **Descrição:** Descrição completa do produto
- **Unidade:** Unidade de medida (UN, KG, CX, etc.)
- **Quantidade:** Quantidade devolvida
- **Valor Unitário:** Valor unitário do produto
- **Valor Total Bruto:** Valor total do item
- **Motivo:** Select para atribuir motivo individual ao produto
  - Cada produto pode ter seu próprio motivo
  - Quando todos os produtos têm motivo, resultado muda para VALIDADA automaticamente

**Dados Adicionais:**
- Exibidos abaixo da tabela quando disponíveis
- Formatação: Negrito, itálico, fonte pequena
- Quebra de linha automática

#### Funcionalidades de Validação

**1. Validação Individual (Produto)**
- Selecionar motivo para cada produto individualmente
- Sistema verifica automaticamente se todos têm motivo
- Se sim, atualiza resultado para VALIDADA e registra validador

**2. Validação em Lote (Nota Completa)**
- Selecionar motivo no campo principal da linha
- Aplica o mesmo motivo para todos os produtos da nota
- Atualiza resultado para VALIDADA automaticamente
- Registra validador e timestamp

**3. Alteração de Resultado**
- Clicar no botão de resultado para avançar no ciclo
- Atualização imediata sem recarregar página
- Registro de log de alteração com usuário e timestamp

**4. Comentários**
- Adicionar comentários explicativos por nota
- Salvar individualmente por nota
- Persistido no banco de dados (`justificativa`)
- Histórico mantido

**5. Edição Completa**
- Modal de edição com todos os campos editáveis
- Permite alteração de qualquer informação
- Validação de dados antes de salvar
- Atualização em cascata de produtos

**6. Exclusão**
- Exclusão individual ou em lote (modo seleção)
- Confirmação antes de excluir
- Exclusão em cascata (produtos também são excluídos)
- Log de exclusão registrado

**7. Compartilhamento WhatsApp**
- Gera mensagem formatada com resumo completo
- Inclui dados da nota, produtos e motivos
- Abre WhatsApp Web/App com mensagem pré-preenchida
- Formatação profissional da mensagem

#### Logs e Rastreabilidade

Todas as ações são registradas na tabela `logs_validacao`:

- **SELECIONAR_MOTIVO:** Quando motivo é atribuído à nota
- **SELECIONAR_MOTIVO_PRODUTO:** Quando motivo é atribuído a produto individual
- **ALTERAR_RESULTADO:** Quando resultado é alterado
- **ADICIONAR_COMENTARIO:** Quando comentário é adicionado

**Cada log contém:**
- ID da devolução
- ID do usuário (quem fez a ação)
- Ação realizada
- Status anterior
- Status novo
- Timestamp preciso

**Consulta de Logs:**
- Disponível na página de Perfil (apenas ADMIN)
- Filtros por período, usuário e ação
- Visualização completa do histórico

---

### 📄 Relatórios (`/reports`)

#### Funcionalidades Principais

**1. Visualização em Tabela**
- Exibição de todas as devoluções em formato tabular
- Colunas: Data, Nota Fiscal, Cliente, Vendedor, Motivo, Origem, Dias, Prazo, Resultado, Valor Total
- Ordenação por qualquer coluna
- Filtros aplicáveis via `FilterBar`

**2. Exportação Excel**
- Exportação completa dos dados filtrados
- Formato: `.xlsx` (Excel)
- Inclui todas as colunas visíveis
- Nome do arquivo com timestamp (ex: `relatorio_devolucoes_25-12-2025_13-37-44.xlsx`)
- Formatação de células (moeda, data, números)

**3. Geração PDF**
Relatório completo em PDF com múltiplas seções:

- **Estatísticas Gerais:** Resumo dos KPIs principais
- **Devoluções Pendentes:** Lista de notas pendentes com detalhes
- **Devoluções em Tratativa:** Notas em cancelamento
- **Devoluções Validadas:** Notas validadas
- **Lista Completa com Produtos:** Tabela detalhada incluindo itens
  - Limitação: Máximo de 50 linhas na seção de produtos (para evitar PDF muito grande)
- **Formatação Profissional:** Cabeçalho com logo, rodapé com data/hora

**4. Relatório HTML**
- Visualização de relatório formatado em HTML
- Preparado para impressão
- Cores e formatação preservadas

**5. Filtros Avançados**
- Todos os filtros do `FilterBar` disponíveis
- Aplicação em tempo real
- Persistência durante a sessão
- Exportação respeita filtros aplicados

---

### 📥 Sincronização/Importação (`/sync`)

**Acesso:** Apenas LOGISTICA e ADMIN

#### Funcionalidades

**1. Upload de Arquivo**
- Suporte para arquivos `.xlsx` (Excel) e `.csv` (CSV)
- Validação de formato antes do processamento
- Feedback visual durante upload
- Drag and drop (futuro)

**2. Preview de Dados**
- Visualização dos primeiros 10 registros antes da importação
- Validação de estrutura de colunas
- Identificação de problemas potenciais
- Avisos sobre dados faltantes

**3. Mapeamento de Colunas**
Sistema inteligente de mapeamento automático:

**Colunas Visíveis (mapeadas):**
- Nome Filial
- Nome Cliente
- Cidade Origem
- UF Origem
- Data Emissão
- Número (Nota Fiscal)
- Valor Total da Nota
- Peso líquido
- Sincronização ERP
- Finalidade NFe
- Dados Adicionais
- Vendedor
- Motivo
- Resultado

**Colunas Ocultas (armazenadas mas não exibidas):**
- CNPJ Destinatário
- Destinatário
- Cidade Destino
- UF Destino
- CNPJ Emitente
- Nome PJ Emitente
- Chave de Acesso
- Série
- Tipo
- Status
- Natureza Operação
- CFOPs
- Etiquetas
- E outros campos técnicos

**4. Enriquecimento de Dados**

O sistema enriquece automaticamente os dados importados:

- **Nome Filial:** Buscado da tabela `emitentes` baseado em CNPJ Destinatário
- **Nome Cliente:** Buscado da tabela `clientes` baseado em CNPJ Emitente
- **Vendedor e Rede:** Preenchidos automaticamente quando cliente é encontrado
- **Município e UF:** Preenchidos quando cliente é encontrado
- **Setor:** Atribuído baseado no motivo de devolução selecionado

**5. Validações**

Antes de importar, o sistema valida:

- Chaves de acesso duplicadas (não importa duplicatas)
- Status de sincronização ERP (filtro opcional)
- Normalização de CNPJs (remove caracteres especiais)
- Validação de tipos de dados (datas, números)
- Campos obrigatórios

**6. Processamento**

- Processamento em lote
- Tratamento de erros individual por registro
- Relatório de sucesso/falha detalhado
- Registro de usuário que fez a sincronização
- Timestamp de importação

**7. Itens da Nota**

Processamento de múltiplos itens por nota:

- **Campos:** Descrição, Unidade, Quantidade, Valor Unitário, Valor Total Bruto
- **Associação automática:** Itens associados à nota fiscal
- **Validação:** Verificação de consistência dos dados

**8. Histórico de Importações**

- Lista de arquivos importados
- Status (sucesso/erro)
- Data e hora da importação
- Usuário responsável
- Quantidade de registros processados

---

### ⚙️ Configurações (`/settings`)

**Acesso:** Apenas ADMIN e LOGISTICA

#### Gestão de Setores

**Funcionalidades:**
- **Listar Setores:** Visualização de todos os setores cadastrados em tabela
- **Adicionar Setor:** Cadastro de novos setores via modal
- **Editar Setor:** Alteração de nome do setor
- **Excluir Setor:** Remoção de setor (com validação de dependências)

**Campos:**
- Nome do Setor (obrigatório, único)

**Validações:**
- Não permite exclusão se houver motivos usando o setor
- Não permite duplicatas

#### Gestão de Motivos de Devolução

**Funcionalidades:**
- **Listar Motivos:** Visualização de todos os motivos com seus setores associados
- **Adicionar Motivo:** Cadastro de novos motivos via modal
- **Editar Motivo:** Alteração de nome e setor associado
- **Excluir Motivo:** Remoção de motivo (com validação)

**Campos:**
- Nome do Motivo (obrigatório)
- Setor (associação obrigatória via select)

**Validações:**
- Motivo deve estar associado a um setor
- Não permite exclusão se houver devoluções usando o motivo
- Não permite duplicatas

#### Gestão de Vendedores

**Funcionalidades:**
- **Listar Vendedores:** Visualização de todos os vendedores cadastrados
- **Remoção Automática:** Vendedores são removidos quando não há mais referências

**Observação:** Vendedores são cadastrados automaticamente quando usados em devoluções ou clientes. Não há cadastro manual.

#### Gestão de Clientes

**Funcionalidades:**
- **Listar Clientes:** Visualização completa de todos os clientes em tabela paginada
- **Adicionar Cliente:** Cadastro completo de cliente via modal
- **Editar Cliente:** Alteração de qualquer campo via modal
- **Excluir Cliente:** Remoção de cliente (com confirmação)

**Campos Completos:**
- **Identificação:**
  - Nome (obrigatório)
  - Razão Social
  - CNPJ/CPF (obrigatório, único)
  - Código
- **Endereço:**
  - Município (obrigatório)
  - UF (obrigatório)
  - Endereço completo
  - Bairro
  - Complemento
  - CEP
  - Código Município
  - País
- **Localização:**
  - Coordenadas (Latitude/Longitude)
- **Contato:**
  - Email
  - Telefone
- **Comercial:**
  - Rede
  - Vendedor
  - Loja
  - Região
- **Fiscal:**
  - Inscrição Estadual
- **Observações:**
  - Campo de texto livre

**Validações:**
- CNPJ/CPF único (não permite duplicatas)
- Campos obrigatórios validados
- Formato de CNPJ/CPF validado

#### Gestão de Usuários

**Funcionalidades:**
- **Listar Usuários:** Visualização de todos os usuários do sistema em tabela
- **Criar Usuário:** Criação de novo usuário via modal
- **Editar Usuário:** Alteração de qualquer campo via modal
- **Excluir Usuário:** Remoção de usuário (com confirmação)

**Campos ao Criar:**
- Email (obrigatório, único)
- Senha (obrigatória, mínimo 6 caracteres)
- Nome (obrigatório)
- Perfil (obrigatório, select: ADMIN, GESTOR, COMERCIAL, LOGISTICA, VENDEDOR, NOVO)
- Vendedor (obrigatório se perfil for VENDEDOR, select)

**Campos ao Editar:**
- Nome (editável)
- Perfil (editável, select)
- Vendedor (editável se perfil for VENDEDOR)
- Senha (opcional, apenas se quiser alterar)

**Perfis Disponíveis:**
- **ADMIN:** Acesso total ao sistema
- **GESTOR:** Acesso a relatórios e análises
- **COMERCIAL:** Acesso a validação e relatórios
- **LOGISTICA:** Acesso a validação e relatórios
- **VENDEDOR:** Acesso apenas aos próprios registros
- **NOVO:** Sem acesso (aguardando permissão)

**Observações:**
- Exclusão remove do banco de dados
- Registro no Supabase Auth pode precisar remoção manual
- Usuários podem fazer login mesmo se perfil for NOVO (mas são redirecionados para página vazia)

---

### 👤 Perfil do Usuário (`/profile`)

#### Métricas Pessoais

**Cards de Estatísticas:**

1. **Minhas Devoluções**
   - Contagem de devoluções do usuário
   - Filtrado por vendedor (se VENDEDOR) ou por validador (se outro perfil)

2. **Taxa de Aprovação**
   - Percentual de devoluções validadas/lançadas
   - Cálculo: (VALIDADAS + LANÇADAS) / TOTAL PROCESSADAS

3. **Valor Total**
   - Soma de valores das devoluções do usuário
   - Formato: R$ com separadores

4. **Ticket Médio**
   - Valor médio por devolução do usuário
   - Comparação com média da empresa (opcional)

#### Gráfico de Evolução

- **Tipo:** Gráfico de Linha
- **Dados:** Devoluções do usuário ao longo do tempo
- **Eixo X:** Datas
- **Eixo Y:** Quantidade de devoluções
- **Comparação:** Linha adicional com média da empresa (se disponível)

#### Comparação com Média

- **Ticket Médio:** Comparação entre ticket médio pessoal e da empresa
- **Total de Devoluções:** Comparação de volume
- **Visualização:** Cards lado a lado com indicadores visuais

#### Resumo Automático

- Análise textual das métricas pessoais
- Insights sobre performance
- Sugestões de melhoria

#### Histórico de Validações (Apenas ADMIN)

**Acesso:** Apenas para usuários ADMIN

**Dados:**
- Log completo de todas as ações de validação
- Filtros por período, usuário e ação
- Informações detalhadas:
  - Usuário que fez a ação
  - Ação realizada
  - Devolução afetada
  - Status anterior
  - Status novo
  - Timestamp preciso

**Funcionalidades:**
- Exportação do log para Excel
- Busca por usuário ou ação
- Filtros por data

---

## 🔐 Sistema de Permissões (RBAC)

### Matriz de Permissões

| Funcionalidade | ADMIN | GESTOR | COMERCIAL | LOGISTICA | VENDEDOR | NOVO |
|----------------|-------|--------|-----------|-----------|----------|------|
| **Login** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Dashboard Pendências** | ✅ | ✅ | ✅ | ✅ | ✅* | ❌ |
| **Dashboard Lançadas** | ✅ | ✅ | ✅ | ✅ | ✅* | ❌ |
| **Validação** | ✅ | ❌ | ✅ | ✅ | ✅* | ❌ |
| **Relatórios** | ✅ | ✅ | ✅ | ✅ | ✅* | ❌ |
| **Sincronização** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Configurações** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Perfil** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Página Vazia** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

*VENDEDOR vê apenas seus próprios dados (filtro automático aplicado)

### Detalhamento de Permissões

#### ADMIN
- ✅ Acesso total ao sistema
- ✅ Gestão completa de usuários
- ✅ Acesso a todas as funcionalidades
- ✅ Visualização de logs de validação
- ✅ Configuração de setores, motivos e clientes

#### GESTOR
- ✅ Dashboard completo (análises)
- ✅ Relatórios e exportações
- ✅ Visualização de todas as devoluções
- ❌ Validação de devoluções
- ❌ Configurações
- ❌ Sincronização

#### COMERCIAL
- ✅ Dashboard
- ✅ Validação de devoluções
- ✅ Relatórios
- ❌ Sincronização
- ❌ Configurações
- ❌ Gestão de usuários

#### LOGISTICA
- ✅ Dashboard
- ✅ Validação de devoluções
- ✅ Relatórios
- ✅ Sincronização (importação)
- ✅ Configurações (setores, motivos, clientes)
- ❌ Gestão de usuários (apenas ADMIN)

#### VENDEDOR
- ✅ Dashboard (apenas próprios dados)
- ✅ Validação (apenas próprias devoluções)
- ✅ Relatórios (apenas próprios dados)
- ✅ Perfil pessoal
- ❌ Sincronização
- ❌ Configurações
- ❌ Gestão de usuários

#### NOVO
- ✅ Login
- ✅ Página vazia (aguardando permissão)
- ❌ Todas as outras funcionalidades

### Filtro Automático por Vendedor

Usuários com perfil VENDEDOR têm acesso automaticamente restrito:

- **Dashboard:** Apenas devoluções do próprio vendedor (campo `vendedor` do registro)
- **Validação:** Apenas devoluções do próprio vendedor
- **Relatórios:** Apenas devoluções do próprio vendedor
- **Perfil:** Métricas baseadas apenas nos próprios dados

O filtro é aplicado automaticamente em todas as queries através do `vendedor` armazenado no perfil do usuário, garantindo isolamento total de dados.

---

## 💾 Estrutura do Banco de Dados

### Tabelas Principais

#### `devolucoes`
Armazena informações das notas fiscais devolvidas.

**Campos Principais:**
- `id` (UUID, PK)
- `numero` (String) - Número da nota fiscal
- `nome_cliente` (String)
- `cnpj_destinatario` (String)
- `cnpj_emitente` (String)
- `data_emissao` (Date)
- `valor_total_nota` (Numeric)
- `vendedor` (String)
- `rede` (String)
- `cidade_origem` (String)
- `uf_origem` (String)
- `motivo_id` (UUID, FK -> motivos_devolucao)
- `setor_id` (UUID, FK -> setores)
- `resultado` (String) - Status da devolução
  - Valores: 'PENDENTE VALIDAÇÃO', 'VALIDADA', 'LANÇADA', 'TRATATIVA DE ANULAÇÃO', 'ANULADA/CANCELADA'
- `prazo` (String) - Status do prazo
  - Valores: 'EM ATRASO', 'NO PRAZO'
- `justificativa` (Text) - Comentários/justificativas
- `validado_por` (UUID, FK -> profiles) - Usuário que validou
- `finalizada_por` (UUID, FK -> profiles) - Usuário que finalizou
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `itens_devolucao`
Armazena os produtos/itens de cada devolução.

**Campos Principais:**
- `id` (UUID, PK)
- `devolucao_id` (UUID, FK -> devolucoes)
- `descricao` (String) - Descrição do produto
- `unidade` (String) - Unidade de medida (UN, KG, CX, etc.)
- `quantidade` (Numeric)
- `valor_unitario` (Numeric)
- `valor_total_bruto` (Numeric)
- `motivo_id` (UUID, FK -> motivos_devolucao, nullable)
- `numero_item` (String) - Número do item na nota fiscal
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `motivos_devolucao`
Catálogo de motivos de devolução.

**Campos:**
- `id` (UUID, PK)
- `nome` (String, unique)
- `sector_id` (UUID, FK -> setores)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `setores`
Catálogo de setores da empresa.

**Campos:**
- `id` (UUID, PK)
- `nome` (String, unique)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `clientes`
Cadastro de clientes.

**Campos Principais:**
- `id` (UUID, PK)
- `nome` (String)
- `razao_social` (String)
- `cnpj_cpf` (String, Unique)
- `municipio` (String)
- `uf` (String)
- `rede` (String)
- `vendedor` (String)
- `endereco` (String)
- `bairro` (String)
- `complemento` (String)
- `cep` (String)
- `loja` (String)
- `regiao` (String)
- `codigo` (String)
- `inscricao_estadual` (String)
- `codigo_municipio` (String)
- `pais` (String)
- `latitude` (Numeric)
- `longitude` (Numeric)
- `email` (String)
- `telefone` (String)
- `observacoes` (Text)
- `ativo` (Boolean, default true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `emitentes`
Cadastro de filiais/emitentes.

**Campos:**
- `id` (UUID, PK)
- `cnpj` (String, Unique)
- `nome` (String)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `profiles`
Perfis de usuários do sistema.

**Campos:**
- `id` (UUID, PK, FK -> auth.users)
- `name` (String)
- `email` (String, unique)
- `role` (String) - ADMIN, GESTOR, COMERCIAL, LOGISTICA, VENDEDOR, NOVO
- `vendedor` (String, nullable) - Se role for VENDEDOR
- `avatar_url` (String, nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Triggers:**
- Trigger automático que cria perfil quando usuário é criado no Supabase Auth
- Se não houver perfil criado, sistema usa fallback com role NOVO

#### `logs_validacao`
Log de todas as ações de validação.

**Campos:**
- `id` (UUID, PK)
- `devolucao_id` (UUID, FK -> devolucoes)
- `usuario_id` (UUID, FK -> profiles)
- `acao` (String) - Tipo de ação
  - Valores: 'SELECIONAR_MOTIVO', 'SELECIONAR_MOTIVO_PRODUTO', 'ALTERAR_RESULTADO', 'ADICIONAR_COMENTARIO'
- `status_anterior` (String, nullable)
- `status_novo` (String, nullable)
- `created_at` (Timestamp)

**Objetivo:**
- Rastreabilidade completa de todas as ações
- Auditoria e compliance
- Análise de comportamento

### Relacionamentos

```
devolucoes
  ├── motivos_devolucao (motivo_id)
  ├── setores (setor_id)
  ├── profiles (validado_por, finalizada_por)
  └── itens_devolucao (devolucao_id)

itens_devolucao
  ├── devolucoes (devolucao_id)
  └── motivos_devolucao (motivo_id)

motivos_devolucao
  └── setores (sector_id)

profiles
  └── auth.users (id)

logs_validacao
  ├── devolucoes (devolucao_id)
  └── profiles (usuario_id)
```

### Políticas RLS (Row Level Security)

Todas as tabelas utilizam Row Level Security para garantir segurança:

- **Políticas de Leitura:** Usuários veem apenas dados permitidos
- **Políticas de Escrita:** Usuários podem modificar apenas dados permitidos
- **Filtro Automático:** Vendedores veem apenas próprios dados

---

## 🛠️ Configuração e Instalação

### Pré-requisitos

- **Node.js:** Versão 18 ou superior
- **npm:** Versão 9 ou superior (ou yarn)
- **Git:** Para clonar o repositório
- **Conta Supabase:** Para backend e banco de dados

### Passo a Passo

#### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd appdedevolucoes
```

#### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

#### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**Onde encontrar:**
- Acesse o dashboard do Supabase: https://app.supabase.com
- Vá em **Settings** > **API**
- Copie a **URL do projeto** e a chave `anon` public

#### 4. Configure o Banco de Dados

Execute as migrações do Supabase na ordem:

1. Estrutura base (tabelas principais)
2. Tabelas de relacionamento
3. Políticas RLS
4. Triggers e funções
5. Dados iniciais (setores, motivos)

**Arquivos de migração:** `supabase/migrations/`

**Como aplicar:**
- Via Supabase Dashboard: SQL Editor
- Via Supabase CLI: `supabase db push`
- Via interface web: Copiar e colar cada arquivo SQL

#### 5. Execute o Projeto em Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

#### 6. Acesse a Aplicação

```
http://localhost:5173
```

#### 7. Crie o Primeiro Usuário Admin

**Opção 1: Via Supabase Dashboard**
1. Acesse **Authentication** > **Users**
2. Clique em **Add User** > **Create New User**
3. Insira email e senha
4. No banco de dados, atualize o perfil para `role = 'ADMIN'`:

```sql
UPDATE profiles 
SET role = 'ADMIN' 
WHERE id = '<id-do-usuario>';
```

**Opção 2: Via Script**
Execute o script auxiliar:

```bash
node scripts/create_admin.js
```

**Opção 3: Migração Automática**
A migração `20250225130000_promote_admin.sql` promove automaticamente o primeiro usuário para ADMIN.

---

## 🌐 Deploy

### Vercel (Recomendado)

O projeto está configurado para deploy automático na Vercel.

#### Configuração

1. **Conecte o Repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login e conecte seu repositório GitHub/GitLab/Bitbucket

2. **Configure Variáveis de Ambiente**
   - No painel da Vercel, vá em **Settings** > **Environment Variables**
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Aplique para **Production**, **Preview** e **Development**

3. **Deploy Automático**
   - Cada push na branch `main` gera deploy automático
   - Deploys de outras branches geram previews

#### Arquivo de Configuração

O arquivo `vercel.json` contém configurações específicas:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Netlify

O projeto também está configurado para Netlify.

#### Configuração

1. **Conecte o Repositório**
   - Acesse [netlify.com](https://netlify.com)
   - Conecte seu repositório

2. **Configure Variáveis de Ambiente**
   - Vá em **Site Settings** > **Environment Variables**
   - Adicione as mesmas variáveis da Vercel

3. **Deploy**
   - Netlify detecta automaticamente o Vite
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Arquivo de Configuração

O arquivo `netlify.toml` e `public/_redirects` contêm configurações de redirecionamento para SPA.

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte aplicações React:

- **AWS Amplify:** Suporte completo
- **Azure Static Web Apps:** Configuração similar
- **GitHub Pages:** Requer configuração adicional (SPA redirects)

---

## 📱 PWA (Progressive Web App)

### Funcionalidades PWA

O aplicativo está configurado como PWA, permitindo instalação como aplicativo nativo:

- **Instalação:** Pode ser instalado em dispositivos móveis e desktop
- **Offline:** Cache de recursos estáticos para funcionamento offline básico
- **Ícone:** Ícone personalizado na tela inicial
- **Splash Screen:** Tela de carregamento personalizada
- **Manifest:** Configuração completa de manifest

### Como Instalar

#### Desktop (Chrome/Edge)

1. Acesse o aplicativo no navegador
2. Clique no ícone de instalação na barra de endereços (ou Menu > Instalar App)
3. Confirme a instalação
4. O aplicativo será adicionado ao menu Iniciar/Applications

#### Mobile (Android)

1. Acesse o aplicativo no Chrome
2. Menu (3 pontos) > **"Adicionar à tela inicial"**
3. Confirme
4. Ícone será criado na tela inicial

#### Mobile (iOS)

1. Acesse o aplicativo no Safari
2. Compartilhar (ícone de compartilhar) > **"Adicionar à Tela de Início"**
3. Confirme
4. Ícone será criado na tela inicial

### Configuração

**Arquivo `public/manifest.json`:**
- Nome do aplicativo
- Ícones em diferentes tamanhos (192x192, 512x512)
- Cores do tema (theme_color, background_color)
- Modo de exibição (standalone)
- Orientação (portrait)

**Service Worker (`public/sw.js`):**
- Cache de recursos estáticos
- Estratégia de cache (Cache First)
- Atualização automática quando há novas versões

---

## 🎨 Design System

### Cores

**Tema Claro:**
- **Primária:** Verde (#18442b, #2e6b4d, #4a9170)
- **Secundária:** Tons de verde mais claros
- **Background:** Branco/Cinza claro
- **Texto:** Preto/Cinza escuro
- **Bordas:** Cinza claro

**Tema Escuro:**
- **Primária:** Ciano (#3fedef, #2cb5b8)
- **Secundária:** Tons de azul/ciano
- **Background:** Preto/Cinza escuro
- **Texto:** Branco/Cinza claro
- **Bordas:** Cinza escuro

**Status Colors:**
- **Sucesso:** Verde (HSL: 142, 76%, 36%)
- **Atenção:** Laranja (HSL: 38, 92%, 50%)
- **Erro:** Vermelho (HSL: 0, 84%, 60%)
- **Info:** Azul (HSL: 221, 83%, 53%)

### Componentes UI

Baseados em **Shadcn UI** e **Radix UI**:

- **Button:** Botões com variantes (default, outline, destructive, ghost)
- **Card:** Containers para conteúdo agrupado
- **Table:** Tabelas responsivas e acessíveis
- **Select:** Dropdowns acessíveis com busca
- **Input/Textarea:** Campos de entrada com validação
- **Badge:** Etiquetas de status
- **Accordion:** Seções expansíveis
- **Dialog:** Modais acessíveis
- **Toast:** Notificações não-intrusivas
- **Calendar:** Seleção de datas
- **Popover:** Popovers posicionáveis

### Tipografia

- **Fonte:** Sistema (San Francisco, Segoe UI, etc.)
- **Tamanhos:** Escala responsiva (text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl)
- **Pesos:** Regular (400), Medium (500), Semibold (600), Bold (700)
- **Line Height:** Relaxado para legibilidade

### Espaçamento

- **Padrão:** Múltiplos de 4px (0.25rem)
- **Gaps:** Utilização de Tailwind gap utilities
- **Padding:** Consistente em cards e containers
- **Margins:** Espaçamento responsivo

### Responsividade

- **Breakpoints Tailwind:**
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

- **Estratégia:** Mobile-first
- **Componentes:** Adaptáveis automaticamente

---

## 📝 Convenções de Código

### TypeScript

- Tipagem estrita habilitada (`strict: true`)
- Interfaces para estruturas de dados
- Tipos para enums e constantes
- Evitar uso de `any` (usar `unknown` quando necessário)

### React

- Componentes funcionais com hooks
- Custom hooks para lógica reutilizável
- Props tipadas com TypeScript
- Hooks de efeito com cleanup apropriado

### Nomenclatura

- **Componentes:** PascalCase (`DashboardPage.tsx`)
- **Funções:** camelCase (`fetchReturns`)
- **Constantes:** UPPER_SNAKE_CASE (`RESULTADO_CORES`)
- **Arquivos:** kebab-case ou PascalCase (componentes)
- **Pastas:** kebab-case (`dashboard-lancadas`)

### Estrutura de Arquivos

- Um componente por arquivo
- Hooks customizados em arquivos separados quando reutilizáveis
- Utilitários em `lib/`
- Tipos compartilhados em `types/`
- Componentes UI em `components/ui/`
- Componentes específicos em pastas por funcionalidade

---

## 🔒 Segurança

### Row Level Security (RLS)

Todas as tabelas do Supabase utilizam RLS para garantir segurança:

- **Políticas de Leitura:** Usuários veem apenas dados permitidos
- **Políticas de Escrita:** Usuários podem modificar apenas dados permitidos
- **Filtro Automático:** Vendedores veem apenas próprios dados

### Autenticação JWT

- Tokens seguros gerados pelo Supabase
- Expiração automática (padrão: 1 hora)
- Renovação transparente (refresh tokens)
- Armazenamento seguro no cliente

### Validação de Dados

- **Cliente:** Validação com TypeScript + React Hook Form
- **Servidor:** Validação com PostgreSQL constraints
- **Sanitização:** Sanitização de inputs antes de salvar
- **SQL Injection:** Proteção via Supabase (parametrized queries)

### HTTPS

- Comunicação criptografada em produção
- Certificados SSL automáticos (Vercel/Netlify)
- HSTS habilitado

---

## 🧪 Testes (Futuro)

### Estrutura de Testes Planejada

- **Unitários:** Jest + React Testing Library
  - Testes de componentes isolados
  - Testes de hooks customizados
  - Testes de utilitários

- **Integração:** Testes de fluxos completos
  - Testes de autenticação
  - Testes de validação de devoluções
  - Testes de exportação

- **E2E:** Cypress ou Playwright
  - Testes de fluxos completos do usuário
  - Testes de regressão visual

---

## 📚 Recursos Adicionais

### Documentação de APIs

- **Supabase:** [docs.supabase.com](https://docs.supabase.com)
- **Recharts:** [recharts.org](https://recharts.org)
- **Shadcn UI:** [ui.shadcn.com](https://ui.shadcn.com)
- **Radix UI:** [radix-ui.com](https://radix-ui.com)
- **React Router:** [reactrouter.com](https://reactrouter.com)

### Scripts Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

### Troubleshooting

**Problema:** Usuário não consegue fazer login
- **Solução:** Verificar se perfil existe na tabela `profiles`
- Verificar se variáveis de ambiente estão configuradas

**Problema:** Dashboard não carrega dados
- **Solução:** Verificar RLS policies do Supabase
- Verificar console do navegador para erros

**Problema:** PWA não instala
- **Solução:** Verificar se está usando HTTPS
- Verificar se `manifest.json` está acessível

---

## 📄 Licença

Este projeto é propriedade do **Grupo Doce Mel**. Todos os direitos reservados.

---

## 👥 Equipe e Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para o Grupo Doce Mel**

*Última atualização: Janeiro 2025*
