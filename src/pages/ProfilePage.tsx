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
import { FilterBar } from "@/components/filters/FilterBar";

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
      totalValue: 0
  });

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

      // Buscar devoluções onde o vendedor é o usuário atual
      // Nota: Isso depende do nome do vendedor bater com o nome do usuário
      let query = supabase
        .from('returns')
        .select('*')
        .ilike('seller_name', `%${user.name}%`);

      // Aplicar filtros de data do FilterBar
      if (filters.startDate) {
          query = query.gte('invoice_date', filters.startDate.toISOString());
      }
      if (filters.endDate) {
          query = query.lte('invoice_date', filters.endDate.toISOString());
      }

      const { data: returns } = await query;

      if (returns) {
          const count = returns.length;
          const total = returns.reduce((acc, curr) => acc + (curr.total_value || 0), 0);
          
          // Calcular taxa de aprovação (se houver status final)
          const finished = returns.filter(r => r.status !== 'PENDING');
          const approved = returns.filter(r => r.status === 'APPROVED').length;
          const rate = finished.length > 0 ? (approved / finished.length) * 100 : 0;

          setStats({
              myReturnsCount: count,
              totalValue: total,
              approvalRate: Math.round(rate)
          });
      }
  };

  const fetchAuditLogs = async () => {
      let query = supabase
        .from('validation_logs')
        .select(`
            *,
            user:profiles(name, email),
            return:returns(invoice_number, customer_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      // Filtros de data também aplicam aos logs se desejar
      if (filters.startDate) {
          query = query.gte('created_at', filters.startDate.toISOString());
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
                        
                        <div className="rounded-lg border p-6 bg-card flex items-start gap-4 shadow-sm">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <BarChart3 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Resumo Automático</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {stats.myReturnsCount > 0 
                                        ? `Você registrou ${stats.myReturnsCount} devoluções neste período, totalizando R$ ${stats.totalValue.toLocaleString('pt-BR')}. Sua taxa de aprovação atual é de ${stats.approvalRate}%.`
                                        : "Nenhuma atividade registrada para o período selecionado. Ajuste os filtros acima para ver seu histórico."
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
                                            <TableCell className="font-medium">{log.user?.name}</TableCell>
                                            <TableCell>{log.return?.invoice_number}</TableCell>
                                            <TableCell>
                                                <Badge variant={log.action === 'APPROVED' ? 'default' : 'destructive'}>
                                                    {log.action === 'APPROVED' ? 'Aprovou' : 'Rejeitou'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs">{log.previous_status}</TableCell>
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
