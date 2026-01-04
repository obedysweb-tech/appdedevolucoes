import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportHTMLPageProps {
  data: any[];
  stats: {
    nfPendentes: number;
    totalPendente: number;
    nfCancelamento: number;
    totalCancelamento: number;
    nfAtraso: number;
    totalAtraso: number;
    nfValidadas: number;
    totalValidadas: number;
    nfLancadas: number;
    totalLancadas: number;
    totalGeral: number;
  };
  filters: any;
}

export function generateReportHTML({ data, stats, filters }: ReportHTMLPageProps): string {
  // Calcular dados dos gráficos
  const topClientesChart = data.reduce((acc: any, curr) => {
    const name = curr.nome_cliente || 'Desconhecido';
    const valor = Number(curr.valor_total_nota) || 0;
    acc[name] = (acc[name] || 0) + valor;
    return acc;
  }, {});
  const topClientesList = Object.entries(topClientesChart)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 10);

  const topVendedoresChart = data.reduce((acc: any, curr) => {
    const vendedor = curr.vendedor || 'Desconhecido';
    const valor = Number(curr.valor_total_nota) || 0;
    acc[vendedor] = (acc[vendedor] || 0) + valor;
    return acc;
  }, {});
  const topVendedoresList = Object.entries(topVendedoresChart)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5);

  const topRedesChart = data.reduce((acc: any, curr) => {
    const rede = curr.rede || 'Sem rede';
    const valor = Number(curr.valor_total_nota) || 0;
    acc[rede] = (acc[rede] || 0) + valor;
    return acc;
  }, {});
  const topRedesList = Object.entries(topRedesChart)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5);

  const municipioChart = data.reduce((acc: any, curr) => {
    const municipio = curr.cidade_origem || 'N/A';
    acc[municipio] = (acc[municipio] || 0) + (Number(curr.valor_total_nota) || 0);
    return acc;
  }, {});
  const municipioList = Object.entries(municipioChart)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 6);

  const motivosChart = data.reduce((acc: any, curr) => {
    const motivo = curr.motivo_nome || 'Não informado';
    acc[motivo] = (acc[motivo] || 0) + 1;
    return acc;
  }, {});
  const motivosList = Object.entries(motivosChart)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5);

  const produtosMap: Record<string, number> = {};
  data.forEach(devol => {
    const itens = devol.itens || [];
    itens.forEach((item: any) => {
      const produto = item.descricao || 'Desconhecido';
      const palavras = produto.split(' ');
      const nomeReduzido = palavras.slice(0, 2).join(' ');
      const quantidade = Number(item.quantidade) || 0;
      produtosMap[nomeReduzido] = (produtosMap[nomeReduzido] || 0) + quantidade;
    });
  });
  const topProdutosList = Object.entries(produtosMap)
    .map(([name, quantidade]) => ({ name, quantidade }))
    .sort((a: any, b: any) => b.quantidade - a.quantidade)
    .slice(0, 10);

  const totalValue = data.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
  const totalReturns = data.length;
  const ticketMedio = totalReturns > 0 ? (totalValue / totalReturns) : 0;
  
  const insightsList: string[] = [];
  
  if (totalReturns > 0) {
    insightsList.push(`📊 Total de ${totalReturns} devolução(ões) no período selecionado, totalizando R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`);
  }
  
  if (topClientesList.length > 0 && totalValue > 0) {
    const top1Percent = ((topClientesList[0].value as number) / totalValue) * 100;
    if (top1Percent > 20) {
      insightsList.push(`⚠️ Cliente "${topClientesList[0].name}" concentra ${top1Percent.toFixed(1)}% do valor total de devoluções.`);
    }
  }
  
  if (topVendedoresList.length > 0) {
    insightsList.push(`👤 Vendedor "${topVendedoresList[0].name}" lidera em devoluções com R$ ${(topVendedoresList[0].value as number).toLocaleString('pt-BR')}.`);
  }
  
  if (topProdutosList.length > 0) {
    insightsList.push(`📦 Produto "${topProdutosList[0].name}" é o mais devolvido com ${topProdutosList[0].quantidade.toFixed(2)} unidades.`);
  }

  // Alertas e Recomendações
  const alertas: string[] = [];
  if (stats.nfAtraso > 0) {
    alertas.push(`🔴 ${stats.nfAtraso} nota(s) fiscal(is) em atraso requerem atenção imediata`);
  }
  if (stats.nfPendentes > 10) {
    alertas.push(`⚠️ Alto volume de pendências (${stats.nfPendentes}) - considere revisar processos`);
  }
  if (stats.totalCancelamento > stats.totalGeral * 0.1) {
    alertas.push(`📉 Taxa de cancelamento acima de 10% - investigar causas`);
  }
  if (alertas.length === 0) {
    alertas.push('✅ Nenhum alerta crítico identificado');
  }


  const periodoText = filters.startDate && filters.endDate 
    ? `${format(filters.startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(filters.endDate, 'dd/MM/yyyy', { locale: ptBR })}`
    : filters.period || 'Período não especificado';

  // Construir informações de filtros selecionados
  const filtrosSelecionados: string[] = [];
  if (filters.motivo && filters.motivo.length > 0) {
    filtrosSelecionados.push(`Motivos: ${filters.motivo.length} selecionado(s)`);
  }
  if (filters.cliente && filters.cliente.length > 0) {
    filtrosSelecionados.push(`Clientes: ${filters.cliente.length} selecionado(s)`);
  }
  if (filters.vendedor && filters.vendedor.length > 0) {
    filtrosSelecionados.push(`Vendedores: ${filters.vendedor.length} selecionado(s)`);
  }
  if (filters.setor && filters.setor.length > 0) {
    filtrosSelecionados.push(`Setores: ${filters.setor.length} selecionado(s)`);
  }
  if (filters.search) {
    filtrosSelecionados.push(`Busca: "${filters.search}"`);
  }

  // Tabelas de dados
  const pendentes = data.filter(d => d.resultado === 'PENDENTE VALIDAÇÃO');
  const tratativas = data.filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO');
  const validadasParaTabela = data.filter(d => d.resultado === 'VALIDADA');

  // Lista completa com produtos (apenas PENDENTE VALIDAÇÃO)
  const produtosData: any[] = [];
  data.filter(d => d.resultado === 'PENDENTE VALIDAÇÃO').forEach(item => {
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
        });
      });
    }
  });

  // Gráfico de evolução no tempo
  const evolucaoMap: Record<string, { value: number, count: number }> = {};
  data.forEach((curr) => {
    const date = new Date(curr.data_emissao || curr.created_at);
    const day = format(date, 'dd/MM', { locale: ptBR });
    if (!evolucaoMap[day]) {
      evolucaoMap[day] = { value: 0, count: 0 };
    }
    evolucaoMap[day].value += (Number(curr.valor_total_nota) || 0);
    evolucaoMap[day].count += 1;
  });

  const evolucaoData = Object.keys(evolucaoMap)
    .sort((a, b) => {
      const dateA = new Date(a.split('/').reverse().join('-'));
      const dateB = new Date(b.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    })
    .map(key => ({
      name: key,
      value: evolucaoMap[key].value,
      count: evolucaoMap[key].count
    }));

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Relatório de Devoluções - Grupo Doce Mel</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  @page {
    size: A4 portrait;
    margin: 15mm;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: white;
    padding: 10px;
    color: #333;
    font-size: 9px;
  }
  
  .page {
    page-break-after: auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    background: linear-gradient(135deg, #073e29 0%, #0a4d33 100%);
    color: white;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .header-logo {
    width: 50px;
    height: 50px;
    background: white;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .header-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .header-content {
    flex: 1;
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
  
  .header-filters {
    font-size: 8px;
    opacity: 0.85;
    margin-top: 4px;
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
  
  .chart-section {
    margin-bottom: 10px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  
  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .chart-title {
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 6px;
    color: #073e29;
    border-bottom: 2px solid #073e29;
    padding-bottom: 3px;
  }

  .chart-container {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 6px;
    background: white;
    height: 140px;
    position: relative;
    width: 100%;
  }
  
  .insights-container {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 6px;
    background: white;
    height: 140px;
    position: relative;
    width: 100%;
    overflow-y: auto;
  }
  
  .insight-item {
    font-size: 8px;
    margin-bottom: 4px;
    padding-left: 6px;
    line-height: 1.4;
    color: #333;
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
    page-break-inside: avoid;
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
  
  @media print {
    body {
      padding: 0;
    }
    .no-print {
      display: none !important;
    }
    .chart-container, .data-table {
      page-break-inside: avoid;
    }
  }
</style>
</head>
<body>
<button class="no-print" onclick="window.print()" style="position: fixed; top: 10px; right: 10px; z-index: 1000; background: #073e29; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
  🖨️ Imprimir
</button>

<div class="page">
  <div class="header">
    <div class="header-logo">
      <img src="/logo.png" alt="Logo" onerror="this.style.display='none'" style="background-color: #073e29;">
    </div>
    <div class="header-content">
      <h1>Relatório de Devoluções</h1>
      <div class="header-info">Relatório Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</div>
      <div class="header-info">Período: ${periodoText}</div>
      ${filtrosSelecionados.length > 0 ? `<div class="header-filters">Filtros: ${filtrosSelecionados.join(' | ')}</div>` : ''}
    </div>
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
  
  <!-- Seção 1: Evolução no Tempo | Top Clientes -->
  <div class="chart-grid">
    <div class="chart-section">
      <div class="chart-title">Evolução no Tempo</div>
      <div class="chart-container">
        <canvas id="chartEvolucao"></canvas>
      </div>
    </div>
    <div class="chart-section">
      <div class="chart-title">Top Clientes (Valor)</div>
      <div class="chart-container">
        <canvas id="chartTopClientes"></canvas>
      </div>
    </div>
  </div>
  
  <!-- Seção 2: Top Vendedores | Top Redes -->
  <div class="chart-grid">
    <div class="chart-section">
      <div class="chart-title">Top Vendedores (Valor)</div>
      <div class="chart-container">
        <canvas id="chartVendedores"></canvas>
      </div>
    </div>
    <div class="chart-section">
      <div class="chart-title">Top Redes (Valor)</div>
      <div class="chart-container">
        <canvas id="chartRedes"></canvas>
      </div>
    </div>
  </div>
  
  <!-- Seção 3: Distribuição por Município | Principais Motivos -->
  <div class="chart-grid">
    <div class="chart-section">
      <div class="chart-title">Distribuição por Município</div>
      <div class="chart-container">
        <canvas id="chartMunicipios"></canvas>
      </div>
    </div>
    <div class="chart-section">
      <div class="chart-title">Principais Motivos</div>
      <div class="chart-container">
        <canvas id="chartMotivos"></canvas>
      </div>
    </div>
  </div>
  
  <!-- Seção 4: Produtos Críticos | Insights Automáticos -->
  <div class="chart-grid">
    <div class="chart-section">
      <div class="chart-title">Produtos Críticos (Top 10)</div>
      <div class="chart-container">
        <canvas id="chartProdutos"></canvas>
      </div>
    </div>
    ${insightsList.length > 0 ? `
    <div class="chart-section">
      <div class="chart-title">Insights Automáticos</div>
      <div class="insights-container">
        ${insightsList.map((insight: string) => `
          <div class="insight-item">${insight}</div>
        `).join('')}
      </div>
    </div>
    ` : '<div class="chart-section"></div>'}
  </div>
  
  <!-- Tabelas de Dados -->
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
          ${tratativas.slice(0, 50).map(item => `
            <tr>
              <td>${item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</td>
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
          ${pendentes.slice(0, 50).map(item => `
            <tr>
              <td>${item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</td>
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
          ${produtosData.slice(0, 100).map(item => `
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

    <!-- Tabela 1: Validações Realizadas (resultado = VALIDADA) -->
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
          ${validadasParaTabela.map(item => `
            <tr>
              <td>${item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</td>
              <td><strong>${item.numero || '-'}</strong></td>
              <td>${(item.nome_cliente || '-').substring(0, 20)}</td>
              <td><strong>R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
              <td>${(item.motivo_nome || '-').substring(0, 20)}</td>
              <td>${(item.setor_nome || '-').substring(0, 15)}</td>
              <td>${item.data_validacao ? format(new Date(item.data_validacao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}

    <!-- Tabela 2: Em Tratativa (resultado = TRATATIVA DE ANULAÇÃO) -->
    ${tratativas.length > 0 ? `
      <div class="data-table-title">Em Tratativa (${tratativas.length})</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Data Emissão</th>
            <th>NF</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Observação</th>
            <th>Data Validação</th>
          </tr>
        </thead>
        <tbody>
          ${tratativas.map(item => `
            <tr>
              <td>${item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</td>
              <td><strong>${item.numero || '-'}</strong></td>
              <td>${(item.nome_cliente || '-').substring(0, 20)}</td>
              <td><strong>R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
              <td>${(item.justificativa || '-').substring(0, 30)}</td>
              <td>${item.data_validacao ? format(new Date(item.data_validacao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}

    <!-- Tabela 3: Pendências (resultado = PENDENTE VALIDAÇÃO) -->
    ${pendentes.length > 0 ? `
      <div class="data-table-title">Pendências (${pendentes.length})</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Data Emissão</th>
            <th>NF</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Dias</th>
            <th>Prazo</th>
          </tr>
        </thead>
        <tbody>
          ${pendentes.map(item => `
            <tr>
              <td>${item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</td>
              <td><strong>${item.numero || '-'}</strong></td>
              <td>${(item.nome_cliente || '-').substring(0, 20)}</td>
              <td><strong>R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
              <td>${item.dias !== null && item.dias !== undefined ? item.dias : '-'}</td>
              <td>${item.prazo || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
  </div>
  
  <div class="footer">
    <p>Relatório gerado automaticamente pelo Sistema de Devoluções - Grupo Doce Mel</p>
    <p>Data de geração: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}</p>
  </div>
</div>

<script>
  Chart.defaults.font.size = 8;
  Chart.defaults.color = '#1f2937';
  Chart.defaults.borderColor = '#e5e7eb';
  
  const commonChartOptions = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#17432a',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#1f2937', font: { size: 8 } }
      },
      y: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#1f2937', font: { size: 8 } }
      }
    }
  };
  
  // Gráfico de Evolução no Tempo
  new Chart(document.getElementById('chartEvolucao'), {
    type: 'line',
    data: {
      labels: ${JSON.stringify(evolucaoData.map((d: any) => d.name))},
      datasets: [{
        label: 'Valor Total (R$)',
        data: ${JSON.stringify(evolucaoData.map((d: any) => d.value))},
        borderColor: '#17432a',
        backgroundColor: 'rgba(23, 67, 42, 0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      ...commonChartOptions,
      plugins: {
        ...commonChartOptions.plugins,
        legend: { display: true, position: 'bottom', labels: { color: '#1f2937' } },
        tooltip: {
          ...commonChartOptions.plugins.tooltip,
          callbacks: {
            label: (context) => 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      },
      scales: {
        ...commonChartOptions.scales,
        y: {
          ...commonChartOptions.scales.y,
          beginAtZero: true,
          ticks: {
            ...commonChartOptions.scales.y.ticks,
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
          }
        },
        x: {
          ...commonChartOptions.scales.x,
          ticks: {
            ...commonChartOptions.scales.x.ticks,
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
  
  // Gráfico Top Clientes
  new Chart(document.getElementById('chartTopClientes'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(topClientesList.map((d: any) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name))},
      datasets: [{
        label: 'Valor (R$)',
        data: ${JSON.stringify(topClientesList.map((d: any) => d.value))},
        backgroundColor: '#17432a',
        borderColor: '#0a4d33',
        borderWidth: 1
      }]
    },
    options: {
      ...commonChartOptions,
      indexAxis: 'y',
      scales: {
        ...commonChartOptions.scales,
        x: {
          ...commonChartOptions.scales.x,
          ticks: {
            ...commonChartOptions.scales.x.ticks,
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
          }
        }
      },
      plugins: {
        ...commonChartOptions.plugins,
        tooltip: {
          ...commonChartOptions.plugins.tooltip,
          callbacks: {
            label: (context) => 'R$ ' + context.parsed.x.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      }
    }
  });
  
  // Gráfico Top Vendedores
  new Chart(document.getElementById('chartVendedores'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(topVendedoresList.map((d: any) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name))},
      datasets: [{
        label: 'Valor (R$)',
        data: ${JSON.stringify(topVendedoresList.map((d: any) => d.value))},
        backgroundColor: '#0a4d33',
        borderColor: '#17432a',
        borderWidth: 1
      }]
    },
    options: {
      ...commonChartOptions,
      scales: {
        ...commonChartOptions.scales,
        y: {
          ...commonChartOptions.scales.y,
          beginAtZero: true,
          ticks: {
            ...commonChartOptions.scales.y.ticks,
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
          }
        },
        x: {
          ...commonChartOptions.scales.x,
          ticks: {
            ...commonChartOptions.scales.x.ticks,
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
      plugins: {
        ...commonChartOptions.plugins,
        tooltip: {
          ...commonChartOptions.plugins.tooltip,
          callbacks: {
            label: (context) => 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      }
    }
  });
  
  // Gráfico Top Redes
  new Chart(document.getElementById('chartRedes'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(topRedesList.map((d: any) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name))},
      datasets: [{
        label: 'Valor (R$)',
        data: ${JSON.stringify(topRedesList.map((d: any) => d.value))},
        backgroundColor: '#065f46',
        borderColor: '#0a4d33',
        borderWidth: 1
      }]
    },
    options: {
      ...commonChartOptions,
      scales: {
        ...commonChartOptions.scales,
        y: {
          ...commonChartOptions.scales.y,
          beginAtZero: true,
          ticks: {
            ...commonChartOptions.scales.y.ticks,
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
          }
        },
        x: {
          ...commonChartOptions.scales.x,
          ticks: {
            ...commonChartOptions.scales.x.ticks,
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
      plugins: {
        ...commonChartOptions.plugins,
        tooltip: {
          ...commonChartOptions.plugins.tooltip,
          callbacks: {
            label: (context) => 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      }
    }
  });
  
  // Gráfico Municípios
  new Chart(document.getElementById('chartMunicipios'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(municipioList.map((d: any) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name))},
      datasets: [{
        label: 'Valor (R$)',
        data: ${JSON.stringify(municipioList.map((d: any) => d.value))},
        backgroundColor: '#17432a',
        borderColor: '#0a4d33',
        borderWidth: 1
      }]
    },
    options: {
      ...commonChartOptions,
      indexAxis: 'y',
      scales: {
        ...commonChartOptions.scales,
        x: {
          ...commonChartOptions.scales.x,
          ticks: {
            ...commonChartOptions.scales.x.ticks,
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
          }
        }
      },
      plugins: {
        ...commonChartOptions.plugins,
        tooltip: {
          ...commonChartOptions.plugins.tooltip,
          callbacks: {
            label: (context) => 'R$ ' + context.parsed.x.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      }
    }
  });
  
  // Gráfico Motivos
  new Chart(document.getElementById('chartMotivos'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(motivosList.map((d: any) => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name))},
      datasets: [{
        label: 'Quantidade',
        data: ${JSON.stringify(motivosList.map((d: any) => d.value))},
        backgroundColor: '#0a4d33',
        borderColor: '#17432a',
        borderWidth: 1
      }]
    },
    options: {
      ...commonChartOptions,
      scales: {
        ...commonChartOptions.scales,
        y: {
          ...commonChartOptions.scales.y,
          beginAtZero: true,
          ticks: {
            ...commonChartOptions.scales.y.ticks,
            stepSize: 1
          }
        },
        x: {
          ...commonChartOptions.scales.x,
          ticks: {
            ...commonChartOptions.scales.x.ticks,
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
      plugins: {
        ...commonChartOptions.plugins,
        tooltip: {
          ...commonChartOptions.plugins.tooltip,
          callbacks: {
            label: (context) => context.parsed.y + ' ocorrência(s)'
          }
        }
      }
    }
  });
  
  // Gráfico Produtos
  new Chart(document.getElementById('chartProdutos'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(topProdutosList.slice(0, 10).map((d: any) => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name))},
      datasets: [{
        label: 'Quantidade',
        data: ${JSON.stringify(topProdutosList.slice(0, 10).map((d: any) => d.quantidade))},
        backgroundColor: '#065f46',
        borderColor: '#0a4d33',
        borderWidth: 1
      }]
    },
    options: {
      ...commonChartOptions,
      indexAxis: 'y',
      scales: {
        ...commonChartOptions.scales,
        x: {
          ...commonChartOptions.scales.x,
          beginAtZero: true
        }
      },
      plugins: {
        ...commonChartOptions.plugins,
        tooltip: {
          ...commonChartOptions.plugins.tooltip,
          callbacks: {
            label: (context) => context.parsed.x.toFixed(2) + ' unidades'
          }
        }
      }
    }
  });
</script>
</body>
</html>
  `;
}
