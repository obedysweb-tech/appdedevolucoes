# Gestão de Devoluções - Grupo Doce Mel

Sistema completo de gestão de devoluções desenvolvido para o Grupo Doce Mel, permitindo controle total sobre o processo de devolução de produtos, desde a importação de dados até a validação e geração de relatórios.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração e Instalação](#configuração-e-instalação)
- [Uso](#uso)
- [Deploy](#deploy)
- [PWA](#pwa)

## 🎯 Sobre o Projeto

O sistema de Gestão de Devoluções foi desenvolvido para automatizar e otimizar o processo de gestão de devoluções do Grupo Doce Mel. O aplicativo permite:

- Importação automática de dados de devoluções via planilhas Excel
- Validação e classificação de devoluções por motivo e setor
- Geração de relatórios detalhados em PDF e Excel
- Dashboard com análises e insights automáticos
- Controle de acesso baseado em perfis de usuário
- Compartilhamento de informações via WhatsApp

## ✨ Funcionalidades

### 🔐 Autenticação e Controle de Acesso

- **Sistema de Login Seguro**: Autenticação via Supabase Auth
- **Perfis de Usuário**: ADMIN, GESTOR, COMERCIAL, LOGISTICA, VENDEDOR
- **Controle de Acesso**: Cada perfil tem acesso apenas às funcionalidades permitidas
- **Filtro por Vendedor**: Usuários VENDEDOR veem apenas seus próprios registros

### 📊 Dashboard

- **KPIs Principais**:
  - Valor Total Devolvido
  - Total de Devoluções
  - Quantidade de Produtos Devolvidos
  - Ticket Médio
  - Devoluções Fora do SLA

- **Gráficos e Visualizações**:
  - Evolução no Tempo (por dia)
  - Top 5 Clientes por Valor (Gráfico de Colunas)
  - Top 5 Vendedores por Valor (Gráfico de Colunas)
  - Top 5 Redes por Valor (Gráfico de Colunas)
  - Análise de Pareto (80/20)
  - Heatmap: Produto × Motivo (valores em R$)
  - Gráfico de Motivos (Pizza)
  - Distribuição Geográfica por Estado

- **Insights Automáticos**: Análises inteligentes baseadas nos dados
- **Alertas Automáticos**: Notificações de produtos acima da média

### 📥 Sincronização de Dados

- **Importação de Planilhas Excel**: Processamento automático de arquivos
- **Validação de Dados**: 
  - Verificação de chaves de acesso duplicadas
  - Filtro por status de sincronização ERP
  - Normalização de CNPJs
- **Mapeamento Automático**: Associação automática de clientes e emitentes
- **Preview de Dados**: Visualização antes da importação final

### ✅ Validação de Devoluções

- **Validação Individual**: Seleção de motivo por produto
- **Validação em Lote**: Aplicação de motivo para todos os produtos de uma nota
- **Validação Automática**: Resultado muda para "VALIDADA" quando todos os produtos têm motivo
- **Cálculo Inteligente**: Motivo principal é o mais repetido entre os produtos
- **Edição Completa**: Edição de todos os campos do registro
- **Exclusão**: Exclusão individual ou em lote
- **Compartilhamento WhatsApp**: Geração de mensagem formatada com resumo completo

### 📈 Relatórios

- **Tabela Completa**: Visualização de todas as devoluções com filtros
- **Exportação Excel**: Exportação completa dos dados
- **Geração PDF**: Relatório completo com:
  - Estatísticas gerais
  - Lista de devoluções pendentes
  - Lista de devoluções em tratativa
  - Lista de devoluções validadas
  - Lista completa com produtos (incluindo unidade)
- **Ordenação**: Ordenação por qualquer coluna (ascendente/descendente)
- **Filtros Avançados**: Filtros por período, cliente, vendedor, motivo, resultado, etc.

### ⚙️ Configurações

- **Master Data**:
  - Cadastro de Setores
  - Cadastro de Motivos de Devolução (associados a setores)
  - Cadastro de Clientes
  - Cadastro de Vendedores

- **Gestão de Usuários** (apenas ADMIN):
  - Criação de usuários
  - Edição de perfil e permissões
  - Exclusão de usuários
  - Alteração de senha

### 👤 Perfil do Usuário

- **Métricas Pessoais**: 
  - Total de devoluções
  - Valor envolvido
  - Taxa de aprovação
- **Gráfico de Evolução**: Minhas devoluções no tempo (linha)
- **Comparação com Média**: Comparação com média da empresa
- **Resumo Automático**: Análise textual automática
- **Histórico de Validações**: Log completo de ações (para Admin)

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 19**: Biblioteca JavaScript para construção de interfaces
- **TypeScript**: Tipagem estática para JavaScript
- **Vite**: Build tool e dev server
- **React Router DOM**: Roteamento de páginas
- **Zustand**: Gerenciamento de estado global
- **Tailwind CSS**: Framework CSS utilitário
- **Shadcn UI**: Componentes UI baseados em Radix UI
- **Recharts**: Biblioteca de gráficos
- **jsPDF + jsPDF-AutoTable**: Geração de PDFs
- **XLSX**: Manipulação de arquivos Excel
- **date-fns**: Manipulação de datas
- **Sonner**: Sistema de notificações toast

### Backend e Banco de Dados

- **Supabase**: Backend as a Service
  - PostgreSQL: Banco de dados relacional
  - Auth: Autenticação de usuários
  - Storage: Armazenamento de arquivos
  - Row Level Security (RLS): Segurança em nível de linha

### PWA

- **Service Worker**: Cache e funcionalidade offline
- **Web App Manifest**: Configuração de PWA

## 📁 Estrutura do Projeto

```
appdedevolucoes/
├── public/
│   ├── logo.png          # Logo da aplicação
│   ├── manifest.json      # Manifesto PWA
│   └── sw.js             # Service Worker
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── dashboard/    # Componentes do dashboard
│   │   ├── filters/      # Componentes de filtro
│   │   └── layout/       # Componentes de layout
│   ├── lib/              # Bibliotecas e utilitários
│   │   ├── supabase.ts   # Cliente Supabase
│   │   └── store.ts      # Store Zustand
│   ├── pages/            # Páginas da aplicação
│   │   ├── DashboardPage.tsx
│   │   ├── ValidationPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SyncPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── LoginPage.tsx
│   ├── types/            # Definições de tipos TypeScript
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Entry point
├── index.html            # HTML principal
├── vite.config.ts        # Configuração do Vite
├── vercel.json           # Configuração do Vercel
├── package.json          # Dependências do projeto
└── README.md             # Este arquivo
```

## 🚀 Configuração e Instalação

### Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase
- Git

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd appdedevolucoes
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

4. **Execute o projeto em desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

## 📖 Uso

### Login

1. Acesse a página de login
2. Informe seu email e senha
3. O sistema carregará seu perfil automaticamente

### Importação de Dados

1. Acesse a página "Sincronização"
2. Selecione o arquivo Excel com os dados
3. Revise o preview dos dados
4. Clique em "Processar e Enviar"
5. Aguarde a confirmação de importação

### Validação de Devoluções

1. Acesse a página "Validação"
2. Expanda uma devolução para ver os produtos
3. Selecione o motivo para cada produto OU selecione o motivo principal para aplicar a todos
4. O resultado será atualizado automaticamente para "VALIDADA" quando todos os produtos tiverem motivo

### Geração de Relatórios

1. Acesse a página "Relatórios"
2. Aplique os filtros desejados
3. Clique em "Gerar PDF" ou "Exportar Excel"
4. O arquivo será baixado automaticamente

## 🌐 Deploy

O projeto está configurado para deploy na Vercel. Consulte o arquivo `DEPLOY.md` para instruções detalhadas.

## 📱 PWA (Progressive Web App)

O aplicativo está configurado como PWA, permitindo:

- **Instalação**: Pode ser instalado como aplicativo nativo
- **Funcionamento Offline**: Cache de recursos estáticos
- **Notificações**: Suporte a notificações push (futuro)
- **Acesso Rápido**: Atalhos para funcionalidades principais

### Como Instalar

1. Acesse o aplicativo no navegador
2. No Chrome/Edge: Clique no ícone de instalação na barra de endereços
3. No Safari (iOS): Compartilhar > Adicionar à Tela de Início
4. O aplicativo será instalado e poderá ser aberto como app nativo

## 🔒 Segurança

- **Row Level Security (RLS)**: Políticas de segurança no banco de dados
- **Autenticação JWT**: Tokens seguros para autenticação
- **Validação de Dados**: Validação tanto no cliente quanto no servidor
- **HTTPS**: Comunicação criptografada (em produção)

## 📝 Licença

Este projeto é propriedade do Grupo Doce Mel.

## 👥 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para o Grupo Doce Mel**
