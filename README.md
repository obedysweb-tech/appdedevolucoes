# Sistema de Gestão de Devoluções - Grupo Doce Mel

Sistema completo e profissional para gestão de devoluções desenvolvido para o Grupo Doce Mel, permitindo controle total sobre o processo de devolução de produtos, desde a importação de dados até a validação, análise e geração de relatórios.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Telas e Funcionalidades](#telas-e-funcionalidades)
  - [Tela de Login](#tela-de-login)
  - [Dashboard](#dashboard)
  - [Validação](#validação)
  - [Relatórios](#relatórios)
  - [Sincronização](#sincronização)
  - [Configurações](#configurações)
  - [Perfil](#perfil)
- [Sistema de Autenticação e Permissões](#sistema-de-autenticação-e-permissões)
- [Configuração e Instalação](#configuração-e-instalação)
- [Deploy](#deploy)
- [PWA](#pwa)

---

## 🎯 Visão Geral

O Sistema de Gestão de Devoluções é uma aplicação web completa desenvolvida em React/TypeScript que automatiza e otimiza todo o processo de gestão de devoluções do Grupo Doce Mel. O sistema oferece:

- **Importação automatizada** de dados via planilhas Excel/CSV
- **Validação inteligente** de devoluções com classificação por motivo e setor
- **Dashboard analítico** com KPIs, gráficos e insights automáticos
- **Geração de relatórios** em PDF e Excel
- **Controle de acesso** baseado em perfis de usuário
- **Rastreabilidade completa** com logs de todas as ações

---

## 🏗️ Arquitetura e Tecnologias

### Frontend

- **React 19** - Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript** - Tipagem estática para maior segurança e produtividade
- **Vite** - Build tool moderno e rápido
- **React Router DOM** - Roteamento de páginas SPA
- **Zustand** - Gerenciamento de estado global leve e performático
- **Tailwind CSS** - Framework CSS utilitário para estilização rápida
- **Shadcn UI** - Biblioteca de componentes UI acessíveis baseados em Radix UI
- **Recharts** - Biblioteca de gráficos para visualização de dados
- **jsPDF + jsPDF-AutoTable** - Geração de documentos PDF
- **XLSX (SheetJS)** - Manipulação e exportação de arquivos Excel
- **date-fns** - Biblioteca moderna para manipulação de datas
- **Sonner** - Sistema de notificações toast elegante

### Backend e Banco de Dados

- **Supabase** - Backend as a Service completo
  - **PostgreSQL** - Banco de dados relacional robusto
  - **Auth** - Sistema de autenticação JWT integrado
  - **Row Level Security (RLS)** - Segurança em nível de linha do banco
  - **Real-time** - Suporte a atualizações em tempo real (futuro)

### PWA (Progressive Web App)

- **Service Worker** - Cache de recursos e funcionalidade offline
- **Web App Manifest** - Configuração para instalação como app nativo
- **Responsive Design** - Interface adaptável para desktop, tablet e mobile

---

## 📁 Estrutura do Projeto

```
appdedevolucoes/
├── public/
│   ├── logo.png              # Logo da aplicação
│   ├── manifest.json          # Manifesto PWA
│   └── sw.js                  # Service Worker
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── dashboard/         # Componentes específicos do dashboard
│   │   │   └── KPICard.tsx    # Card de KPI reutilizável
│   │   ├── filters/           # Componentes de filtro
│   │   │   └── FilterBar.tsx  # Barra de filtros global
│   │   └── layout/            # Componentes de layout
│   │       └── PageHeader.tsx # Cabeçalho de página padronizado
│   ├── lib/                   # Bibliotecas e utilitários
│   │   ├── supabase.ts        # Cliente Supabase configurado
│   │   ├── store.ts           # Store Zustand (estado global)
│   │   └── dateUtils.ts       # Utilitários de data
│   ├── pages/                 # Páginas da aplicação
│   │   ├── LoginPage.tsx      # Tela de autenticação
│   │   ├── DashboardPage.tsx  # Dashboard principal
│   │   ├── ValidationPage.tsx # Tela de validação de devoluções
│   │   ├── ReportsPage.tsx    # Tela de relatórios
│   │   ├── SyncPage.tsx        # Tela de sincronização/importação
│   │   ├── SettingsPage.tsx    # Tela de configurações
│   │   └── ProfilePage.tsx     # Tela de perfil do usuário
│   ├── types/                 # Definições de tipos TypeScript
│   │   └── index.ts           # Tipos globais
│   ├── App.tsx                # Componente principal da aplicação
│   ├── main.tsx               # Entry point da aplicação
│   └── index.css              # Estilos globais
├── supabase/
│   └── migrations/            # Migrações do banco de dados
├── index.html                 # HTML principal
├── vite.config.ts             # Configuração do Vite
├── vercel.json                # Configuração do Vercel
├── package.json               # Dependências do projeto
└── README.md                  # Este arquivo
```

---

## 🖥️ Telas e Funcionalidades

### 🔐 Tela de Login

**Rota:** `/login`

**Descrição:** Tela de autenticação do sistema.

**Funcionalidades:**
- Autenticação via email e senha usando Supabase Auth
- Validação de credenciais em tempo real
- Tratamento de erros com mensagens claras
- Redirecionamento automático após login bem-sucedido
- Interface responsiva e moderna

**Componentes Visuais:**
- Logo da empresa
- Campos de email e senha
- Botão de login
- Mensagens de erro/sucesso

**Fluxo:**
1. Usuário insere email e senha
2. Sistema valida credenciais no Supabase
3. Em caso de sucesso, carrega perfil do usuário e redireciona para Dashboard
4. Em caso de erro, exibe mensagem apropriada

---

### 📊 Dashboard

**Rota:** `/dashboard`

**Descrição:** Tela principal com visão geral e análises dos dados de devoluções.

**Objetivo:** Fornecer uma visão consolidada e analítica de todas as devoluções, permitindo tomada de decisão baseada em dados.

#### KPIs Principais

Exibidos em cards no topo da página:

1. **Valor Total Devolvido**
   - Soma de todos os valores de notas fiscais devolvidas
   - Formato: R$ com separadores de milhar
   - Atualização em tempo real conforme filtros

2. **Total de Devoluções**
   - Contagem total de notas fiscais devolvidas
   - Atualização dinâmica

3. **Produtos Devolvidos**
   - Quantidade total de produtos devolvidos (soma de quantidades)
   - Calculado a partir dos itens de devolução

4. **Ticket Médio**
   - Valor médio por devolução
   - Cálculo: Valor Total / Total de Devoluções

5. **Fora do SLA**
   - Contagem de devoluções que ultrapassaram o prazo estabelecido
   - Indicador de performance operacional

#### Gráficos e Visualizações

**1. Evolução no Tempo**
- **Tipo:** Gráfico de Área
- **Eixo X:** Datas (formato dd/MM)
- **Eixo Y:** Valor em R$
- **Dados:** Agrupamento diário do valor total devolvido
- **Interatividade:** Tooltip com valor exato ao passar o mouse

**2. Top Clientes (Valor)**
- **Tipo:** Gráfico de Colunas
- **Dados:** Top 10 clientes por valor total devolvido
- **Eixo X:** Nome do cliente (com quebra de linha automática)
- **Eixo Y:** Valor em R$
- **Cores:** Paleta verde (tema claro) / ciano (tema escuro)

**3. Top Vendedores (Valor)**
- **Tipo:** Gráfico de Colunas
- **Dados:** Top 5 vendedores por valor total devolvido
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
- **Visualização:** Distribuição percentual
- **Legenda:** Nomes dos motivos com cores correspondentes

**7. Distribuição por Município**
- **Tipo:** Lista com barras de progresso
- **Dados:** Top 6 municípios por valor total
- **Fonte:** `cidade_origem` (município do cliente/emitente)
- **Visualização:** Barra horizontal com percentual

**8. Produtos Críticos**
- **Tipo:** Lista ordenada
- **Dados:** Top 10 produtos mais devolvidos por quantidade total
- **Formato:** Nome reduzido (2 primeiras palavras) + quantidade com 2 casas decimais
- **Ordenação:** Decrescente por quantidade

**9. Heatmap: Produto × Rede**
- **Tipo:** Tabela com cores de intensidade
- **Dados:** Quantidades totais devolvidas por produto e rede
- **Filtro:** Apenas notas com resultado "PENDENTE VALIDAÇÃO"
- **Agrupamento:** Produtos agrupados pelas 2 primeiras palavras do nome
- **Visualização:** Células coloridas proporcionalmente à quantidade
- **Formato:** Quantidade em unidades (ex: "10.50 qtde")

**10. Notas em Cancelamento**
- **Tipo:** Gráfico de Colunas
- **Dados:** Notas com resultado "TRATATIVA DE ANULAÇÃO"
- **Agrupamento:** Por data (dd/MM)
- **Tooltip:** Mostra nome do cliente e número da nota fiscal
- **Cores:** Mesma paleta dos outros gráficos

**11. Notas Canceladas**
- **Tipo:** Gráfico de Colunas
- **Dados:** Notas com resultado "ANULADA/CANCELADA"
- **Visualização:** Similar ao gráfico de cancelamento
- **Layout:** Exibido lado a lado com "Notas em Cancelamento"

#### Insights Automáticos

Sistema inteligente que gera análises automáticas baseadas nos dados:

1. **Total de Devoluções:** Sempre presente quando há dados
2. **Cliente Concentrado:** Alerta quando um cliente concentra mais de 20% do valor
3. **Média de Produtos:** Média de produtos por devolução
4. **Vendedor Líder:** Identificação do vendedor com maior valor devolvido
5. **Regra 80/20:** Análise de concentração de valor
6. **Produto Mais Devolvido:** Identificação do produto mais problemático
7. **Taxa de Cancelamento:** Alerta quando taxa > 10%
8. **Motivo Mais Comum:** Identificação do motivo mais frequente
9. **Ticket Alto:** Identificação de devoluções acima de 150% da média
10. **Rede Problemática:** Alerta quando uma rede concentra > 15% do valor
11. **Tendência Temporal:** Análise de variação comparada ao período anterior

#### Alertas Automáticos

Sistema de alertas que identifica situações atípicas:

- **Produtos Acima da Média:** Notas com quantidade de produtos acima de 150% da média
- Limitação: Máximo de 5 alertas exibidos
- Formato: Mensagem descritiva com número da nota e cliente

#### Filtros

O Dashboard utiliza a barra de filtros global (`FilterBar`) que permite:

- **Período:** Seleção de período pré-definido ou intervalo customizado
- **Busca:** Pesquisa por cliente, vendedor ou número da nota
- **Resultado:** Filtro por status (PENDENTE VALIDAÇÃO, VALIDADA, etc.)
- **Motivo:** Filtro por motivo de devolução
- **Cliente:** Filtro por cliente específico
- **Vendedor:** Filtro por vendedor
- **Setor:** Filtro por setor

**Observação:** Usuários com perfil VENDEDOR veem automaticamente apenas seus próprios dados.

---

### ✅ Validação

**Rota:** `/validation`

**Descrição:** Tela principal para validação e gestão de devoluções.

**Objetivo:** Permitir que usuários validem devoluções, atribuam motivos, alterem resultados e gerenciem o fluxo de trabalho.

#### Cards de Estatísticas

Exibidos no topo da página:

1. **NF Pendentes:** Contagem de notas fiscais pendentes de validação
2. **Total Pendente:** Valor total em R$ das notas pendentes
3. **NF em Cancelamento:** Contagem de notas em processo de cancelamento
4. **Total Cancelamento:** Valor total em R$ das notas em cancelamento
5. **NF em Atraso:** Contagem de notas fora do prazo (SLA)
6. **Total em Atraso:** Valor total em R$ das notas em atraso

#### Tabela de Devoluções

Tabela principal com todas as devoluções, organizada em linhas expansíveis.

**Colunas:**

1. **Expandir/Recolher:** Ícone para expandir e ver detalhes dos produtos
2. **Data Emissão:** Data de emissão da nota fiscal (formato dd/MM/yyyy)
3. **Nota Fiscal:** Número da nota fiscal
4. **Cliente:** Nome do cliente (truncado se muito longo)
5. **Origem:** Cidade/UF de origem (formato: Cidade/UF)
6. **Vendedor:** Nome do vendedor
7. **Motivo:** Select dropdown para seleção de motivo
   - Exibe motivo e setor entre parênteses
   - Mostra setor abaixo quando selecionado
8. **Valor Total:** Valor total da nota em R$ (formato: R$ X.XX)
9. **Dias:** Quantidade de dias desde a emissão
10. **Prazo:** Badge indicando status do prazo
    - EM ATRASO (vermelho)
    - NO PRAZO (verde)
    - Sem informação (cinza)
11. **Resultado:** Botão para alterar resultado
    - Cores por status
    - Ciclo: PENDENTE VALIDAÇÃO → VALIDADA → LANÇADA → TRATATIVA DE ANULAÇÃO → ANULADA/CANCELADA
12. **Validado Por:** Nome do usuário que validou a nota
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

**Funcionalidades da Tabela:**

- **Ordenação:** Clique no cabeçalho para ordenar (ascendente/descendente)
- **Seleção Múltipla:** Modo de seleção para ações em lote
- **Expansão:** Clique no ícone para expandir e ver produtos
- **Fonte Reduzida:** Tamanho de fonte otimizado para visualização de todas as colunas
- **Responsiva:** Scroll horizontal quando necessário

#### Seção Expandida (Produtos)

Ao expandir uma linha, exibe:

**Tabela de Itens:**
- **Número:** Número do item na nota fiscal
- **Descrição:** Descrição completa do produto
- **Unidade:** Unidade de medida (UN, KG, etc.)
- **Quantidade:** Quantidade devolvida
- **Valor Unitário:** Valor unitário do produto
- **Valor Total Bruto:** Valor total do item
- **Motivo:** Select para atribuir motivo individual ao produto
  - Cada produto pode ter seu próprio motivo
  - Quando todos os produtos têm motivo, resultado muda para VALIDADA automaticamente

**Dados Adicionais:**
- Exibidos abaixo da tabela de produtos quando disponíveis
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
- Registra validador

**3. Alteração de Resultado**
- Clicar no botão de resultado para avançar no ciclo
- Atualização imediata sem recarregar página
- Registro de log de alteração

**4. Comentários**
- Adicionar comentários explicativos
- Salvar individualmente por nota
- Persistido no banco de dados

**5. Edição Completa**
- Modal de edição com todos os campos
- Permite alteração de qualquer informação
- Validação de dados antes de salvar

**6. Exclusão**
- Exclusão individual ou em lote
- Confirmação antes de excluir
- Exclusão em cascata (produtos também são excluídos)

**7. Compartilhamento WhatsApp**
- Gera mensagem formatada com resumo completo
- Inclui dados da nota, produtos e motivos
- Abre WhatsApp Web/App com mensagem pré-preenchida

#### Filtros e Ordenação

- **Filtros Globais:** Utiliza `FilterBar` para filtros avançados
- **Ordenação:** Por qualquer coluna (clique no cabeçalho)
- **Paginação:** 100 itens por página
- **Busca:** Pesquisa em tempo real

#### Logs e Rastreabilidade

Todas as ações são registradas na tabela `logs_validacao`:

- **SELECIONAR_MOTIVO:** Quando motivo é atribuído
- **SELECIONAR_MOTIVO_PRODUTO:** Quando motivo é atribuído a produto individual
- **ALTERAR_RESULTADO:** Quando resultado é alterado
- **ADICIONAR_COMENTARIO:** Quando comentário é adicionado

Cada log contém:
- ID da devolução
- ID do usuário
- Ação realizada
- Status anterior
- Status novo
- Timestamp

---

### 📈 Relatórios

**Rota:** `/reports`

**Descrição:** Tela para visualização e exportação de relatórios de devoluções.

**Objetivo:** Fornecer ferramentas de análise e exportação de dados para tomada de decisão.

#### Funcionalidades

**1. Visualização em Tabela**
- Exibição de todas as devoluções em formato tabular
- Colunas: Data, Nota Fiscal, Cliente, Vendedor, Motivo, Origem, Dias, Prazo, Resultado, Valor Total
- Ordenação por qualquer coluna
- Filtros aplicáveis via `FilterBar`

**2. Exportação Excel**
- Exportação completa dos dados filtrados
- Formato: `.xlsx`
- Inclui todas as colunas visíveis
- Nome do arquivo com timestamp

**3. Geração PDF**
- Relatório completo em PDF com múltiplas seções:
  - **Estatísticas Gerais:** Resumo dos KPIs
  - **Devoluções Pendentes:** Lista de notas pendentes
  - **Devoluções em Tratativa:** Notas em cancelamento
  - **Devoluções Validadas:** Notas validadas
  - **Lista Completa com Produtos:** Tabela detalhada incluindo itens
- Formatação profissional
- Limitação: Máximo de 50 linhas na seção de produtos

**4. Filtros Avançados**
- Todos os filtros do `FilterBar` disponíveis
- Aplicação em tempo real
- Persistência durante a sessão

---

### 📥 Sincronização

**Rota:** `/sync`

**Descrição:** Tela para importação de dados de devoluções via planilhas Excel/CSV.

**Objetivo:** Permitir importação em massa de dados de devoluções de forma automatizada e validada.

#### Funcionalidades

**1. Upload de Arquivo**
- Suporte para arquivos `.xlsx` e `.csv`
- Validação de formato antes do processamento
- Feedback visual durante upload

**2. Preview de Dados**
- Visualização dos primeiros 10 registros antes da importação
- Validação de estrutura de colunas
- Identificação de problemas potenciais

**3. Mapeamento de Colunas**
- Sistema inteligente de mapeamento automático
- Associação de colunas do Excel com campos do banco
- Colunas visíveis vs. colunas ocultas:
  - **Visíveis:** Nome Filial, Nome Cliente, Cidade Origem, UF Origem, Data Emissão, Número, Valor Total da Nota, Peso líquido, Sincronização ERP, Finalidade NFe, Dados Adicionais, Vendedor, Motivo, Resultado
  - **Ocultas:** CNPJ Destinatário, Destinatário, Cidade Destino, UF Destino, CNPJ Emitente, Nome PJ Emitente, Chave de Acesso, Série, Tipo, Status, Natureza Operação, CFOPs, Etiquetas, etc.

**4. Enriquecimento de Dados**
- **Nome Filial:** Buscado da tabela `emitentes` baseado em CNPJ Destinatário
- **Nome Cliente:** Buscado da tabela `clientes` baseado em CNPJ Emitente
- **Vendedor e Rede:** Preenchidos automaticamente quando cliente é encontrado
- **Município e UF:** Preenchidos quando cliente é encontrado

**5. Validações**
- Verificação de chaves de acesso duplicadas
- Filtro por status de sincronização ERP
- Normalização de CNPJs
- Validação de tipos de dados

**6. Processamento**
- Processamento em lote
- Tratamento de erros individual por registro
- Relatório de sucesso/falha
- Registro de usuário que fez a sincronização

**7. Itens da Nota**
- Processamento de múltiplos itens por nota
- Campos: Descrição, Unidade, Quantidade, Valor Unitário, Valor Total Bruto
- Associação automática com a nota fiscal

---

### ⚙️ Configurações

**Rota:** `/settings`

**Descrição:** Tela de configurações e gestão de dados mestres.

**Objetivo:** Permitir administração completa do sistema, incluindo cadastros e gestão de usuários.

**Acesso:** Apenas usuários com perfil ADMIN

#### Gestão de Setores

**Funcionalidades:**
- **Listar Setores:** Visualização de todos os setores cadastrados
- **Adicionar Setor:** Cadastro de novos setores
- **Editar Setor:** Alteração de nome do setor
- **Excluir Setor:** Remoção de setor (com validação de dependências)

**Campos:**
- Nome do Setor

#### Gestão de Motivos de Devolução

**Funcionalidades:**
- **Listar Motivos:** Visualização de todos os motivos com seus setores
- **Adicionar Motivo:** Cadastro de novos motivos
- **Editar Motivo:** Alteração de nome e setor associado
- **Excluir Motivo:** Remoção de motivo (com validação)

**Campos:**
- Nome do Motivo
- Setor (associação obrigatória)

**Validação:**
- Motivo deve estar associado a um setor
- Não permite exclusão se houver devoluções usando o motivo

#### Gestão de Vendedores

**Funcionalidades:**
- **Listar Vendedores:** Visualização de todos os vendedores cadastrados
- **Adicionar Vendedor:** Cadastro de novos vendedores
- **Remoção Automática:** Vendedores são removidos quando não há mais referências

**Observação:** Vendedores são cadastrados automaticamente quando usados em devoluções ou clientes.

#### Gestão de Clientes

**Funcionalidades:**
- **Listar Clientes:** Visualização completa de todos os clientes
- **Adicionar Cliente:** Cadastro completo de cliente
- **Editar Cliente:** Alteração de qualquer campo
- **Excluir Cliente:** Remoção de cliente

**Campos:**
- Nome
- Razão Social
- CNPJ/CPF
- Município
- UF
- Rede
- Endereço completo
- Bairro, Complemento, CEP
- Vendedor
- Loja
- Região
- Código
- Inscrição Estadual
- Código Município
- País
- Coordenadas (Latitude/Longitude)
- Email
- Telefone
- Observações

**Validação:**
- CNPJ/CPF único
- Campos obrigatórios validados

#### Gestão de Usuários

**Funcionalidades:**
- **Listar Usuários:** Visualização de todos os usuários do sistema
- **Criar Usuário:** Criação de novo usuário
  - Email (único)
  - Senha
  - Nome
  - Perfil (ADMIN, GESTOR, COMERCIAL, LOGISTICA, VENDEDOR, NOVO)
  - Vendedor (se perfil for VENDEDOR)
- **Editar Usuário:** Alteração de qualquer campo
  - Nome
  - Perfil
  - Vendedor
  - Senha (opcional)
- **Excluir Usuário:** Remoção de usuário
  - Remove do banco de dados
  - Observação: Registro no Auth pode precisar remoção manual

**Perfis Disponíveis:**
- **ADMIN:** Acesso total ao sistema
- **GESTOR:** Acesso a relatórios e análises
- **COMERCIAL:** Acesso a validação e relatórios
- **LOGISTICA:** Acesso a validação e relatórios
- **VENDEDOR:** Acesso apenas aos próprios registros

---

### 👤 Perfil

**Rota:** `/profile`

**Descrição:** Tela de perfil do usuário com métricas pessoais e histórico.

**Objetivo:** Fornecer ao usuário visão de suas próprias atividades e performance.

#### Métricas Pessoais

**Cards de Estatísticas:**

1. **Minhas Devoluções**
   - Contagem de devoluções do usuário
   - Filtrado por vendedor (se VENDEDOR) ou por nome

2. **Taxa de Aprovação**
   - Percentual de devoluções validadas/lançadas
   - Cálculo: (VALIDADAS + LANÇADAS) / TOTAL PROCESSADAS

3. **Valor Total**
   - Soma de valores das devoluções do usuário
   - Formato: R$ com separadores

4. **Ticket Médio**
   - Valor médio por devolução do usuário
   - Comparação com média da empresa

#### Gráfico de Evolução

- **Tipo:** Gráfico de Linha
- **Dados:** Devoluções do usuário ao longo do tempo
- **Eixo X:** Datas
- **Eixo Y:** Quantidade de devoluções
- **Comparação:** Linha adicional com média da empresa

#### Comparação com Média

- **Ticket Médio:** Comparação entre ticket médio pessoal e da empresa
- **Total de Devoluções:** Comparação de volume
- **Visualização:** Cards lado a lado

#### Resumo Automático

- Análise textual das métricas pessoais
- Insights sobre performance
- Sugestões de melhoria

#### Histórico de Validações (Admin)

- **Acesso:** Apenas para usuários ADMIN
- **Dados:** Log completo de todas as ações de validação
- **Filtros:** Por período, usuário, ação
- **Informações:** Usuário, ação, devolução, status anterior, status novo, timestamp

---

## 🔐 Sistema de Autenticação e Permissões

### Autenticação

- **Método:** Supabase Auth (JWT)
- **Login:** Email e senha
- **Sessão:** Mantida durante navegação
- **Logout:** Limpa sessão e redireciona para login

### Perfis e Permissões

#### ADMIN
- ✅ Acesso total ao sistema
- ✅ Gestão completa de usuários
- ✅ Acesso a todas as funcionalidades
- ✅ Visualização de logs de validação

#### GESTOR
- ✅ Dashboard completo
- ✅ Relatórios e exportações
- ✅ Visualização de todas as devoluções
- ❌ Validação de devoluções
- ❌ Configurações

#### COMERCIAL
- ✅ Dashboard
- ✅ Validação de devoluções
- ✅ Relatórios
- ✅ Sincronização
- ❌ Configurações
- ❌ Gestão de usuários

#### LOGISTICA
- ✅ Dashboard
- ✅ Validação de devoluções
- ✅ Relatórios
- ✅ Sincronização
- ❌ Configurações
- ❌ Gestão de usuários

#### VENDEDOR
- ✅ Dashboard (apenas próprios dados)
- ✅ Validação (apenas próprias devoluções)
- ✅ Relatórios (apenas próprios dados)
- ✅ Perfil pessoal
- ❌ Sincronização
- ❌ Configurações
- ❌ Gestão de usuários

### Filtro Automático por Vendedor

Usuários com perfil VENDEDOR têm acesso automaticamente restrito:

- **Dashboard:** Apenas devoluções do próprio vendedor
- **Validação:** Apenas devoluções do próprio vendedor
- **Relatórios:** Apenas devoluções do próprio vendedor
- **Perfil:** Métricas baseadas apenas nos próprios dados

O filtro é aplicado automaticamente em todas as queries, garantindo isolamento de dados.

---

## 🚀 Configuração e Instalação

### Pré-requisitos

- **Node.js:** Versão 18 ou superior
- **npm:** Versão 9 ou superior
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
   ```

#### 3. Configure as Variáveis de Ambiente
   
   Crie um arquivo `.env` na raiz do projeto:

   ```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**Onde encontrar:**
- Acesse o dashboard do Supabase
- Vá em Settings > API
- Copie a URL do projeto e a chave `anon` public

#### 4. Configure o Banco de Dados

Execute as migrações do Supabase na ordem:

1. Estrutura base (tabelas principais)
2. Tabelas de relacionamento
3. Políticas RLS
4. Triggers e funções

**Arquivos de migração:** `supabase/migrations/`

#### 5. Execute o Projeto em Desenvolvimento

   ```bash
   npm run dev
   ```

#### 6. Acesse a Aplicação

   ```
   http://localhost:5173
   ```

#### 7. Crie o Primeiro Usuário Admin

1. Acesse o Supabase Dashboard
2. Vá em Authentication > Users
3. Crie um novo usuário manualmente
4. No banco de dados, atualize o perfil para `role = 'ADMIN'`:

```sql
UPDATE profiles 
SET role = 'ADMIN' 
WHERE id = '<id-do-usuario>';
```

---

## 🌐 Deploy

### Vercel (Recomendado)

O projeto está configurado para deploy automático na Vercel.

#### Configuração

1. **Conecte o Repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte seu repositório GitHub/GitLab

2. **Configure Variáveis de Ambiente**
   - No painel da Vercel, vá em Settings > Environment Variables
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

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

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte aplicações React:

- **Netlify:** Similar à Vercel
- **AWS Amplify:** Suporte completo
- **Azure Static Web Apps:** Configuração similar
- **GitHub Pages:** Requer configuração adicional

---

## 📱 PWA (Progressive Web App)

O aplicativo está configurado como PWA, permitindo instalação como aplicativo nativo.

### Funcionalidades PWA

- **Instalação:** Pode ser instalado em dispositivos móveis e desktop
- **Offline:** Cache de recursos estáticos para funcionamento offline básico
- **Ícone:** Ícone personalizado na tela inicial
- **Splash Screen:** Tela de carregamento personalizada
- **Manifest:** Configuração completa de manifest

### Como Instalar

#### Desktop (Chrome/Edge)

1. Acesse o aplicativo no navegador
2. Clique no ícone de instalação na barra de endereços
3. Confirme a instalação
4. O aplicativo será adicionado ao menu Iniciar/Applications

#### Mobile (Android)

1. Acesse o aplicativo no Chrome
2. Menu > "Adicionar à tela inicial"
3. Confirme
4. Ícone será criado na tela inicial

#### Mobile (iOS)

1. Acesse o aplicativo no Safari
2. Compartilhar > "Adicionar à Tela de Início"
3. Confirme
4. Ícone será criado na tela inicial

### Configuração

**Arquivo `public/manifest.json`:**
- Nome do aplicativo
- Ícones em diferentes tamanhos
- Cores do tema
- Modo de exibição

**Service Worker (`public/sw.js`):**
- Cache de recursos estáticos
- Estratégia de cache
- Atualização automática

---

## 🔒 Segurança

### Row Level Security (RLS)

Todas as tabelas do Supabase utilizam RLS para garantir segurança:

- **Políticas de Leitura:** Usuários veem apenas dados permitidos
- **Políticas de Escrita:** Usuários podem modificar apenas dados permitidos
- **Filtro Automático:** Vendedores veem apenas próprios dados

### Autenticação JWT

- Tokens seguros gerados pelo Supabase
- Expiração automática
- Renovação transparente

### Validação de Dados

- Validação no cliente (TypeScript + React)
- Validação no servidor (PostgreSQL constraints)
- Sanitização de inputs

### HTTPS

- Comunicação criptografada em produção
- Certificados SSL automáticos (Vercel)

---

## 📊 Banco de Dados

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
- `justificativa` (Text) - Comentários
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `itens_devolucao`
Armazena os produtos/itens de cada devolução.

**Campos Principais:**
- `id` (UUID, PK)
- `devolucao_id` (UUID, FK -> devolucoes)
- `descricao` (String)
- `unidade` (String)
- `quantidade` (Numeric)
- `valor_unitario` (Numeric)
- `valor_total_bruto` (Numeric)
- `motivo_id` (UUID, FK -> motivos_devolucao)
- `numero_item` (String)

#### `motivos_devolucao`
Catálogo de motivos de devolução.

**Campos:**
- `id` (UUID, PK)
- `nome` (String)
- `setor_id` (UUID, FK -> setores)
- `created_at` (Timestamp)

#### `setores`
Catálogo de setores da empresa.

**Campos:**
- `id` (UUID, PK)
- `nome` (String)
- `created_at` (Timestamp)

#### `clientes`
Cadastro de clientes.

**Campos Principais:**
- `id` (UUID, PK)
- `nome` (String)
- `cnpj_cpf` (String, Unique)
- `municipio` (String)
- `uf` (String)
- `rede` (String)
- `vendedor` (String)
- `ativo` (Boolean)
- E outros campos de endereço e contato

#### `profiles`
Perfis de usuários do sistema.

**Campos:**
- `id` (UUID, PK, FK -> auth.users)
- `name` (String)
- `email` (String)
- `role` (String) - ADMIN, GESTOR, COMERCIAL, LOGISTICA, VENDEDOR
- `vendedor` (String) - Se role for VENDEDOR
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `logs_validacao`
Log de todas as ações de validação.

**Campos:**
- `id` (UUID, PK)
- `devolucao_id` (UUID, FK -> devolucoes)
- `usuario_id` (UUID, FK -> profiles)
- `acao` (String) - Tipo de ação
- `status_anterior` (String)
- `status_novo` (String)
- `created_at` (Timestamp)

### Relacionamentos

- `devolucoes` → `motivos_devolucao` (motivo_id)
- `devolucoes` → `setores` (setor_id)
- `itens_devolucao` → `devolucoes` (devolucao_id)
- `itens_devolucao` → `motivos_devolucao` (motivo_id)
- `motivos_devolucao` → `setores` (setor_id)
- `logs_validacao` → `devolucoes` (devolucao_id)
- `logs_validacao` → `profiles` (usuario_id)

---

## 🎨 Design System

### Cores

**Tema Claro:**
- **Primária:** Verde (#18442b, #2e6b4d, #4a9170)
- **Secundária:** Tons de verde mais claros
- **Background:** Branco/Cinza claro
- **Texto:** Preto/Cinza escuro

**Tema Escuro:**
- **Primária:** Ciano (#3fedef, #2cb5b8)
- **Secundária:** Tons de azul/ciano
- **Background:** Preto/Cinza escuro
- **Texto:** Branco/Cinza claro

### Componentes UI

Baseados em **Shadcn UI** e **Radix UI**:

- **Button:** Botões com variantes (default, outline, destructive)
- **Card:** Containers para conteúdo agrupado
- **Table:** Tabelas responsivas e acessíveis
- **Select:** Dropdowns acessíveis
- **Input/Textarea:** Campos de entrada
- **Badge:** Etiquetas de status
- **Accordion:** Seções expansíveis
- **Dialog:** Modais
- **Toast:** Notificações

### Tipografia

- **Fonte:** Sistema (San Francisco, Segoe UI, etc.)
- **Tamanhos:** Escala responsiva
- **Pesos:** Regular (400), Medium (500), Semibold (600), Bold (700)

---

## 📝 Convenções de Código

### TypeScript

- Tipagem estrita habilitada
- Interfaces para estruturas de dados
- Tipos para enums e constantes

### React

- Componentes funcionais com hooks
- Custom hooks para lógica reutilizável
- Props tipadas com TypeScript

### Nomenclatura

- **Componentes:** PascalCase (`DashboardPage.tsx`)
- **Funções:** camelCase (`fetchReturns`)
- **Constantes:** UPPER_SNAKE_CASE (`RESULTADO_CORES`)
- **Arquivos:** kebab-case ou PascalCase

### Estrutura de Arquivos

- Um componente por arquivo
- Hooks customizados em arquivos separados quando reutilizáveis
- Utilitários em `lib/`
- Tipos compartilhados em `types/`

---

## 🧪 Testes

### Estrutura de Testes (Futuro)

- **Unitários:** Jest + React Testing Library
- **Integração:** Testes de fluxos completos
- **E2E:** Cypress ou Playwright

---

## 📚 Recursos Adicionais

### Documentação de APIs

- **Supabase:** [docs.supabase.com](https://docs.supabase.com)
- **Recharts:** [recharts.org](https://recharts.org)
- **Shadcn UI:** [ui.shadcn.com](https://ui.shadcn.com)

### Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.

---

## 📄 Licença

Este projeto é propriedade do Grupo Doce Mel. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para o Grupo Doce Mel**

*Última atualização: 2025*
