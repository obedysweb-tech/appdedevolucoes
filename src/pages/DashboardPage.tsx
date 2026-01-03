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
  AlertTriangle,
  TrendingUp,
  Loader2,
  RefreshCw,
  MapPin,
  PackageX,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
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

export function DashboardPage() {
  const { filters } = useFilterStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
      totalValue: 0,
      totalReturns: 0,
      avgTicket: 0,
      slaBreach: 0,
      totalProducts: 0
  });
  const [velocimetroValue, setVelocimetroValue] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [topVendedores, setTopVendedores] = useState<any[]>([]);
  const [topRedes, setTopRedes] = useState<any[]>([]);
  const [reasonsData, setReasonsData] = useState<any[]>([]);
  const [paretoData, setParetoData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [cancelamentoData, setCancelamentoData] = useState<any[]>([]);
  const [canceladasData, setCanceladasData] = useState<any[]>([]);
  const [topProdutos, setTopProdutos] = useState<any[]>([]);
  const [municipioData, setMunicipioData] = useState<any[]>([]);
  const [clientesReincidencia, setClientesReincidencia] = useState<any[]>([]);
  const [motivosPorRede, setMotivosPorRede] = useState<any[]>([]);

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
  }, [filters, user]); 

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Usar vendedor do objeto user (já carregado no App.tsx)
      const userVendedor = user?.role === 'VENDEDOR' ? user.vendedor : null;
      
      // Base query - incluir itens para calcular produtos devolvidos
      let query = supabase.from('devolucoes').select(`
          *,
          motivos_devolucao(nome),
          setores(nome),
          itens:itens_devolucao(quantidade, descricao, motivo_id, valor_total_bruto, unidade)
      `);
    
    // Filtrar por vendedor do usuário (apenas se for tipo VENDEDOR)
    if (user && user.role === 'VENDEDOR' && userVendedor) {
      query = query.eq('vendedor', userVendedor);
      console.log('🔒 Dashboard - Filtrando por vendedor:', userVendedor);
    }
    
    // Aplicar período se não houver datas específicas
    const periodDates = filters.period && !filters.startDate && !filters.endDate 
      ? getDateRangeFromPeriod(filters.period)
      : {};
    const effectiveStartDate = filters.startDate || periodDates.startDate;
    const effectiveEndDate = filters.endDate || periodDates.endDate;
    
    // Aplicar Filtros
    if (filters.search) {
        query = query.or(`nome_cliente.ilike.%${filters.search}%,vendedor.ilike.%${filters.search}%,numero.ilike.%${filters.search}%`);
    }
    if (filters.resultado && filters.resultado.length > 0) {
      query = query.in('resultado', filters.resultado);
    }
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
        console.error('❌ Erro ao buscar dados do Dashboard:', error);
        toast.error('Erro ao carregar dados do Dashboard: ' + error.message);
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
            slaBreach: 0,
            totalProducts: 0
        });
        setVelocimetroValue(0);
        setChartData([]);
        setTopCustomers([]);
        setTopVendedores([]);
        setTopRedes([]);
        setParetoData([]);
        setHeatmapData([]);
        setInsights([]);
        setAlerts([]);
        setReasonsData([]);
        setMunicipioData([]);
        setCancelamentoData([]);
        setCanceladasData([]);
        setTopProdutos([]);
        setLoading(false);
        return;
    }
    
    if (devolucoes) {
        console.log(`✅ Dashboard: ${devolucoes.length} devoluções carregadas`);
        // 1. Calcular KPIs
        const totalValue = devolucoes.reduce((acc, curr) => acc + (Number(curr.valor_total_nota) || 0), 0);
        const totalReturns = devolucoes.length;
        const avgTicket = totalReturns > 0 ? totalValue / totalReturns : 0;
        
        // Calcular quantidade total de produtos devolvidos
        const totalProducts = devolucoes.reduce((acc, curr) => {
            const itens = curr.itens || [];
            return acc + itens.reduce((sum: number, item: any) => sum + (Number(item.quantidade) || 0), 0);
        }, 0);
        
        // Calcular notas fora do SLA (PRAZO = 'EM ATRASO')
        const slaBreach = devolucoes.filter(d => d.prazo === 'EM ATRASO').length;
        
        // Calcular valor para velocímetro: PENDENTE VALIDAÇÃO + TRATATIVA DE ANULAÇÃO
        const valorVelocimetro = devolucoes
            .filter(d => d.resultado === 'PENDENTE VALIDAÇÃO' || d.resultado === 'TRATATIVA DE ANULAÇÃO')
            .reduce((acc, curr) => acc + (Number(curr.valor_total_nota) || 0), 0);
        
        setStats({
            totalValue,
            totalReturns,
            avgTicket,
            slaBreach,
            totalProducts
        });
        setVelocimetroValue(valorVelocimetro);

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
        
        // Heatmap: Produto × Rede (usando quantidade total devolvida com unidade real)
        // Filtrar apenas notas com resultado "PENDENTE VALIDAÇÃO"
        const devolucoesPendentes = devolucoes.filter(d => d.resultado === 'PENDENTE VALIDAÇÃO');
        const produtoRedeMap: Record<string, Record<string, { quantidade: number, unidade: string }>> = {};
        devolucoesPendentes.forEach(devol => {
            const itens = devol.itens || [];
            // Usar rede da devolução para todos os itens
            const rede = devol.rede || 'Sem rede';
            itens.forEach((item: any) => {
                const produtoCompleto = item.descricao || 'Desconhecido';
                // Pegar apenas as 2 primeiras palavras do produto
                const palavras = produtoCompleto.split(' ');
                const produto = palavras.slice(0, 2).join(' ');
                
                if (!produtoRedeMap[produto]) {
                    produtoRedeMap[produto] = {};
                }
                // Usar quantidade devolvida do item e unidade real
                const quantidadeItem = Number(item.quantidade) || 0;
                const unidade = item.unidade || 'UN';
                
                if (!produtoRedeMap[produto][rede]) {
                    produtoRedeMap[produto][rede] = { quantidade: 0, unidade: unidade };
                }
                produtoRedeMap[produto][rede].quantidade += quantidadeItem;
            });
        });
        
        // Converter para formato de heatmap - TODOS OS PRODUTOS AGRUPADOS (sem limite)
        const produtos = Object.keys(produtoRedeMap);
        // Coletar todas as redes únicas das devoluções pendentes
        const redesUnicas = new Set<string>();
        devolucoesPendentes.forEach(devol => {
            const rede = devol.rede || 'Sem rede';
            redesUnicas.add(rede);
        });
        const redes = Array.from(redesUnicas).slice(0, 8);
        
        const heatmap = produtos.map(produto => {
            const row: any = { produto };
            redes.forEach(rede => {
                const data = produtoRedeMap[produto]?.[rede];
                row[rede] = data || { quantidade: 0, unidade: 'UN' };
            });
            return row;
        });
        setHeatmapData(heatmap);

        // 4. Gráfico de Motivos (movido para antes dos insights)
        const reasonMap = devolucoes.reduce((acc: any, curr) => {
            const motivo = curr.motivos_devolucao;
            const reason = (typeof motivo === 'object' && motivo?.nome) ? motivo.nome : (typeof motivo === 'string' ? motivo : null);
            // Ignorar motivos nulos ou "Não informado"
            if (reason && reason !== 'Não informado' && reason !== 'não informado' && reason !== 'NÃO INFORMADO') {
                acc[reason] = (acc[reason] || 0) + 1;
            }
            return acc;
        }, {});

        const reasonsChart = Object.entries(reasonMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
        console.log('📊 Reasons Chart:', reasonsChart);
        setReasonsData(reasonsChart);
        
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
        
        // 6. Gráfico de Notas em Cancelamento (TRATATIVA DE CANCELAMENTO) - com detalhes de cliente e nota fiscal
        const cancelamentoDetalhes: Record<string, Array<{ cliente: string, nota: string }>> = {};
        devolucoes
            .filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO')
            .forEach((curr) => {
                const date = new Date(curr.data_emissao || curr.created_at);
                const day = format(date, 'dd/MM', { locale: ptBR });
                if (!cancelamentoDetalhes[day]) {
                    cancelamentoDetalhes[day] = [];
                }
                cancelamentoDetalhes[day].push({
                    cliente: curr.nome_cliente || 'Desconhecido',
                    nota: curr.numero || '-'
                });
            });
        
        const cancelamentoChart = Object.keys(cancelamentoDetalhes)
            .sort((a, b) => {
                const dateA = new Date(a.split('/').reverse().join('-'));
                const dateB = new Date(b.split('/').reverse().join('-'));
                return dateA.getTime() - dateB.getTime();
            })
            .map(key => ({
                name: key,
                quantidade: cancelamentoDetalhes[key].length,
                detalhes: cancelamentoDetalhes[key]
            }));
        setCancelamentoData(cancelamentoChart);
        
        // 6b. Gráfico de Notas Canceladas (ANULADA/CANCELADA) - com detalhes de cliente e nota fiscal
        const canceladasDetalhes: Record<string, Array<{ cliente: string, nota: string }>> = {};
        devolucoes
            .filter(d => d.resultado === 'ANULADA/CANCELADA')
            .forEach((curr) => {
                const date = new Date(curr.data_emissao || curr.created_at);
                const day = format(date, 'dd/MM', { locale: ptBR });
                if (!canceladasDetalhes[day]) {
                    canceladasDetalhes[day] = [];
                }
                canceladasDetalhes[day].push({
                    cliente: curr.nome_cliente || 'Desconhecido',
                    nota: curr.numero || '-'
                });
            });
        
        const canceladasChart = Object.keys(canceladasDetalhes)
            .sort((a, b) => {
                const dateA = new Date(a.split('/').reverse().join('-'));
                const dateB = new Date(b.split('/').reverse().join('-'));
                return dateA.getTime() - dateB.getTime();
            })
            .map(key => ({
                name: key,
                quantidade: canceladasDetalhes[key].length,
                detalhes: canceladasDetalhes[key]
            }));
        setCanceladasData(canceladasChart);
        
        // 7. Produtos Críticos - Separar por unidade (CX e UN)
        // Função para normalizar unidades
        const normalizarUnidade = (unidade: string): 'CX' | 'UN' | null => {
            if (!unidade) return null;
            const unidadeUpper = unidade.toUpperCase().trim();
            // CX = CX1 = CXS = FD
            if (['CX', 'CX1', 'CXI', 'CX10', 'CXS', 'FD'].includes(unidadeUpper)) {
                return 'CX';
            }
            // UN = UND = UN1 = UNID = BD = BDJ = KG = KG1 = KGS = PTC = PT = PT1 = PC = PC1 = SC = SC1
            if (['UN', 'UND', 'UN1', 'UNID', 'BD', 'BDJ', 'KG', 'KG1', 'KGS', 'PTC', 'PT', 'PT1', 'PC', 'PC1', 'SC', 'SC1'].includes(unidadeUpper)) {
                return 'UN';
            }
            return null;
        };
        
        const produtosMapCX: Record<string, { quantidade: number, unidade: string }> = {};
        const produtosMapUN: Record<string, { quantidade: number, unidade: string }> = {};
        
        devolucoes.forEach(devol => {
            const itens = devol.itens || [];
            itens.forEach((item: any) => {
                const produto = item.descricao || 'Desconhecido';
                const quantidade = Number(item.quantidade) || 0;
                const unidade = item.unidade || '';
                const unidadeNormalizada = normalizarUnidade(unidade);
                
                if (unidadeNormalizada === 'CX') {
                    if (!produtosMapCX[produto]) {
                        produtosMapCX[produto] = { quantidade: 0, unidade: unidade };
                    }
                    produtosMapCX[produto].quantidade += quantidade;
                } else if (unidadeNormalizada === 'UN') {
                    if (!produtosMapUN[produto]) {
                        produtosMapUN[produto] = { quantidade: 0, unidade: unidade };
                    }
                    produtosMapUN[produto].quantidade += quantidade;
                }
            });
        });
        
        // Top 5 produtos em CX
        const topProdutosCX = Object.entries(produtosMapCX)
            .map(([name, data]) => {
                const palavras = name.split(' ');
                const nomeReduzido = palavras.slice(0, 2).join(' ');
                return { name: nomeReduzido, nameFull: name, quantidade: data.quantidade, unidade: data.unidade, tipo: 'CX' };
            })
            .sort((a: any, b: any) => b.quantidade - a.quantidade)
            .slice(0, 5);
        
        // Top 5 produtos em UN
        const topProdutosUN = Object.entries(produtosMapUN)
            .map(([name, data]) => {
                const palavras = name.split(' ');
                const nomeReduzido = palavras.slice(0, 2).join(' ');
                return { name: nomeReduzido, nameFull: name, quantidade: data.quantidade, unidade: data.unidade, tipo: 'UN' };
            })
            .sort((a: any, b: any) => b.quantidade - a.quantidade)
            .slice(0, 5);
        
        // Combinar ambos (CX primeiro, depois UN)
        const topProdutosList = [...topProdutosCX, ...topProdutosUN];
        console.log('🔥 Top Produtos:', topProdutosList);
        setTopProdutos(topProdutosList);
        
        // 8. Clientes com maior reincidência (TRATATIVA DE ANULAÇÃO e ANULADA/CANCELADA) - com detalhes
        const clientesReincidenciaMap: Record<string, { count: number, detalhes: Array<{ cliente: string, nota: string }> }> = {};
        devolucoes
            .filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO' || d.resultado === 'ANULADA/CANCELADA')
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
        
        // Insight 5: Produto mais devolvido
        if (topProdutosList.length > 0) {
            const topProduto = topProdutosList[0];
            insightsList.push(`🔥 Produto "${topProduto.name}" é o mais devolvido com ${topProduto.quantidade} unidades.`);
        }
        
        // Insight 6: Taxa de cancelamento
        const cancelamentoCount = devolucoes.filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO' || d.resultado === 'ANULADA/CANCELADA').length;
        const taxaCancelamento = totalReturns > 0 ? (cancelamentoCount / totalReturns) * 100 : 0;
        if (taxaCancelamento > 10) {
            insightsList.push(`🚨 Taxa de cancelamento alta: ${taxaCancelamento.toFixed(1)}% das devoluções estão em cancelamento.`);
        } else if (cancelamentoCount > 0) {
            insightsList.push(`ℹ️ ${cancelamentoCount} devolução(ões) em processo de cancelamento.`);
        }
        
        // Insight 7: Motivo mais comum
        if (reasonsChart.length > 0) {
            const motivoMaisComum = reasonsChart[0];
            insightsList.push(`📋 Motivo mais frequente: "${motivoMaisComum.name}" com ${motivoMaisComum.value} ocorrência(s).`);
        }
        
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
        
        // 3. Notas pendentes quando acima de 20
        const notasPendentes = devolucoes.filter(d => d.resultado === 'PENDENTE VALIDAÇÃO');
        if (notasPendentes.length > 20) {
            const valorTotal = notasPendentes.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
            alertsList.push({
                type: 'warning',
                message: `${notasPendentes.length} nota(s) pendentes de validação (acima de 20)`,
                count: notasPendentes.length,
                total: notasPendentes.length,
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
        
        // 5. Clientes com mais de 5 notas pendente validação
        const clientesPendentes: Record<string, any[]> = {};
        notasPendentes.forEach(devol => {
            const cliente = devol.nome_cliente || 'Desconhecido';
            if (!clientesPendentes[cliente]) {
                clientesPendentes[cliente] = [];
            }
            clientesPendentes[cliente].push(devol);
        });
        
        Object.entries(clientesPendentes).forEach(([cliente, notas]) => {
            if (notas.length > 5) {
                const valorTotal = notas.reduce((sum: number, d: any) => sum + (Number(d.valor_total_nota) || 0), 0);
                alertsList.push({
                    type: 'error',
                    message: `Cliente "${cliente}" tem ${notas.length} notas pendentes de validação`,
                    cliente: cliente,
                    count: notas.length,
                    total: notas.length,
                    value: valorTotal
                });
            }
        });
        
        // 6. Notas em cancelamentos (TRATATIVA DE ANULAÇÃO)
        const notasCancelamento = devolucoes.filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO');
        if (notasCancelamento.length > 0) {
            const valorTotal = notasCancelamento.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
            alertsList.push({
                type: 'error',
                message: `${notasCancelamento.length} nota(s) em tratativa de anulação`,
                detalhes: notasCancelamento.map(n => `NF ${n.numero} - ${n.nome_cliente || 'Sem cliente'} - R$ ${(Number(n.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`),
                count: notasCancelamento.length,
                total: notasCancelamento.length,
                value: valorTotal
            });
        }
        
        setAlerts(alertsList); // Mostrar todos os alertas
      }
    } catch (error: any) {
      console.error('❌ Erro ao processar dados do Dashboard:', error);
      toast.error('Erro ao processar dados: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  // Componente Velocímetro - Novo modelo
  const Velocimetro = ({ value }: { value: number }) => {
    // Definir os limites
    const max = 40000;
    const normalLimit = 10000;
    const warningLimit = 20000;
    
    // Ângulo do ponteiro (de -90° a 90°, total 180°)
    const percentage = Math.min(value / max, 1);
    const angle = -90 + (percentage * 180);
    
    // Determinar status
    const getStatus = () => {
      if (value < normalLimit) return { color: '#10b981', label: 'Normal', icon: '✓', bg: 'bg-green-50' };
      if (value < warningLimit) return { color: '#f59e0b', label: 'Atenção', icon: '⚠', bg: 'bg-yellow-50' };
      return { color: '#ef4444', label: 'Crítico', icon: '🚨', bg: 'bg-red-50' };
    };
    
    const status = getStatus();
    
    return (
      <div className="w-full max-w-sm mx-auto">
        {/* SVG do Velocímetro */}
        <div className="relative w-full" style={{ paddingBottom: '50%' }}>
          <svg 
            viewBox="0 0 200 120" 
            className="absolute inset-0 w-full h-full"
          >
            {/* Arco Verde (0k - 10k) - 25% do arco */}
            <path
              d="M 20 100 A 80 80 0 0 1 65 35"
              fill="none"
              stroke="#10b981"
              strokeWidth="20"
              strokeLinecap="round"
            />
            
            {/* Arco Amarelo (10k - 20k) - 25% do arco */}
            <path
              d="M 65 35 A 80 80 0 0 1 135 35"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="20"
              strokeLinecap="round"
            />
            
            {/* Arco Vermelho (20k - 40k) - 50% do arco */}
            <path
              d="M 135 35 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#ef4444"
              strokeWidth="20"
              strokeLinecap="round"
            />
            
            {/* Marcações principais com labels */}
            {[
              { val: 0, angle: -90, label: '15k' },
              { val: 10000, angle: -45, label: '20k' },
              { val: 15000, angle: -22.5, label: '25k' },
              { val: 20000, angle: 0, label: '35k' },
              { val: 40000, angle: 90, label: '40k' }
            ].map((mark, i) => {
              const rad = (mark.angle * Math.PI) / 180;
              const x1 = 100 + 70 * Math.cos(rad);
              const y1 = 100 + 70 * Math.sin(rad);
              const x2 = 100 + 85 * Math.cos(rad);
              const y2 = 100 + 85 * Math.sin(rad);
              
              // Posição do texto
              const textX = 100 + 98 * Math.cos(rad);
              const textY = 100 + 98 * Math.sin(rad);
              
              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[9px] fill-gray-700 font-bold"
                  >
                    {mark.label}
                  </text>
                </g>
              );
            })}
            
            {/* Marcações menores */}
            {[5000, 12500, 17500, 25000, 30000, 35000].map((val, i) => {
              const percentage = val / max;
              const markAngle = -90 + (percentage * 180);
              const rad = (markAngle * Math.PI) / 180;
              const x1 = 100 + 75 * Math.cos(rad);
              const y1 = 100 + 75 * Math.sin(rad);
              const x2 = 100 + 85 * Math.cos(rad);
              const y2 = 100 + 85 * Math.sin(rad);
              
              return (
                <line
                  key={`minor-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                />
              );
            })}
            
            {/* Ponteiro com design aprimorado */}
            <g transform={`rotate(${angle} 100 100)`}>
              {/* Sombra do ponteiro */}
              <path
                d="M 100 100 L 96 94 L 98 25 L 100 20 L 102 25 L 104 94 Z"
                fill="rgba(0,0,0,0.15)"
                transform="translate(2, 2)"
              />
              {/* Ponteiro principal */}
              <path
                d="M 100 100 L 96 94 L 98 25 L 100 20 L 102 25 L 104 94 Z"
                fill={status.color}
                stroke="#fff"
                strokeWidth="1.5"
              />
              {/* Brilho no ponteiro */}
              <path
                d="M 100 20 L 99 25 L 99 70 L 100 70 Z"
                fill="rgba(255,255,255,0.3)"
              />
            </g>
            
            {/* Centro do ponteiro com efeito 3D */}
            <circle cx="101" cy="101" r="10" fill="rgba(0,0,0,0.1)" />
            <circle cx="100" cy="100" r="10" fill="#fff" stroke={status.color} strokeWidth="3" />
            <circle cx="100" cy="100" r="5" fill={status.color} />
            <circle cx="98" cy="98" r="2" fill="rgba(255,255,255,0.6)" />
          </svg>
        </div>
        
        {/* Informações abaixo do velocímetro */}
        <div className="mt-6 space-y-3">
          {/* Valor principal com destaque */}
          <div className={`${status.bg} rounded-xl p-5 border-2 shadow-lg`} style={{ borderColor: status.color }}>
            <div className="text-center">
              <div className="text-xs text-gray-600 font-medium mb-1">VALOR TOTAL</div>
              <div className="text-4xl font-bold tracking-tight" style={{ color: status.color }}>
                R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-2xl">{status.icon}</span>
                <span className="text-xl font-bold uppercase tracking-wide" style={{ color: status.color }}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>
          
          {/* Legenda com faixas de valores */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="font-bold text-green-700 mb-1">✓ Normal</div>
              <div className="text-green-600 font-semibold">0 - 10k</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
              <div className="font-bold text-yellow-700 mb-1">⚠ Atenção</div>
              <div className="text-yellow-600 font-semibold">10k - 20k</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border-2 border-red-200">
              <div className="font-bold text-red-700 mb-1">🚨 Crítico</div>
              <div className="text-red-600 font-semibold">20k - 40k</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente AlertCard para os alertas
  const AlertCard = ({ alert }: { alert: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const config = {
      error: {
        bg: 'bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10',
        border: 'border-red-300 dark:border-red-800/50',
        iconBg: 'bg-red-500',
        textColor: 'text-red-800 dark:text-red-300',
        icon: XCircle,
        badge: 'bg-red-500 text-white'
      },
      warning: {
        bg: 'bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10',
        border: 'border-amber-300 dark:border-amber-800/50',
        iconBg: 'bg-amber-500',
        textColor: 'text-amber-800 dark:text-amber-300',
        icon: AlertTriangle,
        badge: 'bg-amber-500 text-white'
      },
      info: {
        bg: 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10',
        border: 'border-blue-300 dark:border-blue-800/50',
        iconBg: 'bg-blue-500',
        textColor: 'text-blue-800 dark:text-blue-300',
        icon: Info,
        badge: 'bg-blue-500 text-white'
      }
    };
    
    const style = config[alert.type as 'error' | 'warning' | 'info'];
    const Icon = style.icon;
    const hasDetails = alert.detalhes && alert.detalhes.length > 0;
    const shouldShowDetails = hasDetails && alert.message.includes('tratativa de anulação');
    
    return (
      <div className={`${style.bg} rounded-xl border-2 ${style.border} shadow-sm hover:shadow-md transition-all duration-200`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Ícone */}
            <div className={`${style.iconBg} rounded-lg p-2 shadow-lg flex-shrink-0`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            
            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`font-semibold text-sm leading-relaxed ${style.textColor}`}>
                  {alert.message}
                </p>
                
                {/* Badge com contador */}
                {alert.count && (
                  <span className={`${style.badge} px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 shadow-sm`}>
                    {alert.count}
                  </span>
                )}
              </div>
              
              {/* Valor em destaque */}
              {alert.value !== undefined && (
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${style.textColor}`}>
                    R$ {alert.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              
              {/* Detalhes expansíveis */}
              {shouldShowDetails && (
                <div className="mt-3">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`flex items-center gap-1 text-xs font-semibold ${style.textColor} hover:underline`}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3" />
                        Ocultar detalhes
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        Ver {alert.total} itens
                      </>
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-2 space-y-1 pl-4 border-l-2 border-current/20">
                      {alert.detalhes!.slice(0, 5).map((detalhe: string, i: number) => (
                        <div key={i} className={`text-xs ${style.textColor} opacity-90 flex items-start gap-2`}>
                          <span className="mt-1">•</span>
                          <span>{detalhe}</span>
                        </div>
                      ))}
                      {alert.total! > 5 && (
                        <div className={`text-xs font-semibold ${style.textColor} mt-2`}>
                          ... e mais {alert.total! - 5} itens
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        title="Dashboard" 
        description="Visão geral das devoluções com KPIs, gráficos e insights automáticos para análise estratégica."
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <FilterBar />
        <Button variant="outline" size="sm" onClick={fetchDashboardData} className="w-full md:w-auto shrink-0">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
        </Button>
      </div>

      {/* Alertas e Velocímetro */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Alertas - Novo componente */}
        {alerts.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 border-b-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3 shadow-lg">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Central de Alertas</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitoramento de devoluções e pendências</p>
                  </div>
                </div>
                
                {/* Resumo de badges */}
                <div className="flex items-center gap-2">
                  {alerts.filter(a => a.type === 'error').length > 0 && (
                    <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-full border border-red-300 dark:border-red-700">
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-bold text-red-700 dark:text-red-300">{alerts.filter(a => a.type === 'error').length}</span>
                    </div>
                  )}
                  {alerts.filter(a => a.type === 'warning').length > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-full border border-amber-300 dark:border-amber-700">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-300">{alerts.filter(a => a.type === 'warning').length}</span>
                    </div>
                  )}
                  {alerts.filter(a => a.type === 'info').length > 0 && (
                    <div className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-300 dark:border-blue-700">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{alerts.filter(a => a.type === 'info').length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Lista de alertas */}
            <div className="p-6">
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {alerts.map((alert, idx) => (
                  <AlertCard key={idx} alert={alert} />
                ))}
              </div>
            </div>
            
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
              }
            `}</style>
          </div>
        )}
        
        {/* Velocímetro */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-sm font-semibold">Status de Validação</CardTitle>
            <CardDescription className="text-center text-xs">
              Valor total de notas pendentes e em tratativa de anulação
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Velocimetro value={velocimetroValue} />
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard 
          title="Valor Total Devolvido" 
          value={`R$ ${stats.totalValue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
          trend="up"
          trendValue="vs período anterior"
        />
        <KPICard 
          title="Total de Devoluções" 
          value={stats.totalReturns}
          icon={RefreshCcw}
          description="Neste período"
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
        <KPICard 
          title="Fora do SLA" 
          value={stats.slaBreach}
          icon={AlertTriangle}
          description="Devoluções atrasadas"
          trend="down"
          trendValue="0"
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
            <CardDescription>Clientes com mais notas em TRATATIVA DE ANULAÇÃO e ANULADA/CANCELADA</CardDescription>
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
      
      {/* Heatmap */}
      {heatmapData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Heatmap: Produto × Rede</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left bg-muted text-xs">Produto</th>
                    {heatmapData[0] && Object.keys(heatmapData[0]).filter(k => k !== 'produto').map(rede => (
                      <th key={rede} className="border p-2 bg-muted text-xs">{rede.length > 15 ? rede.substring(0, 15) + '...' : rede}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="border p-2 font-medium text-xs">{row.produto.length > 20 ? row.produto.substring(0, 20) + '...' : row.produto}</td>
                      {Object.keys(row).filter(k => k !== 'produto').map(rede => {
                        const data = row[rede] || { quantidade: 0, unidade: 'UN' };
                        const value = typeof data === 'object' ? data.quantidade : data;
                        const unidade = typeof data === 'object' ? data.unidade : 'UN';
                        const maxValue = Math.max(...heatmapData.map(r => {
                          return Math.max(...Object.keys(r).filter(k => k !== 'produto').map(k => {
                            const cellData = r[k];
                            return typeof cellData === 'object' ? cellData.quantidade : cellData || 0;
                          }));
                        }));
                        const intensity = maxValue > 0 ? (value / maxValue) * 100 : 0;
                        return (
                          <td 
                            key={rede} 
                            className="border p-2 text-center text-xs"
                            style={{ 
                              backgroundColor: intensity > 0 ? (isDark ? `rgba(210, 248, 247, ${intensity / 100})` : `rgba(23, 67, 42, ${intensity / 100})`) : 'transparent',
                              color: intensity > 50 ? (isDark ? '#000' : '#fff') : 'inherit'
                            }}
                            title={`${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unidade}`}
                          >
                            {value > 0 ? `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unidade}` : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficos de Cancelamento e Canceladas */}
      {(cancelamentoData.length > 0 || canceladasData.length > 0) && (
  <div className="grid gap-4 md:grid-cols-2">
    {/* Gráfico de Notas em Cancelamento */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-orange-500" />
          Notas em Cancelamento
        </CardTitle>
      </CardHeader>

      <CardContent>
        {cancelamentoData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cancelamentoData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/30"
              />

              <XAxis
                dataKey="name"
                height={60}
                tick={<CustomXAxisTick />}
              />

              <YAxis className="text-[10px] font-bold" />

              {/* Tooltip customizado */}
              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="quantidade"
                fill={CHART_COLORS[0]}
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  dataKey="quantidade"
                  position="inside"
                  fill="#f1f1e5"
                  fontSize={13}
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-center p-4">
            <XCircle className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-sm">
              Nenhuma nota em cancelamento encontrada.
            </p>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Gráfico de Notas Canceladas */}
    <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Notas Canceladas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {canceladasData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={canceladasData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis 
                      dataKey="name" 
                      height={60}
                      tick={<CustomXAxisTick />}
                    />
                    <YAxis className="text-[10px] font-bold" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="quantidade" fill={CHART_COLORS[1]} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-center p-4">
                  <XCircle className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-sm">Nenhuma nota cancelada encontrada.</p>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
      )}

      {/* Secondary Charts Row */}
      <div className="grid gap-4 md:grid-cols-3">
          {/* Reasons Chart */}
          <Card className="col-span-1">
              <CardHeader>
                  <CardTitle className="text-base">Principais Motivos</CardTitle>
              </CardHeader>
              <CardContent>
                  {reasonsData.length > 0 ? (
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={reasonsData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {reasonsData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--card)', 
                                    borderRadius: '8px', 
                                    border: '1px solid var(--border)' 
                                }}
                            />
                                <Legend 
                                verticalAlign="bottom" 
                                height={60}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '9px', paddingTop: '8px' }}
                                formatter={(value) => {
                                    const maxLength = 20;
                                    const truncated = value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
                                    return <span style={{ fontSize: '9px' }}>{truncated}</span>;
                                }}
                            />
                            </PieChart>
                        </ResponsiveContainer>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground text-center p-4">
                          <AlertTriangle className="h-10 w-10 mb-2 opacity-20" />
                          <p className="text-sm">Nenhum motivo encontrado para o período selecionado.</p>
                      </div>
                  )}
              </CardContent>
          </Card>

          {/* Geo Distribution - Alterado para Município */}
          <Card className="col-span-1">
              <CardHeader>
                  <CardTitle className="text-base">Distribuição por Município</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {municipioData.length > 0 ? (
                          municipioData.map((municipio, i) => (
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
                          ))
                      ) : (
                          <div className="text-center text-sm text-muted-foreground py-8">
                              Nenhum dado disponível
                          </div>
                      )}
                  </div>
              </CardContent>
          </Card>

          {/* Produtos Críticos - Separado em CX e UN */}
          <Card className="col-span-1">
              <CardHeader>
                  <CardTitle className="text-base">Produtos Críticos</CardTitle>
              </CardHeader>
              <CardContent>
                  {topProdutos.length > 0 ? (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto">
                          {/* Top 5 em CX - SEMPRE MOSTRAR, mesmo que vazio */}
                          <div>
                              <h4 className="text-xs font-bold text-muted-foreground mb-2">Top 5 em CX</h4>
                              <div className="space-y-2">
                                  {topProdutos.filter(p => p.tipo === 'CX').length > 0 ? (
                                      topProdutos.filter(p => p.tipo === 'CX').map((produto, i) => (
                                          <div key={`cx-${i}`} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                                  <span className="text-xs font-bold text-muted-foreground w-6">{i + 1}º</span>
                                                  <span className="text-sm font-medium truncate" title={produto.nameFull || produto.name}>{produto.name}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                  <span className="text-sm font-bold">{produto.quantidade.toFixed(2)}</span>
                                                  <span className="text-xs text-muted-foreground">{produto.unidade || 'CX'}</span>
                                              </div>
                                          </div>
                                      ))
                                  ) : (
                                      <div className="text-xs text-muted-foreground p-2">Nenhum produto em CX encontrado</div>
                                  )}
                              </div>
                          </div>
                          
                          {/* Top 5 em UN - SEMPRE MOSTRAR, mesmo que vazio */}
                          <div>
                              <h4 className="text-xs font-bold text-muted-foreground mb-2">Top 5 em UN</h4>
                              <div className="space-y-2">
                                  {topProdutos.filter(p => p.tipo === 'UN').length > 0 ? (
                                      topProdutos.filter(p => p.tipo === 'UN').map((produto, i) => (
                                          <div key={`un-${i}`} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                                  <span className="text-xs font-bold text-muted-foreground w-6">{i + 1}º</span>
                                                  <span className="text-sm font-medium truncate" title={produto.nameFull || produto.name}>{produto.name}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                  <span className="text-sm font-bold">{produto.quantidade.toFixed(2)}</span>
                                                  <span className="text-xs text-muted-foreground">{produto.unidade || 'UN'}</span>
                                              </div>
                                          </div>
                                      ))
                                  ) : (
                                      <div className="text-xs text-muted-foreground p-2">Nenhum produto em UN encontrado</div>
                                  )}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground text-center p-4">
                          <PackageX className="h-10 w-10 mb-2 opacity-20" />
                          <p className="text-sm">Nenhum produto encontrado para o período selecionado.</p>
                      </div>
                  )}
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
