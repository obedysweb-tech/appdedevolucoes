import { useEffect, useState } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { FilterBar } from "@/components/filters/FilterBar";
import { PageHeader } from "@/components/layout/PageHeader";
import { useFilterStore, useAuthStore } from "@/lib/store";
import { getDateRangeFromPeriod } from "@/lib/dateUtils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  DollarSign, 
  RefreshCcw, 
  TrendingUp,
  Loader2,
  RefreshCw,
  MapPin,
  PackageX,
  XCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  LabelList
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer } from "lucide-react";

// Cores padronizadas
const COLORS_LIGHT = ['#17432a', '#17432a', '#17432a', '#17432a', '#17432a', '#17432a'];
const COLORS_DARK = ['#d2f8f7', '#d2f8f7', '#d2f8f7', '#d2f8f7', '#d2f8f7', '#d2f8f7'];

// Componente customizado para quebrar texto no eixo X
const CustomXAxisTick = ({ x, y, payload }: any) => {
  const MAX_CHARS_PER_LINE = 10;

  const words = payload.value.split(" ");
  let lines: string[] = [];
  let currentLine = "";

  words.forEach((word: string) => {
    if ((currentLine + word).length <= MAX_CHARS_PER_LINE) {
      currentLine += `${word} `;
    } else {
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      currentLine = `${word} `;
    }
  });

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="currentColor"
        fontSize={10}
        fontWeight="bold"
      >
        {lines.map((line, index) => (
          <tspan x="0" dy={index === 0 ? 0 : 14} key={index}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export function DashboardLancadasPage() {
  const { filters } = useFilterStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
      totalValue: 0,
      totalReturns: 0,
      avgTicket: 0,
      totalProducts: 0,
      valorTotalLancado: 0,
      notasLancadas: 0,
      valorTotalCancelado: 0,
      notasCanceladas: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [topVendedores, setTopVendedores] = useState<any[]>([]);
  const [topRedes, setTopRedes] = useState<any[]>([]);
  const [paretoData, setParetoData] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [municipioData, setMunicipioData] = useState<any[]>([]);
  const [clientesReincidencia, setClientesReincidencia] = useState<any[]>([]);
  const [motivosPorRede, setMotivosPorRede] = useState<any[]>([]);
  const [devolucoesPorMotivo, setDevolucoesPorMotivo] = useState<any[]>([]);
  const [devolucoesPorSetor, setDevolucoesPorSetor] = useState<any[]>([]);
  const [top20Produtos, setTop20Produtos] = useState<any[]>([]);
  const [filtroUnidadeProdutos, setFiltroUnidadeProdutos] = useState<'KG' | 'CX'>('KG');

  useEffect(() => {
    const checkTheme = () => {
        setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const CHART_COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;

  useEffect(() => {
    fetchDashboardData();
  }, [filters, user, filtroUnidadeProdutos]); 

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Usar vendedor do objeto user (já carregado no App.tsx)
      const userVendedor = user?.role === 'VENDEDOR' ? user.vendedor : null;
      
      // Base query - incluir itens para calcular produtos devolvidos
      let query = supabase.from('devolucoes').select(`
          *,
          motivos_devolucao(nome, setores:setores(nome)),
          setores(nome),
          itens:itens_devolucao(quantidade, descricao, motivo_id, valor_total_bruto, unidade)
      `);
    
    // Filtrar por vendedor do usuário (apenas se for tipo VENDEDOR)
    if (user && user.role === 'VENDEDOR' && userVendedor) {
      query = query.eq('vendedor', userVendedor);
      console.log('🔒 Dashboard Lançadas - Filtrando por vendedor:', userVendedor);
    }
    
    // Aplicar período se não houver datas específicas
    const periodDates = filters.period && !filters.startDate && !filters.endDate 
      ? getDateRangeFromPeriod(filters.period)
      : {};
    const effectiveStartDate = filters.startDate || periodDates.startDate;
    const effectiveEndDate = filters.endDate || periodDates.endDate;
    
    // FILTRO FIXO: Apenas notas com resultado LANÇADA e ANULADA/CANCELADA
    query = query.in('resultado', ['LANÇADA', 'ANULADA/CANCELADA']);
    
    // Aplicar Filtros
    if (filters.search) {
        query = query.or(`nome_cliente.ilike.%${filters.search}%,vendedor.ilike.%${filters.search}%,numero.ilike.%${filters.search}%`);
    }
    // Remover filtro de resultado do usuário, pois já temos filtro fixo acima
    // if (filters.resultado && filters.resultado.length > 0) {
    //   query = query.in('resultado', filters.resultado);
    // }
    if (filters.motivo && filters.motivo.length > 0) {
      query = query.in('motivo_id', filters.motivo);
    }
    if (filters.cliente && filters.cliente.length > 0) {
      query = query.in('nome_cliente', filters.cliente);
    }
    if (filters.vendedor && filters.vendedor.length > 0) {
      query = query.in('vendedor', filters.vendedor);
    }
    if (filters.setor && filters.setor.length > 0) {
        query = query.in('setor_id', filters.setor);
    }
    if (effectiveStartDate) {
        query = query.gte('data_emissao', effectiveStartDate.toISOString().split('T')[0]);
    }
    if (effectiveEndDate) {
        query = query.lte('data_emissao', effectiveEndDate.toISOString().split('T')[0]);
    }
    
    const { data: devolucoes, error } = await query;

    if (error) {
        console.error('❌ Erro ao buscar dados do Dashboard Lançadas:', error);
        toast.error('Erro ao carregar dados do Dashboard Lançadas: ' + error.message);
        setLoading(false);
        return;
    }
    
    if (!devolucoes || devolucoes.length === 0) {
        console.log('ℹ️ Nenhuma devolução encontrada para os filtros selecionados');
        // Limpar todos os dados quando não há resultados
        setStats({
            totalValue: 0,
            totalReturns: 0,
            avgTicket: 0,
            totalProducts: 0,
            valorTotalLancado: 0,
            notasLancadas: 0,
            valorTotalCancelado: 0,
            notasCanceladas: 0
        });
        setChartData([]);
        setTopCustomers([]);
        setTopVendedores([]);
        setTopRedes([]);
        setParetoData([]);
        setInsights([]);
        setMunicipioData([]);
        setDevolucoesPorMotivo([]);
        setDevolucoesPorSetor([]);
        setTop20Produtos([]);
        setLoading(false);
        return;
    }
    
    if (devolucoes) {
        console.log(`✅ Dashboard Lançadas: ${devolucoes.length} devoluções carregadas`);
        // 1. Calcular KPIs
        const totalValue = devolucoes.reduce((acc, curr) => acc + (Number(curr.valor_total_nota) || 0), 0);
        const totalReturns = devolucoes.length;
        const avgTicket = totalReturns > 0 ? totalValue / totalReturns : 0;
        
        // Calcular quantidade total de produtos devolvidos
        const totalProducts = devolucoes.reduce((acc, curr) => {
            const itens = curr.itens || [];
            return acc + itens.reduce((sum: number, item: any) => sum + (Number(item.quantidade) || 0), 0);
        }, 0);
        
        // Calcular valores para cards específicos
        const notasLancadas = devolucoes.filter(d => d.resultado === 'LANÇADA');
        const notasCanceladas = devolucoes.filter(d => d.resultado === 'ANULADA/CANCELADA');
        const valorTotalLancado = notasLancadas.reduce((acc, curr) => acc + (Number(curr.valor_total_nota) || 0), 0);
        const valorTotalCancelado = notasCanceladas.reduce((acc, curr) => acc + (Number(curr.valor_total_nota) || 0), 0);
        
        setStats({
            totalValue,
            totalReturns,
            avgTicket,
            totalProducts,
            valorTotalLancado,
            notasLancadas: notasLancadas.length,
            valorTotalCancelado,
            notasCanceladas: notasCanceladas.length
        });

        // 2. Gráfico de Evolução (Agrupar por Dia) - Incluir valor e quantidade de notas
        const groupedByDay = devolucoes.reduce((acc: any, curr) => {
            const date = new Date(curr.data_emissao || curr.created_at);
            const day = format(date, 'dd/MM', { locale: ptBR });
            if (!acc[day]) {
                acc[day] = { value: 0, count: 0 };
            }
            acc[day].value += (Number(curr.valor_total_nota) || 0);
            acc[day].count += 1;
            return acc;
        }, {});

        // Ordenar por data
        const chart = Object.keys(groupedByDay)
            .sort((a, b) => {
                const dateA = new Date(a.split('/').reverse().join('-'));
                const dateB = new Date(b.split('/').reverse().join('-'));
                return dateA.getTime() - dateB.getTime();
            })
            .map(key => ({
                name: key,
                value: groupedByDay[key].value,
                count: groupedByDay[key].count
            }));
        setChartData(chart);

        // 3. Top Clientes - com detalhes
        const customerMap: Record<string, { valor: number, detalhes: Array<{ cliente: string, nota: string }> }> = {};
        devolucoes.forEach((curr) => {
            const name = curr.nome_cliente || 'Desconhecido';
            const valor = Number(curr.valor_total_nota) || 0;
            if (!customerMap[name]) {
                customerMap[name] = { valor: 0, detalhes: [] };
            }
            customerMap[name].valor += valor;
            customerMap[name].detalhes.push({
                cliente: name,
                nota: curr.numero || '-'
            });
        });
        
        const topCust = Object.entries(customerMap)
            .map(([name, data]) => ({ 
                name, 
                value: data.valor,
                quantidade: data.detalhes.length,
                detalhes: data.detalhes
            }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 10);
        setTopCustomers(topCust);
        
        // Top Vendedores por valor - com detalhes
        const vendedorMap: Record<string, { valor: number, detalhes: Array<{ cliente: string, nota: string }> }> = {};
        devolucoes.forEach((curr) => {
            const vendedor = curr.vendedor || 'Desconhecido';
            const valor = Number(curr.valor_total_nota) || 0;
            if (!vendedorMap[vendedor]) {
                vendedorMap[vendedor] = { valor: 0, detalhes: [] };
            }
            vendedorMap[vendedor].valor += valor;
            vendedorMap[vendedor].detalhes.push({
                cliente: curr.nome_cliente || 'Desconhecido',
                nota: curr.numero || '-'
            });
        });
        
        const topVend = Object.entries(vendedorMap)
            .map(([name, data]) => ({ 
                name, 
                value: data.valor,
                quantidade: data.detalhes.length,
                detalhes: data.detalhes
            }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
        setTopVendedores(topVend);
        
        // Top Redes por valor - com detalhes
        const redeMap: Record<string, { valor: number, detalhes: Array<{ cliente: string, nota: string }> }> = {};
        devolucoes.forEach((curr) => {
            // Tentar obter rede de diferentes fontes
            let rede = curr.rede || 'Sem rede';
            
            // Se não tiver rede direto, tentar buscar do cliente via CNPJ
            if (rede === 'Sem rede' && curr.cnpj_destinatario) {
                // A query já tentou fazer join, mas se não funcionou, usar o que está disponível
                rede = curr.rede || 'Sem rede';
            }
            
            const valor = Number(curr.valor_total_nota) || 0;
            if (!redeMap[rede]) {
                redeMap[rede] = { valor: 0, detalhes: [] };
            }
            redeMap[rede].valor += valor;
            redeMap[rede].detalhes.push({
                cliente: curr.nome_cliente || 'Desconhecido',
                nota: curr.numero || '-'
            });
        });
        
        const topRed = Object.entries(redeMap)
            .map(([name, data]) => ({ 
                name, 
                value: data.valor,
                quantidade: data.detalhes.length,
                detalhes: data.detalhes
            }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
        setTopRedes(topRed);
        
        // Gráfico de Pareto (80/20) - Clientes (usando customerMap que já tem detalhes)
        const sortedCustomers = Object.entries(customerMap)
            .map(([name, data]) => ({ name, value: data.valor, detalhes: data.detalhes }))
            .sort((a, b) => b.value - a.value);
        
        let cumulativeValue = 0;
        const totalCustomerValue = sortedCustomers.reduce((sum, item) => sum + item.value, 0);
        const pareto = sortedCustomers.map((item, index) => {
            cumulativeValue += item.value;
            return {
                name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
                value: item.value,
                cumulative: cumulativeValue,
                percentage: (cumulativeValue / totalCustomerValue) * 100,
                index: index + 1,
                quantidade: item.detalhes.length,
                detalhes: item.detalhes
            };
        }).slice(0, 10);
        setParetoData(pareto);
        
        // Heatmap removido - não é mais usado

        // 4. Gráfico de Motivos removido - não é mais usado
        
        // 5. Dados Geográficos (Municípios) - Alterado de Estado para Município
        // Buscar município do cliente (emitente) - cidade_origem é do cliente/emitente
        const municipioMap = devolucoes.reduce((acc: any, curr) => {
            // Usar cidade_origem que é do cliente/emitente, não cidade_destino que é da filial
            const municipio = curr.cidade_origem || 'N/A';
            acc[municipio] = (acc[municipio] || 0) + (Number(curr.valor_total_nota) || 0);
            return acc;
        }, {});
        
        const municipioChart = Object.entries(municipioMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 6);
        console.log('📍 Município Chart:', municipioChart);
        setMunicipioData(municipioChart);
        
        // Gráficos de Notas Lançadas e Canceladas removidos - não são mais usados
        
        // Produtos Críticos removido - não é mais usado
        
        // 8. Clientes com maior reincidência (ANULADA/CANCELADA) - com detalhes
        const clientesReincidenciaMap: Record<string, { count: number, detalhes: Array<{ cliente: string, nota: string }> }> = {};
        devolucoes
            .filter(d => d.resultado === 'ANULADA/CANCELADA')
            .forEach((curr) => {
                const cliente = curr.nome_cliente || 'Desconhecido';
                if (!clientesReincidenciaMap[cliente]) {
                    clientesReincidenciaMap[cliente] = { count: 0, detalhes: [] };
                }
                clientesReincidenciaMap[cliente].count += 1;
                clientesReincidenciaMap[cliente].detalhes.push({
                    cliente: cliente,
                    nota: curr.numero || '-'
                });
            });
        
        const clientesReincidenciaList = Object.entries(clientesReincidenciaMap)
            .map(([name, data]) => ({ 
                name, 
                count: data.count,
                quantidade: data.detalhes.length,
                detalhes: data.detalhes
            }))
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 5);
        setClientesReincidencia(clientesReincidenciaList);
        
        // 9. Motivos mais recorrentes por rede - com detalhes
        const motivosPorRedeMap: Record<string, Record<string, { count: number, detalhes: Array<{ cliente: string, nota: string }> }>> = {};
        devolucoes.forEach((curr) => {
            const rede = curr.rede || 'Sem rede';
            const motivoNome = curr.motivos_devolucao?.nome;
            
            // Ignorar motivos nulos ou "Não informado"
            if (!motivoNome || motivoNome === 'Não informado' || motivoNome === 'não informado' || motivoNome === 'NÃO INFORMADO') {
                return;
            }
            
            if (!motivosPorRedeMap[rede]) {
                motivosPorRedeMap[rede] = {};
            }
            if (!motivosPorRedeMap[rede][motivoNome]) {
                motivosPorRedeMap[rede][motivoNome] = { count: 0, detalhes: [] };
            }
            motivosPorRedeMap[rede][motivoNome].count += 1;
            motivosPorRedeMap[rede][motivoNome].detalhes.push({
                cliente: curr.nome_cliente || 'Desconhecido',
                nota: curr.numero || '-'
            });
        });
        
        // Transformar em array para gráfico (top 5 redes com seus motivos mais recorrentes)
        const motivosPorRedeList: any[] = [];
        Object.entries(motivosPorRedeMap)
            .sort((a, b) => {
                const totalA = Object.values(a[1]).reduce((sum: number, val: any) => sum + val.count, 0);
                const totalB = Object.values(b[1]).reduce((sum: number, val: any) => sum + val.count, 0);
                return totalB - totalA;
            })
            .slice(0, 5)
            .forEach(([rede, motivos]) => {
                const motivoMaisRecorrente = Object.entries(motivos)
                    .sort((a: any, b: any) => b[1].count - a[1].count)[0];
                if (motivoMaisRecorrente) {
                    motivosPorRedeList.push({
                        rede: rede.length > 15 ? rede.substring(0, 15) + '...' : rede,
                        motivo: motivoMaisRecorrente[0].length > 20 ? motivoMaisRecorrente[0].substring(0, 20) + '...' : motivoMaisRecorrente[0],
                        count: motivoMaisRecorrente[1].count,
                        quantidade: motivoMaisRecorrente[1].detalhes.length,
                        detalhes: motivoMaisRecorrente[1].detalhes
                    });
                }
            });
        setMotivosPorRede(motivosPorRedeList);
        
        // Insights automáticos - Expandido (movido para depois de calcular todos os dados)
        const insightsList: string[] = [];
        
        // Insight básico sempre presente
        if (totalReturns > 0) {
            insightsList.push(`📊 Total de ${totalReturns} devolução(ões) no período selecionado, totalizando R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`);
        }
        
        // Insight 1: Cliente concentrado
        if (topCust.length > 0 && totalValue > 0) {
            const top1Percent = ((topCust[0].value as number) / totalValue) * 100;
            if (top1Percent > 20) {
                insightsList.push(`⚠️ Cliente "${topCust[0].name}" concentra ${top1Percent.toFixed(1)}% do valor total de devoluções.`);
            }
        }
        
        // Insight 2: Média de produtos
        if (totalProducts > 0 && totalReturns > 0) {
            const avgProductsPerReturn = totalProducts / totalReturns;
            insightsList.push(`📦 Média de ${avgProductsPerReturn.toFixed(1)} produtos por devolução.`);
        }
        
        // Insight 3: Vendedor líder
        if (topVend.length > 0) {
            insightsList.push(`👤 Vendedor "${topVend[0].name}" lidera em devoluções com R$ ${(topVend[0].value as number).toLocaleString('pt-BR')}.`);
        }
        
        // Insight 4: Regra 80/20
        if (pareto.length > 0) {
            const pareto80Index = pareto.findIndex(p => p.percentage >= 80);
            if (pareto80Index >= 0 && pareto80Index < 5) {
                insightsList.push(`📊 Regra 80/20: ${pareto80Index + 1} clientes concentram 80% do valor de devoluções.`);
            }
        }
        
        // Insight 5: Produto mais devolvido - removido (produtos críticos não são mais usados)
        
        // Insight 6: Taxa de cancelamento
        const cancelamentoCount = devolucoes.filter(d => d.resultado === 'ANULADA/CANCELADA').length;
        const taxaCancelamento = totalReturns > 0 ? (cancelamentoCount / totalReturns) * 100 : 0;
        if (taxaCancelamento > 10) {
            insightsList.push(`🚨 Taxa de cancelamento alta: ${taxaCancelamento.toFixed(1)}% das devoluções estão em cancelamento.`);
        } else if (cancelamentoCount > 0) {
            insightsList.push(`ℹ️ ${cancelamentoCount} devolução(ões) em processo de cancelamento.`);
        }
        
        // Insight 7: Motivo mais comum - removido (gráfico de motivos não é mais usado)
        
        // Insight 8: Comparação de ticket médio
        if (avgTicket > 0) {
            const ticketAlto = devolucoes.filter(d => Number(d.valor_total_nota) > avgTicket * 1.5).length;
            if (ticketAlto > 0) {
                insightsList.push(`💰 ${ticketAlto} devolução(ões) com valor acima de 150% do ticket médio.`);
            }
        }
        
        // Insight 9: Rede mais problemática
        if (topRed.length > 0 && totalValue > 0) {
            const redePercent = ((topRed[0].value as number) / totalValue) * 100;
            if (redePercent > 15) {
                insightsList.push(`🏪 Rede "${topRed[0].name}" representa ${redePercent.toFixed(1)}% do valor devolvido.`);
            }
        }
        
        // Insight 10: Tendência temporal
        if (chart.length >= 2) {
            const ultimoValor = chart[chart.length - 1].value;
            const penultimoValor = chart[chart.length - 2].value;
            if (penultimoValor > 0) {
                const variacao = ((ultimoValor - penultimoValor) / penultimoValor) * 100;
                if (Math.abs(variacao) > 20) {
                    const tendencia = variacao > 0 ? 'aumento' : 'redução';
                    insightsList.push(`📈 ${tendencia.charAt(0).toUpperCase() + tendencia.slice(1)} de ${Math.abs(variacao).toFixed(1)}% no valor devolvido comparado ao período anterior.`);
                }
            }
        }
        
        console.log('💡 Insights:', insightsList);
        setInsights(insightsList);
        
        // Alertas automáticos - Recriados conforme solicitado
        const alertsList: any[] = [];
        
        // 1. Notas em atraso (prazo = 'EM ATRASO')
        const notasAtraso = devolucoes.filter(d => d.prazo === 'EM ATRASO');
        if (notasAtraso.length > 0) {
            const valorTotal = notasAtraso.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
            alertsList.push({
                type: 'warning',
                message: `${notasAtraso.length} nota(s) em atraso`,
                count: notasAtraso.length,
                total: notasAtraso.length,
                value: valorTotal
            });
        }
        
        // 2. Quantidade de notas quando acima de 50
        if (totalReturns > 50) {
            alertsList.push({
                type: 'info',
                message: `Total de ${totalReturns} notas no período (acima de 50)`,
                count: totalReturns,
                total: totalReturns
            });
        }
        
        // 3. Notas lançadas quando acima de 20
        if (notasLancadas.length > 20) {
            const valorTotal = notasLancadas.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
            alertsList.push({
                type: 'info',
                message: `${notasLancadas.length} nota(s) lançadas (acima de 20)`,
                count: notasLancadas.length,
                total: notasLancadas.length,
                value: valorTotal
            });
        }
        
        // 4. Notas com valores acima de 1000
        const notasValorAlto = devolucoes.filter(d => Number(d.valor_total_nota) > 1000);
        if (notasValorAlto.length > 0) {
            const valorTotal = notasValorAlto.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
            alertsList.push({
                type: 'warning',
                message: `${notasValorAlto.length} nota(s) com valor acima de R$ 1.000,00`,
                count: notasValorAlto.length,
                total: notasValorAlto.length,
                value: valorTotal
            });
        }
        
        // 5. Clientes com mais de 5 notas lançadas
        const clientesLancados: Record<string, any[]> = {};
        notasLancadas.forEach(devol => {
            const cliente = devol.nome_cliente || 'Desconhecido';
            if (!clientesLancados[cliente]) {
                clientesLancados[cliente] = [];
            }
            clientesLancados[cliente].push(devol);
        });
        
        Object.entries(clientesLancados).forEach(([cliente, notas]) => {
            if (notas.length > 5) {
                const valorTotal = notas.reduce((sum: number, d: any) => sum + (Number(d.valor_total_nota) || 0), 0);
                alertsList.push({
                    type: 'info',
                    message: `Cliente "${cliente}" tem ${notas.length} notas lançadas`,
                    cliente: cliente,
                    count: notas.length,
                    total: notas.length,
                    value: valorTotal
                });
            }
        });
        
        // 6. Notas anuladas/canceladas
        const notasAnuladas = devolucoes.filter(d => d.resultado === 'ANULADA/CANCELADA');
        if (notasAnuladas.length > 0) {
            const valorTotal = notasAnuladas.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
            alertsList.push({
                type: 'warning',
                message: `${notasAnuladas.length} nota(s) anuladas/canceladas`,
                detalhes: notasAnuladas.map(n => `NF ${n.numero} - ${n.nome_cliente || 'Sem cliente'} - R$ ${(Number(n.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`),
                count: notasAnuladas.length,
                total: notasAnuladas.length,
                value: valorTotal
            });
        }
        
        // Alertas removidos - não são mais usados
        
        // Calcular Devoluções Por Motivo (valor total e quantidade de notas) - APENAS LANÇADA
        const motivoMap: Record<string, { valorTotal: number, quantidade: number }> = {};
        devolucoes
            .filter(d => d.resultado === 'LANÇADA')
            .forEach((curr) => {
                const motivoNome = curr.motivos_devolucao?.nome || 'Sem motivo';
                const valor = Number(curr.valor_total_nota) || 0;
                if (!motivoMap[motivoNome]) {
                    motivoMap[motivoNome] = { valorTotal: 0, quantidade: 0 };
                }
                motivoMap[motivoNome].valorTotal += valor;
                motivoMap[motivoNome].quantidade += 1;
            });
        
        const motivoChart = Object.entries(motivoMap)
            .map(([name, data]) => ({
                name,
                valorTotal: data.valorTotal,
                quantidade: data.quantidade
            }))
            .sort((a, b) => b.valorTotal - a.valorTotal);
        setDevolucoesPorMotivo(motivoChart);
        
        // Calcular Devoluções Por Setor (valor total e quantidade de notas) - APENAS LANÇADA
        // O setor vem do motivo: motivos_devolucao.setores.nome
        const setorMap: Record<string, { valorTotal: number, quantidade: number }> = {};
        devolucoes
            .filter(d => d.resultado === 'LANÇADA')
            .forEach((curr) => {
                // Buscar setor do motivo (motivos_devolucao.setores.nome)
                const setorNome = curr.motivos_devolucao?.setores?.nome || curr.setores?.nome || 'Sem setor';
                const valor = Number(curr.valor_total_nota) || 0;
                if (!setorMap[setorNome]) {
                    setorMap[setorNome] = { valorTotal: 0, quantidade: 0 };
                }
                setorMap[setorNome].valorTotal += valor;
                setorMap[setorNome].quantidade += 1;
            });
        
        const setorChart = Object.entries(setorMap)
            .map(([name, data]) => ({
                name,
                valorTotal: data.valorTotal,
                quantidade: data.quantidade
            }))
            .sort((a, b) => b.valorTotal - a.valorTotal);
        setDevolucoesPorSetor(setorChart);
        
        // Calcular Top 20 Produtos mais devolvidos (quantidade soma geral)
        const produtosMap: Record<string, { quantidadeKG: number, quantidadeCX: number, descricao: string }> = {};
        devolucoes.forEach((devol) => {
            const itens = devol.itens || [];
            itens.forEach((item: any) => {
                const produto = item.descricao || 'Desconhecido';
                const quantidade = Number(item.quantidade) || 0;
                const unidade = (item.unidade || '').toUpperCase().trim();
                
                if (!produtosMap[produto]) {
                    produtosMap[produto] = { quantidadeKG: 0, quantidadeCX: 0, descricao: produto };
                }
                
                // Normalizar unidades
                if (['KG', 'KG1', 'KGS'].includes(unidade)) {
                    produtosMap[produto].quantidadeKG += quantidade;
                } else if (['CX', 'CX1', 'CXI', 'CX10', 'CXS', 'FD'].includes(unidade)) {
                    produtosMap[produto].quantidadeCX += quantidade;
                }
            });
        });
        
        const produtosList = Object.entries(produtosMap)
            .map(([name, data]) => ({
                name: name.length > 30 ? name.substring(0, 30) + '...' : name,
                nameFull: name,
                quantidadeKG: data.quantidadeKG,
                quantidadeCX: data.quantidadeCX,
                quantidade: filtroUnidadeProdutos === 'KG' ? data.quantidadeKG : data.quantidadeCX
            }))
            .filter(p => p.quantidade > 0)
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 20);
        setTop20Produtos(produtosList);
      }
    } catch (error: any) {
      console.error('❌ Erro ao processar dados do Dashboard Lançadas:', error);
      toast.error('Erro ao processar dados: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  // Componente removido - Velocímetro não é mais usado

  // Componente removido - AlertCard não é mais usado

  // Componente CustomTooltip para os gráficos
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    // Suportar diferentes formatos: quantidade, count, ou value
    const quantidade = data.quantidade || data.count || data.value || 0;
    const detalhes = data.detalhes || [];
    
    // Se não houver detalhes mas houver valor, mostrar apenas o valor
    const temDetalhes = detalhes && detalhes.length > 0;

    return (
      <div className="bg-card border border-border rounded-md p-3 shadow-md">
        {/* Título */}
        <p className="text-sm font-bold text-foreground mb-1">
          Detalhes
        </p>

        {/* Quantidade/Valor */}
        {data.value && typeof data.value === 'number' && data.value > 1000 ? (
          <p className="text-sm font-bold text-primary">
            R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        ) : (
          <p className="text-sm font-bold text-primary">
            {quantidade} {data.count !== undefined ? 'nota(s)' : data.value !== undefined ? 'ocorrência(s)' : 'item(s)'}
          </p>
        )}

        {/* Lista de detalhes */}
        {temDetalhes && (
          <div className="mt-2 space-y-1 max-h-[200px] overflow-y-auto">
            {detalhes.map((d: any, index: number) => (
              <p key={index} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {d.cliente}
                </span>
                <span className="mx-1">—</span>
                <span className="text-primary">
                  NF: {d.nota}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Função para gerar relatório HTML do Dashboard
  const handlePrintDashboard = () => {
    const periodoText = filters.startDate && filters.endDate 
      ? `${format(filters.startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(filters.endDate, 'dd/MM/yyyy', { locale: ptBR })}`
      : filters.period || 'Todos os períodos';

    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Lançadas - Relatório</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    @page {
      size: A4 landscape;
      margin: 10mm;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: white;
      padding: 20px;
      color: #333;
      font-size: 10px;
    }
    
    .header {
      background: linear-gradient(135deg, #073e29 0%, #0a4d33 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 24px;
      margin-bottom: 5px;
    }
    
    .header p {
      font-size: 12px;
      opacity: 0.9;
    }
    
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .kpi-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background: #f9fafb;
    }
    
    .kpi-title {
      font-size: 9px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .kpi-value {
      font-size: 18px;
      font-weight: bold;
      color: #073e29;
    }
    
    .kpi-desc {
      font-size: 8px;
      color: #999;
      margin-top: 5px;
    }
    
    .chart-section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .chart-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #073e29;
      border-bottom: 2px solid #073e29;
      padding-bottom: 5px;
    }
    
    .chart-container {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background: white;
      min-height: 200px;
    }
    
    .insights-section {
      margin-top: 20px;
      padding: 15px;
      background: #f0f9ff;
      border-left: 4px solid #073e29;
      border-radius: 4px;
    }
    
    .insights-title {
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #073e29;
    }
    
    .insight-item {
      font-size: 10px;
      margin-bottom: 5px;
      padding-left: 10px;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 9px;
    }
    
    .table th, .table td {
      border: 1px solid #ddd;
      padding: 6px;
      text-align: left;
    }
    
    .table th {
      background: #073e29;
      color: white;
      font-weight: bold;
    }
    
    .table tr:nth-child(even) {
      background: #f9fafb;
    }
    
    .municipio-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 10px;
    }
    
    .municipio-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    
    .municipio-name {
      font-weight: 500;
    }
    
    .municipio-percent {
      color: #666;
      font-size: 9px;
    }
    
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
    <button onclick="window.print()" style="background: #073e29; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
      🖨️ Imprimir
    </button>
  </div>
  
  <div class="header">
    <h1>Dashboard Lançadas</h1>
    <p>Relatório Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} | Período: ${periodoText}</p>
  </div>
  
  <!-- KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-title">Valor Total Devolvido</div>
      <div class="kpi-value">R$ ${stats.valorTotalLancado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div class="kpi-desc">Resultado: LANÇADA</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Notas Lançadas</div>
      <div class="kpi-value">${stats.notasLancadas}</div>
      <div class="kpi-desc">Resultado: LANÇADA</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Valor Total Cancelado</div>
      <div class="kpi-value">R$ ${stats.valorTotalCancelado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div class="kpi-desc">Resultado: ANULADA/CANCELADA</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Notas Canceladas</div>
      <div class="kpi-value">${stats.notasCanceladas}</div>
      <div class="kpi-desc">Resultado: ANULADA/CANCELADA</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Produtos Devolvidos</div>
      <div class="kpi-value">${stats.totalProducts.toFixed(2)}</div>
      <div class="kpi-desc">Quantidade total</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Ticket Médio</div>
      <div class="kpi-value">R$ ${stats.avgTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
    </div>
  </div>
  
  <!-- Gráfico: Devoluções Por Motivo -->
  ${devolucoesPorMotivo.length > 0 ? `
  <div class="chart-section">
    <div class="chart-title">Devoluções Por Motivo (Apenas LANÇADA)</div>
    <div class="chart-container">
      <table class="table">
        <thead>
          <tr>
            <th>Motivo</th>
            <th>Valor Total</th>
            <th>Quantidade de Notas</th>
          </tr>
        </thead>
        <tbody>
          ${devolucoesPorMotivo.map((item: any) => `
            <tr>
              <td>${item.name}</td>
              <td>R$ ${item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${item.quantidade}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  ` : ''}
  
  <!-- Gráfico: Devoluções Por Setores -->
  ${devolucoesPorSetor.length > 0 ? `
  <div class="chart-section">
    <div class="chart-title">Devoluções Por Setores (Apenas LANÇADA)</div>
    <div class="chart-container">
      <table class="table">
        <thead>
          <tr>
            <th>Setor</th>
            <th>Valor Total</th>
            <th>Quantidade de Notas</th>
          </tr>
        </thead>
        <tbody>
          ${devolucoesPorSetor.map((item: any) => `
            <tr>
              <td>${item.name}</td>
              <td>R$ ${item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${item.quantidade}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  ` : ''}
  
  <!-- Top 20 Produtos -->
  ${top20Produtos.length > 0 ? `
  <div class="chart-section">
    <div class="chart-title">Top 20 Produtos mais devolvidos (${filtroUnidadeProdutos})</div>
    <div class="chart-container">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Produto</th>
            <th>Quantidade (${filtroUnidadeProdutos})</th>
          </tr>
        </thead>
        <tbody>
          ${top20Produtos.map((item: any, index: number) => `
            <tr>
              <td>${index + 1}º</td>
              <td>${item.nameFull || item.name}</td>
              <td>${item.quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  ` : ''}
  
  <!-- Distribuição por Município -->
  ${municipioData.length > 0 ? `
  <div class="chart-section">
    <div class="chart-title">Distribuição por Município</div>
    <div class="chart-container">
      <div class="municipio-grid">
        <div>
          ${municipioData.slice(0, 10).map((municipio: any) => `
            <div class="municipio-item">
              <span class="municipio-name">${municipio.name}</span>
              <span class="municipio-percent">${((municipio.value / (stats.totalValue || 1)) * 100).toFixed(0)}%</span>
            </div>
          `).join('')}
        </div>
        <div>
          ${municipioData.slice(10, 20).map((municipio: any) => `
            <div class="municipio-item">
              <span class="municipio-name">${municipio.name}</span>
              <span class="municipio-percent">${((municipio.value / (stats.totalValue || 1)) * 100).toFixed(0)}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>
  ` : ''}
  
  <!-- Insights -->
  ${insights.length > 0 ? `
  <div class="insights-section">
    <div class="insights-title">Insights Automáticos</div>
    ${insights.map((insight: string) => `
      <div class="insight-item">${insight}</div>
    `).join('')}
  </div>
  ` : ''}
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #073e29; text-align: center; font-size: 9px; color: #666;">
    <p>Relatório gerado automaticamente pelo Sistema de Devoluções - Grupo Doce Mel</p>
    <p>Data de geração: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}</p>
  </div>
</body>
</html>
    `;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  // CustomTooltip para gráficos de Motivo, Setores e Produtos (mostra valor e quantidade)
  const CustomTooltipDetalhado = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    const valorTotal = data.valorTotal || 0;
    const quantidade = data.quantidade || data.count || 0;
    const name = data.name || data.nameFull || '';
    // Para produtos, usar nameFull se disponível, senão name
    const displayName = data.nameFull || name;
    // Para produtos, usar filtroUnidadeProdutos, senão 'nota(s)'
    const unidade = data.nameFull ? filtroUnidadeProdutos : (data.unidade || 'nota(s)');

    return (
      <div className="bg-card border border-border rounded-md p-3 shadow-md">
        <p className="text-sm font-bold text-foreground mb-2">
          {displayName}
        </p>
        <div className="space-y-1">
          {valorTotal > 0 && (
            <p className="text-sm font-bold text-primary">
              Valor Total: R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
          {quantidade > 0 && (
            <p className="text-sm text-muted-foreground">
              {valorTotal > 0 ? 'Quantidade: ' : ''}{quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {unidade}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Lançadas" 
        description="Visão geral das devoluções lançadas (Lançadas e Anuladas/Canceladas) com KPIs, gráficos e insights automáticos para análise estratégica."
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <FilterBar />
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={fetchDashboardData} className="w-full md:w-auto shrink-0">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintDashboard} className="w-full md:w-auto shrink-0">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Dashboard
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <KPICard 
          title="Valor Total Devolvido" 
          value={`R$ ${stats.valorTotalLancado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          description="Resultado: LANÇADA"
        />
        <KPICard 
          title="Notas Lançadas" 
          value={stats.notasLancadas}
          icon={RefreshCcw}
          description="Resultado: LANÇADA"
        />
        <KPICard 
          title="Valor Total Cancelado" 
          value={`R$ ${stats.valorTotalCancelado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          description="Resultado: ANULADA/CANCELADA"
        />
        <KPICard 
          title="Notas Canceladas" 
          value={stats.notasCanceladas}
          icon={XCircle}
          description="Resultado: ANULADA/CANCELADA"
        />
        <KPICard 
          title="Produtos Devolvidos" 
          value={stats.totalProducts.toFixed(2)}
          icon={PackageX}
          description="Quantidade total"
        />
        <KPICard 
          title="Ticket Médio" 
          value={`R$ ${stats.avgTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Evolução no Tempo</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="name" 
                  height={60}
                  tick={<CustomXAxisTick />}
                />
                <YAxis className="text-[6px] font-size-6px font-bold" tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        fontSize: '11px',
                        fontWeight: 'bold'
                    }}
                    formatter={(value: any, name: string | undefined) => {
                        if (name === 'value') {
                            return [`R$ ${(value || 0).toFixed(2)}`, 'Valor Total'];
                        }
                        if (name === 'count') {
                            return [`${value || 0}`, 'Qtd de Notas'];
                        }
                        return [value, name || ''];
                    }}
                    labelFormatter={(label) => `Data: ${label}`}
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={CHART_COLORS[0]} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                />
                <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke={CHART_COLORS[1]} 
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS[1], r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Top Clientes (Valor)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topCustomers}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="name" 
                  height={60}
                  tick={<CustomXAxisTick />}
                />
                <YAxis className="text-[6px] font-bold" tickFormatter={(value) => `R$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]}>
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    content={({ value }: any) => (
                      <text 
                        x={0} 
                        y={0} 
                        dy={-5} 
                        fill={isDark ? '#d2f8f7' : '#17432a'} 
                        fontSize={10} 
                        fontWeight="bold" 
                        textAnchor="middle"
                      >
                        {`R$ ${(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                      </text>
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos de Colunas - Vendedores e Redes */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Vendedores (Valor)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topVendedores}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="name" 
                  height={60}
                  tick={<CustomXAxisTick />}
                />
                <YAxis className="text-[10px] font-bold" tickFormatter={(value) => `R$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={CHART_COLORS[1]} radius={[8, 8, 0, 0]}>
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    content={({ value }: any) => (
                      <text 
                        x={0} 
                        y={0} 
                        dy={-5} 
                        fill={isDark ? '#d2f8f7' : '#17432a'} 
                        fontSize={10} 
                        fontWeight="bold" 
                        textAnchor="middle"
                      >
                        {`R$ ${(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                      </text>
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Redes (Valor)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topRedes}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="name" 
                  height={60}
                  tick={<CustomXAxisTick />}
                />
                <YAxis className="text-[10px] font-bold" tickFormatter={(value) => `R$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={CHART_COLORS[2]} radius={[8, 8, 0, 0]}>
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    content={({ value }: any) => (
                      <text 
                        x={0} 
                        y={0} 
                        dy={-5} 
                        fill={isDark ? '#d2f8f7' : '#17432a'} 
                        fontSize={10} 
                        fontWeight="bold" 
                        textAnchor="middle"
                      >
                        {`R$ ${(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                      </text>
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Novos Gráficos: Clientes com Reincidência e Motivos por Rede */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Clientes com Reincidência</CardTitle>
            <CardDescription>Clientes com mais notas ANULADAS/CANCELADAS</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientesReincidencia}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="name" 
                  height={60}
                  tick={<CustomXAxisTick />}
                />
                <YAxis className="text-[10px] font-bold" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill={CHART_COLORS[3]} radius={[8, 8, 0, 0]}>
                  <LabelList 
                    dataKey="count" 
                    position="top" 
                    content={({ value }: any) => (
                      <text 
                        x={0} 
                        y={0} 
                        dy={-5} 
                        fill={isDark ? '#d2f8f7' : '#17432a'} 
                        fontSize={10} 
                        fontWeight="bold" 
                        textAnchor="middle"
                      >
                        {`${value || 0}`}
                      </text>
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Motivos Mais Recorrentes por Rede</CardTitle>
            <CardDescription>Principais motivos de devolução por rede (Top 5 redes)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={motivosPorRede} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis type="number" className="text-[10px] font-bold" />
                <YAxis 
                  type="category" 
                  dataKey="rede" 
                  width={100}
                  tick={<CustomXAxisTick />}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill={CHART_COLORS[4]} radius={[0, 8, 8, 0]}>
                  <LabelList 
                    dataKey="count" 
                    position="right" 
                    content={({ value }: any) => (
                      <text 
                        x={0} 
                        y={0} 
                        dx={5} 
                        fill={isDark ? '#d2f8f7' : '#17432a'} 
                        fontSize={10} 
                        fontWeight="bold" 
                        textAnchor="start"
                      >
                        {`${value || 0}`}
                      </text>
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráfico de Pareto e Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Análise de Pareto (80/20)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={paretoData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="name" 
                  height={60}
                  tick={<CustomXAxisTick />}
                />
                <YAxis yAxisId="left" className="text-[10px] font-bold" tickFormatter={(value) => `R$${value}`} />
                <YAxis yAxisId="right" orientation="right" className="text-[10px] font-bold" tickFormatter={(value) => `${value}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="value" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]}>
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    content={({ value }: any) => (
                      <text 
                        x={0} 
                        y={0} 
                        dy={-5} 
                        fill={isDark ? '#d2f8f7' : '#17432a'} 
                        fontSize={10} 
                        fontWeight="bold" 
                        textAnchor="middle"
                      >
                        {`R$ ${(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                      </text>
                    )}
                  />
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="percentage" stroke={CHART_COLORS[3]} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-4 text-xs text-muted-foreground">
              Linha mostra o percentual acumulado. A regra 80/20 indica que poucos clientes concentram a maioria do valor.
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Insights Automáticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.length > 0 ? (
                insights.map((insight, idx) => (
                  <div key={idx} className="p-3 bg-muted/50 rounded-lg text-sm">
                    {insight}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum insight disponível no momento.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      

      {/* Gráficos de Devoluções Por Motivo e Por Setores */}
  <div className="grid gap-4 md:grid-cols-2">
        {/* Gráfico de Devoluções Por Motivo */}
    <Card>
      <CardHeader>
            <CardTitle>Devoluções Por Motivo</CardTitle>
            <CardDescription>Valor total e quantidade de notas por motivo</CardDescription>
      </CardHeader>
      <CardContent>
            {devolucoesPorMotivo.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
                <BarChart data={devolucoesPorMotivo}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis
                dataKey="name"
                height={60}
                tick={<CustomXAxisTick />}
              />
                  <YAxis className="text-[10px] font-bold" tickFormatter={(value) => `R$${value}`} />
                  <Tooltip content={<CustomTooltipDetalhado />} />
                  <Bar dataKey="valorTotal" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]}>
                <LabelList
                      dataKey="valorTotal" 
                      position="top" 
                      content={({ value }: any) => (
                        <text 
                          x={0} 
                          y={0} 
                          dy={-5} 
                          fill={isDark ? '#d2f8f7' : '#17432a'} 
                          fontSize={9} 
                  fontWeight="bold"
                          textAnchor="middle"
                        >
                          {`R$ ${(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                        </text>
                      )}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-center p-4">
                <PackageX className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">Nenhum dado disponível.</p>
          </div>
        )}
      </CardContent>
    </Card>

        {/* Gráfico de Devoluções Por Setores */}
    <Card>
            <CardHeader>
            <CardTitle>Devoluções Por Setores</CardTitle>
            <CardDescription>Valor total e quantidade de notas por setor</CardDescription>
            </CardHeader>
            <CardContent>
            {devolucoesPorSetor.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={devolucoesPorSetor}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis 
                      dataKey="name" 
                      height={60}
                      tick={<CustomXAxisTick />}
                    />
                  <YAxis className="text-[10px] font-bold" tickFormatter={(value) => `R$${value}`} />
                  <Tooltip content={<CustomTooltipDetalhado />} />
                  <Bar dataKey="valorTotal" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]}>
                    <LabelList 
                      dataKey="valorTotal" 
                      position="top" 
                      content={({ value }: any) => (
                        <text 
                          x={0} 
                          y={0} 
                          dy={-5} 
                          fill={isDark ? '#d2f8f7' : '#17432a'} 
                          fontSize={9} 
                          fontWeight="bold" 
                          textAnchor="middle"
                        >
                          {`R$ ${(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                        </text>
                      )}
                    />
                  </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-center p-4">
                <PackageX className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">Nenhum dado disponível.</p>
                </div>
              )}
            </CardContent>
          </Card>
      </div>

      {/* Geo Distribution - Alterado para Município */}
      <Card>
          <CardHeader>
              <CardTitle className="text-base">Distribuição por Município</CardTitle>
          </CardHeader>
          <CardContent>
              {municipioData.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6">
                      {/* Primeira coluna - até 10 municípios */}
                      <div className="space-y-4">
                          {municipioData.slice(0, 10).map((municipio, i) => (
                              <div key={i} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium truncate max-w-[120px]" title={municipio.name}>{municipio.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <div className="h-2 bg-muted rounded-full w-24 overflow-hidden">
                                          <div 
                                            className="h-full bg-primary" 
                                            style={{ width: `${(municipio.value / (stats.totalValue || 1)) * 100}%` }}
                                          />
                                      </div>
                                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                                          {((municipio.value / (stats.totalValue || 1)) * 100).toFixed(0)}%
                                      </span>
                                  </div>
                              </div>
                          ))}
                      </div>
                      {/* Segunda coluna - próximos 10 municípios */}
                      <div className="space-y-4">
                          {municipioData.slice(10, 20).map((municipio, i) => (
                              <div key={i + 10} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium truncate max-w-[120px]" title={municipio.name}>{municipio.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <div className="h-2 bg-muted rounded-full w-24 overflow-hidden">
                                          <div 
                                            className="h-full bg-primary" 
                                            style={{ width: `${(municipio.value / (stats.totalValue || 1)) * 100}%` }}
                                          />
                                      </div>
                                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                                          {((municipio.value / (stats.totalValue || 1)) * 100).toFixed(0)}%
                                      </span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              ) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                      Nenhum dado disponível
                  </div>
              )}
          </CardContent>
      </Card>

      {/* Top 20 Produtos mais devolvidos */}
      <Card className="col-span-4">
              <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top 20 Produtos mais devolvidos</CardTitle>
            <Select value={filtroUnidadeProdutos} onValueChange={(value: 'KG' | 'CX') => setFiltroUnidadeProdutos(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KG">KG</SelectItem>
                <SelectItem value="CX">CX</SelectItem>
              </SelectContent>
            </Select>
                                              </div>
        </CardHeader>
        <CardContent className="pl-2">
          {top20Produtos.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={top20Produtos}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="name" 
                  height={80}
                  tick={<CustomXAxisTick />}
                />
                <YAxis className="text-[10px] font-bold" />
                <Tooltip content={<CustomTooltipDetalhado />} />
                <Bar dataKey="quantidade" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]}>
                  <LabelList 
                    dataKey="quantidade" 
                    position="top" 
                    content={({ value }: any) => (
                      <text 
                        x={0} 
                        y={0} 
                        dy={-5} 
                        fill={isDark ? '#d2f8f7' : '#17432a'} 
                        fontSize={10} 
                        fontWeight="bold" 
                        textAnchor="middle"
                      >
                        {`${(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${filtroUnidadeProdutos}`}
                      </text>
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground text-center p-4">
                          <PackageX className="h-10 w-10 mb-2 opacity-20" />
                          <p className="text-sm">Nenhum produto encontrado para o período selecionado.</p>
                      </div>
                  )}
              </CardContent>
          </Card>
    </div>
  );
}
