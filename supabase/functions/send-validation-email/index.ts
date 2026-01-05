import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts"
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

    // Criar cliente Supabase Admin para verificação de autenticação
    // Quando verify_jwt=true, o Supabase já valida o token, então precisamos
    // usar o Service Role Key para fazer queries no banco
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Obter token do header para obter o usuário autenticado
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autenticação não fornecido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Obter dados do corpo da requisição
    const { userId, email, data } = await req.json()

    // Verificar se usuário é VENDEDOR e buscar nome do vendedor
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, vendedor, name')
      .eq('id', userId)
      .single()

    if (profileError || !profile || profile.role !== 'VENDEDOR') {
      throw new Error('Apenas vendedores podem enviar validação por email')
    }

    // Buscar nome do vendedor - usar o nome do perfil
    const vendedorNome = profile.name || profile.vendedor || 'Vendedor'

    // Buscar dados de validação do dia
    const dataValidação = new Date(data)
    dataValidação.setHours(0, 0, 0, 0)

    // Buscar TODAS as notas do vendedor (sem filtro de data)
    const { data: todasNotas, error: notasError } = await supabaseAdmin
      .from('devolucoes')
      .select(`
        *,
        motivos_devolucao(nome),
        setores(nome)
      `)
      .eq('vendedor', profile.vendedor)

    if (notasError) {
      throw new Error('Erro ao buscar notas: ' + notasError.message)
    }

    const notas = todasNotas || []

    console.log(`Total de notas encontradas para vendedor ${profile.vendedor}:`, notas.length)

    // Filtrar notas por resultado (sem filtro de data) - para o vendedor que enviou o email
    const notasValidadas = notas.filter(n => n.resultado === 'VALIDADA')
    const notasPendentes = notas.filter(n => n.resultado === 'PENDENTE VALIDAÇÃO')
    const notasTratativa = notas.filter(n => n.resultado === 'TRATATIVA DE ANULAÇÃO')

    console.log('Notas Validadas:', notasValidadas.length)
    console.log('Notas Pendentes:', notasPendentes.length)
    console.log('Notas em Tratativa:', notasTratativa.length)

    // Calcular totais
    const valorTotalValidado = notasValidadas.reduce((sum, n) => sum + (Number(n.valor_total_nota) || 0), 0)
    const valorTotalPendente = notasPendentes.reduce((sum, n) => sum + (Number(n.valor_total_nota) || 0), 0)
    const valorTotalTratativa = notasTratativa.reduce((sum, n) => sum + (Number(n.valor_total_nota) || 0), 0)

    console.log('Valor Total Validado:', valorTotalValidado)
    console.log('Valor Total Pendente:', valorTotalPendente)
    console.log('Valor Total Tratativa:', valorTotalTratativa)

    // Para o relatório HTML, usar todas as notas do vendedor
    const notasDoDia = notas

    // Buscar última validação anterior (última nota validada antes de hoje)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    
    const { data: ultimaValidacao } = await supabaseAdmin
      .from('devolucoes')
      .select('data_validacao')
      .eq('vendedor', profile.vendedor)
      .eq('resultado', 'VALIDADA')
      .not('data_validacao', 'is', null)
      .lt('data_validacao', hoje.toISOString())
      .order('data_validacao', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Formatar data
    const formatarData = (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date
      return d.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })
    }

    // Logo - usando URL direta da logo do Grupo Doce Mel
    // URL: https://i.ibb.co/b095hpJ/Chat-GPT-Image-25-de-dez-de-2025-15-24-45.png
    const logoUrl = 'https://i.ibb.co/b095hpJ/Chat-GPT-Image-25-de-dez-de-2025-15-24-45.png'

    // Função para gerar HTML do relatório completo
    const gerarHTMLRelatorio = () => {
      const htmlRelatorio = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Relatório de Devoluções - ${vendedorNome} - ${formatarData(dataValidação)}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: white;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .report-header {
      background: linear-gradient(135deg, #073e29 0%, #0a4d33 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .report-title {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }
    .report-subtitle {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
    }
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      border: 2px solid #073e29;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
    }
    .stat-card-title {
      font-size: 12px;
      color: #073e29;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .stat-card-value {
      font-size: 32px;
      font-weight: bold;
      color: #073e29;
      margin-bottom: 5px;
    }
    .stat-card-subvalue {
      font-size: 14px;
      color: #666;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #073e29;
      margin: 30px 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 3px solid #073e29;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .data-table th {
      background: #073e29;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: bold;
      font-size: 12px;
    }
    .data-table td {
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 11px;
    }
    .data-table tr:hover {
      background: #f9fafb;
    }
  </style>
</head>
<body>
  <div class="report-header">
    <h1 class="report-title">Relatório de Devoluções</h1>
    <p class="report-subtitle">GRUPO DOCE MEL</p>
    <p class="report-subtitle">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
    <p class="report-subtitle">Período: ${formatarData(dataValidação)}</p>
  </div>

  <div class="stats-cards">
    <div class="stat-card">
      <div class="stat-card-title">NF Validadas</div>
      <div class="stat-card-value">${notasValidadas.length}</div>
      <div class="stat-card-subvalue">R$ ${valorTotalValidado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-title">NF Pendentes</div>
      <div class="stat-card-value">${notasPendentes.length}</div>
      <div class="stat-card-subvalue">R$ ${valorTotalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-title">NF Tratativa</div>
      <div class="stat-card-value">${notasTratativa.length}</div>
      <div class="stat-card-subvalue">R$ ${valorTotalTratativa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-title">Total Geral</div>
      <div class="stat-card-value">${notasDoDia.length}</div>
      <div class="stat-card-subvalue">R$ ${(valorTotalValidado + valorTotalPendente + valorTotalTratativa).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
    </div>
  </div>

  <h2 class="section-title">📋 Dados Detalhados</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th>Data Emissão</th>
        <th>Nota Fiscal</th>
        <th>Cliente</th>
        <th>Vendedor</th>
        <th>Valor</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${notasDoDia.map((item: any) => `
        <tr>
          <td>${item.data_emissao ? formatarData(item.data_emissao) : '-'}</td>
          <td>${item.numero || '-'}</td>
          <td>${(item.nome_cliente || '-').substring(0, 30)}</td>
          <td>${item.vendedor || '-'}</td>
          <td>R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td>${item.resultado || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`
      return htmlRelatorio
    }

    // Gerar HTML do email
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: white;
    }
    .header { 
      background-color: #073e29; 
      color: white; 
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content { 
      padding: 30px 20px; 
    }
    .content h2 {
      color: #073e29;
      font-size: 20px;
      margin-bottom: 20px;
      border-bottom: 2px solid #073e29;
      padding-bottom: 10px;
    }
    .stats { 
      background-color: #f9fafb; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 20px 0; 
      border: 1px solid #e5e7eb;
    }
    .stat-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 12px 0; 
      border-bottom: 1px solid #e5e7eb; 
    }
    .stat-row:last-child { 
      border-bottom: none; 
    }
    .stat-label { 
      font-weight: bold; 
      color: #374151;
    }
    .stat-value {
      color: #073e29;
      font-weight: 600;
    }
    .footer { 
      text-align: center; 
      padding: 20px; 
      color: #6b7280; 
      font-size: 12px; 
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .logo-img {
      max-width: 150px;
      max-height: 80px;
      margin-bottom: 15px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="Logo Doce Mel" class="logo-img" />
      <h1>Validação das Devoluções</h1>
      <p>${vendedorNome} - ${formatarData(dataValidação)} - Trielo CD BA</p>
    </div>
    <div class="content">
      <h2>Resumo do Dia</h2>
      
      <div class="stats">
        <div class="stat-row">
          <span class="stat-label">Filial:</span>
          <span class="stat-value">Trielo CD BA</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Usuário:</span>
          <span class="stat-value">${vendedorNome}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Data de Validação:</span>
          <span class="stat-value">${formatarData(dataValidação)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Quantidade de Notas Validadas:</span>
          <span class="stat-value">${notasValidadas.length}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Valor Total Validado:</span>
          <span class="stat-value">R$ ${valorTotalValidado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Quantidade de Notas Pendentes:</span>
          <span class="stat-value">${notasPendentes.length}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Valor Total Pendente:</span>
          <span class="stat-value">R$ ${valorTotalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Quantidade de Notas em Tratativa:</span>
          <span class="stat-value">${notasTratativa.length}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Valor Total em Tratativa:</span>
          <span class="stat-value">R$ ${valorTotalTratativa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        ${ultimaValidacao?.data_validacao ? `
        <div class="stat-row">
          <span class="stat-label">Data da Última Validação:</span>
          <span class="stat-value">${formatarData(ultimaValidacao.data_validacao)}</span>
        </div>
        ` : ''}
      </div>
    </div>
    <div class="footer">
      <p>Relatório gerado automaticamente pelo Sistema de Devoluções - Grupo Doce Mel</p>
      <p>Este email foi enviado automaticamente. Por favor, não responda.</p>
    </div>
  </div>
</body>
</html>
    `

    // Enviar email via Resend
    // IMPORTANTE: Para domínio de teste do Resend, só pode enviar para o email cadastrado (obedysweb@gmail.com)
    // Se quiser enviar para outros emails, verifique um domínio no Resend e altere o "from"
    const emailDestino = 'obedysweb@gmail.com' // Usar sempre o email cadastrado no Resend enquanto usar domínio de teste
    
    // Gerar HTML do relatório
    const htmlRelatorio = gerarHTMLRelatorio()
    
    // Converter HTML para base64 para anexo
    const encoder = new TextEncoder()
    const htmlBytes = encoder.encode(htmlRelatorio)
    const htmlRelatorioBase64 = encode(htmlBytes)

    // Limpar nome do arquivo (remover caracteres especiais)
    const nomeArquivoSeguro = vendedorNome.replace(/[^a-zA-Z0-9]/g, '_')
    const dataArquivoSegura = formatarData(dataValidação).replace(/\//g, '-')
    const nomeArquivo = `Relatorio_Devolucoes_${nomeArquivoSeguro}_${dataArquivoSegura}.html`

    console.log('Gerando email com anexo:', nomeArquivo)
    console.log('Tamanho do HTML do relatório:', htmlRelatorio.length, 'caracteres')
    console.log('Tamanho do base64:', htmlRelatorioBase64.length, 'caracteres')

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Sistema de Devoluções <onboarding@resend.dev>', // Usando domínio de teste do Resend
        // Para domínio de teste, só pode enviar para o email cadastrado no Resend (obedysweb@gmail.com)
        // Se quiser enviar para outros emails, verifique um domínio no Resend e altere o "from" acima
        to: [emailDestino],
        subject: `Validação das Devoluções - ${vendedorNome} - ${formatarData(dataValidação)} - Trielo CD BA`,
        html: emailHTML,
        attachments: [
          {
            filename: nomeArquivo,
            content: htmlRelatorioBase64,
          }
        ],
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
    console.error('Erro na Edge Function:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
