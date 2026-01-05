# Configuração: Envio de Email de Validação do Dia

Este documento contém as instruções passo a passo para configurar o envio de email de validação do dia para vendedores.

## 📋 Pré-requisitos

1. Conta no Resend (https://resend.com)
2. Acesso ao projeto Supabase via Dashboard
3. Chave de API do Resend

## 🔧 Passo 1: Configurar Resend

### 1.1 Criar conta no Resend
1. Acesse https://resend.com
2. Crie uma conta (se ainda não tiver)
3. Verifique seu domínio ou use o domínio de teste do Resend

### 1.2 Obter API Key
1. No painel do Resend, vá em "API Keys"
2. Clique em "Create API Key"
3. Dê um nome (ex: "Supabase Email Validation")
4. Copie a chave gerada (ela começa com `re_...`)
5. **IMPORTANTE:** Guarde esta chave, você precisará dela no próximo passo

## 🔧 Passo 2: Configurar Variável de Ambiente no Supabase

### 2.1 Acessar Configurações do Projeto
1. Acesse o Dashboard do Supabase (https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** (Configurações)
4. No menu lateral, clique em **Edge Functions**

### 2.2 Adicionar Secret
1. Na seção "Edge Functions", procure por **Secrets** ou **Environment Variables**
2. Clique em **Add Secret** ou **Add Environment Variable**
3. Configure:
   - **Key:** `RESEND_API_KEY`
   - **Value:** Cole a API Key do Resend que você copiou (começa com `re_...`)
4. Clique em **Save**

## 🔧 Passo 3: Criar Edge Function no Supabase

### 3.1 Usar Supabase CLI (Recomendado)

Se você tem o Supabase CLI instalado:

```bash
# 1. Faça login no Supabase CLI
supabase login

# 2. Link seu projeto (se ainda não fez)
supabase link --project-ref seu-project-ref

# 3. Crie a Edge Function
supabase functions new send-validation-email

# 4. O arquivo será criado em: supabase/functions/send-validation-email/index.ts
```

### 3.2 Usar Dashboard (Alternativa)

Se não tem o CLI, você pode criar manualmente:

1. Acesse o Dashboard do Supabase
2. Vá em **Edge Functions**
3. Clique em **Create a new function**
4. Nome: `send-validation-email`
5. Copie o código da função (veja seção abaixo)

## 📝 Passo 4: Código da Edge Function

Crie o arquivo `supabase/functions/send-validation-email/index.ts` com o seguinte conteúdo:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar API Key
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurada')
    }

    // Obter token de autenticação do header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Token de autenticação não fornecido')
    }

    // Criar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Obter dados do corpo da requisição
    const { userId, email, vendedorNome, data } = await req.json()

    // Verificar se usuário é VENDEDOR
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, vendedor')
      .eq('id', userId)
      .single()

    if (profileError || !profile || profile.role !== 'VENDEDOR') {
      throw new Error('Apenas vendedores podem enviar validação por email')
    }

    // Buscar dados de validação do dia
    const hoje = new Date(data)
    hoje.setHours(0, 0, 0, 0)
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)

    // Buscar notas do dia
    const { data: notas, error: notasError } = await supabaseClient
      .from('devolucoes')
      .select('*, motivos_devolucao(nome), setores(nome)')
      .eq('vendedor', profile.vendedor)
      .gte('data_emissao', hoje.toISOString().split('T')[0])
      .lt('data_emissao', amanha.toISOString().split('T')[0])

    if (notasError) {
      throw new Error('Erro ao buscar notas: ' + notasError.message)
    }

    // Calcular estatísticas
    const notasValidadas = notas?.filter(n => n.resultado === 'VALIDADA') || []
    const notasPendentes = notas?.filter(n => n.resultado === 'PENDENTE VALIDAÇÃO') || []
    const notasTratativa = notas?.filter(n => n.resultado === 'TRATATIVA DE ANULAÇÃO') || []

    const valorTotalValidado = notasValidadas.reduce((sum, n) => sum + (Number(n.valor_total_nota) || 0), 0)
    const valorTotalPendente = notasPendentes.reduce((sum, n) => sum + (Number(n.valor_total_nota) || 0), 0)
    const valorTotalTratativa = notasTratativa.reduce((sum, n) => sum + (Number(n.valor_total_nota) || 0), 0)

    // Buscar última validação anterior (última nota validada antes de hoje)
    const { data: ultimaValidacao } = await supabaseClient
      .from('devolucoes')
      .select('data_validacao')
      .eq('vendedor', profile.vendedor)
      .eq('resultado', 'VALIDADA')
      .lt('data_validacao', hoje.toISOString())
      .order('data_validacao', { ascending: false })
      .limit(1)
      .single()

    // Gerar HTML do email
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #073e29; color: white; padding: 20px; text-align: center; }
    .header img { max-width: 150px; margin-bottom: 10px; }
    .content { background-color: #f9fafb; padding: 20px; }
    .stats { background-color: white; border-radius: 8px; padding: 15px; margin: 15px 0; }
    .stat-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .stat-row:last-child { border-bottom: none; }
    .stat-label { font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Validação das Devoluções</h1>
      <p>${vendedorNome} - ${new Date(data).toLocaleDateString('pt-BR')} - Trielo CD BA</p>
    </div>
    <div class="content">
      <h2>Resumo do Dia</h2>
      
      <div class="stats">
        <div class="stat-row">
          <span class="stat-label">Filial:</span>
          <span>Trielo CD BA</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Usuário:</span>
          <span>${vendedorNome}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Data de Validação:</span>
          <span>${new Date(data).toLocaleDateString('pt-BR')}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Quantidade de Notas Validadas:</span>
          <span>${notasValidadas.length}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Valor Total Validado:</span>
          <span>R$ ${valorTotalValidado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Quantidade de Notas Pendentes:</span>
          <span>${notasPendentes.length}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Valor Total Pendente:</span>
          <span>R$ ${valorTotalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Quantidade de Notas em Tratativa:</span>
          <span>${notasTratativa.length}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Valor Total em Tratativa:</span>
          <span>R$ ${valorTotalTratativa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        ${ultimaValidacao?.data_validacao ? `
        <div class="stat-row">
          <span class="stat-label">Data da Última Validação:</span>
          <span>${new Date(ultimaValidacao.data_validacao).toLocaleDateString('pt-BR')}</span>
        </div>
        ` : ''}
      </div>
    </div>
    <div class="footer">
      <p>Relatório gerado automaticamente pelo Sistema de Devoluções - Grupo Doce Mel</p>
    </div>
  </div>
</body>
</html>
    `

    // Gerar relatório HTML (você precisará adaptar isso para gerar o relatório completo)
    // Por enquanto, vamos enviar o HTML básico acima

    // Enviar email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Sistema de Devoluções <noreply@seudominio.com>', // ALTERE PARA SEU DOMÍNIO
        to: [email],
        subject: `Validação das Devoluções - ${vendedorNome} - ${new Date(data).toLocaleDateString('pt-BR')} - Trielo CD BA`,
        html: emailHTML,
        // attachments: [ // Você pode adicionar o relatório HTML como anexo aqui
        //   {
        //     filename: 'relatorio.html',
        //     content: relatorioHTML,
        //   },
        // ],
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json()
      throw new Error('Erro ao enviar email: ' + JSON.stringify(errorData))
    }

    const resendData = await resendResponse.json()

    return new Response(
      JSON.stringify({ success: true, messageId: resendData.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
```

### 4.1 Alterações Necessárias

No código acima, você precisa alterar:

1. **Linha do `from` no email:** Substitua `noreply@seudominio.com` pelo seu domínio verificado no Resend
2. Se quiser adicionar o relatório HTML como anexo, descomente a seção de attachments e adapte o código

## 🚀 Passo 5: Deploy da Edge Function

### 5.1 Usando Supabase CLI

```bash
# Fazer deploy da função
supabase functions deploy send-validation-email
```

### 5.2 Verificar no Dashboard

1. Acesse o Dashboard do Supabase
2. Vá em **Edge Functions**
3. Verifique se a função `send-validation-email` aparece na lista
4. Clique para ver detalhes e testar

## 🔧 Passo 6: Configurar Email no Frontend

O botão já está implementado na tela de perfil. Ele chama a Edge Function quando clicado.

**IMPORTANTE:** Certifique-se de que:
1. A variável de ambiente `RESEND_API_KEY` está configurada no Supabase
2. A Edge Function `send-validation-email` foi criada e fez deploy
3. O domínio de email está verificado no Resend

## ✅ Verificação Final

1. Faça login como um usuário tipo VENDEDOR
2. Vá na tela de Perfil
3. Clique no botão "Enviar validação do dia por e-mail"
4. Verifique se o email foi recebido

## 🐛 Troubleshooting

### Erro: "RESEND_API_KEY não configurada"
- Verifique se adicionou a variável de ambiente no Supabase (Passo 2)

### Erro: "Erro ao enviar email"
- Verifique se o domínio está verificado no Resend
- Verifique se a API Key está correta
- Verifique os logs da Edge Function no Dashboard do Supabase

### Email não chega
- Verifique a pasta de spam
- Verifique se o endereço de email está correto
- Verifique os logs no Resend Dashboard

## 📚 Recursos Úteis

- Documentação Resend: https://resend.com/docs
- Documentação Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Supabase CLI: https://supabase.com/docs/guides/cli
