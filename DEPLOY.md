# Guia de Deploy - Gestão de Devoluções

Este guia fornece instruções passo a passo para fazer o deploy do aplicativo na Vercel.

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Node.js 18+ instalado localmente (para testes)

## 🚀 Passo a Passo

### 1. Preparação do Projeto

#### 1.1. Verificar Configurações

Certifique-se de que os seguintes arquivos estão configurados:

- ✅ `vercel.json` - Configuração do Vercel
- ✅ `vite.config.ts` - Configuração do Vite
- ✅ `package.json` - Scripts e dependências
- ✅ `public/manifest.json` - Manifesto PWA
- ✅ `public/sw.js` - Service Worker
- ✅ `.env.example` - Exemplo de variáveis de ambiente (opcional)

#### 1.2. Variáveis de Ambiente

Crie um arquivo `.env.local` para desenvolvimento local:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

**⚠️ IMPORTANTE**: Nunca commite o arquivo `.env` ou `.env.local` no Git!

### 2. Configuração do Supabase

#### 2.1. Verificar Banco de Dados

Certifique-se de que todas as tabelas e políticas RLS estão configuradas:

- `profiles` - Perfis de usuários
- `devolucoes` - Devoluções
- `itens_devolucao` - Itens das devoluções
- `setores` - Setores
- `motivos_devolucao` - Motivos de devolução
- `clientes` - Clientes
- `emitentes` - Emitentes
- `logs_validacao` - Logs de validação

#### 2.2. Verificar Políticas RLS

Acesse o Supabase Dashboard > Authentication > Policies e verifique:

- ✅ Políticas de leitura para cada tabela
- ✅ Políticas de escrita para usuários autenticados
- ✅ Políticas especiais para ADMIN

### 3. Deploy na Vercel

#### 3.1. Criar Conta/Login na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub, GitLab ou Bitbucket
3. Autorize o acesso ao seu repositório

#### 3.2. Importar Projeto

1. No dashboard da Vercel, clique em **"Add New Project"**
2. Selecione o repositório do projeto
3. Clique em **"Import"**

#### 3.3. Configurar Build

A Vercel detectará automaticamente o Vite. Verifique as configurações:

- **Framework Preset**: Vite
- **Root Directory**: `./` (raiz)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 3.4. Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

**Para cada ambiente** (Production, Preview, Development):
- Clique em "Add"
- Digite o nome da variável
- Digite o valor
- Selecione os ambientes onde será usada
- Clique em "Save"

#### 3.5. Deploy

1. Clique em **"Deploy"**
2. Aguarde o processo de build (2-5 minutos)
3. Após o deploy, você receberá uma URL: `https://seu-projeto.vercel.app`

### 4. Pós-Deploy

#### 4.1. Verificar Funcionamento

1. Acesse a URL fornecida pela Vercel
2. Teste o login
3. Verifique se todas as funcionalidades estão funcionando
4. Teste o PWA (instalação no dispositivo móvel)

#### 4.2. Configurar Domínio Personalizado (Opcional)

1. No projeto na Vercel, vá em **Settings > Domains**
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruções
4. Aguarde a propagação DNS (pode levar até 24h)

#### 4.3. Configurar HTTPS

A Vercel fornece HTTPS automaticamente via Let's Encrypt. Não é necessário configuração adicional.

### 5. Atualizações Futuras

#### 5.1. Deploy Automático

A Vercel faz deploy automático quando você faz push para:
- **main/master**: Deploy em produção
- **outras branches**: Deploy de preview

#### 5.2. Deploy Manual

Para fazer deploy manual:

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

### 6. Troubleshooting

#### Problema: Build falha

**Solução**:
- Verifique os logs de build na Vercel
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se não há erros de TypeScript

#### Problema: Variáveis de ambiente não funcionam

**Solução**:
- Certifique-se de que as variáveis começam com `VITE_`
- Verifique se foram adicionadas para o ambiente correto
- Faça um novo deploy após adicionar variáveis

#### Problema: PWA não funciona

**Solução**:
- Verifique se `manifest.json` está em `/public`
- Verifique se `sw.js` está em `/public`
- Verifique os headers no `vercel.json`
- Certifique-se de que está usando HTTPS

#### Problema: Rotas não funcionam

**Solução**:
- Verifique o `vercel.json` - deve ter o rewrite para `index.html`
- Certifique-se de que o React Router está configurado corretamente

### 7. Monitoramento

#### 7.1. Logs

Acesse **Deployments > [deployment] > Functions Logs** para ver logs em tempo real.

#### 7.2. Analytics

A Vercel fornece analytics básicos. Para mais detalhes, considere integrar:
- Google Analytics
- Vercel Analytics (premium)

### 8. Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Build passa sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Login funciona corretamente
- [ ] Todas as páginas carregam
- [ ] PWA instalável
- [ ] Service Worker registrado
- [ ] PDFs geram corretamente
- [ ] Exportação Excel funciona
- [ ] Filtros funcionam
- [ ] Validação de devoluções funciona
- [ ] Dashboard carrega dados
- [ ] Gráficos renderizam corretamente

## 📞 Suporte

Se encontrar problemas durante o deploy:

1. Verifique os logs na Vercel
2. Verifique o console do navegador
3. Verifique as configurações do Supabase
4. Consulte a documentação da Vercel: https://vercel.com/docs

---

**Boa sorte com o deploy! 🚀**

