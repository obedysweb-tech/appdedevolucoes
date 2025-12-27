import { useState, useEffect } from "react";
import { FilterBar } from "@/components/filters/FilterBar";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, Save, ArrowUpDown, ArrowUp, ArrowDown, FileText, Trash2, Edit, Share2, CheckSquare, Square, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuthStore, useFilterStore } from "@/lib/store";
import { getDateRangeFromPeriod } from "@/lib/dateUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ResultadoStatus = 'PENDENTE VALIDAÇÃO' | 'VALIDADA' | 'LANÇADA' | 'TRATATIVA DE ANULAÇÃO' | 'ANULADA/CANCELADA';

const RESULTADO_CICLO: ResultadoStatus[] = [
  'PENDENTE VALIDAÇÃO',
  'VALIDADA',
  'LANÇADA',
  'TRATATIVA DE ANULAÇÃO',
  'ANULADA/CANCELADA'
];

const RESULTADO_CORES: Record<ResultadoStatus, string> = {
  'PENDENTE VALIDAÇÃO': 'bg-red-500 hover:bg-red-600 text-white',
  'VALIDADA': 'bg-blue-500 hover:bg-blue-600 text-white',
  'LANÇADA': 'bg-green-500 hover:bg-green-600 text-white',
  'TRATATIVA DE ANULAÇÃO': 'bg-orange-500 hover:bg-orange-600 text-white',
  'ANULADA/CANCELADA': 'bg-black hover:bg-gray-900 text-white'
};

const RESULTADO_ORDEM: Record<ResultadoStatus, number> = {
  'PENDENTE VALIDAÇÃO': 1,
  'VALIDADA': 2,
  'LANÇADA': 3,
  'TRATATIVA DE ANULAÇÃO': 4,
  'ANULADA/CANCELADA': 5
};

function getProximoResultado(atual: ResultadoStatus): ResultadoStatus {
  const index = RESULTADO_CICLO.indexOf(atual);
  const proximoIndex = (index + 1) % RESULTADO_CICLO.length;
  return RESULTADO_CICLO[proximoIndex];
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

type SortField = 'data_emissao' | 'numero' | 'nome_cliente' | 'cidade_origem' | 'vendedor' | 'motivo' | 'valor_total_nota' | 'dias' | 'prazo' | 'resultado';
type SortDirection = 'asc' | 'desc' | null;

export function ValidationPage() {
  const [data, setData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [motivos, setMotivos] = useState<any[]>([]);
  const [setores, setSetores] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<Record<string, string>>({});
  const [savingComment, setSavingComment] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [stats, setStats] = useState({
    nfPendentes: 0,
    totalPendente: 0,
    nfCancelamento: 0,
    totalCancelamento: 0,
    nfAtraso: 0,
    totalAtraso: 0
  });
  const { user } = useAuthStore();
  const { filters } = useFilterStore();
  const itemsPerPage = 100;

  useEffect(() => {
    fetchMotivos();
    fetchSetores();
    fetchReturns();
    // Resetar ordenação e página quando filtros mudarem
    setSortField(null);
    setSortDirection(null);
    setCurrentPage(1);
  }, [filters]);

  const fetchMotivos = async () => {
    try {
      // Primeiro busca os motivos
      const { data: motivosData, error } = await supabase
        .from('motivos_devolucao')
        .select('id, nome, sector_id')
        .order('nome');
      
      if (error) {
        console.error('Erro ao buscar motivos:', error);
        toast.error('Erro ao carregar motivos');
        return;
      }
      
      if (!motivosData || motivosData.length === 0) {
        console.warn('Nenhum motivo encontrado');
        setMotivos([]);
        return;
      }
      
      // Busca os setores correspondentes
      const sectorIds = motivosData
        .map(m => m.sector_id)
        .filter(id => id !== null);
      
      let setoresMap: Record<string, string> = {};
      
      if (sectorIds.length > 0) {
        const { data: setoresData } = await supabase
          .from('setores')
          .select('id, nome')
          .in('id', sectorIds);
        
        if (setoresData) {
          setoresMap = setoresData.reduce((acc: Record<string, string>, setor: any) => {
            acc[setor.id] = setor.nome;
            return acc;
          }, {});
        }
      }
      
      // Combina os dados
      const motivosComSetores = motivosData.map(motivo => ({
        ...motivo,
        setores: motivo.sector_id ? { nome: setoresMap[motivo.sector_id] || '' } : null
      }));
      
      console.log('Motivos carregados:', motivosComSetores.length);
      setMotivos(motivosComSetores);
    } catch (error) {
      console.error('Erro ao buscar motivos:', error);
      toast.error('Erro ao carregar motivos');
    }
  };

  const fetchSetores = async () => {
    const { data: setoresData } = await supabase
      .from('setores')
      .select('id, nome')
      .order('nome');
    
    if (setoresData) {
      setSetores(setoresData);
    }
  };

  const fetchReturns = async () => {
    setLoading(true);
    
    // Usar vendedor do objeto user (já carregado no App.tsx)
    const userVendedor = user?.role === 'VENDEDOR' ? user.vendedor : null;
    
    let query = supabase
        .from('devolucoes')
        .select(`
            *,
            itens:itens_devolucao(*, motivo_item:motivos_devolucao(id, nome)),
            setores:setores(nome),
            motivos_devolucao:motivos_devolucao(id, nome, setores:setores(nome))
        `);
    
    // Filtrar por vendedor do usuário (apenas se for tipo VENDEDOR)
    if (user && user.role === 'VENDEDOR' && userVendedor) {
      query = query.eq('vendedor', userVendedor);
      console.log('🔒 Validação - Filtrando por vendedor:', userVendedor);
    }
    
    // Aplicar período se não houver datas específicas
    const periodDates = filters.period && !filters.startDate && !filters.endDate 
      ? getDateRangeFromPeriod(filters.period)
      : {};
    const effectiveStartDate = filters.startDate || periodDates.startDate;
    const effectiveEndDate = filters.endDate || periodDates.endDate;
    
    // Aplicar filtros
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
    
    const { data: devolucoes, error } = await query.order('created_at', { ascending: false });

    if (error) {
        toast.error("Erro ao carregar devoluções");
        console.error(error);
    } else if (devolucoes) {
        // Buscar dados dos clientes baseado no CNPJ para preencher nome, vendedor e rede
        const cnpjs = devolucoes
          .map(d => d.cnpj_destinatario)
          .filter(cnpj => cnpj && cnpj.trim() !== '');
        
        let clientesMap = new Map();
        if (cnpjs.length > 0) {
          const { data: clientes } = await supabase
            .from('clientes')
            .select('cnpj_cpf, nome, vendedor, rede, uf, municipio')
            .in('cnpj_cpf', cnpjs);
          
          if (clientes) {
            clientes.forEach(cliente => {
              clientesMap.set(cliente.cnpj_cpf, cliente);
            });
          }
        }

        // Buscar logs de validação para obter nomes dos usuários validadores
        const devolucaoIds = devolucoes.map(d => d.id);
        let validadoresMap = new Map<string, string>();
        
        if (devolucaoIds.length > 0) {
          const { data: logs } = await supabase
            .from('logs_validacao')
            .select(`
              devolucao_id,
              status_novo,
              usuario_id
            `)
            .in('devolucao_id', devolucaoIds)
            .order('created_at', { ascending: false });
          
          if (logs) {
            // Buscar nomes dos usuários primeiro
            const userIds = [...new Set(logs.map((l: any) => l.usuario_id).filter(Boolean))];
            const usuariosMap = new Map<string, string>();
            
            if (userIds.length > 0) {
              const { data: usuarios } = await supabase
                .from('profiles')
                .select('id, name')
                .in('id', userIds);
              
              if (usuarios) {
                usuarios.forEach((u: any) => {
                  usuariosMap.set(u.id, u.name);
                });
              }
            }
            
            // Criar mapa com o último validador por devolução e status
            logs.forEach((log: any) => {
              const key = `${log.devolucao_id}_${log.status_novo}`;
              if (!validadoresMap.has(key)) {
                const nomeUsuario = usuariosMap.get(log.usuario_id);
                if (nomeUsuario) {
                  validadoresMap.set(key, nomeUsuario);
                }
              }
            });
          }
        }
        
        const formattedData = devolucoes.map((item: any) => {
          const cliente = clientesMap.get(item.cnpj_destinatario);
          
          // Processar itens para incluir motivo
          const itensProcessados = item.itens?.map((prod: any) => ({
            ...prod,
            motivo_nome: prod.motivo_item?.nome || '-'
          }));
          
          // Buscar nome do validador baseado no resultado atual
          const resultado = item.resultado || 'PENDENTE VALIDAÇÃO';
          let nomeValidador = '-';
          
          if (resultado !== 'PENDENTE VALIDAÇÃO') {
            const key = `${item.id}_${resultado}`;
            nomeValidador = validadoresMap.get(key) || '-';
          }
          
          return {
            ...item,
            setor: item.setores?.nome,
            motivo: (typeof item.motivos_devolucao === 'object' && item.motivos_devolucao?.nome) ? item.motivos_devolucao.nome : (typeof item.motivos_devolucao === 'string' ? item.motivos_devolucao : '-'),
            motivo_id: item.motivo_id,
            resultado: resultado,
            itens: itensProcessados,
            nome_validador: nomeValidador,
            // Preencher com dados do cliente se encontrado
            nome_cliente: cliente?.nome || item.nome_cliente || 'Cliente não encontrado',
            vendedor: cliente?.vendedor || item.vendedor || '-',
            rede: cliente?.rede || item.rede || '-',
            uf_destino: cliente?.uf || item.uf_destino || '-',
            cidade_destino: cliente?.municipio || item.cidade_destino || '-'
          };
        });
        
        // Aplicar ordenação padrão inicialmente (a ordenação customizada será aplicada no useEffect)
        const sortedDefault = formattedData.sort((a, b) => {
          const ordemA = RESULTADO_ORDEM[a.resultado as ResultadoStatus] || 999;
          const ordemB = RESULTADO_ORDEM[b.resultado as ResultadoStatus] || 999;
          
          if (ordemA !== ordemB) {
            return ordemA - ordemB;
          }
          
          const dataA = a.data_emissao ? new Date(a.data_emissao).getTime() : 0;
          const dataB = b.data_emissao ? new Date(b.data_emissao).getTime() : 0;
          return dataB - dataA;
        });
        
        setAllData(sortedDefault);
        
        // Calcular estatísticas (usar dados ordenados padrão)
        const nfPendentes = sortedDefault.filter(d => d.resultado === 'PENDENTE VALIDAÇÃO').length;
        const totalPendente = sortedDefault
          .filter(d => d.resultado === 'PENDENTE VALIDAÇÃO')
          .reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
        
        const nfCancelamento = sortedDefault.filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO').length;
        const totalCancelamento = sortedDefault
          .filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO')
          .reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
        
        const nfAtraso = sortedDefault.filter(d => d.prazo === 'EM ATRASO').length;
        const totalAtraso = sortedDefault
          .filter(d => d.prazo === 'EM ATRASO')
          .reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
        
        setStats({
          nfPendentes,
          totalPendente,
          nfCancelamento,
          totalCancelamento,
          nfAtraso,
          totalAtraso
        });
        
        // Inicializar comentários
        const comentariosInicial: Record<string, string> = {};
        sortedDefault.forEach(item => {
          comentariosInicial[item.id] = item.justificativa || '';
        });
        setComentarios(comentariosInicial);
    }
    setLoading(false);
  };
  
  // Aplicar ordenação customizada quando o usuário clicar nos cabeçalhos
  useEffect(() => {
    if (allData.length === 0) return;
    
    let sorted = [...allData];
    
    if (sortField && sortDirection) {
      sorted = [...allData].sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        switch (sortField) {
          case 'data_emissao':
            aValue = a.data_emissao ? new Date(a.data_emissao).getTime() : 0;
            bValue = b.data_emissao ? new Date(b.data_emissao).getTime() : 0;
            break;
          case 'numero':
            aValue = a.numero || '';
            bValue = b.numero || '';
            break;
          case 'nome_cliente':
            aValue = (a.nome_cliente || '').toLowerCase();
            bValue = (b.nome_cliente || '').toLowerCase();
            break;
          case 'cidade_origem':
            aValue = (a.cidade_origem || '').toLowerCase();
            bValue = (b.cidade_origem || '').toLowerCase();
            break;
          case 'vendedor':
            aValue = (a.vendedor || '').toLowerCase();
            bValue = (b.vendedor || '').toLowerCase();
            break;
          case 'motivo':
            aValue = (a.motivo || '').toLowerCase();
            bValue = (b.motivo || '').toLowerCase();
            break;
          case 'valor_total_nota':
            aValue = parseFloat(a.valor_total_nota || 0);
            bValue = parseFloat(b.valor_total_nota || 0);
            break;
          case 'dias':
            aValue = a.dias !== null && a.dias !== undefined ? a.dias : -1;
            bValue = b.dias !== null && b.dias !== undefined ? b.dias : -1;
            break;
          case 'prazo':
            aValue = (a.prazo || '').toLowerCase();
            bValue = (b.prazo || '').toLowerCase();
            break;
          case 'resultado':
            aValue = RESULTADO_ORDEM[a.resultado as ResultadoStatus] || 999;
            bValue = RESULTADO_ORDEM[b.resultado as ResultadoStatus] || 999;
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Se não houver ordenação customizada, aplicar ordenação padrão
      sorted = [...allData].sort((a, b) => {
        const ordemA = RESULTADO_ORDEM[a.resultado as ResultadoStatus] || 999;
        const ordemB = RESULTADO_ORDEM[b.resultado as ResultadoStatus] || 999;
        
        if (ordemA !== ordemB) {
          return ordemA - ordemB;
        }
        
        const dataA = a.data_emissao ? new Date(a.data_emissao).getTime() : 0;
        const dataB = b.data_emissao ? new Date(b.data_emissao).getTime() : 0;
        return dataB - dataA;
      });
    }
    
    // Atualizar dados ordenados e paginação
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setData(sorted.slice(startIndex, endIndex));
  }, [sortField, sortDirection, allData, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Se já está ordenando por este campo, alternar direção
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      // Novo campo, começar com ascendente
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Resetar para primeira página ao ordenar
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-1 h-4 w-4" />;
    }
    return <ArrowDown className="ml-1 h-4 w-4" />;
  };

  const handleResultadoChange = async (id: string, resultadoAtual: string) => {
      if (!user) return;

      const resultadoAtualTyped = resultadoAtual as ResultadoStatus;
      const novoResultado = getProximoResultado(resultadoAtualTyped);

      try {
        // 1. Atualizar Resultado
        const { error: updateError } = await supabase
            .from('devolucoes')
            .update({ resultado: novoResultado })
            .eq('id', id);
        
        if (updateError) throw updateError;

        // 2. Log da Ação
        const { error: logError } = await supabase
            .from('logs_validacao')
            .insert({
                devolucao_id: id,
                usuario_id: user.id,
                acao: 'ALTERAR_RESULTADO',
                status_anterior: resultadoAtual,
                status_novo: novoResultado
            });

        if (logError) console.error("Erro ao salvar log:", logError);

        toast.success(`Resultado alterado para: ${novoResultado}`);
        
        // Atualizar apenas o item específico na lista local sem recarregar tudo
        const updateItem = (item: any) => {
          if (item.id === id) {
            return {
              ...item,
              resultado: novoResultado,
              nome_validador: novoResultado !== 'PENDENTE VALIDAÇÃO' ? (user.name || user.email || '-') : '-'
            };
          }
          return item;
        };
        
        setData(prevData => prevData.map(updateItem));
        setAllData(prevData => prevData.map(updateItem));

      } catch (error: any) {
          toast.error("Erro ao processar: " + error.message);
      }
  };

  const handleMotivoChange = async (id: string, motivoId: string) => {
    if (!user) return;

    try {
      // Buscar status atual antes de atualizar
      const { data: devolucaoAtual } = await supabase
          .from('devolucoes')
          .select('resultado')
          .eq('id', id)
          .single();

      const statusAnterior = devolucaoAtual?.resultado || 'PENDENTE VALIDAÇÃO';

      // Aplicar o mesmo motivo para todos os produtos desta devolução PRIMEIRO
      const { data: itens } = await supabase
          .from('itens_devolucao')
          .select('id')
          .eq('devolucao_id', id);
      
      if (itens && itens.length > 0) {
        for (const item of itens) {
          const { error: itemError } = await supabase
              .from('itens_devolucao')
              .update({ motivo_id: motivoId })
              .eq('id', item.id);
          
          if (itemError) {
            console.error("Erro ao atualizar item:", itemError);
            throw itemError;
          }
        }
      }

      // Depois de atualizar todos os produtos, atualizar motivo e resultado para VALIDADA
      const { error: updateError } = await supabase
          .from('devolucoes')
          .update({ 
            motivo_id: motivoId,
            resultado: 'VALIDADA'
          })
          .eq('id', id);
      
      if (updateError) throw updateError;

      // Log da Ação
      const { error: logError } = await supabase
          .from('logs_validacao')
          .insert({
              devolucao_id: id,
              usuario_id: user.id,
              acao: 'SELECIONAR_MOTIVO',
              status_anterior: statusAnterior,
              status_novo: 'VALIDADA'
          });

      if (logError) console.error("Erro ao salvar log:", logError);

      toast.success("Motivo aplicado a todos os produtos e resultado alterado para VALIDADA!");
      
      // Atualizar apenas o item específico na lista local sem recarregar tudo
      const updateItem = (item: any) => {
        if (item.id === id) {
          return {
            ...item,
            motivo_id: motivoId,
            resultado: 'VALIDADA',
            nome_validador: user.name || user.email || '-',
            itens: item.itens?.map((prod: any) => ({ ...prod, motivo_id: motivoId }))
          };
        }
        return item;
      };
      
      setData(prevData => prevData.map(updateItem));
      setAllData(prevData => prevData.map(updateItem));

    } catch (error: any) {
        toast.error("Erro ao processar: " + error.message);
    }
  };

  const handleComentarioChange = (id: string, value: string) => {
    const words = countWords(value);
    if (words > 100) {
      toast.warning("Máximo de 100 palavras permitido");
      return;
    }
    setComentarios(prev => ({ ...prev, [id]: value }));
  };

  const handleSalvarComentario = async (id: string) => {
    if (!user) return;

    setSavingComment(prev => ({ ...prev, [id]: true }));

    try {
      const { error } = await supabase
          .from('devolucoes')
          .update({ justificativa: comentarios[id] || null })
          .eq('id', id);
      
      if (error) throw error;

      toast.success("Comentário salvo com sucesso!");
      
      // Log da Ação
      await supabase
          .from('logs_validacao')
          .insert({
              devolucao_id: id,
              usuario_id: user.id,
              acao: 'ADICIONAR_COMENTARIO',
              status_anterior: null,
              status_novo: null
          });

    } catch (error: any) {
        toast.error("Erro ao salvar comentário: " + error.message);
    } finally {
      setSavingComment(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleMotivoItemChange = async (itemId: string, motivoId: string, devolucaoId: string) => {
    if (!user) return;

    try {
      // Atualizar motivo do item
      const { error: itemError } = await supabase
          .from('itens_devolucao')
          .update({ motivo_id: motivoId })
          .eq('id', itemId);
      
      if (itemError) throw itemError;

      // Buscar todos os itens desta devolução
      const { data: todosItens, error: itensError } = await supabase
          .from('itens_devolucao')
          .select('id, motivo_id')
          .eq('devolucao_id', devolucaoId);
      
      if (itensError) throw itensError;

      // Verificar se todos os itens têm motivo
      const todosTemMotivo = todosItens && todosItens.length > 0 && todosItens.every(item => item.motivo_id);

      // Se todos têm motivo, atualizar resultado para VALIDADA e definir motivo_id na devolução
      if (todosTemMotivo) {
        // Calcular o motivo mais repetido ou o primeiro escolhido
        const motivoCounts: Record<string, number> = {};
        let primeiroMotivo: string | null = null;
        
        todosItens.forEach((item: any) => {
          if (item.motivo_id) {
            if (!primeiroMotivo) {
              primeiroMotivo = item.motivo_id;
            }
            motivoCounts[item.motivo_id] = (motivoCounts[item.motivo_id] || 0) + 1;
          }
        });

        // Encontrar o motivo mais repetido
        let motivoMaisRepetido: string | null = primeiroMotivo;
        let maxCount = 0;
        
        Object.entries(motivoCounts).forEach(([motivo, count]) => {
          if (count > maxCount) {
            maxCount = count;
            motivoMaisRepetido = motivo;
          }
        });

        // Atualizar devolução com resultado VALIDADA e motivo_id (mais repetido ou primeiro)
        const { data: devolucao } = await supabase
            .from('devolucoes')
            .select('resultado, motivo_id')
            .eq('id', devolucaoId)
            .single();

        if (devolucao && motivoMaisRepetido) {
          const updateData: any = { resultado: 'VALIDADA' };
          
          // Atualizar motivo_id apenas se ainda não estiver definido ou se for diferente
          if (!devolucao.motivo_id || devolucao.motivo_id !== motivoMaisRepetido) {
            updateData.motivo_id = motivoMaisRepetido;
          }

          const { error: updateError } = await supabase
              .from('devolucoes')
              .update(updateData)
              .eq('id', devolucaoId);
          
          if (updateError) {
            console.error("Erro ao atualizar resultado e motivo:", updateError);
            throw updateError;
          }

          // Log da Ação
          await supabase
              .from('logs_validacao')
              .insert({
                  devolucao_id: devolucaoId,
                  usuario_id: user.id,
                  acao: 'SELECIONAR_MOTIVO_PRODUTO',
                  status_anterior: devolucao.resultado || 'PENDENTE VALIDAÇÃO',
                  status_novo: 'VALIDADA'
              });
        }
      }

      // Atualizar estado local ANTES de mostrar toast
      setData(prevData => prevData.map(item => {
        if (item.id === devolucaoId) {
          // Atualizar o item específico
          const itensAtualizados = item.itens?.map((prod: any) => 
            prod.id === itemId ? { ...prod, motivo_id: motivoId } : prod
          );

          // Recalcular se todos têm motivo usando os dados atualizados (usar variável do escopo superior)

          // Calcular motivo_id para atualizar na lista local também
          const motivoCounts: Record<string, number> = {};
          let primeiroMotivo: string | null = null;
          
          itensAtualizados?.forEach((prod: any) => {
            if (prod.motivo_id) {
              if (!primeiroMotivo) {
                primeiroMotivo = prod.motivo_id;
              }
              motivoCounts[prod.motivo_id] = (motivoCounts[prod.motivo_id] || 0) + 1;
            }
          });

          // Encontrar o motivo mais repetido
          let motivoMaisRepetidoLocal: string | null = primeiroMotivo;
          let maxCount = 0;
          
          Object.entries(motivoCounts).forEach(([motivo, count]) => {
            if (count > maxCount) {
              maxCount = count;
              motivoMaisRepetidoLocal = motivo;
            }
          });

          // Buscar nome do motivo mais repetido
          const motivoMaisRepetidoObj = motivos.find(m => m.id === motivoMaisRepetidoLocal);
          const motivoNome = motivoMaisRepetidoObj?.nome || item.motivo || '-';

          return {
            ...item,
            itens: itensAtualizados,
            resultado: todosTemMotivo ? 'VALIDADA' : item.resultado,
            motivo_id: todosTemMotivo && motivoMaisRepetidoLocal ? motivoMaisRepetidoLocal : item.motivo_id,
            motivo: todosTemMotivo && motivoMaisRepetidoLocal ? motivoNome : item.motivo,
            motivos_devolucao: todosTemMotivo && motivoMaisRepetidoLocal ? motivoMaisRepetidoObj : item.motivos_devolucao,
            nome_validador: todosTemMotivo ? (user.name || user.email || '-') : item.nome_validador
          };
        }
        return item;
      }));

      // Atualizar allData também
      setAllData(prevData => prevData.map(item => {
        if (item.id === devolucaoId) {
          const itensAtualizados = item.itens?.map((prod: any) => 
            prod.id === itemId ? { ...prod, motivo_id: motivoId } : prod
          );

          // Recalcular se todos têm motivo usando os dados atualizados
          const todosTemMotivoLocal = itensAtualizados && itensAtualizados.length > 0 && 
            itensAtualizados.every((prod: any) => prod.motivo_id);

          const motivoCounts: Record<string, number> = {};
          let primeiroMotivo: string | null = null;
          
          itensAtualizados?.forEach((prod: any) => {
            if (prod.motivo_id) {
              if (!primeiroMotivo) {
                primeiroMotivo = prod.motivo_id;
              }
              motivoCounts[prod.motivo_id] = (motivoCounts[prod.motivo_id] || 0) + 1;
            }
          });

          let motivoMaisRepetidoLocal: string | null = primeiroMotivo;
          let maxCount = 0;
          
          Object.entries(motivoCounts).forEach(([motivo, count]) => {
            if (count > maxCount) {
              maxCount = count;
              motivoMaisRepetidoLocal = motivo;
            }
          });

          // Buscar nome do motivo mais repetido
          const motivoMaisRepetidoObj = motivos.find(m => m.id === motivoMaisRepetidoLocal);
          const motivoNome = motivoMaisRepetidoObj?.nome || item.motivo || '-';

          return {
            ...item,
            itens: itensAtualizados,
            resultado: todosTemMotivoLocal ? 'VALIDADA' : item.resultado,
            motivo_id: todosTemMotivoLocal && motivoMaisRepetidoLocal ? motivoMaisRepetidoLocal : item.motivo_id,
            motivo: todosTemMotivoLocal && motivoMaisRepetidoLocal ? motivoNome : item.motivo,
            motivos_devolucao: todosTemMotivoLocal && motivoMaisRepetidoLocal ? motivoMaisRepetidoObj : item.motivos_devolucao
          };
        }
        return item;
      }));

      if (todosTemMotivo) {
        toast.success("Todos os produtos validados! Resultado alterado para VALIDADA.");
      } else {
        toast.success("Motivo do item atualizado!");
      }

    } catch (error: any) {
        toast.error("Erro ao atualizar motivo: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;

    try {
      // Deletar itens primeiro
      const { error: itemsError } = await supabase
        .from('itens_devolucao')
        .delete()
        .eq('devolucao_id', id);

      if (itemsError) throw itemsError;

      // Deletar registro principal
      const { error: deleteError } = await supabase
        .from('devolucoes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast.success('Registro excluído com sucesso!');
      fetchReturns(); // Recarregar dados
      setSelectedItems(new Set());
    } catch (error: any) {
      toast.error("Erro ao excluir registro: " + error.message);
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedItems.size === 0) {
      toast.warning('Selecione pelo menos um registro para excluir');
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir ${selectedItems.size} registro(s)?`)) return;

    try {
      const ids = Array.from(selectedItems);
      
      // Deletar itens primeiro
      for (const id of ids) {
        await supabase
          .from('itens_devolucao')
          .delete()
          .eq('devolucao_id', id);
      }

      // Deletar registros principais
      const { error } = await supabase
        .from('devolucoes')
        .delete()
        .in('id', ids);

      if (error) throw error;

      toast.success(`${ids.length} registro(s) excluído(s) com sucesso!`);
      fetchReturns(); // Recarregar dados
      setSelectedItems(new Set());
      setIsSelectMode(false);
    } catch (error: any) {
      toast.error("Erro ao excluir registros: " + error.message);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
  };

  const handleSaveEdit = async () => {
    if (!editingItem || !user) return;

    try {
      const { error } = await supabase
        .from('devolucoes')
        .update({
          numero: editingItem.numero,
          nome_cliente: editingItem.nome_cliente,
          vendedor: editingItem.vendedor,
          cidade_origem: editingItem.cidade_origem,
          uf_origem: editingItem.uf_origem,
          data_emissao: editingItem.data_emissao,
          valor_total_nota: editingItem.valor_total_nota,
          peso_liquido: editingItem.peso_liquido,
          motivo_id: editingItem.motivo_id,
          setor_id: editingItem.setor_id,
          resultado: editingItem.resultado,
          justificativa: editingItem.justificativa,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      toast.success('Registro atualizado com sucesso!');
      setEditingItem(null);
      fetchReturns(); // Recarregar dados
    } catch (error: any) {
      toast.error("Erro ao atualizar registro: " + error.message);
    }
  };

  const handleShareWhatsApp = (item: any) => {
    const produtos = item.itens?.map((prod: any, index: number) => 
      `${index + 1}. ${prod.descricao || '-'}\n   Quantidade: ${prod.quantidade || '-'} ${prod.unidade || ''}\n   Valor Unitário: R$ ${(Number(prod.valor_unitario) || 0).toFixed(2)}\n   Valor Total: R$ ${(Number(prod.valor_total_bruto) || 0).toFixed(2)}`
    ).join('\n\n') || 'Nenhum produto cadastrado';

    const mensagem = `📋 *Devolução - Nota Fiscal ${item.numero || '-'}*

*Cliente:* ${item.nome_cliente || '-'}
*Vendedor:* ${item.vendedor || '-'}
*Data de Emissão:* ${item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
*Origem:* ${item.cidade_origem || '-'}/${item.uf_origem || '-'}

*Valor Total:* R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
*Peso Líquido:* ${item.peso_liquido || '-'} kg
*Dias:* ${item.dias !== null && item.dias !== undefined ? item.dias : '-'}
*Prazo:* ${item.prazo || '-'}
*Resultado:* ${item.resultado || '-'}
*Motivo:* ${item.motivo || '-'}
*Setor:* ${item.setor || '-'}

*Produtos:*
${produtos}

${item.justificativa ? `*Comentário:*\n${item.justificativa}` : ''}`;

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === data.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(data.map(item => item.id)));
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Cores corporativas (verde do app #073e29)
      const primaryColor: [number, number, number] = [7, 62, 41]; // Verde principal #073e29
      const secondaryColor: [number, number, number] = [10, 80, 55]; // Verde escuro
      const successColor: [number, number, number] = [7, 62, 41]; // Verde
      const warningColor: [number, number, number] = [251, 191, 36]; // Amarelo
      const dangerColor: [number, number, number] = [239, 68, 68]; // Vermelho
      const lightGreen: [number, number, number] = [220, 252, 231]; // Verde claro para fundo
      const cardBorderColor: [number, number, number] = [7, 62, 41]; // Verde principal para bordas

      // ========== CABEÇALHO ==========
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Logo (tentar carregar a imagem)
      try {
        // Adicionar logo se disponível
        const logoImg = new Image();
        logoImg.src = '/logo.png';
        doc.addImage(logoImg, 'PNG', 15, 8, 25, 25);
      } catch (err) {
        // Fallback: Logo simulado (quadrado verde com texto branco)
        doc.setFillColor(255, 255, 255);
        doc.rect(15, 8, 12, 12, 'F');
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(15.5, 8.5, 11, 11, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('DM', 19, 16);
      }
      
      // Nome do App
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Gestão de Devoluções', 45, 18);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(255, 255, 255);
      doc.text('Grupo Doce Mel', 45, 28);
      doc.text(`Relatório Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 15, 38);
      
      // Filial e Período
      const periodoText = filters.startDate && filters.endDate 
        ? `${format(filters.startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(filters.endDate, 'dd/MM/yyyy', { locale: ptBR })}`
        : filters.period || 'Período não especificado';
      
      doc.text(`Período: ${periodoText}`, pageWidth - 15, 20, { align: 'right' as any });
      doc.text(`Filial: Todas`, pageWidth - 15, 30, { align: 'right' as any });

      yPosition = 55;

      // ========== CARDS DE ESTATÍSTICAS ==========
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumo Executivo', 15, yPosition);
      yPosition += 10;

      const cardWidth = (pageWidth - 45) / 3;
      const cardHeight = 25;
      let cardX = 15;
      let cardY = yPosition;

      // Card 1: NF Pendentes (com fundo verde claro e borda)
      doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
      doc.setDrawColor(cardBorderColor[0], cardBorderColor[1], cardBorderColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(cardX, cardY, cardWidth, cardHeight, 'FD');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('NF Pendentes', cardX + 5, cardY + 8);
      doc.setFontSize(16);
      doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2]);
      doc.text(stats.nfPendentes.toString(), cardX + 5, cardY + 18);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`R$ ${stats.totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, cardX + 5, cardY + 23);

      // Card 2: NF Cancelamento
      cardX += cardWidth + 7.5;
      doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
      doc.setDrawColor(cardBorderColor[0], cardBorderColor[1], cardBorderColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(cardX, cardY, cardWidth, cardHeight, 'FD');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('NF Cancelamento', cardX + 5, cardY + 8);
      doc.setFontSize(16);
      doc.setTextColor(warningColor[0], warningColor[1], warningColor[2]);
      doc.text(stats.nfCancelamento.toString(), cardX + 5, cardY + 18);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`R$ ${stats.totalCancelamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, cardX + 5, cardY + 23);

      // Card 3: NF em Atraso
      cardX += cardWidth + 7.5;
      doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
      doc.setDrawColor(cardBorderColor[0], cardBorderColor[1], cardBorderColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(cardX, cardY, cardWidth, cardHeight, 'FD');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('NF em Atraso', cardX + 5, cardY + 8);
      doc.setFontSize(16);
      doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2]);
      doc.text(stats.nfAtraso.toString(), cardX + 5, cardY + 18);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`R$ ${stats.totalAtraso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, cardX + 5, cardY + 23);

      yPosition += cardHeight + 15;

      // Segunda linha de cards
      cardX = 15;
      cardY = yPosition;

      // Card 4: Total Validadas
      const nfValidadas = allData.filter(d => d.resultado === 'VALIDADA').length;
      const totalValidadas = allData
        .filter(d => d.resultado === 'VALIDADA')
        .reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
      
      doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
      doc.setDrawColor(cardBorderColor[0], cardBorderColor[1], cardBorderColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(cardX, cardY, cardWidth, cardHeight, 'FD');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('NF Validadas', cardX + 5, cardY + 8);
      doc.setFontSize(16);
      doc.setTextColor(successColor[0], successColor[1], successColor[2]);
      doc.text(nfValidadas.toString(), cardX + 5, cardY + 18);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`R$ ${totalValidadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, cardX + 5, cardY + 23);

      // Card 5: Total Lançadas
      const nfLancadas = allData.filter(d => d.resultado === 'LANÇADA').length;
      const totalLancadas = allData
        .filter(d => d.resultado === 'LANÇADA')
        .reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
      
      cardX += cardWidth + 7.5;
      doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
      doc.setDrawColor(cardBorderColor[0], cardBorderColor[1], cardBorderColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(cardX, cardY, cardWidth, cardHeight, 'FD');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('NF Lançadas', cardX + 5, cardY + 8);
      doc.setFontSize(16);
      doc.setTextColor(successColor[0], successColor[1], successColor[2]);
      doc.text(nfLancadas.toString(), cardX + 5, cardY + 18);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`R$ ${totalLancadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, cardX + 5, cardY + 23);

      // Card 6: Total Geral
      const totalGeral = allData.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
      cardX += cardWidth + 7.5;
      doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
      doc.setDrawColor(cardBorderColor[0], cardBorderColor[1], cardBorderColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(cardX, cardY, cardWidth, cardHeight, 'FD');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Total Geral', cardX + 5, cardY + 8);
      doc.setFontSize(16);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(allData.length.toString(), cardX + 5, cardY + 18);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, cardX + 5, cardY + 23);

      yPosition += cardHeight + 20;

      // ========== TABELAS ==========
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');

      // Tabela 1: Lista de Pendentes
      const pendentes = allData.filter(d => d.resultado === 'PENDENTE VALIDAÇÃO');
      if (pendentes.length > 0) {
        doc.text('1. Lista de Pendentes', 15, yPosition);
        yPosition += 5;
        
        const pendentesData = pendentes.map(item => [
          item.numero || '-',
          item.vendedor || '-',
          (item.nome_cliente || '-').substring(0, 30),
          item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-',
          `R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          item.prazo || '-',
          item.dias !== null && item.dias !== undefined ? item.dias.toString() : '-',
          item.resultado || '-'
        ]);

        autoTable(doc, {
          head: [['NF', 'Vendedor', 'Cliente', 'Data Emissão', 'Valor', 'Prazo', 'Dias', 'Resultado']],
          body: pendentesData,
          startY: yPosition,
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 15, right: 15 }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // Nova página se necessário
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      // Tabela 2: Lista em Tratativas
      const tratativas = allData.filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO');
      if (tratativas.length > 0) {
        doc.text('2. Lista em Tratativas', 15, yPosition);
        yPosition += 5;
        
        const tratativasData = tratativas.map(item => [
          item.numero || '-',
          item.vendedor || '-',
          (item.nome_cliente || '-').substring(0, 30),
          item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-',
          `R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          item.prazo || '-',
          item.dias !== null && item.dias !== undefined ? item.dias.toString() : '-',
          item.resultado || '-'
        ]);

        autoTable(doc, {
          head: [['NF', 'Vendedor', 'Cliente', 'Data Emissão', 'Valor', 'Prazo', 'Dias', 'Resultado']],
          body: tratativasData,
          startY: yPosition,
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { fillColor: [warningColor[0], warningColor[1], warningColor[2]], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [255, 250, 240] },
          margin: { left: 15, right: 15 }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // Nova página se necessário
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      // Tabela 3: Lista Validadas
      const validadas = allData.filter(d => d.resultado === 'VALIDADA');
      if (validadas.length > 0) {
        doc.text('3. Lista Validadas', 15, yPosition);
        yPosition += 5;
        
        const validadasData = validadas.map(item => [
          item.numero || '-',
          item.vendedor || '-',
          (item.nome_cliente || '-').substring(0, 30),
          item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-',
          `R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          item.prazo || '-',
          item.dias !== null && item.dias !== undefined ? item.dias.toString() : '-',
          item.resultado || '-'
        ]);

        autoTable(doc, {
          head: [['NF', 'Vendedor', 'Cliente', 'Data Emissão', 'Valor', 'Prazo', 'Dias', 'Resultado']],
          body: validadasData,
          startY: yPosition,
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { fillColor: [successColor[0], successColor[1], successColor[2]], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 255, 240] },
          margin: { left: 15, right: 15 }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // Nova página se necessário
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      // Tabela 4: Lista Completa com Produtos
      doc.text('4. Lista Completa com Produtos', 15, yPosition);
      yPosition += 5;

      const produtosData: any[] = [];
      allData.forEach(item => {
        if (item.itens && item.itens.length > 0) {
          item.itens.forEach((produto: any) => {
            produtosData.push([
              item.numero || '-',
              item.vendedor || '-',
              (item.nome_cliente || '-').substring(0, 25),
              (produto.descricao || '-').substring(0, 30),
              produto.unidade || '-',
              produto.quantidade ? produto.quantidade.toString() : '-',
              `R$ ${(Number(produto.valor_total_bruto) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            ]);
          });
        } else {
          produtosData.push([
            item.numero || '-',
            item.vendedor || '-',
            (item.nome_cliente || '-').substring(0, 25),
            'Sem itens',
            '-',
            '-',
            `R$ ${(Number(item.valor_total_nota) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          ]);
        }
      });

      autoTable(doc, {
        head: [['NF', 'Vendedor', 'Cliente', 'Produto', 'Unidade', 'Quantidade', 'Valor']],
        body: produtosData.slice(0, 50), // Limitar a 50 linhas para não sobrecarregar
        startY: yPosition,
        styles: { fontSize: 6, cellPadding: 1.5 },
        headStyles: { fillColor: [secondaryColor[0], secondaryColor[1], secondaryColor[2]], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        margin: { left: 15, right: 15 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;

      // Nova página se necessário
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // ========== SEÇÃO DE INTELIGÊNCIA ==========
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, yPosition - 5, pageWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Inteligência e Análises', 15, yPosition + 3);
      yPosition += 15;

      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      
      // Análise de Recorrência
      const clientesRecorrentes = allData.reduce((acc: any, item) => {
        const cliente = item.nome_cliente || 'Desconhecido';
        acc[cliente] = (acc[cliente] || 0) + 1;
        return acc;
      }, {});
      
      const topClientes = Object.entries(clientesRecorrentes)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5)
        .map(([cliente, count]: any) => `${cliente}: ${count} devolução(ões)`);

      doc.text('Clientes com Maior Recorrência:', 15, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      topClientes.forEach((text, index) => {
        doc.text(`${index + 1}. ${text}`, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 5;

      // Alertas
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Alertas e Recomendações:', 15, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      const alertas: string[] = [];
      if (stats.nfAtraso > 0) {
        alertas.push(`⚠ ${stats.nfAtraso} nota(s) fiscal(is) em atraso requerem atenção imediata`);
      }
      if (stats.nfPendentes > 10) {
        alertas.push(`⚠ Alto volume de pendências (${stats.nfPendentes}) - considere revisar processos`);
      }
      if (stats.totalCancelamento > totalGeral * 0.1) {
        alertas.push(`⚠ Taxa de cancelamento acima de 10% - investigar causas`);
      }
      if (allData.length > 0) {
        const mediaDias = allData
          .filter(d => d.dias !== null && d.dias !== undefined)
          .reduce((sum, d) => sum + (d.dias || 0), 0) / allData.filter(d => d.dias !== null && d.dias !== undefined).length;
        if (mediaDias > 30) {
          alertas.push(`⚠ Tempo médio de processamento alto (${mediaDias.toFixed(1)} dias)`);
        }
      }

      if (alertas.length === 0) {
        alertas.push('✓ Nenhum alerta crítico identificado');
      }

      alertas.forEach((alerta) => {
        doc.text(alerta, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 5;

      // Histórico e Tendências
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Tendências:', 15, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      const taxaValidacao = allData.length > 0 
        ? ((validadas.length / allData.length) * 100).toFixed(1)
        : '0';
      const taxaCancelamento = allData.length > 0
        ? ((stats.nfCancelamento / allData.length) * 100).toFixed(1)
        : '0';

      doc.text(`Taxa de Validação: ${taxaValidacao}%`, 20, yPosition);
      yPosition += 5;
      doc.text(`Taxa de Cancelamento: ${taxaCancelamento}%`, 20, yPosition);
      yPosition += 5;
      doc.text(`Total Processado: ${allData.length} nota(s) fiscal(is)`, 20, yPosition);

      // Rodapé
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${totalPages} - Sistema de Devoluções`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Salvar PDF
      const fileName = `Relatorio_Devolucoes_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss', { locale: ptBR })}.pdf`;
      doc.save(fileName);
      toast.success('PDF gerado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Validação" 
        description="Valide e gerencie devoluções pendentes. Selecione motivos, altere resultados e adicione comentários para cada devolução."
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {isSelectMode && selectedItems.size > 0 && (
            <Button variant="destructive" onClick={handleDeleteMultiple}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir ({selectedItems.size})
            </Button>
          )}
          <Button 
            variant={isSelectMode ? "default" : "outline"} 
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              setSelectedItems(new Set());
            }}
          >
            {isSelectMode ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancelar Seleção
              </>
            ) : (
              <>
                <CheckSquare className="mr-2 h-4 w-4" />
                Selecionar
              </>
            )}
          </Button>
          <Button variant="outline" onClick={generatePDF}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar PDF
          </Button>
        </div>
      </div>
      
      <FilterBar />

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">NF Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nfPendentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">NF em Cancelamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nfCancelamento}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cancelamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.totalCancelamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">NF em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.nfAtraso}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ {stats.totalAtraso.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card min-h-[400px]">
        {loading ? (
            <div className="flex items-center justify-center h-full py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
                <AlertCircle className="h-10 w-10 mb-2" />
                <p>Nenhuma devolução encontrada.</p>
            </div>
        ) : (
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {isSelectMode && (
                <TableHead className="w-[50px]">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-muted rounded">
                    {selectedItems.size === data.length && data.length > 0 ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </TableHead>
              )}
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 text-[10px] px-2" onClick={() => handleSort('data_emissao')}>
                <div className="flex items-center">
                  Data Emissão
                  <SortIcon field="data_emissao" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 text-[10px] px-2" onClick={() => handleSort('numero')}>
                <div className="flex items-center">
                  Nota Fiscal
                  <SortIcon field="numero" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 text-[10px] px-2" onClick={() => handleSort('nome_cliente')}>
                <div className="flex items-center">
                  Cliente
                  <SortIcon field="nome_cliente" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 text-[10px] px-2" onClick={() => handleSort('cidade_origem')}>
                <div className="flex items-center">
                  Origem
                  <SortIcon field="cidade_origem" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 text-[10px] px-2" onClick={() => handleSort('vendedor')}>
                <div className="flex items-center">
                  Vendedor
                  <SortIcon field="vendedor" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 text-[10px] px-2" onClick={() => handleSort('motivo')}>
                <div className="flex items-center">
                  Motivo
                  <SortIcon field="motivo" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 text-[10px] px-2" onClick={() => handleSort('valor_total_nota')}>
                <div className="flex items-center">
                  Valor Total
                  <SortIcon field="valor_total_nota" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 text-[10px] px-2" onClick={() => handleSort('dias')}>
                <div className="flex items-center">
                  Dias
                  <SortIcon field="dias" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 text-[10px] px-2" onClick={() => handleSort('prazo')}>
                <div className="flex items-center">
                  Prazo
                  <SortIcon field="prazo" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 text-[10px] px-2" onClick={() => handleSort('resultado')}>
                <div className="flex items-center">
                  Resultado
                  <SortIcon field="resultado" />
                </div>
              </TableHead>
              <TableHead className="text-[10px] px-2">Validado Por</TableHead>
              <TableHead className="text-[10px] px-2">Comentário</TableHead>
              <TableHead className="w-[120px] text-[10px] px-2">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const resultado = (item.resultado || 'PENDENTE VALIDAÇÃO') as ResultadoStatus;
              
              return (
              <TableRow key={item.id} className="group">
                <TableCell colSpan={isSelectMode ? 15 : 14} className="p-0 border-b">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={item.id} className="border-b-0">
                            <div className="flex items-center w-full py-2 px-4 hover:bg-muted/50">
                                {isSelectMode && (
                                  <button 
                                    onClick={() => toggleSelectItem(item.id)}
                                    className="w-[50px] flex items-center justify-center"
                                  >
                                    {selectedItems.has(item.id) ? (
                                      <CheckSquare className="h-4 w-4 text-primary" />
                                    ) : (
                                      <Square className="h-4 w-4" />
                                    )}
                                  </button>
                                )}
                                <div className="flex gap-2 w-full items-center text-[10px]">
                                    <AccordionTrigger className="w-[50px] py-0 pr-4 hover:no-underline flex-shrink-0">
                                        {/* Trigger Icon is automatic */}
                                    </AccordionTrigger>
                                    <div className="w-20">{item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</div>
                                    <div className="w-20 font-medium">{item.numero}</div>
                                    <div className="w-32 truncate" title={item.nome_cliente}>{item.nome_cliente}</div>
                                    <div className="w-20">{item.cidade_origem}/{item.uf_origem}</div>
                                    <div className="w-24 truncate" title={item.vendedor}>{item.vendedor}</div>
                                    <div 
                                      className="w-40"
                                      style={{ position: 'relative', zIndex: 10000 }}
                                      onMouseDown={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                      }}
                                      onPointerDown={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <select
                                        value={item.motivo_id || ''}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          handleMotivoChange(item.id, e.target.value);
                                        }}
                                        onMouseDown={(e) => {
                                          e.stopPropagation();
                                        }}
                                        onPointerDown={(e) => {
                                          e.stopPropagation();
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                        onFocus={(e) => {
                                          e.stopPropagation();
                                        }}
                                        onKeyDown={(e) => {
                                          e.stopPropagation();
                                        }}
                                        className="h-7 w-full px-2 text-[10px] border rounded-md bg-background cursor-pointer"
                                        style={{ position: 'relative', zIndex: 10001 }}
                                      >
                                        <option value="">Selecione... ({motivos.length} motivos)</option>
                                        {motivos && motivos.length > 0 ? (
                                          motivos.map((motivo) => {
                                            const setorNome = (motivo.setores as any)?.nome || '';
                                            return (
                                              <option 
                                                key={motivo.id} 
                                                value={motivo.id}
                                              >
                                                {motivo.nome} {setorNome ? `(${setorNome})` : ''}
                                              </option>
                                            );
                                          })
                                        ) : (
                                          <option value="" disabled>Carregando motivos...</option>
                                        )}
                                      </select>
                                    </div>
                                    <div className="w-24 text-[9px] text-muted-foreground">
                                      {item.motivo_id && (() => {
                                        const motivoSelecionado = motivos.find(m => m.id === item.motivo_id);
                                        const setorNome = motivoSelecionado ? (motivoSelecionado.setores as any)?.nome : null;
                                        return setorNome ? `Setor: ${setorNome}` : '';
                                      })()}
                                    </div>
                                    <div className="w-20 font-bold">R$ {Number(item.valor_total_nota || 0).toFixed(2)}</div>
                                    <div className="w-12 text-center">{item.dias !== null && item.dias !== undefined ? item.dias : '-'}</div>
                                    <div className="w-20">
                                      <span className={`text-[9px] px-1 py-0.5 rounded ${
                                        item.prazo === 'EM ATRASO' 
                                          ? 'bg-red-500 text-white' 
                                          : item.prazo === 'NO PRAZO' 
                                          ? 'bg-green-500 text-white' 
                                          : 'bg-gray-500 text-white'
                                      }`}>
                                        {item.prazo || '-'}
                                      </span>
                                    </div>
                                    <div className="w-36">
                                        <Button
                                          size="sm"
                                          className={`${RESULTADO_CORES[resultado]} cursor-pointer text-[9px] px-1 py-0.5 w-full`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleResultadoChange(item.id, resultado);
                                          }}
                                        >
                                          {resultado}
                                        </Button>
                                    </div>
                                    <div className="w-28 truncate text-[9px]" title={item.nome_validador || '-'}>
                                      {item.nome_validador || '-'}
                                    </div>
                                    <div className="w-48 flex gap-1">
                                      <Textarea
                                        className="h-7 text-[9px] min-h-[28px] max-h-[28px] resize-none flex-1"
                                        placeholder="Comentário..."
                                        value={comentarios[item.id] || ''}
                                        onChange={(e) => handleComentarioChange(item.id, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        maxLength={500}
                                      />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 px-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSalvarComentario(item.id);
                                        }}
                                        disabled={savingComment[item.id]}
                                      >
                                        <Save className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <div className="w-28 flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 px-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleShareWhatsApp(item);
                                        }}
                                        title="Compartilhar via WhatsApp"
                                      >
                                        <Share2 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 px-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEdit(item);
                                        }}
                                        title="Editar"
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-7 px-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(item.id);
                                        }}
                                        title="Excluir"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                            <AccordionContent>
                              <div className="px-4 pb-4">
                                <div className="rounded-md border bg-muted/50 p-4">
                                  <h4 className="font-semibold mb-2 text-sm">Itens da Devolução</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="h-8 text-xs">Número</TableHead>
                                        <TableHead className="h-8 text-xs">Descrição</TableHead>
                                        <TableHead className="h-8 text-xs">Unidade</TableHead>
                                        <TableHead className="h-8 text-xs">Quantidade</TableHead>
                                        <TableHead className="h-8 text-xs">Valor Unitário</TableHead>
                                        <TableHead className="h-8 text-xs">Valor Total Bruto</TableHead>
                                        <TableHead className="h-8 text-xs">Motivo</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {item.itens && item.itens.length > 0 ? (
                                        item.itens.map((prod: any, idx: number) => (
                                          <TableRow key={idx}>
                                            <TableCell className="text-xs">{prod.numero_item || '-'}</TableCell>
                                            <TableCell className="text-xs">{prod.descricao || '-'}</TableCell>
                                            <TableCell className="text-xs">{prod.unidade || '-'}</TableCell>
                                            <TableCell className="text-xs">{prod.quantidade || '-'}</TableCell>
                                            <TableCell className="text-xs">R$ {Number(prod.valor_unitario || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-xs">R$ {Number(prod.valor_total_bruto || 0).toFixed(2)}</TableCell>
                                            <TableCell 
                                              className="text-xs relative"
                                              style={{ position: 'relative', zIndex: 9999 }}
                                              onMouseDown={(e) => e.stopPropagation()}
                                              onPointerDown={(e) => e.stopPropagation()}
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <select
                                                value={prod.motivo_id || ''}
                                                onChange={(e) => {
                                                  e.stopPropagation();
                                                  handleMotivoItemChange(prod.id, e.target.value, item.id);
                                                }}
                                                onMouseDown={(e) => {
                                                  e.stopPropagation();
                                                }}
                                                onPointerDown={(e) => {
                                                  e.stopPropagation();
                                                }}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                }}
                                                onFocus={(e) => {
                                                  e.stopPropagation();
                                                }}
                                                className="h-7 w-full px-2 text-xs border rounded-md bg-background cursor-pointer"
                                                style={{ position: 'relative', zIndex: 9999 }}
                                              >
                                                <option value="">Selecione...</option>
                                                {motivos && motivos.length > 0 ? (
                                                  motivos.map((motivo) => {
                                                    const setorNome = (motivo.setores as any)?.nome || '';
                                                    return (
                                                      <option 
                                                        key={motivo.id} 
                                                        value={motivo.id}
                                                      >
                                                        {motivo.nome} {setorNome ? `(${setorNome})` : ''}
                                                      </option>
                                                    );
                                                  })
                                                ) : (
                                                  <option value="" disabled>Carregando motivos...</option>
                                                )}
                                              </select>
                                              {prod.motivo_id && (() => {
                                                const motivoSelecionado = motivos.find(m => m.id === prod.motivo_id);
                                                const setorNome = motivoSelecionado ? (motivoSelecionado.setores as any)?.nome : null;
                                                return setorNome ? (
                                                  <div className="text-xs text-muted-foreground mt-1">
                                                    Setor: {setorNome}
                                                  </div>
                                                ) : null;
                                              })()}
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={7} className="text-center text-xs text-muted-foreground">
                                            Nenhum item cadastrado
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                  {item.dados_adicionais && (
                                    <div className="mt-4 pt-4 border-t">
                                      <p className="text-[10px] font-bold italic text-muted-foreground whitespace-pre-wrap break-words">
                                        {item.dados_adicionais}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
        )}
      </div>

      {/* Modal de Edição */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Editar Registro</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Número da Nota</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.numero || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, numero: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cliente</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.nome_cliente || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, nome_cliente: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Vendedor</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.vendedor || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, vendedor: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cidade Origem</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.cidade_origem || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, cidade_origem: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">UF Origem</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.uf_origem || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, uf_origem: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Emissão</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={editingItem.data_emissao ? format(new Date(editingItem.data_emissao), 'yyyy-MM-dd') : ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, data_emissao: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Valor Total</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="w-full border rounded px-3 py-2"
                                    value={editingItem.valor_total_nota || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, valor_total_nota: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Peso Líquido</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="w-full border rounded px-3 py-2"
                                    value={editingItem.peso_liquido || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, peso_liquido: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Setor</label>
                                  <Select
                                    value={editingItem.setor_id || ''}
                                    onValueChange={(value) => setEditingItem({ ...editingItem, setor_id: value })}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Selecione o setor..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {setores.map((setor) => (
                                        <SelectItem key={setor.id} value={setor.id}>
                                          {setor.nome}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Motivo</label>
                                  <Select
                                    value={editingItem.motivo_id || ''}
                                    onValueChange={(value) => setEditingItem({ ...editingItem, motivo_id: value })}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Selecione o motivo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {motivos.map((motivo) => (
                                        <SelectItem key={motivo.id} value={motivo.id}>
                                          {motivo.nome}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Resultado</label>
                                  <Select
                                    value={editingItem.resultado || 'PENDENTE VALIDAÇÃO'}
                                    onValueChange={(value) => setEditingItem({ ...editingItem, resultado: value })}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PENDENTE VALIDAÇÃO">PENDENTE VALIDAÇÃO</SelectItem>
                                      <SelectItem value="VALIDADA">VALIDADA</SelectItem>
                                      <SelectItem value="LANÇADA">LANÇADA</SelectItem>
                                      <SelectItem value="TRATATIVA DE ANULAÇÃO">TRATATIVA DE ANULAÇÃO</SelectItem>
                                      <SelectItem value="ANULADA/CANCELADA">ANULADA/CANCELADA</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Justificativa</label>
                                <Textarea
                                  className="w-full border rounded px-3 py-2"
                                  value={editingItem.justificativa || ''}
                                  onChange={(e) => setEditingItem({ ...editingItem, justificativa: e.target.value })}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setEditingItem(null)}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleSaveEdit}>
                                  Salvar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
