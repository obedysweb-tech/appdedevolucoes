import { useEffect, useState } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { FilterBar } from "@/components/filters/FilterBar";
import { useFilterStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { 
  DollarSign, 
  RefreshCcw, 
  AlertTriangle,
  TrendingUp,
  Users,
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
  Legend
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
      totalValue: 0,
      totalReturns: 0,
      avgTicket: 0,
      slaBreach: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [reasonsData, setReasonsData] = useState<any[]>([]);
  const [geoData, setGeoData] = useState<any[]>([]);
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
    
    // Base query
    let query = supabase.from('returns').select(`
        *,
        return_reasons(name),
        sectors(id, name)
    `);
    
    // Apply Filters
    if (filters.search) {
        query = query.or(`customer_name.ilike.%${filters.search}%,seller_name.ilike.%${filters.search}%`);
    }
    if (filters.startDate) {
        query = query.gte('invoice_date', filters.startDate.toISOString());
    }
    if (filters.endDate) {
        query = query.lte('invoice_date', filters.endDate.toISOString());
    }
    if (filters.sector && filters.sector.length > 0) {
        // Filter by sector_id if available in returns table
        // Note: You need to ensure 'sector_id' exists in 'returns' table or join filtering
        // Assuming we added sector_id to returns in migration
        query = query.in('sector_id', filters.sector);
    }
    
    const { data: returns, error } = await query;

    if (error) {
        console.error(error);
    } else if (returns) {
        // 1. Calculate KPIs
        const totalValue = returns.reduce((acc, curr) => acc + (curr.total_value || 0), 0);
        const totalReturns = returns.length;
        const avgTicket = totalReturns > 0 ? totalValue / totalReturns : 0;
        
        setStats({
            totalValue,
            totalReturns,
            avgTicket,
            slaBreach: 0 
        });

        // 2. Evolution Chart (Group by Month)
        const groupedByMonth = returns.reduce((acc: any, curr) => {
            const date = new Date(curr.invoice_date || curr.created_at);
            const month = format(date, 'MMM', { locale: ptBR });
            acc[month] = (acc[month] || 0) + curr.total_value;
            return acc;
        }, {});

        const chart = Object.keys(groupedByMonth).map(key => ({
            name: key,
            value: groupedByMonth[key]
        }));
        setChartData(chart);

        // 3. Top Customers
        const customerMap = returns.reduce((acc: any, curr) => {
            const name = curr.customer_name || 'Desconhecido';
            acc[name] = (acc[name] || 0) + curr.total_value;
            return acc;
        }, {});
        
        const topCust = Object.entries(customerMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
        setTopCustomers(topCust);

        // 4. Reasons Chart
        const reasonMap = returns.reduce((acc: any, curr) => {
            const reason = curr.return_reasons?.name || 'Não informado';
            acc[reason] = (acc[reason] || 0) + 1;
            return acc;
        }, {});
        
        const reasonsChart = Object.entries(reasonMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value)
            .slice(0, 5);
        setReasonsData(reasonsChart);

        // 5. Geo Data (States)
        const geoMap = returns.reduce((acc: any, curr) => {
            const uf = curr.origin_uf || 'N/A';
            acc[uf] = (acc[uf] || 0) + curr.total_value;
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

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor']}
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
             <div className="space-y-4">
                {topCustomers.map((cust, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium truncate max-w-[150px]" title={cust.name}>{cust.name}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">R$ {(cust.value as number).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                    </div>
                ))}
                {topCustomers.length === 0 && <p className="text-sm text-muted-foreground">Sem dados.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

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
                                {reasonsData.map((entry, index) => (
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
