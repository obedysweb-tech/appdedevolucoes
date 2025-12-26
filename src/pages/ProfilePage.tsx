import { useAuthStore, useFilterStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, BarChart3, History, TrendingUp, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilterBar } from "@/components/filters/FilterBar";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export function ProfilePage() {
  const { user } = useAuthStore();
  const { filters } = useFilterStore();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  
  // Stats State
  const [stats, setStats] = useState({
      myReturnsCount: 0,
      approvalRate: 0,
      totalValue: 0,
      avgCompanyTicket: 0,
      avgCompanyReturns: 0
  });
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [summaryText, setSummaryText] = useState("");

  useEffect(() => {
    if (user) {
        fetchUserStats();
        if (user.role === 'ADMIN' || user.role === 'GESTOR') {
            fetchAuditLogs();
        }
    }
  }, [user, filters]); // Recalcula quando mudar o filtro de data

  const fetchUserStats = async () => {
      if (!user) return;

      // Buscar devoluções do usuário atual
      let userQuery = supabase
        .from('devolucoes')
        .select('*');
      
      // Filtrar por vendedor se for VENDEDOR
      if (user.role === 'VENDEDOR' && user.vendedor) {
        userQuery = userQuery.eq('vendedor', user.vendedor);
      } else {
        // Para outros roles, buscar por nome do vendedor
        userQuery = userQuery.ilike('vendedor', `%${user.name}%`);
      }

      // Aplicar filtros de data do FilterBar
      if (filters.startDate) {
          userQuery = userQuery.gte('data_emissao', filters.startDate.toISOString());
      }
      if (filters.endDate) {
          userQuery = userQuery.lte('data_emissao', filters.endDate.toISOString());
      }

      const { data: devolucoes } = await userQuery;

      // Buscar todas as devoluções para calcular média da empresa
      let companyQuery = supabase
        .from('devolucoes')
        .select('*');
      
      if (filters.startDate) {
          companyQuery = companyQuery.gte('data_emissao', filters.startDate.toISOString());
      }
      if (filters.endDate) {
          companyQuery = companyQuery.lte('data_emissao', filters.endDate.toISOString());
      }
      
      const { data: allDevolucoes } = await companyQuery;

      if (devolucoes) {
          const count = devolucoes.length;
          const total = devolucoes.reduce((acc, curr) => acc + (Number(curr.valor_total_nota) || 0), 0);
          
          // Calcular taxa de aprovação baseado no resultado
          const finished = devolucoes.filter(r => r.resultado && r.resultado !== 'PENDENTE VALIDAÇÃO');
          const approved = devolucoes.filter(r => r.resultado === 'VALIDADA' || r.resultado === 'LANÇADA').length;
          const rate = finished.length > 0 ? (approved / finished.length) * 100 : 0;

          // Calcular média da empresa
          const companyCount = allDevolucoes?.length || 0;
          const companyTotal = allDevolucoes?.reduce((acc, curr) => acc + (Number(curr.valor_total_nota) || 0), 0) || 0;
          const avgCompanyTicket = companyCount > 0 ? companyTotal / companyCount : 0;
          const myAvgTicket = count > 0 ? total / count : 0;

          setStats({
              myReturnsCount: count,
              totalValue: total,
              approvalRate: Math.round(rate),
              avgCompanyTicket,
              avgCompanyReturns: companyCount
          });

          // Gráfico de linha: minhas devoluções no tempo
          const groupedByMonth = devolucoes.reduce((acc: any, curr) => {
              const date = new Date(curr.data_emissao || curr.created_at);
              const month = format(date, 'MMM yyyy', { locale: ptBR });
              if (!acc[month]) {
                  acc[month] = { count: 0, value: 0 };
              }
              acc[month].count += 1;
              acc[month].value += Number(curr.valor_total_nota) || 0;
              return acc;
          }, {});

          const timeline = Object.entries(groupedByMonth)
              .map(([name, data]: [string, any]) => ({
                  name,
                  quantidade: data.count,
                  valor: data.value
              }))
              .sort((a, b) => {
                  const dateA = new Date(a.name.split(' ')[1] + '-' + (ptBR.localize?.month?.parse(a.name.split(' ')[0]) || 0));
                  const dateB = new Date(b.name.split(' ')[1] + '-' + (ptBR.localize?.month?.parse(b.name.split(' ')[0]) || 0));
                  return dateA.getTime() - dateB.getTime();
              });
          
          setTimelineData(timeline);

          // Resumo textual automático melhorado
          const comparison = myAvgTicket > avgCompanyTicket ? 'acima' : myAvgTicket < avgCompanyTicket ? 'abaixo' : 'igual';
          const diffPercent = avgCompanyTicket > 0 ? Math.abs(((myAvgTicket - avgCompanyTicket) / avgCompanyTicket) * 100).toFixed(1) : '0';
          
          let summary = `Você registrou ${count} devoluções neste período, totalizando R$ ${total.toLocaleString('pt-BR')}. `;
          summary += `Sua taxa de aprovação é de ${Math.round(rate)}%. `;
          if (count > 0 && companyCount > 0) {
              summary += `Seu ticket médio (R$ ${myAvgTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}) está ${comparison} da média da empresa (R$ ${avgCompanyTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}). `;
              if (comparison !== 'igual') {
                  summary += `Diferença de ${diffPercent}%. `;
              }
          }
          summary += `A empresa registrou ${companyCount} devoluções no total neste período.`;
          
          setSummaryText(summary);
      }
  };

  const fetchAuditLogs = async () => {
      let query = supabase
        .from('logs_validacao')
        .select(`
            *,
            user:profiles(name, email),
            devolucao:devolucoes(numero, nome_cliente)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      // Filtros de data também aplicam aos logs
      if (filters.startDate) {
          query = query.gte('created_at', filters.startDate.toISOString());
      }
      if (filters.endDate) {
          query = query.lte('created_at', filters.endDate.toISOString());
      }

      const { data } = await query;
      if (data) setAuditLogs(data);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        toast.success("Senha atualizada com sucesso!");
        setNewPassword("");
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
      
      {/* Filtros Globais agora presentes no Perfil */}
      <FilterBar />

      <div className="grid gap-6 md:grid-cols-7">
        {/* User Info Card */}
        <Card className="md:col-span-2 h-fit">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24 border-4 border-primary/10">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="text-2xl font-bold text-primary bg-primary/10">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <div className="mt-2">
                    <Badge variant="outline" className="border-primary text-primary">{user.role}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 text-sm bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <User className="h-4 w-4 text-primary" />
                        <span className="truncate" title={user.id}>ID: {user.id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="truncate" title={user.email}>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Acesso: {user.role}</span>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Details & Stats */}
        <Card className="md:col-span-5">
            <CardHeader>
                <CardTitle>Painel do Usuário</CardTitle>
                <CardDescription>Suas métricas e configurações pessoais</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="overview">
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        {(user.role === 'ADMIN' || user.role === 'GESTOR') && (
                            <TabsTrigger value="audit">Histórico de Validações</TabsTrigger>
                        )}
                        <TabsTrigger value="security">Segurança</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Minhas Devoluções</CardTitle>
                                    <Package className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">{stats.myReturnsCount}</div>
                                    <p className="text-xs text-muted-foreground">No período selecionado</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Valor Envolvido</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">R$ {stats.totalValue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                                    <p className="text-xs text-muted-foreground">Total devolvido</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Aprovação</CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.approvalRate}%</div>
                                    <p className="text-xs text-muted-foreground">Das devoluções finalizadas</p>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Gráfico de linha: minhas devoluções no tempo */}
                        {timelineData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Minhas Devoluções no Tempo</CardTitle>
                                    <CardDescription>Evolução mensal das suas devoluções</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={timelineData}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                            <XAxis dataKey="name" className="text-xs" />
                                            <YAxis yAxisId="left" className="text-xs" />
                                            <YAxis yAxisId="right" orientation="right" className="text-xs" tickFormatter={(value) => `R$${value}`} />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: 'var(--card)', 
                                                    borderRadius: '8px', 
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--foreground)'
                                                }}
                                                formatter={(value: number | undefined, name: string) => {
                                                    if (name === 'quantidade') return [value, 'Quantidade'];
                                                    if (name === 'valor') return [`R$ ${(value || 0).toLocaleString('pt-BR')}`, 'Valor'];
                                                    return [value, name];
                                                }}
                                            />
                                            <Legend />
                                            <Line yAxisId="left" type="monotone" dataKey="quantidade" stroke="#073e29" strokeWidth={2} name="Quantidade" />
                                            <Line yAxisId="right" type="monotone" dataKey="valor" stroke="#4a9170" strokeWidth={2} name="Valor (R$)" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}
                        
                        {/* Comparação com média da empresa */}
                        {stats.myReturnsCount > 0 && stats.avgCompanyReturns > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Comparação com Média da Empresa</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="text-sm text-muted-foreground">Seu Ticket Médio</div>
                                            <div className="text-2xl font-bold">
                                                R$ {stats.myReturnsCount > 0 ? (stats.totalValue / stats.myReturnsCount).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '0'}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm text-muted-foreground">Ticket Médio da Empresa</div>
                                            <div className="text-2xl font-bold text-muted-foreground">
                                                R$ {stats.avgCompanyTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                            </div>
                                        </div>
                                    </div>
                                    {stats.myReturnsCount > 0 && (
                                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                            <div className="text-sm">
                                                {stats.totalValue / stats.myReturnsCount > stats.avgCompanyTicket ? (
                                                    <span className="text-orange-600 dark:text-orange-400">
                                                        ⚠️ Seu ticket médio está {(stats.totalValue / stats.myReturnsCount / stats.avgCompanyTicket * 100 - 100).toFixed(1)}% acima da média da empresa.
                                                    </span>
                                                ) : stats.totalValue / stats.myReturnsCount < stats.avgCompanyTicket ? (
                                                    <span className="text-green-600 dark:text-green-400">
                                                        ✅ Seu ticket médio está {(100 - stats.totalValue / stats.myReturnsCount / stats.avgCompanyTicket * 100).toFixed(1)}% abaixo da média da empresa.
                                                    </span>
                                                ) : (
                                                    <span className="text-blue-600 dark:text-blue-400">
                                                        📊 Seu ticket médio está igual à média da empresa.
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                        
                        {/* Resumo textual automático */}
                        <div className="rounded-lg border p-6 bg-card flex items-start gap-4 shadow-sm">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <BarChart3 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Resumo Automático</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {summaryText || (stats.myReturnsCount > 0 
                                        ? `Você registrou ${stats.myReturnsCount} devoluções neste período, totalizando R$ ${stats.totalValue.toLocaleString('pt-BR')}. Sua taxa de aprovação atual é de ${stats.approvalRate}%.`
                                        : "Nenhuma atividade registrada para o período selecionado. Ajuste os filtros acima para ver seu histórico.")
                                    }
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="audit" className="mt-6">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Usuário</TableHead>
                                        <TableHead>Nota Fiscal</TableHead>
                                        <TableHead>Ação</TableHead>
                                        <TableHead>Status Anterior</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {auditLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-xs">
                                                {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm')}
                                            </TableCell>
                                            <TableCell className="font-medium">{log.user?.name || 'Sistema'}</TableCell>
                                            <TableCell>{log.devolucao?.numero || log.devolucao_id?.slice(0, 8) || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    log.acao === 'SELECIONAR_MOTIVO' || log.status_novo === 'VALIDADA' ? 'default' : 
                                                    log.status_novo === 'TRATATIVA DE ANULAÇÃO' ? 'destructive' : 
                                                    'secondary'
                                                }>
                                                    {log.acao === 'SELECIONAR_MOTIVO' ? 'Validou' : 
                                                     log.acao === 'ALTERAR_RESULTADO' ? 'Alterou Resultado' :
                                                     log.acao || 'Ação'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {log.status_anterior} → {log.status_novo}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {auditLogs.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                <History className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                                <p>Nenhum registro de validação encontrado.</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="security" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Alterar Senha</CardTitle>
                                <CardDescription>Escolha uma senha forte para proteger sua conta.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">Nova Senha</Label>
                                        <Input 
                                            id="new-password" 
                                            type="password" 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Mínimo de 6 caracteres"
                                            minLength={6}
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading || !newPassword}>
                                        {loading ? "Atualizando..." : "Atualizar Senha"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
