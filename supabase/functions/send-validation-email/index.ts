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

    // Criar cliente Supabase Admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Obter token do header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autenticação não fornecido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Obter dados do corpo da requisição
    const { userId, email, data } = await req.json()

    // Verificar se usuário é VENDEDOR
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, vendedor, name')
      .eq('id', userId)
      .single()

    if (profileError || !profile || profile.role !== 'VENDEDOR') {
      throw new Error('Apenas vendedores podem enviar validação por email')
    }

    const vendedorNome = profile.name || profile.vendedor || 'Vendedor'
    const dataValidação = new Date(data)
    dataValidação.setHours(0, 0, 0, 0)

    // Buscar TODAS as notas do vendedor com todos os relacionamentos (como na ReportsPage)
    const { data: devolucoes, error: notasError } = await supabaseAdmin
      .from('devolucoes')
      .select(`
        *,
        itens:itens_devolucao(*, motivo_item:motivos_devolucao(id, nome)),
        setores(nome),
        motivos_devolucao(nome, setores:setores(nome))
      `)
      .eq('vendedor', profile.vendedor)

    if (notasError) {
      throw new Error('Erro ao buscar notas: ' + notasError.message)
    }

    const todasNotas = devolucoes || []
    console.log(`Total de notas encontradas para vendedor ${profile.vendedor}:`, todasNotas.length)

    // Buscar dados dos clientes baseado no CNPJ (como na ReportsPage)
    const cnpjs = todasNotas
      .map((d: any) => d.cnpj_destinatario)
      .filter((cnpj: string) => cnpj && cnpj.trim() !== '')

    let clientesMap = new Map()
    if (cnpjs.length > 0) {
      const { data: clientes } = await supabaseAdmin
        .from('clientes')
        .select('cnpj_cpf, nome, vendedor, rede, uf, municipio')
        .in('cnpj_cpf', cnpjs)

      if (clientes) {
        clientes.forEach((cliente: any) => {
          clientesMap.set(cliente.cnpj_cpf, cliente)
        })
      }
    }

    // Formatar TODOS os dados (como na ReportsPage)
    const formattedAll = todasNotas.map((r: any) => {
      const cliente = clientesMap.get(r.cnpj_destinatario)
      return {
        ...r,
        setor_nome: r.setores?.nome || '-',
        motivo_nome: r.motivos_devolucao?.nome || '-',
        rede: cliente?.rede || r.rede || '-',
        uf_destino: cliente?.uf || r.uf_destino || '-',
        cidade_destino: cliente?.municipio || r.cidade_destino || '-',
        prazo: r.prazo || (r.resultado === 'LANÇADA' || r.resultado === 'ANULADA/CANCELADA' ? 'FINALIZADO' : r.prazo),
        nome_validador: r.nome_validador || '-',
        finalizada_por: r.finalizada_por || '-',
        justificativa: r.justificativa || ''
      }
    })

    // Filtrar notas por resultado (sem filtro de data) - para o vendedor que enviou o email
    const notasValidadas = formattedAll.filter((n: any) => n.resultado === 'VALIDADA')
    const notasPendentes = formattedAll.filter((n: any) => n.resultado === 'PENDENTE VALIDAÇÃO')
    const notasTratativa = formattedAll.filter((n: any) => n.resultado === 'TRATATIVA DE ANULAÇÃO')

    console.log('Notas Validadas:', notasValidadas.length)
    console.log('Notas Pendentes:', notasPendentes.length)
    console.log('Notas em Tratativa:', notasTratativa.length)

    // Calcular totais
    const valorTotalValidado = notasValidadas.reduce((sum: number, n: any) => sum + (Number(n.valor_total_nota) || 0), 0)
    const valorTotalPendente = notasPendentes.reduce((sum: number, n: any) => sum + (Number(n.valor_total_nota) || 0), 0)
    const valorTotalTratativa = notasTratativa.reduce((sum: number, n: any) => sum + (Number(n.valor_total_nota) || 0), 0)

    console.log('Valor Total Validado:', valorTotalValidado)
    console.log('Valor Total Pendente:', valorTotalPendente)
    console.log('Valor Total Tratativa:', valorTotalTratativa)

    // Calcular estatísticas para o relatório HTML (como na ReportsPage)
    const stats = {
      nfPendentes: notasPendentes.length,
      totalPendente: valorTotalPendente,
      nfCancelamento: notasTratativa.length,
      totalCancelamento: valorTotalTratativa,
      nfAtraso: formattedAll.filter((d: any) => d.prazo === 'EM ATRASO').length,
      totalAtraso: formattedAll.filter((d: any) => d.prazo === 'EM ATRASO').reduce((sum: number, d: any) => sum + (Number(d.valor_total_nota) || 0), 0),
      nfValidadas: notasValidadas.length,
      totalValidadas: valorTotalValidado,
      nfLancadas: formattedAll.filter((d: any) => d.resultado === 'LANÇADA').length,
      totalLancadas: formattedAll.filter((d: any) => d.resultado === 'LANÇADA').reduce((sum: number, d: any) => sum + (Number(d.valor_total_nota) || 0), 0),
      totalGeral: formattedAll.reduce((sum: number, d: any) => sum + (Number(d.valor_total_nota) || 0), 0)
    }

    // Buscar última validação anterior
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

    const formatarDataHora = (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date
      return d.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Logo
    const logoUrl = 'https://i.ibb.co/b095hpJ/Chat-GPT-Image-25-de-dez-de-2025-15-24-45.png'

    // Gerar relatório HTML completo (usando a mesma estrutura do ReportHTMLPage)
    // Importar a função generateReportHTML seria ideal, mas como estamos em Deno,
    // vamos replicar a lógica aqui
    const htmlRelatorio = await generateReportHTMLComplete({
      data: formattedAll,
      stats,
      vendedorNome,
      dataValidação,
      formatarData,
      formatarDataHora
    })

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
      
      <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
        📎 O relatório HTML completo está anexado a este email.
      </p>
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
    const emailDestino = 'obedysweb@gmail.com'
    
    // Converter HTML para base64 para anexo
    const encoder = new TextEncoder()
    const htmlBytes = encoder.encode(htmlRelatorio)
    const htmlRelatorioBase64 = encode(htmlBytes)

    // Limpar nome do arquivo
    const nomeArquivoSeguro = vendedorNome.replace(/[^a-zA-Z0-9]/g, '_')
    const dataArquivoSegura = formatarData(dataValidação).replace(/\//g, '-')
    const nomeArquivo = `Relatorio_Devolucoes_${nomeArquivoSeguro}_${dataArquivoSegura}.html`

    console.log('Gerando email com anexo:', nomeArquivo)
    console.log('Tamanho do HTML do relatório:', htmlRelatorio.length, 'caracteres')

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Sistema de Devoluções <onboarding@resend.dev>',
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

// Função para gerar relatório HTML completo (replicando ReportHTMLPage)
async function generateReportHTMLComplete({ data, stats, vendedorNome, dataValidação, formatarData, formatarDataHora }: any): Promise<string> {
  // Calcular dados dos gráficos
  const topClientesChart = data.reduce((acc: any, curr: any) => {
    const name = curr.nome_cliente || 'Desconhecido'
    const valor = Number(curr.valor_total_nota) || 0
    acc[name] = (acc[name] || 0) + valor
    return acc
  }, {})
  const topClientesList = Object.entries(topClientesChart)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 10)

  const topVendedoresChart = data.reduce((acc: any, curr: any) => {
    const vendedor = curr.vendedor || 'Desconhecido'
    const valor = Number(curr.valor_total_nota) || 0
    acc[vendedor] = (acc[vendedor] || 0) + valor
    return acc
  }, {})
  const topVendedoresList = Object.entries(topVendedoresChart)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5)

  const topRedesChart = data.reduce((acc: any, curr: any) => {
    const rede = curr.rede || 'Sem rede'
    const valor = Number(curr.valor_total_nota) || 0
    acc[rede] = (acc[rede] || 0) + valor
    return acc
  }, {})
  const topRedesList = Object.entries(topRedesChart)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5)

  const municipioChart = data.reduce((acc: any, curr: any) => {
    const municipio = curr.cidade_origem || 'N/A'
    acc[municipio] = (acc[municipio] || 0) + (Number(curr.valor_total_nota) || 0)
    return acc
  }, {})
  const municipioList = Object.entries(municipioChart)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 6)

  const motivosChart = data.reduce((acc: any, curr: any) => {
    const motivo = curr.motivo_nome || 'Não informado'
    acc[motivo] = (acc[motivo] || 0) + 1
    return acc
  }, {})
  const motivosList = Object.entries(motivosChart)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5)

  const produtosMap: Record<string, number> = {}
  data.forEach((devol: any) => {
    const itens = devol.itens || []
    itens.forEach((item: any) => {
      const produto = item.descricao || 'Desconhecido'
      const palavras = produto.split(' ')
      const nomeReduzido = palavras.slice(0, 2).join(' ')
      const quantidade = Number(item.quantidade) || 0
      produtosMap[nomeReduzido] = (produtosMap[nomeReduzido] || 0) + quantidade
    })
  })
  const topProdutosList = Object.entries(produtosMap)
    .map(([name, quantidade]) => ({ name, quantidade }))
    .sort((a: any, b: any) => b.quantidade - a.quantidade)
    .slice(0, 10)

  const totalValue = data.reduce((sum: number, d: any) => sum + (Number(d.valor_total_nota) || 0), 0)
  const totalReturns = data.length
  const ticketMedio = totalReturns > 0 ? (totalValue / totalReturns) : 0
  
  const insightsList: string[] = []
  
  if (totalReturns > 0) {
    insightsList.push(`📊 Total de ${totalReturns} devolução(ões) no período selecionado, totalizando R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`)
  }
  
  if (topClientesList.length > 0 && totalValue > 0) {
    const top1Percent = ((topClientesList[0].value as number) / totalValue) * 100
    if (top1Percent > 20) {
      insightsList.push(`⚠️ Cliente "${topClientesList[0].name}" concentra ${top1Percent.toFixed(1)}% do valor total de devoluções.`)
    }
  }
  
  if (topVendedoresList.length > 0) {
    insightsList.push(`👤 Vendedor "${topVendedoresList[0].name}" lidera em devoluções com R$ ${(topVendedoresList[0].value as number).toLocaleString('pt-BR')}.`)
  }
  
  if (topProdutosList.length > 0) {
    insightsList.push(`📦 Produto "${topProdutosList[0].name}" é o mais devolvido com ${topProdutosList[0].quantidade.toFixed(2)} unidades.`)
  }

  const alertas: string[] = []
  if (stats.nfAtraso > 0) {
    alertas.push(`🔴 ${stats.nfAtraso} nota(s) fiscal(is) em atraso requerem atenção imediata`)
  }
  if (stats.nfPendentes > 10) {
    alertas.push(`⚠️ Alto volume de pendências (${stats.nfPendentes}) - considere revisar processos`)
  }
  if (stats.totalCancelamento > stats.totalGeral * 0.1) {
    alertas.push(`📉 Taxa de cancelamento acima de 10% - investigar causas`)
  }
  if (alertas.length === 0) {
    alertas.push('✅ Nenhum alerta crítico identificado')
  }

  const periodoText = formatarData(dataValidação)

  // Tabelas de dados
  const pendentes = data.filter((d: any) => d.resultado === 'PENDENTE VALIDAÇÃO')
  const tratativas = data.filter((d: any) => d.resultado === 'TRATATIVA DE ANULAÇÃO')
  const validadasParaTabela = data.filter((d: any) => d.resultado === 'VALIDADA')
  
  const notasParaInformacoes = data.filter((d: any) => 
    d.resultado === 'PENDENTE VALIDAÇÃO' || 
    d.resultado === 'VALIDADA' || 
    d.resultado === 'TRATATIVA DE ANULAÇÃO'
  )

  const produtosData: any[] = []
  data.filter((d: any) => d.resultado === 'PENDENTE VALIDAÇÃO').forEach((item: any) => {
    if (item.itens && item.itens.length > 0) {
      item.itens.forEach((produto: any) => {
        produtosData.push({
          nf: item.numero || '-',
          vendedor: item.vendedor || '-',
          cliente: (item.nome_cliente || '-').substring(0, 25),
          produto: (produto.descricao || '-').substring(0, 30),
          unidade: produto.unidade || '-',
          quantidade: produto.quantidade ? produto.quantidade.toString() : '-',
          valor: `R$ ${(Number(produto.valor_total_bruto) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        })
      })
    }
  })

  // Gráfico de evolução no tempo
  const evolucaoMap: Record<string, { value: number, count: number }> = {}
  data.forEach((curr: any) => {
    const date = new Date(curr.data_emissao || curr.created_at)
    const day = formatarData(date)
    if (!evolucaoMap[day]) {
      evolucaoMap[day] = { value: 0, count: 0 }
    }
    evolucaoMap[day].value += (Number(curr.valor_total_nota) || 0)
    evolucaoMap[day].count += 1
  })

  const evolucaoData = Object.keys(evolucaoMap)
    .sort((a, b) => {
      const dateA = new Date(a.split('/').reverse().join('-'))
      const dateB = new Date(b.split('/').reverse().join('-'))
      return dateA.getTime() - dateB.getTime()
    })
    .map(key => ({
      name: key,
      value: evolucaoMap[key].value,
      count: evolucaoMap[key].count
    }))

  const tituloRelatorio = `Relatório das Devoluções - ${formatarData(new Date())} - ${vendedorNome}`

  // Retornar HTML completo (versão simplificada sem Chart.js para anexo)
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${tituloRelatorio}</title>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: white;
    padding: 10px;
    color: #333;
    font-size: 9px;
  }
  
  .header {
    background: linear-gradient(135deg, #073e29 0%, #0a4d33 100%);
    color: white;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 12px;
  }
  
  .header h1 {
    font-size: 18px;
    margin-bottom: 4px;
  }
  
  .header-info {
    font-size: 9px;
    opacity: 0.95;
    margin-bottom: 3px;
  }
  
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;
    margin-bottom: 12px;
  }
  
  .kpi-card {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px;
    background: #f9fafb;
  }
  
  .kpi-title {
    font-size: 7px;
    color: #666;
    margin-bottom: 3px;
  }
  
  .kpi-value {
    font-size: 13px;
    font-weight: bold;
    color: #073e29;
  }
  
  .kpi-desc {
    font-size: 6px;
    color: #999;
    margin-top: 2px;
  }
  
  .data-table-section {
    margin-top: 12px;
    margin-bottom: 12px;
  }
  
  .data-table-title {
    font-size: 12px;
    font-weight: bold;
    color: #073e29;
    margin-bottom: 8px;
    border-bottom: 2px solid #073e29;
    padding-bottom: 4px;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7px;
    margin-bottom: 15px;
  }
  
  .data-table thead {
    background: #073e29;
    color: white;
  }
  
  .data-table th {
    padding: 6px 4px;
    text-align: left;
    font-weight: bold;
    font-size: 7px;
  }
  
  .data-table td {
    padding: 4px;
    border: 1px solid #ddd;
    color: #333;
  }
  
  .data-table tbody tr:nth-child(even) {
    background: #f9fafb;
  }
  
  .footer {
    margin-top: auto;
    padding-top: 12px;
    border-top: 2px solid #073e29;
    text-align: center;
    font-size: 7px;
    color: #666;
  }
</style>
</head>
<body>
<div class="header">
  <h1>${tituloRelatorio}</h1>
  <div class="header-info">Relatório Gerado em ${formatarDataHora(new Date())}</div>
  <div class="header-info">Período: ${periodoText}</div>
</div>

<div class="kpi-grid">
  <div class="kpi-card">
    <div class="kpi-title">NF Pendentes</div>
    <div class="kpi-value">${stats.nfPendentes}</div>
    <div class="kpi-desc">R$ ${stats.totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-title">NF Cancelamento</div>
    <div class="kpi-value">${stats.nfCancelamento}</div>
    <div class="kpi-desc">R$ ${stats.totalCancelamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-title">NF em Atraso</div>
    <div class="kpi-value">${stats.nfAtraso}</div>
    <div class="kpi-desc">R$ ${stats.totalAtraso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-title">NF Validadas</div>
    <div class="kpi-value">${stats.nfValidadas}</div>
    <div class="kpi-desc">R$ ${stats.totalValidadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-title">Total Geral</div>
    <div class="kpi-value">${data.length}</div>
    <div class="kpi-desc">R$ ${stats.totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-title">Ticket Médio</div>
    <div class="kpi-value">R$ ${ticketMedio.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
    <div class="kpi-desc">Por devolução</div>
  </div>
</div>

<div class="data-table-section">
  ${tratativas.length > 0 ? `
    <div class="data-table-title">Notas em Tratativa de Anulação (${tratativas.length})</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Data Emissão</th>
          <th>NF</th>
          <th>Cliente</th>
          <th>Vendedor</th>
          <th>Valor</th>
          <th>Dias</th>
          <th>Prazo</th>
        </tr>
      </thead>
      <tbody>
        ${tratativas.slice(0, 50).map((item: any) => `
          <tr>
            <td>${item.data_emissao ? formatarData(item.data_emissao) : '-'}</td>
            <td><strong>${item.numero || '-'}</strong></td>
            <td>${(item.nome_cliente || '-').substring(0, 20)}</td>
            <td>${(item.vendedor || '-').substring(0, 15)}</td>
            <td><strong>R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
            <td>${item.dias !== null && item.dias !== undefined ? item.dias : '-'}</td>
            <td>${item.prazo || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}

  ${pendentes.length > 0 ? `
    <div class="data-table-title">Notas Pendentes (${pendentes.length})</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Data Emissão</th>
          <th>NF</th>
          <th>Cliente</th>
          <th>Vendedor</th>
          <th>Valor</th>
          <th>Dias</th>
          <th>Prazo</th>
        </tr>
      </thead>
      <tbody>
        ${pendentes.slice(0, 50).map((item: any) => `
          <tr>
            <td>${item.data_emissao ? formatarData(item.data_emissao) : '-'}</td>
            <td><strong>${item.numero || '-'}</strong></td>
            <td>${(item.nome_cliente || '-').substring(0, 20)}</td>
            <td>${(item.vendedor || '-').substring(0, 15)}</td>
            <td><strong>R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
            <td>${item.dias !== null && item.dias !== undefined ? item.dias : '-'}</td>
            <td>${item.prazo || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}

  ${produtosData.length > 0 ? `
    <div class="data-table-title">Lista Completa com Produtos (${produtosData.length})</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>NF</th>
          <th>Vendedor</th>
          <th>Cliente</th>
          <th>Produto</th>
          <th>Unidade</th>
          <th>Quantidade</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        ${produtosData.slice(0, 100).map((item: any) => `
          <tr>
            <td><strong>${item.nf}</strong></td>
            <td>${item.vendedor}</td>
            <td>${item.cliente}</td>
            <td>${item.produto}</td>
            <td>${item.unidade}</td>
            <td>${item.quantidade}</td>
            <td><strong>${item.valor}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}

  ${validadasParaTabela.length > 0 ? `
    <div class="data-table-title">Validações Realizadas (${validadasParaTabela.length})</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Data Emissão</th>
          <th>NF</th>
          <th>Cliente</th>
          <th>Valor</th>
          <th>Motivo</th>
          <th>Setor</th>
          <th>Data Validação</th>
        </tr>
      </thead>
      <tbody>
        ${validadasParaTabela.map((item: any) => `
          <tr>
            <td>${item.data_emissao ? formatarData(item.data_emissao) : '-'}</td>
            <td><strong>${item.numero || '-'}</strong></td>
            <td>${(item.nome_cliente || '-').substring(0, 20)}</td>
            <td><strong>R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
            <td>${(item.motivo_nome || '-').substring(0, 20)}</td>
            <td>${(item.setor_nome || '-').substring(0, 15)}</td>
            <td>${item.data_validacao ? formatarData(item.data_validacao) : '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}
</div>

<div class="footer">
  <p>Relatório gerado automaticamente pelo Sistema de Devoluções - Grupo Doce Mel</p>
  <p>Data de geração: ${formatarDataHora(new Date())}</p>
</div>
</body>
</html>`
}
