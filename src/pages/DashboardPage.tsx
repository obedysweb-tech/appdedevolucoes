import { useEffect, useState } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { FilterBar } from "@/components/filters/FilterBar";
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
  PackageX
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
  Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

// Cores Doce Mel (Verde e tons derivados) + Ciano para Dark Mode
const COLORS_LIGHT = ['#18442b', '#2e6b4d', '#4a9170', '#70b896', '#9cdebd', '#c4f0da'];
const COLORS_DARK = ['#3fedef', '#2cb5b8', '#1e8285', '#135457', '#0a2e30', '#000000'];

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
  const [chartData, setChartData] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [topVendedores, setTopVendedores] = useState<any[]>([]);
  const [topRedes, setTopRedes] = useState<any[]>([]);
  const [reasonsData, setReasonsData] = useState<any[]>([]);
  const [geoData, setGeoData] = useState<any[]>([]);
  const [paretoData, setParetoData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(false);

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
  }, [filters]); 

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Usar vendedor do objeto user (já carregado no App.tsx)
    const userVendedor = user?.role === 'VENDEDOR' ? user.vendedor : null;
    
    // Base query - incluir itens para calcular produtos devolvidos
    // Remover join com clientes que pode estar causando problemas
    let query = supabase.from('devolucoes').select(`
        *,
        motivos_devolucao(nome),
        setores(nome),
        itens:itens_devolucao(quantidade, descricao, motivo_id)
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
        setChartData([]);
        setTopCustomers([]);
        setTopVendedores([]);
        setTopRedes([]);
        setParetoData([]);
        setHeatmapData([]);
        setInsights([]);
        setAlerts([]);
        setReasonsData([]);
        setGeoData([]);
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
        
        setStats({
            totalValue,
            totalReturns,
            avgTicket,
            slaBreach: 0,
            totalProducts
        });

        // 2. Gráfico de Evolução (Agrupar por Dia)
        const groupedByDay = devolucoes.reduce((acc: any, curr) => {
            const date = new Date(curr.data_emissao || curr.created_at);
            const day = format(date, 'dd/MM', { locale: ptBR });
            acc[day] = (acc[day] || 0) + (Number(curr.valor_total_nota) || 0);
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
                value: groupedByDay[key]
            }));
        setChartData(chart);

        // 3. Top Clientes
        const customerMap = devolucoes.reduce((acc: any, curr) => {
            const name = curr.nome_cliente || 'Desconhecido';
            const valor = Number(curr.valor_total_nota) || 0;
            acc[name] = (acc[name] || 0) + valor;
            return acc;
        }, {});
        
        const topCust = Object.entries(customerMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
        setTopCustomers(topCust);
        
        // Top Vendedores por valor
        const vendedorMap = devolucoes.reduce((acc: any, curr) => {
            const vendedor = curr.vendedor || 'Desconhecido';
            const valor = Number(curr.valor_total_nota) || 0;
            acc[vendedor] = (acc[vendedor] || 0) + valor;
            return acc;
        }, {});
        
        const topVend = Object.entries(vendedorMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
        setTopVendedores(topVend);
        
        // Top Redes por valor
        // Buscar redes dos clientes separadamente se necessário
        const redeMap = devolucoes.reduce((acc: any, curr) => {
            // Tentar obter rede de diferentes fontes
            let rede = curr.rede || 'Sem rede';
            
            // Se não tiver rede direto, tentar buscar do cliente via CNPJ
            if (rede === 'Sem rede' && curr.cnpj_destinatario) {
                // A query já tentou fazer join, mas se não funcionou, usar o que está disponível
                rede = curr.rede || 'Sem rede';
            }
            
            const valor = Number(curr.valor_total_nota) || 0;
            acc[rede] = (acc[rede] || 0) + valor;
            return acc;
        }, {});
        
        const topRed = Object.entries(redeMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
        setTopRedes(topRed);
        
        // Gráfico de Pareto (80/20) - Clientes
        const sortedCustomers = Object.entries(customerMap)
            .map(([name, value]) => ({ name, value: value as number }))
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
                index: index + 1
            };
        }).slice(0, 10);
        setParetoData(pareto);
        
        // Heatmap: Produto × Motivo (usando valores em R$)
        const produtoMotivoMap: Record<string, Record<string, number>> = {};
        devolucoes.forEach(devol => {
            const itens = devol.itens || [];
            itens.forEach((item: any) => {
                const produto = item.descricao || 'Desconhecido';
                // Buscar motivo do item primeiro, depois da devolução
                const motivo = item.motivo_item?.nome || devol.motivos_devolucao?.nome || 'Não informado';
                if (!produtoMotivoMap[produto]) {
                    produtoMotivoMap[produto] = {};
                }
                // Usar valor total bruto do item ao invés de quantidade
                const valorItem = Number(item.valor_total_bruto) || 0;
                produtoMotivoMap[produto][motivo] = (produtoMotivoMap[produto][motivo] || 0) + valorItem;
            });
        });
        
        // Converter para formato de heatmap
        const produtos = Object.keys(produtoMotivoMap).slice(0, 10);
        // Coletar todos os motivos únicos dos itens e devoluções
        const motivosUnicos = new Set<string>();
        devolucoes.forEach(devol => {
            const itens = devol.itens || [];
            itens.forEach((item: any) => {
                if (item.motivo_item?.nome) {
                    motivosUnicos.add(item.motivo_item.nome);
                }
            });
            if (devol.motivos_devolucao?.nome) {
                motivosUnicos.add(devol.motivos_devolucao.nome);
            }
        });
        const motivos = Array.from(motivosUnicos).slice(0, 8);
        
        const heatmap = produtos.map(produto => {
            const row: any = { produto };
            motivos.forEach(motivo => {
                row[motivo] = produtoMotivoMap[produto]?.[motivo] || 0;
            });
            return row;
        });
        setHeatmapData(heatmap);
        
        // Insights automáticos
        const insightsList: string[] = [];
        
        if (topCust.length > 0) {
            const top1Percent = (topCust[0].value as number / totalValue) * 100;
            if (top1Percent > 20) {
                insightsList.push(`⚠️ Cliente "${topCust[0].name}" concentra ${top1Percent.toFixed(1)}% do valor total de devoluções.`);
            }
        }
        
        if (totalProducts > 0 && totalReturns > 0) {
            const avgProductsPerReturn = totalProducts / totalReturns;
            insightsList.push(`📦 Média de ${avgProductsPerReturn.toFixed(1)} produtos por devolução.`);
        }
        
        if (topVend.length > 0) {
            insightsList.push(`👤 Vendedor "${topVend[0].name}" lidera em devoluções com R$ ${(topVend[0].value as number).toLocaleString('pt-BR')}.`);
        }
        
        const pareto80Index = pareto.findIndex(p => p.percentage >= 80);
        if (pareto80Index >= 0 && pareto80Index < 5) {
            insightsList.push(`📊 Regra 80/20: ${pareto80Index + 1} clientes concentram 80% do valor de devoluções.`);
        }
        
        setInsights(insightsList);
        
        // Alertas automáticos
        const alertsList: any[] = [];
        
        // Alerta: produtos acima da média
        if (totalProducts > 0 && totalReturns > 0) {
            const avgProductsPerReturn = totalProducts / totalReturns;
            devolucoes.forEach(devol => {
                const itens = devol.itens || [];
                const totalItens = itens.reduce((sum: number, item: any) => sum + (Number(item.quantidade) || 0), 0);
                if (totalItens > avgProductsPerReturn * 1.5) {
                    alertsList.push({
                        type: 'warning',
                        message: `Nota ${devol.numero} tem ${totalItens} produtos (acima da média de ${avgProductsPerReturn.toFixed(1)})`,
                        cliente: devol.nome_cliente
                    });
                }
            });
        }
        
        setAlerts(alertsList.slice(0, 5)); // Limitar a 5 alertas

        // 4. Gráfico de Motivos
        const reasonMap = devolucoes.reduce((acc: any, curr) => {
            const motivo = curr.motivos_devolucao;
            const reason = (typeof motivo === 'object' && motivo?.nome) ? motivo.nome : (typeof motivo === 'string' ? motivo : 'Não informado');
            acc[reason] = (acc[reason] || 0) + 1;
            return acc;
        }, {});

        const reasonsChart = Object.entries(reasonMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
        setReasonsData(reasonsChart);

        // 5. Dados Geográficos (Estados)
        const geoMap = devolucoes.reduce((acc: any, curr) => {
            const uf = curr.uf_origem || 'N/A';
            acc[uf] = (acc[uf] || 0) + (Number(curr.valor_total_nota) || 0);
            return acc;
        }, {});
        
        const geoChart = Object.entries(geoMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 6);
        setGeoData(geoChart);
    }
    setLoading(false);
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
        </Button>
      </div>
      
      <FilterBar />

      {/* Alertas */}
      {alerts.length > 0 && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5" />
              Alertas ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, idx) => (
                <div key={idx} className="text-sm text-orange-800 dark:text-orange-300">
                  • {alert.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
          value={stats.totalProducts}
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)'
                    }}
                    formatter={(value: number | undefined) => [`R$ ${(value || 0).toFixed(2)}`, 'Valor']}
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={CHART_COLORS[0]} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Clientes (Valor)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topCustomers}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="text-xs" tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value: number | undefined) => [`R$ ${(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, 'Valor']}
                />
                <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} />
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
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="text-xs" tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value: number | undefined) => [`R$ ${(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, 'Valor']}
                />
                <Bar dataKey="value" fill={CHART_COLORS[1]} radius={[8, 8, 0, 0]} />
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
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="text-xs" tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value: number | undefined) => [`R$ ${(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, 'Valor']}
                />
                <Bar dataKey="value" fill={CHART_COLORS[2]} radius={[8, 8, 0, 0]} />
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
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis yAxisId="left" className="text-xs" tickFormatter={(value) => `R$${value}`} />
                <YAxis yAxisId="right" orientation="right" className="text-xs" tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value: number | undefined, name: string | undefined) => {
                    const val = value || 0;
                    const nameStr = name || '';
                    if (nameStr === 'value') return [`R$ ${val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, 'Valor'];
                    if (nameStr === 'percentage') return [`${val.toFixed(1)}%`, 'Acumulado'];
                    return [val, nameStr];
                  }}
                />
                <Bar yAxisId="left" dataKey="value" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} />
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
            <CardTitle>Heatmap: Produto × Motivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left bg-muted text-xs">Produto</th>
                    {heatmapData[0] && Object.keys(heatmapData[0]).filter(k => k !== 'produto').map(motivo => (
                      <th key={motivo} className="border p-2 bg-muted text-xs">{motivo.length > 15 ? motivo.substring(0, 15) + '...' : motivo}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="border p-2 font-medium text-xs">{row.produto.length > 20 ? row.produto.substring(0, 20) + '...' : row.produto}</td>
                      {Object.keys(row).filter(k => k !== 'produto').map(motivo => {
                        const value = row[motivo] || 0;
                        const maxValue = Math.max(...heatmapData.map(r => Math.max(...Object.keys(r).filter(k => k !== 'produto').map(k => r[k] || 0))));
                        const intensity = maxValue > 0 ? (value / maxValue) * 100 : 0;
                        return (
                          <td 
                            key={motivo} 
                            className="border p-2 text-center text-xs"
                            style={{ 
                              backgroundColor: intensity > 0 ? `rgba(7, 62, 41, ${intensity / 100})` : 'transparent',
                              color: intensity > 50 ? 'white' : 'inherit'
                            }}
                            title={`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                          >
                            {value > 0 ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
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

      {/* Secondary Charts Row */}
      <div className="grid gap-4 md:grid-cols-3">
          {/* Reasons Chart */}
          <Card className="col-span-1">
              <CardHeader>
                  <CardTitle className="text-base">Principais Motivos</CardTitle>
              </CardHeader>
              <CardContent>
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
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                  </div>
              </CardContent>
          </Card>

          {/* Geo Distribution */}
          <Card className="col-span-1">
              <CardHeader>
                  <CardTitle className="text-base">Distribuição por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {geoData.map((geo, i) => (
                          <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">{geo.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <div className="h-2 bg-muted rounded-full w-24 overflow-hidden">
                                      <div 
                                        className="h-full bg-primary" 
                                        style={{ width: `${(geo.value / (stats.totalValue || 1)) * 100}%` }}
                                      />
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                      {((geo.value / (stats.totalValue || 1)) * 100).toFixed(0)}%
                                  </span>
                              </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>

          {/* Products Placeholder */}
          <Card className="col-span-1">
              <CardHeader>
                  <CardTitle className="text-base">Produtos Críticos</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground text-center p-4">
                      <PackageX className="h-10 w-10 mb-2 opacity-20" />
                      <p className="text-sm">Importe dados detalhados para visualizar o ranking de produtos.</p>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
