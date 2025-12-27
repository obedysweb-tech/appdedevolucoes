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
    .slice(0, 5);

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

  // Clientes com maior recorrência
  const clientesRecorrencia = data.reduce((acc: any, curr) => {
    const name = curr.nome_cliente || 'Desconhecido';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const clientesRecorrenciaList = Object.entries(clientesRecorrencia)
    .map(([name, count]) => ({ name, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);

  // Calcular insights
  const totalValue = data.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
  const totalReturns = data.length;
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

  // Tendências
  const validadas = data.filter(d => d.resultado === 'VALIDADA');
  const taxaValidacao = data.length > 0 
    ? ((validadas.length / data.length) * 100).toFixed(1)
    : '0';
  const taxaCancelamento = data.length > 0
    ? ((stats.nfCancelamento / data.length) * 100).toFixed(1)
    : '0';

  const periodoText = filters.startDate && filters.endDate 
    ? `${format(filters.startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(filters.endDate, 'dd/MM/yyyy', { locale: ptBR })}`
    : filters.period || 'Período não especificado';

  // Tabelas de dados
  const pendentes = data.filter(d => d.resultado === 'PENDENTE VALIDAÇÃO');
  const tratativas = data.filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO');

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

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Devoluções - Grupo Doce Mel</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 10px;
      color: #333;
      font-size: 11px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    
    .no-print {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 1000;
      display: flex;
      gap: 8px;
    }
    
    .btn {
      background: #073e29;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .btn:hover {
      background: #0a4d33;
    }
    
    .header {
      background: linear-gradient(135deg, #073e29 0%, #0a4d33 100%);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-after: avoid;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .logo {
      width: 60px;
      height: 60px;
      background: #073e29;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .header-title h1 {
      font-size: 20px;
      margin-bottom: 3px;
      font-weight: bold;
    }
    
    .header-title p {
      font-size: 11px;
      opacity: 0.9;
    }
    
    .header-right {
      text-align: right;
      font-size: 10px;
    }
    
    .header-right div {
      margin-bottom: 3px;
    }
    
    .content {
      padding: 20px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
      page-break-after: avoid;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      border: 1.5px solid #073e29;
      border-radius: 6px;
      padding: 12px;
      text-align: center;
    }
    
    .stat-title {
      font-size: 9px;
      color: #073e29;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    
    .stat-value {
      font-size: 22px;
      font-weight: bold;
      color: #073e29;
      margin-bottom: 3px;
    }
    
    .stat-subvalue {
      font-size: 10px;
      color: #666;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #073e29;
      margin: 20px 0 12px 0;
      padding-bottom: 6px;
      border-bottom: 2px solid #073e29;
      page-break-after: avoid;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .chart-card {
      background: white;
      border: 1.5px solid #e5e7eb;
      border-radius: 6px;
      padding: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      page-break-inside: avoid;
    }
    
    .chart-title {
      font-size: 11px;
      font-weight: bold;
      color: #073e29;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .bar-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .bar-label {
      flex: 0 0 80px;
      font-size: 9px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .bar-container {
      flex: 1;
      background: #e5e7eb;
      height: 18px;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .bar-fill {
      background: #073e29;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 6px;
      color: white;
      font-size: 8px;
      font-weight: bold;
    }
    
    .insights-box {
      background: #f0fdf4;
      border: 1.5px solid #073e29;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .insights-title {
      font-size: 12px;
      font-weight: bold;
      color: #073e29;
      margin-bottom: 10px;
    }
    
    .insights-list {
      list-style: none;
    }
    
    .insights-list li {
      padding: 4px 0;
      border-bottom: 1px solid #d1d5db;
      font-size: 10px;
      color: #374151;
    }
    
    .insights-list li:last-child {
      border-bottom: none;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 9px;
    }
    
    .data-table thead {
      background: #073e29;
      color: white;
    }
    
    .data-table th {
      padding: 6px 8px;
      text-align: left;
      font-weight: bold;
      font-size: 9px;
    }
    
    .data-table td {
      padding: 5px 8px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 9px;
    }
    
    .data-table tbody tr {
      page-break-inside: avoid;
    }
    
    .intelligence-section {
      background: #f0fdf4;
      border: 1.5px solid #073e29;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .intelligence-title {
      font-size: 13px;
      font-weight: bold;
      color: #073e29;
      margin-bottom: 12px;
    }
    
    .intelligence-subsection {
      margin-bottom: 12px;
    }
    
    .intelligence-subsection h4 {
      font-size: 10px;
      color: #073e29;
      margin-bottom: 6px;
      font-weight: bold;
    }
    
    .intelligence-subsection ul {
      list-style: none;
      padding-left: 0;
    }
    
    .intelligence-subsection li {
      padding: 3px 0;
      font-size: 9px;
      color: #374151;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    .table-subtitle {
      color: #073e29;
      margin: 12px 0 6px 0;
      font-size: 10px;
      font-weight: bold;
    }
    
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      .no-print {
        display: none !important;
      }
      
      body {
        padding: 0;
        background: #f5f5f5 !important;
      }
      
      .container {
        box-shadow: none;
      }
      
      .header {
        background: linear-gradient(135deg, #073e29 0%, #0a4d33 100%) !important;
        color: white !important;
      }
      
      .stat-card {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%) !important;
        border: 1.5px solid #073e29 !important;
      }
      
      .bar-fill {
        background: #073e29 !important;
        color: white !important;
      }
      
      .insights-box, .intelligence-section {
        background: #f0fdf4 !important;
        border: 1.5px solid #073e29 !important;
      }
      
      .data-table thead {
        background: #073e29 !important;
        color: white !important;
      }
      
      .section-title {
        color: #073e29 !important;
        border-bottom: 2px solid #073e29 !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="btn" onclick="window.print()">
      🖨️ Imprimir / Salvar PDF
    </button>
    <button class="btn" onclick="window.close()">
      ✖️ Fechar
    </button>
  </div>
  
  <script>
    window.onbeforeprint = function() {
      document.body.style.webkitPrintColorAdjust = 'exact';
      document.body.style.colorAdjust = 'exact';
      document.body.style.printColorAdjust = 'exact';
    };
  </script>

  <div class="container">
    <!-- PÁGINA 1: Header + Cards + Análises Gráficas -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <img src="/logo.png" alt="Logo Doce Mel" onerror="this.onerror=null; this.style.display='none';">
        </div>
        <div class="header-title">
          <h1>Relatório de Devoluções</h1>
          <p>GRUPO DOCE MEL</p>
        </div>
      </div>
      <div class="header-right">
        <div><strong>Gerado em:</strong> ${format(new Date(), 'dd/MM/yyyy, HH:mm:ss', { locale: ptBR })}</div>
        <div><strong>Período:</strong> ${periodoText}</div>
      </div>
    </div>

    <div class="content">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">NF Pendentes</div>
          <div class="stat-value">${stats.nfPendentes}</div>
          <div class="stat-subvalue">R$ ${stats.totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">NF Cancelamento</div>
          <div class="stat-value">${stats.nfCancelamento}</div>
          <div class="stat-subvalue">R$ ${stats.totalCancelamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">NF em Atraso</div>
          <div class="stat-value">${stats.nfAtraso}</div>
          <div class="stat-subvalue">R$ ${stats.totalAtraso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">NF Validadas</div>
          <div class="stat-value">${stats.nfValidadas}</div>
          <div class="stat-subvalue">R$ ${stats.totalValidadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Total Geral</div>
          <div class="stat-value">${data.length}</div>
          <div class="stat-subvalue">R$ ${stats.totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <!-- Gráficos com barras visuais -->
      <h2 class="section-title">📊 Análises Gráficas</h2>
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-title">Top 5 Clientes (Valor)</div>
          <div class="bar-chart">
            ${topClientesList.map((item: any) => {
              const maxValue = Math.max(...topClientesList.map((i: any) => i.value));
              const percentage = (item.value / maxValue) * 100;
              return `
                <div class="bar-item">
                  <div class="bar-label">${item.name.substring(0, 12)}</div>
                  <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%">R$ ${item.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-title">Top 5 Vendedores (Valor)</div>
          <div class="bar-chart">
            ${topVendedoresList.map((item: any) => {
              const maxValue = Math.max(...topVendedoresList.map((i: any) => i.value));
              const percentage = (item.value / maxValue) * 100;
              return `
                <div class="bar-item">
                  <div class="bar-label">${item.name.substring(0, 12)}</div>
                  <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%">R$ ${item.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-title">Top 5 Redes (Valor)</div>
          <div class="bar-chart">
            ${topRedesList.map((item: any) => {
              const maxValue = Math.max(...topRedesList.map((i: any) => i.value));
              const percentage = (item.value / maxValue) * 100;
              return `
                <div class="bar-item">
                  <div class="bar-label">${item.name.substring(0, 12)}</div>
                  <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%">R$ ${item.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-title">Distribuição por Município</div>
          <div class="bar-chart">
            ${municipioList.map((item: any) => {
              const maxValue = Math.max(...municipioList.map((i: any) => i.value));
              const percentage = (item.value / maxValue) * 100;
              return `
                <div class="bar-item">
                  <div class="bar-label">${item.name.substring(0, 12)}</div>
                  <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%">R$ ${item.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-title">Principais Motivos</div>
          <div class="bar-chart">
            ${motivosList.map((item: any) => {
              const maxValue = Math.max(...motivosList.map((i: any) => i.value));
              const percentage = (item.value / maxValue) * 100;
              return `
                <div class="bar-item">
                  <div class="bar-label">${item.name.substring(0, 12)}</div>
                  <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%">${item.value}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-title">Produtos Críticos (Top 10)</div>
          <div class="bar-chart">
            ${topProdutosList.slice(0, 5).map((item: any) => {
              const maxValue = Math.max(...topProdutosList.map((i: any) => i.quantidade));
              const percentage = (item.quantidade / maxValue) * 100;
              return `
                <div class="bar-item">
                  <div class="bar-label">${item.name.substring(0, 12)}</div>
                  <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%">${item.quantidade.toFixed(0)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- PÁGINA 2: Inteligência e Análises + Insights + Notas em Tratativa -->
    <div class="content page-break">
      <!-- Inteligência e Análises -->
      <div class="intelligence-section">
        <div class="intelligence-title">🧠 Inteligência e Análises</div>
        
        <div class="intelligence-subsection">
          <h4>👥 Clientes com Maior Recorrência:</h4>
          <ul>
            ${clientesRecorrenciaList.map((item: any, index) => `
              <li><strong>${index + 1}.</strong> ${item.name}: ${item.count} devolução(ões)</li>
            `).join('')}
          </ul>
        </div>
        
        <div class="intelligence-subsection">
          <h4>⚠️ Alertas e Recomendações:</h4>
          <ul>
            ${alertas.map(alerta => `<li>${alerta}</li>`).join('')}
          </ul>
        </div>
        
        <div class="intelligence-subsection">
          <h4>📈 Tendências:</h4>
          <ul>
            <li>Taxa de Validação: <strong>${taxaValidacao}%</strong></li>
            <li>Taxa de Cancelamento: <strong>${taxaCancelamento}%</strong></li>
            <li>Total Processado: <strong>${data.length} nota(s) fiscal(is)</strong></li>
          </ul>
        </div>
      </div>

      <!-- Insights -->
      <div class="insights-box">
        <div class="insights-title">💡 Insights Automáticos</div>
        <ul class="insights-list">
          ${insightsList.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
      </div>

      ${tratativas.length > 0 ? `
        <h3 class="table-subtitle">Notas em Tratativa de Anulação (${tratativas.length})</h3>
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
                <td>${item.numero || '-'}</td>
                <td>${(item.nome_cliente || '-').substring(0, 30)}</td>
                <td>${item.vendedor || '-'}</td>
                <td>R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>${item.dias !== null && item.dias !== undefined ? item.dias : '-'}</td>
                <td>${item.prazo || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
    </div>

    <!-- PÁGINA 3+: Dados Detalhados -->
    <div class="content page-break">
      <h2 class="section-title">📋 Dados Detalhados</h2>
      
      ${pendentes.length > 0 ? `
        <h3 class="table-subtitle">Notas Pendentes (${pendentes.length})</h3>
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
                <td>${item.numero || '-'}</td>
                <td>${(item.nome_cliente || '-').substring(0, 30)}</td>
                <td>${item.vendedor || '-'}</td>
                <td>R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>${item.dias !== null && item.dias !== undefined ? item.dias : '-'}</td>
                <td>${item.prazo || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      ${validadas.length > 0 ? `
        <h3 class="table-subtitle">Notas Validadas (${validadas.length})</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Data Emissão</th>
              <th>NF</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Motivo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${validadas.slice(0, 50).map(item => `
              <tr>
                <td>${item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</td>
                <td>${item.numero || '-'}</td>
                <td>${(item.nome_cliente || '-').substring(0, 30)}</td>
                <td>${item.vendedor || '-'}</td>
                <td>${item.motivo_nome || '-'}</td>
                <td>R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      ${produtosData.length > 0 ? `
        <h3 class="table-subtitle">Lista Completa com Produtos (${produtosData.length})</h3>
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
                <td>${item.nf}</td>
                <td>${item.vendedor}</td>
                <td>${item.cliente}</td>
                <td>${item.produto}</td>
                <td>${item.unidade}</td>
                <td>${item.quantidade}</td>
                <td>${item.valor}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
    </div>
  </div>
</body>
</html>
  `;
}
