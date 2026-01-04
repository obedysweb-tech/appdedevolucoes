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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Percent } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const [valorVendas, setValorVendas] = useState<string>('');
  const [motivosPorProduto, setMotivosPorProduto] = useState<any[]>([]);
  const [motivosPorVendedor, setMotivosPorVendedor] = useState<any[]>([]);
  const [motivosPorSetorTabela, setMotivosPorSetorTabela] = useState<any[]>([]);
  const [motivosPorCliente, setMotivosPorCliente] = useState<any[]>([]);

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
        setMotivosPorProduto([]);
        setMotivosPorVendedor([]);
        setMotivosPorSetorTabela([]);
        setMotivosPorCliente([]);
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
        
        // Calcular tabelas - APENAS LANÇADA
        const devolucoesLancadas = devolucoes.filter(d => d.resultado === 'LANÇADA');
        
        // 1. Motivos por Produto: 5 produtos mais devolvidos do top 10 maiores motivos
        const top10Motivos = Object.entries(motivoMap)
            .sort((a, b) => b[1].valorTotal - a[1].valorTotal)
            .slice(0, 10)
            .map(([name]) => name);
        
        const motivosPorProdutoMap: Record<string, Record<string, { quantidade: number, valorTotal: number }>> = {};
        devolucoesLancadas.forEach((devol) => {
            const motivoNome = devol.motivos_devolucao?.nome || 'Sem motivo';
            if (!top10Motivos.includes(motivoNome)) return;
            
            const itens = devol.itens || [];
            itens.forEach((item: any) => {
                const produto = item.descricao || 'Desconhecido';
                if (!motivosPorProdutoMap[produto]) {
                    motivosPorProdutoMap[produto] = {};
                }
                if (!motivosPorProdutoMap[produto][motivoNome]) {
                    motivosPorProdutoMap[produto][motivoNome] = { quantidade: 0, valorTotal: 0 };
                }
                motivosPorProdutoMap[produto][motivoNome].quantidade += (Number(item.quantidade) || 0);
                motivosPorProdutoMap[produto][motivoNome].valorTotal += (Number(item.valor_total_bruto) || 0);
            });
        });
        
        // Top 5 produtos mais devolvidos
        const top5Produtos = Object.entries(produtosMap)
            .map(([name, data]) => ({
                name,
                quantidadeTotal: filtroUnidadeProdutos === 'KG' ? data.quantidadeKG : data.quantidadeCX
            }))
            .sort((a, b) => b.quantidadeTotal - a.quantidadeTotal)
            .slice(0, 5)
            .map(p => p.name);
        
        const motivosPorProdutoList: any[] = [];
        top5Produtos.forEach(produto => {
            if (motivosPorProdutoMap[produto]) {
                const motivos = Object.entries(motivosPorProdutoMap[produto])
                    .map(([motivo, data]: [string, any]) => ({
                        produto,
                        motivo,
                        quantidade: data.quantidade,
                        valorTotal: data.valorTotal
                    }))
                    .sort((a, b) => b.quantidade - a.quantidade)
                    .slice(0, 5);
                motivosPorProdutoList.push(...motivos);
            }
        });
        setMotivosPorProduto(motivosPorProdutoList);
        
        // 2. Motivos por Vendedor: 5 motivos mais devolvidos por vendedor
        const motivosPorVendedorMap: Record<string, Record<string, { quantidade: number, valorTotal: number }>> = {};
        devolucoesLancadas.forEach((devol) => {
            const vendedor = devol.vendedor || 'Desconhecido';
            const motivoNome = devol.motivos_devolucao?.nome || 'Sem motivo';
            
            if (!motivosPorVendedorMap[vendedor]) {
                motivosPorVendedorMap[vendedor] = {};
            }
            if (!motivosPorVendedorMap[vendedor][motivoNome]) {
                motivosPorVendedorMap[vendedor][motivoNome] = { quantidade: 0, valorTotal: 0 };
            }
            motivosPorVendedorMap[vendedor][motivoNome].quantidade += 1;
            motivosPorVendedorMap[vendedor][motivoNome].valorTotal += (Number(devol.valor_total_nota) || 0);
        });
        
        const motivosPorVendedorList: any[] = [];
        Object.entries(motivosPorVendedorMap).forEach(([vendedor, motivos]) => {
            const top5Motivos = Object.entries(motivos)
                .map(([motivo, data]: [string, any]) => ({
                    vendedor,
                    motivo,
                    quantidade: data.quantidade,
                    valorTotal: data.valorTotal
                }))
                .sort((a, b) => b.quantidade - a.quantidade)
                .slice(0, 5);
            motivosPorVendedorList.push(...top5Motivos);
        });
        setMotivosPorVendedor(motivosPorVendedorList);
        
        // 3. Motivos por Setor: top 5 motivos mais devolvidos por setor
        const motivosPorSetorMap: Record<string, Record<string, { quantidade: number, valorTotal: number }>> = {};
        devolucoesLancadas.forEach((devol) => {
            const setorNome = devol.motivos_devolucao?.setores?.nome || devol.setores?.nome || 'Sem setor';
            const motivoNome = devol.motivos_devolucao?.nome || 'Sem motivo';
            
            if (!motivosPorSetorMap[setorNome]) {
                motivosPorSetorMap[setorNome] = {};
            }
            if (!motivosPorSetorMap[setorNome][motivoNome]) {
                motivosPorSetorMap[setorNome][motivoNome] = { quantidade: 0, valorTotal: 0 };
            }
            motivosPorSetorMap[setorNome][motivoNome].quantidade += 1;
            motivosPorSetorMap[setorNome][motivoNome].valorTotal += (Number(devol.valor_total_nota) || 0);
        });
        
        const motivosPorSetorList: any[] = [];
        Object.entries(motivosPorSetorMap).forEach(([setor, motivos]) => {
            const top5Motivos = Object.entries(motivos)
                .map(([motivo, data]: [string, any]) => ({
                    setor,
                    motivo,
                    quantidade: data.quantidade,
                    valorTotal: data.valorTotal
                }))
                .sort((a, b) => b.quantidade - a.quantidade)
                .slice(0, 5);
            motivosPorSetorList.push(...top5Motivos);
        });
        setMotivosPorSetorTabela(motivosPorSetorList);
        
        // 4. Motivos por Cliente: top 5 motivos mais devolvidos do top 10 clientes
        const top10Clientes = Object.entries(customerMap)
            .sort((a, b) => b[1].valor - a[1].valor)
            .slice(0, 10)
            .map(([name]) => name);
        
        const motivosPorClienteMap: Record<string, Record<string, { quantidade: number, valorTotal: number }>> = {};
        devolucoesLancadas.forEach((devol) => {
            const cliente = devol.nome_cliente || 'Desconhecido';
            if (!top10Clientes.includes(cliente)) return;
            
            const motivoNome = devol.motivos_devolucao?.nome || 'Sem motivo';
            
            if (!motivosPorClienteMap[cliente]) {
                motivosPorClienteMap[cliente] = {};
            }
            if (!motivosPorClienteMap[cliente][motivoNome]) {
                motivosPorClienteMap[cliente][motivoNome] = { quantidade: 0, valorTotal: 0 };
            }
            motivosPorClienteMap[cliente][motivoNome].quantidade += 1;
            motivosPorClienteMap[cliente][motivoNome].valorTotal += (Number(devol.valor_total_nota) || 0);
        });
        
        const motivosPorClienteList: any[] = [];
        Object.entries(motivosPorClienteMap).forEach(([cliente, motivos]) => {
            const top5Motivos = Object.entries(motivos)
                .map(([motivo, data]: [string, any]) => ({
                    cliente,
                    motivo,
                    quantidade: data.quantidade,
                    valorTotal: data.valorTotal
                }))
                .sort((a, b) => b.quantidade - a.quantidade)
                .slice(0, 5);
            motivosPorClienteList.push(...top5Motivos);
        });
        setMotivosPorCliente(motivosPorClienteList);
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

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard Lançadas - Relatório</title>
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
  
  .devolucao-vendas-card {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px;
    background: #f9fafb;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .devolucao-vendas-title {
    font-size: 11px;
    font-weight: bold;
    color: #073e29;
    margin-bottom: 4px;
  }
  
  .devolucao-vendas-content {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }
  
  .devolucao-vendas-input {
    flex: 1;
  }
  
  .devolucao-vendas-input label {
    font-size: 8px;
    color: #666;
    display: block;
    margin-bottom: 4px;
  }
  
  .devolucao-vendas-input input {
    width: 100%;
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 10px;
  }
  
  .devolucao-vendas-result {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px;
    background: white;
  }
  
  .devolucao-vendas-result-title {
    font-size: 7px;
    color: #666;
    margin-bottom: 3px;
  }
  
  .devolucao-vendas-result-value {
    font-size: 16px;
    font-weight: bold;
    color: #073e29;
  }
  
  .devolucao-vendas-result-desc {
    font-size: 6px;
    color: #999;
    margin-top: 2px;
  }
  
  .tables-section {
    margin-top: 12px;
    margin-bottom: 12px;
  }
  
  .tables-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .table-card {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px;
    background: white;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  
  .table-title {
    font-size: 10px;
    font-weight: bold;
    color: #073e29;
    margin-bottom: 4px;
    border-bottom: 1px solid #073e29;
    padding-bottom: 3px;
  }
  
  .table-description {
    font-size: 7px;
    color: #666;
    margin-bottom: 6px;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7px;
  }
  
  table th {
    background: #f9fafb;
    border: 1px solid #ddd;
    padding: 4px;
    text-align: left;
    font-weight: bold;
    color: #073e29;
  }
  
  table td {
    border: 1px solid #ddd;
    padding: 4px;
    color: #333;
  }
  
  table tr:nth-child(even) {
    background: #f9fafb;
  }
  
  .text-right {
    text-align: right;
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
    .chart-container, .chart-container-full {
      page-break-inside: avoid;
    }
  }
</style>
</head>
<body>
<button class="no-print" onclick="window.print()" style="position: fixed; top: 10px; right: 10px; z-index: 1000; background: #073e29; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
  🖨️ Imprimir
</button>

<!-- PÁGINA 1: Header + KPIs + 3 Seções com 2 Gráficos -->
<div class="page">
  <div class="header">
    <div class="header-logo">
      <img src="/logo.png" alt="Logo" onerror="this.style.display='none'" style="background-color: #073e29;">
    </div>
    <div class="header-content">
      <h1>Dashboard Lançadas</h1>
      <div class="header-info">Relatório Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</div>
      <div class="header-info">Período: ${periodoText}</div>
      ${filtrosSelecionados.length > 0 ? `<div class="header-filters">Filtros: ${filtrosSelecionados.join(' | ')}</div>` : ''}
    </div>
  </div>
  
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
  
  <!-- Card Devolução sobre Vendas -->
  <div class="devolucao-vendas-card">
    <div class="devolucao-vendas-title">Devolução sobre Vendas</div>
    <div class="devolucao-vendas-content">
      <div class="devolucao-vendas-input">
        <label>Valor de Vendas (R$)</label>
        <input type="number" id="valorVendasInput" value="${valorVendas || ''}" readonly style="background: #f0f0f0; cursor: not-allowed;" />
      </div>
      <div class="devolucao-vendas-result">
        <div class="devolucao-vendas-result-title">Devolução sobre Vendas</div>
        <div class="devolucao-vendas-result-value">
          ${valorVendas && Number(valorVendas) > 0 
            ? `${((stats.valorTotalLancado / Number(valorVendas)) * 100).toFixed(2)}%`
            : '0.00%'}
        </div>
        <div class="devolucao-vendas-result-desc">Resultado: LANÇADA</div>
      </div>
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
  
  <!-- Seção 3: Análise de Pareto | Clientes com Reincidência -->
  <div class="chart-grid">
    <div class="chart-section">
      <div class="chart-title">Análise de Pareto (80/20)</div>
      <div class="chart-container">
        <canvas id="chartPareto"></canvas>
      </div>
    </div>
    <div class="chart-section">
      <div class="chart-title">Clientes com Reincidência</div>
      <div class="chart-container">
        <canvas id="chartReincidencia"></canvas>
      </div>
    </div>
  </div>
  
  <!-- Seção 4: Devoluções Por Motivo | Devoluções Por Setores -->
  <div class="chart-grid">
    <div class="chart-section">
      <div class="chart-title">Devoluções Por Motivo (Apenas LANÇADA)</div>
      <div class="chart-container">
        <canvas id="chartMotivos"></canvas>
      </div>
    </div>
    <div class="chart-section">
      <div class="chart-title">Devoluções Por Setores (Apenas LANÇADA)</div>
      <div class="chart-container">
        <canvas id="chartSetores"></canvas>
      </div>
    </div>
  </div>
  
  <!-- Seção 5: Top 20 Produtos | Insights -->
  <div class="chart-grid">
    <div class="chart-section">
      <div class="chart-title">Top 20 Produtos mais devolvidos (${filtroUnidadeProdutos})</div>
      <div class="chart-container">
        <canvas id="chartProdutos"></canvas>
      </div>
    </div>
    ${insights.length > 0 ? `
    <div class="chart-section">
      <div class="chart-title">Insights Automáticos</div>
      <div class="insights-container">
        ${insights.map((insight: string) => `
          <div class="insight-item">${insight}</div>
        `).join('')}
      </div>
    </div>
    ` : '<div class="chart-section"></div>'}
  </div>
  
  <!-- Tabelas de Motivos -->
  <div class="tables-section">
    <div class="tables-grid">
      <!-- Tabela 1: Motivos por Produto -->
      <div class="table-card">
        <div class="table-title">Motivos por Produto</div>
        <div class="table-description">5 produtos mais devolvidos do top 10 maiores motivos (Apenas LANÇADA)</div>
        <div class="table-container">
          ${motivosPorProduto.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Motivo</th>
                <th class="text-right">Qtd</th>
                <th class="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${motivosPorProduto.map((item: any) => `
                <tr>
                  <td>${(item.produto || '').length > 20 ? (item.produto || '').substring(0, 20) + '...' : (item.produto || '')}</td>
                  <td>${(item.motivo || '').length > 20 ? (item.motivo || '').substring(0, 20) + '...' : (item.motivo || '')}</td>
                  <td class="text-right">${(item.quantidade || 0).toFixed(2)}</td>
                  <td class="text-right">R$ ${(item.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p style="text-align: center; color: #999; font-size: 8px; padding: 10px;">Nenhum dado disponível</p>'}
        </div>
      </div>
      
      <!-- Tabela 2: Motivos por Vendedor -->
      <div class="table-card">
        <div class="table-title">Motivos por Vendedor</div>
        <div class="table-description">5 motivos mais devolvidos por vendedor (Apenas LANÇADA)</div>
        <div class="table-container">
          ${motivosPorVendedor.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Vendedor</th>
                <th>Motivo</th>
                <th class="text-right">Qtd</th>
                <th class="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${motivosPorVendedor.map((item: any) => `
                <tr>
                  <td>${(item.vendedor || '').length > 15 ? (item.vendedor || '').substring(0, 15) + '...' : (item.vendedor || '')}</td>
                  <td>${(item.motivo || '').length > 20 ? (item.motivo || '').substring(0, 20) + '...' : (item.motivo || '')}</td>
                  <td class="text-right">${item.quantidade || 0}</td>
                  <td class="text-right">R$ ${(item.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p style="text-align: center; color: #999; font-size: 8px; padding: 10px;">Nenhum dado disponível</p>'}
        </div>
      </div>
      
      <!-- Tabela 3: Motivos por Setor -->
      <div class="table-card">
        <div class="table-title">Motivos por Setor</div>
        <div class="table-description">Top 5 motivos mais devolvidos por setor (Apenas LANÇADA)</div>
        <div class="table-container">
          ${motivosPorSetorTabela.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Setor</th>
                <th>Motivo</th>
                <th class="text-right">Qtd</th>
                <th class="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${motivosPorSetorTabela.map((item: any) => `
                <tr>
                  <td>${item.setor || ''}</td>
                  <td>${(item.motivo || '').length > 20 ? (item.motivo || '').substring(0, 20) + '...' : (item.motivo || '')}</td>
                  <td class="text-right">${item.quantidade || 0}</td>
                  <td class="text-right">R$ ${(item.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p style="text-align: center; color: #999; font-size: 8px; padding: 10px;">Nenhum dado disponível</p>'}
        </div>
      </div>
      
      <!-- Tabela 4: Motivos por Cliente -->
      <div class="table-card">
        <div class="table-title">Motivos por Cliente</div>
        <div class="table-description">Top 5 motivos mais devolvidos do top 10 clientes (Apenas LANÇADA)</div>
        <div class="table-container">
          ${motivosPorCliente.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Motivo</th>
                <th class="text-right">Qtd</th>
                <th class="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${motivosPorCliente.map((item: any) => `
                <tr>
                  <td>${(item.cliente || '').length > 20 ? (item.cliente || '').substring(0, 20) + '...' : (item.cliente || '')}</td>
                  <td>${(item.motivo || '').length > 20 ? (item.motivo || '').substring(0, 20) + '...' : (item.motivo || '')}</td>
                  <td class="text-right">${item.quantidade || 0}</td>
                  <td class="text-right">R$ ${(item.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p style="text-align: center; color: #999; font-size: 8px; padding: 10px;">Nenhum dado disponível</p>'}
        </div>
      </div>
    </div>
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
  
  // Gráfico de Evolução no Tempo
  new Chart(document.getElementById('chartEvolucao'), {
    type: 'line',
    data: {
      labels: ${JSON.stringify(chartData.map((d: any) => d.name))},
      datasets: [{
        label: 'Valor Total (R$)',
        data: ${JSON.stringify(chartData.map((d: any) => d.value))},
        borderColor: '#17432a',
        backgroundColor: 'rgba(23, 67, 42, 0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#17432a',
          borderWidth: 1,
          callbacks: {
            label: (context) => 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#1f2937',
            font: { size: 8 },
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
          },
          grid: { color: '#e5e7eb' }
        },
        x: {
          ticks: {
            color: '#1f2937',
            font: { size: 8 }
          },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  });
  
  // Gráfico Top Clientes
  new Chart(document.getElementById('chartTopClientes'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(topCustomers.map((d: any) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name))},
      datasets: [{
        label: 'Valor (R$)',
        data: ${JSON.stringify(topCustomers.map((d: any) => d.value))},
        backgroundColor: '#17432a',
        borderColor: '#0a4d33',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#17432a',
          borderWidth: 1,
          callbacks: {
            label: (context) => 'R$ ' + context.parsed.x.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#1f2937',
            font: { size: 8 },
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
          },
          grid: { color: '#e5e7eb' }
        },
        y: {
          ticks: {
            color: '#1f2937',
            font: { size: 8 }
          },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  });
  
  // Gráfico Top Vendedores
  new Chart(document.getElementById('chartVendedores'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(topVendedores.map((d: any) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name))},
      datasets: [{
        label: 'Valor (R$)',
        data: ${JSON.stringify(topVendedores.map((d: any) => d.value))},
        backgroundColor: '#0a4d33',
        borderColor: '#17432a',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#0a4d33',
          borderWidth: 1,
          callbacks: {
            label: (context) => 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#1f2937',
            font: { size: 8 },
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
          },
          grid: { color: '#e5e7eb' }
        },
        x: {
          ticks: {
            color: '#1f2937',
            font: { size: 8 }
          },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  });
  
  // Gráfico Top Redes
  new Chart(document.getElementById('chartRedes'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(topRedes.map((d: any) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name))},
      datasets: [{
        label: 'Valor (R$)',
        data: ${JSON.stringify(topRedes.map((d: any) => d.value))},
        backgroundColor: '#065f46',
        borderColor: '#0a4d33',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#065f46',
          borderWidth: 1,
          callbacks: {
            label: (context) => 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#1f2937',
            font: { size: 8 },
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
          },
          grid: { color: '#e5e7eb' }
        },
        x: {
          ticks: {
            color: '#1f2937',
            font: { size: 8 }
          },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  });
  
  // Gráfico Pareto
  new Chart(document.getElementById('chartPareto'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(paretoData.map((d: any) => d.name.length > 10 ? d.name.substring(0, 10) + '...' : d.name))},
      datasets: [{
        type: 'bar',
        label: 'Valor (R$)',
        data: ${JSON.stringify(paretoData.map((d: any) => d.value))},
        backgroundColor: '#17432a',
        borderColor: '#0a4d33',
        borderWidth: 1,
        yAxisID: 'y'
      }, {
        type: 'line',
        label: '% Acumulado',
        data: ${JSON.stringify(paretoData.map((d: any) => d.percentage))},
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 2,
        yAxisID: 'y1',
        pointRadius: 3,
        pointBackgroundColor: '#dc2626'
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
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
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: '#1f2937',
            font: { size: 8 },
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
          },
          grid: { color: '#e5e7eb' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          max: 100,
          ticks: {
            color: '#dc2626',
            font: { size: 8 },
            callback: (value) => value + '%'
          },
          grid: {
            drawOnChartArea: false,
          }
        },
        x: {
          ticks: {
            color: '#1f2937',
            font: { size: 8 }
          },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  });
  
  // Gráfico Reincidência
  new Chart(document.getElementById('chartReincidencia'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(clientesReincidencia.map((d: any) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name))},
      datasets: [{
        label: 'Notas Canceladas',
        data: ${JSON.stringify(clientesReincidencia.map((d: any) => d.count))},
        backgroundColor: '#dc2626',
        borderColor: '#b91c1c',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#dc2626',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#1f2937',
            font: { size: 8 },
            stepSize: 1
          },
          grid: { color: '#e5e7eb' }
        },
        x: {
          ticks: {
            color: '#1f2937',
            font: { size: 8 }
          },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  });
  
  // Gráfico Motivos (Colunas Verticais)
  new Chart(document.getElementById('chartMotivos'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(devolucoesPorMotivo.map((d: any) => d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name))},
      datasets: [{
        label: 'Valor Total (R$)',
        data: ${JSON.stringify(devolucoesPorMotivo.map((d: any) => d.valorTotal))},
        backgroundColor: '#17432a',
        borderColor: '#0a4d33',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      indexAxis: 'x',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#17432a',
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const dataIndex = context.dataIndex;
              const quantidade = ${JSON.stringify(devolucoesPorMotivo.map((d: any) => d.quantidade))}[dataIndex];
              return [
                'Valor: R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                'Quantidade: ' + quantidade + ' nota(s)'
              ];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#1f2937',
            font: { size: 8 },
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
          },
          grid: { color: '#e5e7eb' }
        },
        x: {
          ticks: {
            color: '#1f2937',
            font: { size: 7 },
            maxRotation: 45,
            minRotation: 45
          },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  });
  
  // Gráfico Setores (Colunas Verticais)
  new Chart(document.getElementById('chartSetores'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(devolucoesPorSetor.map((d: any) => d.name))},
      datasets: [{
        label: 'Valor Total (R$)',
        data: ${JSON.stringify(devolucoesPorSetor.map((d: any) => d.valorTotal))},
        backgroundColor: '#0a4d33',
        borderColor: '#17432a',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      indexAxis: 'x',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#0a4d33',
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const dataIndex = context.dataIndex;
              const quantidade = ${JSON.stringify(devolucoesPorSetor.map((d: any) => d.quantidade))}[dataIndex];
              return [
                'Valor: R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                'Quantidade: ' + quantidade + ' nota(s)'
              ];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#1f2937',
            font: { size: 8 },
            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
          },
          grid: { color: '#e5e7eb' }
        },
        x: {
          ticks: {
            color: '#1f2937',
            font: { size: 8 }
          },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  });
  
  // Gráfico Produtos (Colunas Verticais)
  new Chart(document.getElementById('chartProdutos'), {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(top20Produtos.map((d: any) => (d.nameFull || d.name).length > 15 ? (d.nameFull || d.name).substring(0, 15) + '...' : (d.nameFull || d.name)))},
      datasets: [{
        label: 'Quantidade (${filtroUnidadeProdutos})',
        data: ${JSON.stringify(top20Produtos.map((d: any) => d.quantidade))},
        backgroundColor: '#065f46',
        borderColor: '#0a4d33',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      indexAxis: 'x',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#065f46',
          borderWidth: 1,
          callbacks: {
            title: (items) => {
              const index = items[0].dataIndex;
              return ${JSON.stringify(top20Produtos.map((d: any) => d.nameFull || d.name))}[index] || '';
            },
            label: (context) => context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ${filtroUnidadeProdutos}'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#1f2937',
            font: { size: 8 }
          },
          grid: { color: '#e5e7eb' }
        },
        x: {
          ticks: {
            color: '#1f2937',
            font: { size: 7 },
            maxRotation: 45,
            minRotation: 45
          },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  });
</script>
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

      {/* Card Devolução sobre Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Devolução sobre Vendas</CardTitle>
          <CardDescription>Calcule o percentual de devoluções sobre o valor de vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="valorVendas">Valor de Vendas (R$)</Label>
              <Input
                id="valorVendas"
                type="number"
                placeholder="Digite o valor de vendas"
                value={valorVendas}
                onChange={(e) => setValorVendas(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="flex-1">
              <KPICard
                title="Devolução sobre Vendas"
                value={valorVendas && Number(valorVendas) > 0 
                  ? `${((stats.valorTotalLancado / Number(valorVendas)) * 100).toFixed(2)}%`
                  : '0.00%'}
                icon={Percent}
                description="Resultado: LANÇADA"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Tabelas de Motivos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Tabela 1: Motivos por Produto */}
        <Card>
          <CardHeader>
            <CardTitle>Motivos por Produto</CardTitle>
            <CardDescription>5 produtos mais devolvidos do top 10 maiores motivos (Apenas LANÇADA)</CardDescription>
          </CardHeader>
          <CardContent>
            {motivosPorProduto.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px]">Produto</TableHead>
                      <TableHead className="text-[10px]">Motivo</TableHead>
                      <TableHead className="text-[10px] text-right">Qtd</TableHead>
                      <TableHead className="text-[10px] text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {motivosPorProduto.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="text-[10px] font-medium">{item.produto.length > 20 ? item.produto.substring(0, 20) + '...' : item.produto}</TableCell>
                        <TableCell className="text-[10px]">{item.motivo.length > 20 ? item.motivo.substring(0, 20) + '...' : item.motivo}</TableCell>
                        <TableCell className="text-[10px] text-right">{item.quantidade.toFixed(2)}</TableCell>
                        <TableCell className="text-[10px] text-right">R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela 2: Motivos por Vendedor */}
        <Card>
          <CardHeader>
            <CardTitle>Motivos por Vendedor</CardTitle>
            <CardDescription>5 motivos mais devolvidos por vendedor (Apenas LANÇADA)</CardDescription>
          </CardHeader>
          <CardContent>
            {motivosPorVendedor.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px]">Vendedor</TableHead>
                      <TableHead className="text-[10px]">Motivo</TableHead>
                      <TableHead className="text-[10px] text-right">Qtd</TableHead>
                      <TableHead className="text-[10px] text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {motivosPorVendedor.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="text-[10px] font-medium">{item.vendedor.length > 15 ? item.vendedor.substring(0, 15) + '...' : item.vendedor}</TableCell>
                        <TableCell className="text-[10px]">{item.motivo.length > 20 ? item.motivo.substring(0, 20) + '...' : item.motivo}</TableCell>
                        <TableCell className="text-[10px] text-right">{item.quantidade}</TableCell>
                        <TableCell className="text-[10px] text-right">R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela 3: Motivos por Setor */}
        <Card>
          <CardHeader>
            <CardTitle>Motivos por Setor</CardTitle>
            <CardDescription>Top 5 motivos mais devolvidos por setor (Apenas LANÇADA)</CardDescription>
          </CardHeader>
          <CardContent>
            {motivosPorSetorTabela.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px]">Setor</TableHead>
                      <TableHead className="text-[10px]">Motivo</TableHead>
                      <TableHead className="text-[10px] text-right">Qtd</TableHead>
                      <TableHead className="text-[10px] text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {motivosPorSetorTabela.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="text-[10px] font-medium">{item.setor}</TableCell>
                        <TableCell className="text-[10px]">{item.motivo.length > 20 ? item.motivo.substring(0, 20) + '...' : item.motivo}</TableCell>
                        <TableCell className="text-[10px] text-right">{item.quantidade}</TableCell>
                        <TableCell className="text-[10px] text-right">R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela 4: Motivos por Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Motivos por Cliente</CardTitle>
            <CardDescription>Top 5 motivos mais devolvidos do top 10 clientes (Apenas LANÇADA)</CardDescription>
          </CardHeader>
          <CardContent>
            {motivosPorCliente.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px]">Cliente</TableHead>
                      <TableHead className="text-[10px]">Motivo</TableHead>
                      <TableHead className="text-[10px] text-right">Qtd</TableHead>
                      <TableHead className="text-[10px] text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {motivosPorCliente.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="text-[10px] font-medium">{item.cliente.length > 20 ? item.cliente.substring(0, 20) + '...' : item.cliente}</TableCell>
                        <TableCell className="text-[10px]">{item.motivo.length > 20 ? item.motivo.substring(0, 20) + '...' : item.motivo}</TableCell>
                        <TableCell className="text-[10px] text-right">{item.quantidade}</TableCell>
                        <TableCell className="text-[10px] text-right">R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
