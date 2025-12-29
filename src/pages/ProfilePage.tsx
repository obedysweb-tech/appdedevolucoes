import { useAuthStore, useFilterStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, BarChart3, History, TrendingUp, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Share2 } from "lucide-react";

export function ProfilePage() {
  const { user } = useAuthStore();
  const { filters } = useFilterStore();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLogsPage, setAuditLogsPage] = useState(1);
  const [auditLogsTotal, setAuditLogsTotal] = useState(0);
  const auditLogsPerPage = 100;
  
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
  const [userKPIs, setUserKPIs] = useState<any>(null); // KPIs de usuários para ADMIN
  
  // Estados para compartilhamento WhatsApp
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (user) {
        fetchUserStats();
        // ADMIN, COMERCIAL e LOGISTICA veem histórico
        if (user.role === 'ADMIN' || user.role === 'COMERCIAL' || user.role === 'LOGISTICA') {
            fetchAuditLogs();
        }
        // ADMIN, COMERCIAL e LOGISTICA veem KPIs
        if (user.role === 'ADMIN' || user.role === 'COMERCIAL' || user.role === 'LOGISTICA') {
            fetchUserKPIs();
        }
    }
  }, [user, filters, auditLogsPage]); // Recalcula quando mudar o filtro de data ou página

  const fetchUserStats = async () => {
      if (!user) return;

      // ADMIN e COMERCIAL veem TODAS as devoluções (dados gerais)
      // Se não ADMIN/COMERCIAL, buscar devoluções do usuário atual
      let userQuery = supabase
        .from('devolucoes')
        .select('*');
      
      if (user.role === 'ADMIN' || user.role === 'COMERCIAL' || user.role === 'LOGISTICA') {
        // ADMIN, COMERCIAL e LOGISTICA veem tudo - não filtrar por usuário
      } else if (user.role === 'VENDEDOR' && user.vendedor) {
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
                  // Ordenar por data (assumindo formato "Mês Ano")
                  const monthMap: Record<string, number> = {
                      'jan': 1, 'fev': 2, 'mar': 3, 'abr': 4, 'mai': 5, 'jun': 6,
                      'jul': 7, 'ago': 8, 'set': 9, 'out': 10, 'nov': 11, 'dez': 12
                  };
                  const partsA = a.name.toLowerCase().split(' ');
                  const partsB = b.name.toLowerCase().split(' ');
                  const monthA = monthMap[partsA[0]?.substring(0, 3) || ''] || 0;
                  const monthB = monthMap[partsB[0]?.substring(0, 3) || ''] || 0;
                  const yearA = parseInt(partsA[1] || '0');
                  const yearB = parseInt(partsB[1] || '0');
                  const dateA = new Date(yearA, monthA - 1);
                  const dateB = new Date(yearB, monthB - 1);
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

  const fetchUserKPIs = async () => {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'COMERCIAL' && user.role !== 'LOGISTICA')) return;
      
      try {
        // Buscar todos os usuários VENDEDOR
        const { data: usuarios } = await supabase
          .from('profiles')
          .select('id, name, role, vendedor')
          .eq('role', 'VENDEDOR');
        
        if (!usuarios) return;
        
        // Buscar todas as devoluções com logs de validação
        const { data: devolucoes } = await supabase
          .from('devolucoes')
          .select(`
            *,
            logs_validacao(
              usuario_id,
              created_at,
              status_novo,
              status_anterior
            )
          `);
        
        if (!devolucoes) return;
        
        // Criar mapa de vendedor -> usuário
        const vendedorUsuarioMap: Record<string, any> = {};
        usuarios.forEach((usuario) => {
          if (usuario.vendedor) {
            vendedorUsuarioMap[usuario.vendedor] = {
              id: usuario.id,
              name: usuario.name,
              role: usuario.role,
              vendedor: usuario.vendedor,
              tempoMedioValidacao: 0,
              diasAtraso: 0,
              totalValidacoes: 0,
              notasPendentes: 0,
              notasCancelamento: 0,
              devolucoesValidadas: [] as any[],
              ultimaValidacao: null as Date | null
            };
          }
        });
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        // Processar devoluções por vendedor (não por usuário que validou)
        devolucoes.forEach((devol) => {
          const vendedor = devol.vendedor;
          if (!vendedor || !vendedorUsuarioMap[vendedor]) return;
          
          const usuario = vendedorUsuarioMap[vendedor];
          const logs = devol.logs_validacao || [];
          
          // Contar notas pendentes
          if (devol.resultado === 'PENDENTE VALIDAÇÃO') {
            usuario.notasPendentes++;
          }
          
          // Contar notas em cancelamento
          if (devol.resultado === 'TRATATIVA DE ANULAÇÃO') {
            usuario.notasCancelamento++;
          }
          
          // Encontrar log de validação (status_novo = VALIDADA)
          const logValidacao = logs.find((log: any) => log.status_novo === 'VALIDADA');
          
          if (logValidacao) {
            const logDate = new Date(logValidacao.created_at);
            const devolDate = new Date(devol.data_emissao || devol.created_at);
            const diasDiferenca = Math.floor((logDate.getTime() - devolDate.getTime()) / (1000 * 60 * 60 * 24));
            
            usuario.totalValidacoes++;
            usuario.tempoMedioValidacao += diasDiferenca;
            
            // Atualizar última validação se for mais recente
            if (!usuario.ultimaValidacao || logDate > usuario.ultimaValidacao) {
              usuario.ultimaValidacao = logDate;
            }
            
            usuario.devolucoesValidadas.push({
              dias: diasDiferenca,
              prazo: devol.prazo
            });
          }
        });
        
        // Calcular médias e dias em atraso
        Object.keys(vendedorUsuarioMap).forEach((vendedor) => {
          const usuario = vendedorUsuarioMap[vendedor];
          if (usuario.totalValidacoes > 0) {
            usuario.tempoMedioValidacao = Math.round(usuario.tempoMedioValidacao / usuario.totalValidacoes);
          }
          
          // Calcular dias em atraso: média do campo "dias" de notas com PENDENTE VALIDAÇÃO e prazo EM ATRASO
          // Buscar notas do vendedor com esses critérios
          const notasAtraso = devolucoes.filter((devol: any) => 
            devol.vendedor === vendedor &&
            devol.resultado === 'PENDENTE VALIDAÇÃO' &&
            devol.prazo === 'EM ATRASO' &&
            devol.dias != null &&
            devol.dias > 0
          );
          
          if (notasAtraso.length > 0) {
            const somaDias = notasAtraso.reduce((sum: number, devol: any) => sum + (Number(devol.dias) || 0), 0);
            usuario.diasAtraso = Math.round(somaDias / notasAtraso.length);
          } else {
            usuario.diasAtraso = 0;
          }
        });
        
        setUserKPIs({
          usuarios: Object.values(vendedorUsuarioMap),
          totalUsuarios: Object.keys(vendedorUsuarioMap).length
        });
      } catch (error) {
        console.error('Erro ao buscar KPIs de usuários:', error);
      }
  };

  // Função para buscar validações do vendedor para uma data específica
  const fetchValidacoesPorData = async (data: Date) => {
    if (!user || user.role !== 'VENDEDOR' || !user.vendedor) return [];
    
    // Formatar data como YYYY-MM-DD para usar na query
    const dataStr = format(data, 'yyyy-MM-dd');
    
    console.log('Buscando validações para a data:', dataStr);
    console.log('Vendedor do usuário:', user.vendedor);
    
    // Estratégia: buscar devoluções validadas do vendedor
    // e depois verificar a data de validação através dos logs
    // Não usar join com order by em tabela relacionada (não funciona no Supabase)
    const { data: devolucoes, error: devolucoesError } = await supabase
      .from('devolucoes')
      .select(`
        *,
        itens:itens_devolucao(*, motivo_item:motivos_devolucao(nome)),
        logs_validacao!inner(
          created_at,
          status_novo,
          acao
        )
      `)
      .eq('vendedor', user.vendedor)
      .eq('resultado', 'VALIDADA')
      .eq('logs_validacao.status_novo', 'VALIDADA');
    
    if (devolucoesError) {
      console.error('Erro ao buscar devoluções com logs:', devolucoesError);
      
      // Fallback: buscar apenas devoluções validadas e depois buscar logs separadamente
      console.log('Tentando fallback: buscar devoluções sem join...');
      const { data: devolucoesSimples, error: simplesError } = await supabase
        .from('devolucoes')
        .select(`
          *,
          itens:itens_devolucao(*, motivo_item:motivos_devolucao(nome))
        `)
        .eq('vendedor', user.vendedor)
        .eq('resultado', 'VALIDADA');
      
      if (simplesError) {
        console.error('Erro ao buscar devoluções simples:', simplesError);
        return [];
      }
      
      console.log('Devoluções encontradas (sem filtro de data):', devolucoesSimples?.length || 0);
      
      // Buscar logs para cada devolução
      if (devolucoesSimples && devolucoesSimples.length > 0) {
        const devolucoesIds = devolucoesSimples.map(d => d.id);
        
        // Buscar logs de validação para essas devoluções
        const { data: logs, error: logsError } = await supabase
          .from('logs_validacao')
          .select('devolucao_id, created_at, status_novo')
          .in('devolucao_id', devolucoesIds)
          .eq('status_novo', 'VALIDADA')
          .order('created_at', { ascending: false });
        
        if (logsError) {
          console.error('Erro ao buscar logs:', logsError);
          console.log('Retornando todas as devoluções sem filtro de data');
          // Retornar todas as devoluções se não conseguir buscar logs
          return devolucoesSimples;
        }
        
        console.log('Logs encontrados:', logs?.length || 0);
        if (logs && logs.length > 0) {
          console.log('Primeiros 3 logs:', logs.slice(0, 3).map(l => ({
            devolucao_id: l.devolucao_id,
            created_at: l.created_at,
            data_formatada: format(new Date(l.created_at), 'yyyy-MM-dd'),
            status: l.status_novo
          })));
        } else {
          console.log('⚠️ Nenhum log encontrado para as devoluções!');
        }
        
        // Criar mapa de data de validação por devolução (pegar o log mais recente de cada devolução)
        const validacaoPorDevolucao = new Map<string, Date>();
        logs?.forEach(log => {
          const existing = validacaoPorDevolucao.get(log.devolucao_id);
          const logDate = new Date(log.created_at);
          // Se não existe ou se este log é mais recente, atualizar
          if (!existing || logDate > existing) {
            validacaoPorDevolucao.set(log.devolucao_id, logDate);
          }
        });
        
        console.log('Mapa de validações criado:', validacaoPorDevolucao.size, 'devoluções com data de validação');
        console.log('Data buscada:', dataStr);
        
        // Mostrar algumas datas de validação para debug
        if (validacaoPorDevolucao.size > 0) {
          const primeirasDatas = Array.from(validacaoPorDevolucao.entries()).slice(0, 5);
          console.log('Primeiras datas de validação:', primeirasDatas.map(([id, date]) => ({
            devolucao_id: id.substring(0, 8) + '...',
            data: format(date, 'yyyy-MM-dd')
          })));
        }
        
        // Filtrar devoluções validadas na data escolhida
        const devolucoesFiltradas = devolucoesSimples.filter(devol => {
          const dataValidacao = validacaoPorDevolucao.get(devol.id);
          if (!dataValidacao) {
            console.log('Devolução', devol.numero, 'não tem data de validação nos logs');
            return false;
          }
          const dataValidacaoStr = format(dataValidacao, 'yyyy-MM-dd');
          const match = dataValidacaoStr === dataStr;
          if (!match) {
            console.log('Devolução', devol.numero, 'validada em', dataValidacaoStr, 'não corresponde a', dataStr);
          }
          return match;
        });
        
        console.log('Devoluções filtradas pela data:', devolucoesFiltradas.length);
        if (devolucoesFiltradas.length > 0) {
          console.log('Primeiras devoluções filtradas:', devolucoesFiltradas.slice(0, 3).map(d => ({
            numero: d.numero,
            vendedor: d.vendedor
          })));
        }
        return devolucoesFiltradas;
      }
      
      return [];
    }
    
    if (!devolucoes || devolucoes.length === 0) {
      console.log('Nenhuma devolução encontrada');
      return [];
    }
    
    console.log('Devoluções encontradas (com join):', devolucoes.length);
    
    // Filtrar pela data de validação (usando o log mais recente de cada devolução)
    const devolucoesFiltradas = devolucoes.filter((devol: any) => {
      const logs = devol.logs_validacao || [];
      if (logs.length === 0) return false;
      
      // Pegar o log mais recente de validação
      const logValidacao = logs
        .filter((l: any) => l.status_novo === 'VALIDADA')
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      if (!logValidacao) return false;
      
      const dataValidacao = new Date(logValidacao.created_at);
      const dataValidacaoStr = format(dataValidacao, 'yyyy-MM-dd');
      return dataValidacaoStr === dataStr;
    });
    
    console.log('Devoluções filtradas pela data:', devolucoesFiltradas.length);
    
    // Remover os logs do objeto antes de retornar (já foram usados para filtrar)
    const devolucoesLimpos = devolucoesFiltradas.map((devol: any) => {
      const { logs_validacao, ...resto } = devol;
      return resto;
    });
    
    return devolucoesLimpos;
  };
  
  // Função para buscar tratativas do vendedor
  const fetchTratativas = async () => {
    if (!user || user.role !== 'VENDEDOR' || !user.vendedor) return [];
    
    const { data: devolucoes } = await supabase
      .from('devolucoes')
      .select(`
        *,
        itens:itens_devolucao(*)
      `)
      .eq('vendedor', user.vendedor)
      .eq('resultado', 'TRATATIVA DE ANULAÇÃO')
      .order('data_emissao', { ascending: false });
    
    return devolucoes || [];
  };
  
  // Função para gerar texto de validações
  const gerarTextoValidacoes = (devolucoes: any[], data: Date) => {
    if (!user || !user.vendedor) return '';
    
    const dataFormatada = format(data, 'dd/MM/yyyy', { locale: ptBR });
    let texto = `✅ *RESUMO: NOTAS VALIDADAS - ${user.vendedor}*\n\n`;
    texto += `📆 *DATA DA VALIDAÇÃO* ${dataFormatada}\n`;
    texto += `👤 *USUÁRIO* ${user.name}\n\n`;
    texto += `🔎 *DETALHAMENTO*\n\n`;
    
    devolucoes.forEach((devol, index) => {
      texto += `============= ${index + 1}º NOTA FISCAL =============\n`;
      texto += `📄 *DEVOLUÇÃO Nº* ${devol.numero || '-'}\n`;
      texto += `🏪 *Cliente:* ${devol.nome_cliente || '-'}\n`;
      texto += `💼 *Vendedor:* ${devol.vendedor || '-'}\n`;
      texto += `📆 *Data de Emissão:* ${format(new Date(devol.data_emissao), 'dd/MM/yyyy', { locale: ptBR })}\n`;
      texto += `📝 *Observação:* ${devol.justificativa || '-'}\n`;
      
      // Calcular valor total
      const valorTotal = devol.itens?.reduce((sum: number, item: any) => 
        sum + (Number(item.valor_total_bruto) || 0), 0) || Number(devol.valor_total_nota) || 0;
      texto += `💰 *Valor Total da NFD:* R$ ${valorTotal.toFixed(2)}\n`;
      
      // Calcular dias para validação
      const dataEmissao = new Date(devol.data_emissao);
      const dataValidacao = new Date(data);
      const dias = Math.floor((dataValidacao.getTime() - dataEmissao.getTime()) / (1000 * 60 * 60 * 24));
      texto += `🔢 *Média de Dias p/ Validação:* ${dias} dias\n`;
      texto += `⏳ *Prazo:* ${dias >= 3 ? 'VALIDADA COM ATRASO' : 'DENTRO DO PRAZO'}\n`;
      texto += `-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n`;
      
      // Produtos
      devol.itens?.forEach((item: any) => {
        const descricao = item.descricao || '-';
        const palavras = descricao.split(' ').slice(0, 3).join(' ');
        texto += `📦 *Produto:* ${palavras}\n`;
        texto += `⚖️ *Quantidade:* ${item.quantidade || 0} ${item.unidade || 'UN'}\n`;
        texto += `💰 *Valor Total:* R$ ${Number(item.valor_total_bruto || 0).toFixed(2)}\n`;
        texto += `🎯 *Motivo:* ${item.motivo_item?.nome || '-'}\n`;
        texto += `-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n`;
      });
    });
    
    return texto;
  };
  
  // Função para gerar texto de tratativas
  const gerarTextoTratativas = (devolucoes: any[]) => {
    if (!user || !user.vendedor) return '';
    
    let texto = `⚠️ *RESUMO: NOTAS EM TRATATIVAS - ${user.vendedor}*\n\n`;
    texto += `📆 *DATA DA SINALIZAÇÃO* ${format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}\n`;
    texto += `👤 *USUÁRIO* ${user.name}\n\n`;
    texto += `🔎 *DETALHAMENTO*\n\n`;
    
    devolucoes.forEach((devol, index) => {
      texto += `============= ${index + 1}º NOTA FISCAL =============\n`;
      texto += `📄 *DEVOLUÇÃO Nº* ${devol.numero || '-'}\n`;
      texto += `🏪 *Cliente:* ${devol.nome_cliente || '-'}\n`;
      texto += `💼 *Vendedor:* ${devol.vendedor || '-'}\n`;
      texto += `📆 *Data de Emissão:* ${format(new Date(devol.data_emissao), 'dd/MM/yyyy', { locale: ptBR })}\n`;
      
      const valorTotal = devol.itens?.reduce((sum: number, item: any) => 
        sum + (Number(item.valor_total_bruto) || 0), 0) || Number(devol.valor_total_nota) || 0;
      texto += `💰 *Valor Total da NFD:* R$ ${valorTotal.toFixed(2)}\n`;
      texto += `📝 *Observação:* ${devol.justificativa || '-'}\n`;
      texto += `-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n`;
      
      // Produtos (apenas nomes, 3 primeiras palavras)
      devol.itens?.forEach((item: any) => {
        const descricao = item.descricao || '-';
        const palavras = descricao.split(' ').slice(0, 3).join(' ');
        texto += `📦 *Produto:* ${palavras}\n`;
      });
    });
    
    return texto;
  };
  
  // Função para compartilhar via WhatsApp
  const compartilharWhatsApp = (texto: string) => {
    // Usar api.whatsapp.com para melhor suporte a emojis
    const textoEncoded = encodeURIComponent(texto);
    window.open(`https://api.whatsapp.com/send?text=${textoEncoded}`, '_blank');
  };
  
  // Handler para compartilhar validações
  const handleCompartilharValidacoes = async () => {
    if (!selectedDate) {
      toast.error('Selecione uma data');
      return;
    }
    
    const devolucoes = await fetchValidacoesPorData(selectedDate);
    if (devolucoes.length === 0) {
      toast.error('Nenhuma validação encontrada para esta data');
      return;
    }
    
    const texto = gerarTextoValidacoes(devolucoes, selectedDate);
    compartilharWhatsApp(texto);
    setShowValidationDialog(false);
  };
  
  // Handler para compartilhar tratativas
  const handleCompartilharTratativas = async () => {
    const devolucoes = await fetchTratativas();
    if (devolucoes.length === 0) {
      toast.error('Nenhuma tratativa encontrada');
      return;
    }
    
    const texto = gerarTextoTratativas(devolucoes);
    compartilharWhatsApp(texto);
  };

  const fetchAuditLogs = async () => {
      console.log('📋 fetchAuditLogs - Iniciando busca de logs para role:', user?.role);
      
      // Primeiro, contar total de registros
      let countQuery = supabase
        .from('logs_validacao')
        .select('*', { count: 'exact', head: true });
      
      if (filters.startDate) {
          countQuery = countQuery.gte('created_at', filters.startDate.toISOString());
      }
      if (filters.endDate) {
          countQuery = countQuery.lte('created_at', filters.endDate.toISOString());
      }
      
      const { count, error: countError } = await countQuery;
      if (countError) {
          console.error('❌ Erro ao contar logs:', countError);
      }
      console.log('📋 Total de logs encontrados:', count);
      setAuditLogsTotal(count || 0);
      
      // Buscar registros paginados
      const from = (auditLogsPage - 1) * auditLogsPerPage;
      const to = from + auditLogsPerPage - 1;
      
      let query = supabase
        .from('logs_validacao')
        .select(`
            *,
            user:profiles(name, email),
            devolucao:devolucoes(numero, nome_cliente)
        `)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      // Filtros de data também aplicam aos logs
      if (filters.startDate) {
          query = query.gte('created_at', filters.startDate.toISOString());
      }
      if (filters.endDate) {
          query = query.lte('created_at', filters.endDate.toISOString());
      }

      const { data, error } = await query;
      if (error) {
          console.error('❌ Erro ao buscar logs:', error);
      } else {
          console.log('✅ Logs carregados:', data?.length || 0);
      }
      if (data) {
          setAuditLogs(data);
      } else {
          setAuditLogs([]);
      }
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

  // Se usuário não tem role ou é tipo NOVO, mostrar apenas o header
  if (!user.role || user.role === 'NOVO') {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Meu Perfil" 
          description="Aguarde a atribuição de permissões por um administrador para acessar os recursos do sistema."
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                Seu perfil está aguardando a atribuição de permissões por um administrador.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Entre em contato com o administrador do sistema para obter acesso.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={(user.role === 'ADMIN' || user.role === 'COMERCIAL' || user.role === 'LOGISTICA') ? "Painel Administrativo" : "Meu Perfil"} 
        description={(user.role === 'ADMIN' || user.role === 'COMERCIAL' || user.role === 'LOGISTICA')
          ? "Visão geral de todos os dados do sistema, métricas gerais e KPIs de usuários."
          : "Visualize suas métricas pessoais, histórico de validações e gerencie suas configurações de segurança."
        }
      />
      
      {/* Filtros removidos conforme solicitado */}

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
                <div className="mt-2 space-y-1">
                    <Badge variant="outline" className="border-primary text-primary">
                      {user.role || 'Sem permissões'}
                    </Badge>
                    {user.role === 'VENDEDOR' && user.vendedor && (
                        <div className="text-sm text-muted-foreground mt-2">
                            <div className="font-medium">VENDEDOR</div>
                            <div className="text-primary font-semibold">{user.vendedor}</div>
                        </div>
                    )}
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
                <Tabs defaultValue={user.role === 'GESTOR' ? 'security' : 'overview'}>
                    <TabsList className="w-full justify-start">
                        {/* GESTOR não vê Visão Geral nem Histórico */}
                        {user.role !== 'GESTOR' && (
                            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        )}
                        {/* ADMIN, COMERCIAL e LOGISTICA veem Histórico */}
                        {(user.role === 'ADMIN' || user.role === 'COMERCIAL' || user.role === 'LOGISTICA') && (
                            <TabsTrigger value="audit">Histórico de Validações</TabsTrigger>
                        )}
                        <TabsTrigger value="security">Segurança</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {(user.role === 'ADMIN' || user.role === 'COMERCIAL' || user.role === 'LOGISTICA') ? 'Total de Devoluções' : 'Minhas Devoluções'}
                                    </CardTitle>
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
                        
                        {/* Gráfico de linha: devoluções no tempo */}
                        {timelineData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {(user.role === 'ADMIN' || user.role === 'COMERCIAL' || user.role === 'LOGISTICA') ? 'Devoluções no Tempo' : 'Minhas Devoluções no Tempo'}
                                    </CardTitle>
                                    <CardDescription>
                                        {(user.role === 'ADMIN' || user.role === 'COMERCIAL' || user.role === 'LOGISTICA') 
                                            ? 'Evolução mensal de todas as devoluções' 
                                            : 'Evolução mensal das suas devoluções'}
                                    </CardDescription>
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
                                                formatter={(value: number | undefined, name?: string) => {
                                                    if (name === 'quantidade') return [value, 'Quantidade'];
                                                    if (name === 'valor') return [`R$ ${(value || 0).toLocaleString('pt-BR')}`, 'Valor'];
                                                    return [value, name || ''];
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
                        
                        {/* Botões de Compartilhamento WhatsApp - Apenas para VENDEDOR */}
                        {user.role === 'VENDEDOR' && user.vendedor && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Compartilhar Resumos</CardTitle>
                                    <CardDescription>Compartilhe seus resumos via WhatsApp</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
                                            <DialogTrigger asChild>
                                                <Button className="flex-1" variant="outline">
                                                    <Share2 className="mr-2 h-4 w-4" />
                                                    COMPARTILHAR VALIDAÇÃO
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Selecione a Data da Validação</DialogTitle>
                                                    <DialogDescription>
                                                        Escolha a data para gerar o resumo de validações
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <Calendar
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={setSelectedDate}
                                                        className="rounded-md border"
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setShowValidationDialog(false)}>
                                                        Cancelar
                                                    </Button>
                                                    <Button onClick={handleCompartilharValidacoes}>
                                                        OK
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        
                                        <Button 
                                            className="flex-1" 
                                            variant="outline"
                                            onClick={handleCompartilharTratativas}
                                        >
                                            <Share2 className="mr-2 h-4 w-4" />
                                            COMPARTILHAR TRATATIVAS
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        {/* KPIs de Usuários - Para ADMIN, COMERCIAL e LOGISTICA */}
                        {(user.role === 'ADMIN' || user.role === 'COMERCIAL' || user.role === 'LOGISTICA') && userKPIs && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>KPIs de Usuários</CardTitle>
                                    <CardDescription>Métricas de desempenho por usuário</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {userKPIs.usuarios.map((usuario: any, index: number) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-semibold">{usuario.name}</h4>
                                                        {usuario.role === 'VENDEDOR' && usuario.vendedor && (
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                <span className="font-medium">VENDEDOR:</span> <span className="text-primary font-semibold">{usuario.vendedor}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Badge variant="outline">{usuario.role}</Badge>
                                                </div>
                                                <div className="grid gap-2 md:grid-cols-3 text-sm">
                                                    {usuario.role === 'VENDEDOR' && (
                                                        <>
                                                            <div>
                                                                <span className="text-muted-foreground">Média Tempo Validação:</span>
                                                                <span className="ml-2 font-semibold">{usuario.tempoMedioValidacao} dias</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Total Validações:</span>
                                                                <span className="ml-2 font-semibold">{usuario.totalValidacoes}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Dias em Atraso:</span>
                                                                <span className={`ml-2 font-semibold ${usuario.diasAtraso >= 3 ? 'text-red-600' : 'text-green-600'}`}>
                                                                    {usuario.diasAtraso} dias
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Notas Pendentes:</span>
                                                                <span className="ml-2 font-semibold">{usuario.notasPendentes || 0}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Notas em Cancelamento:</span>
                                                                <span className="ml-2 font-semibold">{usuario.notasCancelamento || 0}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    {usuario.role === 'LOGISTICA' && (
                                                        <>
                                                            <div>
                                                                <span className="text-muted-foreground">Média Tempo Lançamento:</span>
                                                                <span className="ml-2 font-semibold">{usuario.tempoMedioLancamento} dias</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Total Lançamentos:</span>
                                                                <span className="ml-2 font-semibold">{usuario.totalLancamentos}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {userKPIs.usuarios.length === 0 && (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                Nenhum usuário VENDEDOR ou LOGISTICA encontrado.
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
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
                                    {auditLogs && auditLogs.length > 0 ? (
                                        auditLogs.map((log) => (
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
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                <History className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                                <p>Nenhum registro de validação encontrado.</p>
                                                {user?.role === 'COMERCIAL' || user?.role === 'LOGISTICA' ? (
                                                    <p className="text-xs mt-2">Carregando dados...</p>
                                                ) : null}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Paginação */}
                        {auditLogsTotal > 0 && (
                            <div className="flex items-center justify-between px-2 py-4 border-t">
                                <div className="text-sm text-muted-foreground">
                                    {auditLogsTotal > auditLogsPerPage ? (
                                        <>Mostrando {((auditLogsPage - 1) * auditLogsPerPage) + 1} a {Math.min(auditLogsPage * auditLogsPerPage, auditLogsTotal)} de {auditLogsTotal} registros</>
                                    ) : (
                                        <>Total de {auditLogsTotal} registro(s)</>
                                    )}
                                </div>
                                {auditLogsTotal > auditLogsPerPage && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setAuditLogsPage(prev => {
                                                    const newPage = Math.max(1, prev - 1);
                                                    return newPage;
                                                });
                                            }}
                                            disabled={auditLogsPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Anterior
                                        </Button>
                                        <div className="text-sm text-muted-foreground">
                                            Página {auditLogsPage} de {Math.ceil(auditLogsTotal / auditLogsPerPage)}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setAuditLogsPage(prev => {
                                                    const maxPage = Math.ceil(auditLogsTotal / auditLogsPerPage);
                                                    return Math.min(maxPage, prev + 1);
                                                });
                                            }}
                                            disabled={auditLogsPage >= Math.ceil(auditLogsTotal / auditLogsPerPage)}
                                        >
                                            Próxima
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
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
