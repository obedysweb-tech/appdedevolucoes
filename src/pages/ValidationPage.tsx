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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Save, ArrowUpDown, ArrowUp, ArrowDown, Trash2, Edit, Share2, CheckSquare, Square, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuthStore, useFilterStore } from "@/lib/store";
import { getDateRangeFromPeriod, calculateBusinessDays } from "@/lib/dateUtils";

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


function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

type SortField = 'data_emissao' | 'numero' | 'nome_cliente' | 'vendedor' | 'motivo' | 'valor_total_nota' | 'dias' | 'prazo' | 'resultado';
type SortDirection = 'asc' | 'desc' | null;

export function ValidationPage() {
  const [data, setData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [motivos, setMotivos] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<Record<string, string>>({});
  const [savingComment, setSavingComment] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<string | null>(null);
  const [deletingMultiple, setDeletingMultiple] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [stats, setStats] = useState({
    nfPendentes: 0,
    totalPendente: 0,
    nfValidadas: 0,
    totalValidadas: 0,
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
    // Filtro de setores será aplicado após buscar os dados (para considerar tanto setor_id quanto motivo_id)
    // Buscar motivos que pertencem aos setores selecionados (se houver filtro de setor)
    let setorMotivoIds: string[] = [];
    if (filters.setor && filters.setor.length > 0) {
      const { data: motivosPorSetor } = await supabase
        .from('motivos_devolucao')
        .select('id')
        .in('sector_id', filters.setor);
      
      setorMotivoIds = motivosPorSetor?.map((m: any) => m.id) || [];
      
      // Filtrar por setor_id diretamente na query (filtro adicional por motivo_id será aplicado depois)
      query = query.in('setor_id', filters.setor);
    }
    
    // Aplicar filtros de data considerando fuso horário de Salvador/Bahia (UTC-3)
    if (effectiveStartDate) {
      // Ajustar para início do dia em Salvador/Bahia (UTC-3)
      const startDate = new Date(effectiveStartDate);
      startDate.setHours(0, 0, 0, 0);
      // Converter para UTC considerando UTC-3
      const startDateUTC = new Date(startDate.getTime() - (3 * 60 * 60 * 1000));
      query = query.gte('data_emissao', startDateUTC.toISOString().split('T')[0]);
    }
    if (effectiveEndDate) {
      // Ajustar para fim do dia em Salvador/Bahia (UTC-3)
      const endDate = new Date(effectiveEndDate);
      endDate.setHours(23, 59, 59, 999);
      // Converter para UTC considerando UTC-3
      const endDateUTC = new Date(endDate.getTime() - (3 * 60 * 60 * 1000));
      query = query.lte('data_emissao', endDateUTC.toISOString().split('T')[0]);
    }
    
    const { data: devolucoes, error } = await query.order('created_at', { ascending: false });

    if (error) {
        toast.error("Erro ao carregar devoluções");
        console.error(error);
    } else if (devolucoes) {
        // Aplicar filtro de setores adicional (se necessário filtrar por motivo_id também)
        let devolucoesComFiltroSetor = devolucoes;
        if (filters.setor && filters.setor.length > 0 && setorMotivoIds.length > 0) {
          devolucoesComFiltroSetor = devolucoes.filter((d: any) => {
            const temSetorId = d.setor_id && filters.setor!.includes(d.setor_id);
            const temMotivoId = d.motivo_id && setorMotivoIds.includes(d.motivo_id);
            return temSetorId || temMotivoId;
          });
        }
        
        // Filtrar notas: mostrar apenas PENDENTE VALIDAÇÃO, VALIDADA e TRATATIVA DE ANULAÇÃO
        // LANÇADA e ANULADA/CANCELADA vão para a tela de Relatórios
        const devolucoesFiltradas = devolucoesComFiltroSetor.filter((d: any) => {
          return d.resultado === 'PENDENTE VALIDAÇÃO' || 
                 d.resultado === 'VALIDADA' ||
                 d.resultado === 'TRATATIVA DE ANULAÇÃO';
        });
        // Buscar dados dos clientes baseado no CNPJ para preencher nome, vendedor e rede
        const cnpjs = devolucoesFiltradas
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
        const devolucaoIds = devolucoesFiltradas.map(d => d.id);
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
        
        const formattedData = devolucoesFiltradas.map((item: any) => {
          const cliente = clientesMap.get(item.cnpj_destinatario);
          
          // Processar itens para incluir motivo (preservar motivo_id do banco)
          const itensProcessados = item.itens?.map((prod: any) => {
            // Garantir que o id está presente
            if (!prod.id) {
              console.warn('Item sem ID:', prod);
            }
            return {
            ...prod,
              id: prod.id, // Garantir que o id está presente
              motivo_id: prod.motivo_id || null, // Preservar motivo_id do banco
            motivo_nome: prod.motivo_item?.nome || '-'
            };
          });
          
          // Buscar nome do validador baseado no resultado atual
          const resultado = item.resultado || 'PENDENTE VALIDAÇÃO';
          let nomeValidador = '-';
          
          if (resultado !== 'PENDENTE VALIDAÇÃO') {
            const key = `${item.id}_${resultado}`;
            nomeValidador = validadoresMap.get(key) || '-';
          }
          
          // Calcular dias úteis baseado na data atual (horário de Salvador/Bahia - UTC-3) em relação à data de emissão
          // Excluindo sábados e domingos
          let diasCalculados = null;
          if (item.data_emissao) {
            try {
              // Obter data atual no horário de Salvador/Bahia (UTC-3)
              const agora = new Date();
              const offsetSalvador = -3 * 60; // UTC-3 em minutos
              const utc = agora.getTime() + (agora.getTimezoneOffset() * 60000);
              const dataAtualSalvador = new Date(utc + (offsetSalvador * 60000));
              dataAtualSalvador.setHours(0, 0, 0, 0);
              
              // Converter data de emissão para Date
              const dataEmissao = new Date(item.data_emissao);
              dataEmissao.setHours(0, 0, 0, 0);
              
              // Calcular diferença em dias úteis (excluindo sábados e domingos)
              diasCalculados = calculateBusinessDays(dataEmissao, dataAtualSalvador);
            } catch (err) {
              console.warn('Erro ao calcular dias:', err);
              diasCalculados = item.dias; // Usar valor do banco se houver erro
            }
          }
          
          // Calcular prazo baseado no resultado
          let prazoCalculado = item.prazo;
          if (resultado === 'LANÇADA' || resultado === 'ANULADA/CANCELADA') {
            prazoCalculado = 'FINALIZADO';
          } else if (resultado === 'TRATATIVA DE ANULAÇÃO') {
            prazoCalculado = 'TRATANDO';
          } else if (resultado === 'VALIDADA') {
            prazoCalculado = 'CONCLUIDO';
          } else if (resultado === 'PENDENTE VALIDAÇÃO') {
            // Regra de prazo: dias >= 3 = EM ATRASO, dias < 3 = NO PRAZO
            const dias = diasCalculados !== null ? diasCalculados : item.dias;
            if (dias !== null && dias !== undefined) {
              if (dias >= 3) {
                prazoCalculado = 'EM ATRASO';
              } else {
                prazoCalculado = 'NO PRAZO';
              }
            }
          }
          
          return {
            ...item,
            setor: item.setores?.nome,
            motivo: (typeof item.motivos_devolucao === 'object' && item.motivos_devolucao?.nome) ? item.motivos_devolucao.nome : (typeof item.motivos_devolucao === 'string' ? item.motivos_devolucao : '-'),
            motivo_id: item.motivo_id,
            resultado: resultado,
            itens: itensProcessados,
            nome_validador: nomeValidador,
            prazo: prazoCalculado,
            dias: diasCalculados !== null ? diasCalculados : item.dias, // Usar dias calculados
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
        
        const nfValidadas = sortedDefault.filter(d => d.resultado === 'VALIDADA').length;
        const totalValidadas = sortedDefault
          .filter(d => d.resultado === 'VALIDADA')
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
          nfValidadas,
          totalValidadas,
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
            // Converter para número se possível, senão comparar como string
            const numA = parseInt(a.numero || '0', 10) || 0;
            const numB = parseInt(b.numero || '0', 10) || 0;
            if (numA !== 0 || numB !== 0) {
              aValue = numA;
              bValue = numB;
            } else {
              aValue = (a.numero || '').toLowerCase();
              bValue = (b.numero || '').toLowerCase();
            }
            break;
          case 'nome_cliente':
            aValue = (a.nome_cliente || '').toLowerCase();
            bValue = (b.nome_cliente || '').toLowerCase();
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

  const handleResultadoChange = async (id: string, novoResultado: string) => {
      if (!user) return;

      const novoResultadoTyped = novoResultado as ResultadoStatus;
      
      // Validar se o resultado é válido
      if (!RESULTADO_CICLO.includes(novoResultadoTyped)) {
        console.error('Resultado inválido:', novoResultado);
        toast.error("Resultado inválido");
        return;
      }

      try {
        // VALIDAÇÃO: Não permitir mudar para LANÇADA sem todos os motivos preenchidos
        if (novoResultadoTyped === 'LANÇADA') {
          // Buscar a devolução com seus itens
          const { data: devolucaoCompleta, error: fetchErrorValidacao } = await supabase
            .from('devolucoes')
            .select(`
              *,
              itens:itens_devolucao(id, motivo_id)
            `)
            .eq('id', id)
            .single();
          
          if (fetchErrorValidacao) {
            console.error('Erro ao buscar devolução:', fetchErrorValidacao);
            throw fetchErrorValidacao;
          }
          
          // Verificar se a devolução tem motivo principal
          if (!devolucaoCompleta.motivo_id) {
            toast.error('Não é possível lançar a nota sem o motivo principal preenchido.');
            return;
          }
          
          // Verificar se todos os itens têm motivo preenchido
          if (devolucaoCompleta.itens && devolucaoCompleta.itens.length > 0) {
            const itensSemMotivo = devolucaoCompleta.itens.filter((item: any) => !item.motivo_id);
            if (itensSemMotivo.length > 0) {
              toast.error(`Não é possível lançar a nota. ${itensSemMotivo.length} item(ns) ainda não possui(m) motivo preenchido.`);
              return;
            }
          }
        }
        
        // Buscar resultado atual antes de atualizar
        const { data: devolucaoAtual, error: fetchError } = await supabase
          .from('devolucoes')
          .select('resultado')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          console.error('Erro ao buscar resultado atual:', fetchError);
          throw fetchError;
        }
        
        const resultadoAtual = devolucaoAtual?.resultado || 'PENDENTE VALIDAÇÃO';
        
        // Se o resultado não mudou, não fazer nada
        if (resultadoAtual === novoResultadoTyped) {
          return;
        }
        
        // Calcular prazo baseado no novo resultado
        let novoPrazo = null;
        if (novoResultadoTyped === 'LANÇADA' || novoResultadoTyped === 'ANULADA/CANCELADA') {
          novoPrazo = 'FINALIZADO';
        } else if (novoResultadoTyped === 'TRATATIVA DE ANULAÇÃO') {
          novoPrazo = 'TRATANDO';
        } else if (novoResultadoTyped === 'VALIDADA') {
          novoPrazo = 'CONCLUIDO';
        } else if (novoResultadoTyped === 'PENDENTE VALIDAÇÃO') {
          // Manter cálculo baseado em dias (será recalculado no fetch)
          novoPrazo = null;
        }
        
        // 1. Atualizar Resultado, Prazo, Validada Por e Finalizada Por
        const updateData: any = { resultado: novoResultadoTyped };
        if (novoPrazo) {
          updateData.prazo = novoPrazo;
        }
        
        const nomeUsuario = user.name || user.email || '-';
        
        // Salvar validada_por e data_validacao para VALIDADA ou TRATATIVA DE ANULAÇÃO
        // Apenas se o resultado anterior era PENDENTE VALIDAÇÃO
        if ((novoResultadoTyped === 'VALIDADA' || novoResultadoTyped === 'TRATATIVA DE ANULAÇÃO') && 
            resultadoAtual === 'PENDENTE VALIDAÇÃO') {
          updateData.nome_validador = nomeUsuario;
          updateData.data_validacao = new Date().toISOString();
        }
        
        // Salvar finalizada_por e data_finalizacao para LANÇADA ou ANULADA/CANCELADA
        if (novoResultadoTyped === 'LANÇADA' || novoResultadoTyped === 'ANULADA/CANCELADA') {
          updateData.finalizada_por = nomeUsuario;
          updateData.data_finalizacao = new Date().toISOString();
        }
        
        const { error: updateError } = await supabase
            .from('devolucoes')
            .update(updateData)
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
                status_novo: novoResultadoTyped
            });

        if (logError) console.error("Erro ao salvar log:", logError);

        toast.success(`Resultado alterado para: ${novoResultadoTyped}`);
        
        // Calcular prazo para atualização local
        let prazoLocal = null;
        if (novoResultadoTyped === 'LANÇADA' || novoResultadoTyped === 'ANULADA/CANCELADA') {
          prazoLocal = 'FINALIZADO';
        } else if (novoResultadoTyped === 'TRATATIVA DE ANULAÇÃO') {
          prazoLocal = 'TRATANDO';
        } else if (novoResultadoTyped === 'VALIDADA') {
          prazoLocal = 'CONCLUIDO';
        }
        
        // Se o novo resultado for LANÇADA ou ANULADA/CANCELADA, remover da lista (vai para Relatórios)
        // VALIDADA e TRATATIVA DE ANULAÇÃO continuam na tela de validação
        if (novoResultadoTyped === 'LANÇADA' || novoResultadoTyped === 'ANULADA/CANCELADA') {
          // Remover o item das listas locais
          setData(prevData => prevData.filter(item => item.id !== id));
          setAllData(prevData => prevData.filter(item => item.id !== id));
        } else {
          // Atualizar apenas o item específico na lista local
          const updateItem = (item: any) => {
            if (item.id === id) {
              return {
                ...item,
                resultado: novoResultadoTyped,
                nome_validador: novoResultadoTyped !== 'PENDENTE VALIDAÇÃO' ? (user.name || user.email || '-') : '-',
                prazo: prazoLocal || item.prazo
              };
            }
            return item;
          };
          
          setData(prevData => prevData.map(updateItem));
          setAllData(prevData => prevData.map(updateItem));
        }

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

      // Depois de atualizar todos os produtos, atualizar motivo, resultado para VALIDADA, prazo CONCLUIDO e nome_validador
      const updateData: any = { 
        motivo_id: motivoId,
        resultado: 'VALIDADA',
        prazo: 'CONCLUIDO',
        nome_validador: user.name || user.email || '-'
      };
      
      // Salvar data_validacao se o resultado anterior era PENDENTE VALIDAÇÃO
      if (statusAnterior === 'PENDENTE VALIDAÇÃO') {
        updateData.data_validacao = new Date().toISOString();
      }
      
      const { error: updateError } = await supabase
          .from('devolucoes')
          .update(updateData)
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
            prazo: 'CONCLUIDO',
            motivo: motivos.find(m => m.id === motivoId)?.nome || item.motivo,
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
    // Atualizar estado local imediatamente para resposta fluida (sem validação durante digitação)
    setComentarios(prev => ({ ...prev, [id]: value }));
  };
  
  // Validação separada apenas ao salvar
  const validateComentario = (value: string): boolean => {
    const words = countWords(value);
    if (words > 100) {
      toast.warning("Máximo de 100 palavras permitido");
      return false;
    }
    return true;
  };

  const handleSalvarComentario = async (id: string) => {
    if (!user) return;
    
    // Validar antes de salvar
    if (!validateComentario(comentarios[id] || '')) {
      return;
    }

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
    if (!user) {
      console.error('Usuário não autenticado');
      return;
    }

    // Se o motivoId for vazio, não fazer nada (usuário desmarcou)
    if (!motivoId || motivoId.trim() === '') {
      console.log('Motivo vazio, ignorando...');
      return;
    }

    // Validar IDs
    if (!itemId || !devolucaoId) {
      console.error('IDs inválidos:', { itemId, devolucaoId, tipoItemId: typeof itemId, tipoDevolucaoId: typeof devolucaoId });
      toast.error("Erro: IDs inválidos. Verifique o console para mais detalhes.");
      return;
    }

    // Garantir que itemId é uma string válida
    const itemIdString = String(itemId).trim();
    const devolucaoIdString = String(devolucaoId).trim();

    if (!itemIdString || itemIdString === 'undefined' || itemIdString === 'null') {
      console.error('itemId inválido após conversão:', { itemId, itemIdString });
      toast.error("Erro: ID do produto inválido");
      return;
    }

    try {
      const nomeValidador = user.name || user.email || '-';

      console.log('Salvando motivo:', { itemId: itemIdString, motivoId, devolucaoId: devolucaoIdString });

      // Verificar se o item existe antes de atualizar
      const { data: itemExistente, error: checkError } = await supabase
        .from('itens_devolucao')
        .select('id, motivo_id, devolucao_id')
        .eq('id', itemIdString)
        .single();

      if (checkError) {
        console.error('Erro ao verificar item:', checkError);
        toast.error("Erro: Item não encontrado no banco de dados. Verifique o console.");
        throw checkError;
      }

      if (!itemExistente) {
        console.error('Item não encontrado:', itemIdString);
        toast.error("Erro: Item não encontrado");
        return;
      }

      console.log('Item encontrado:', itemExistente);

      // Verificar se o item pertence à devolução correta
      if (itemExistente.devolucao_id !== devolucaoIdString) {
        console.error('Item não pertence à devolução:', { 
          itemDevolucaoId: itemExistente.devolucao_id, 
          devolucaoIdEsperado: devolucaoIdString 
        });
        toast.error("Erro: Item não pertence à devolução correta");
        return;
      }

      // Atualizar motivo do item no banco de dados
      console.log('Tentando atualizar item:', { itemIdString, motivoId });
      
      const { data: updatedItem, error: itemError } = await supabase
          .from('itens_devolucao')
          .update({ motivo_id: motivoId })
          .eq('id', itemIdString)
          .select('id, motivo_id');
      
      console.log('Resultado do update:', { updatedItem, error: itemError });
      
      if (itemError) {
        console.error('Erro ao salvar motivo no Supabase:', itemError);
        toast.error("Erro ao salvar motivo: " + itemError.message);
        throw itemError;
      }

      // Verificar se o update retornou dados (agora deve funcionar com a política RLS)
      if (updatedItem && updatedItem.length > 0 && updatedItem[0].motivo_id === motivoId) {
        console.log('✅ Motivo salvo com sucesso! Item atualizado:', updatedItem[0]);
      } else {
        console.warn('⚠️ Update pode não ter funcionado completamente, verificando...');
      }

      // Aguardar um pouco para garantir que o banco processou o update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar se o update realmente funcionou fazendo uma busca
      let itemVerificado = null;
      let tentativasVerificacao = 0;
      const maxTentativasVerificacao = 5;
      
      while (tentativasVerificacao < maxTentativasVerificacao) {
        const { data, error: verifError } = await supabase
          .from('itens_devolucao')
          .select('id, motivo_id, devolucao_id')
          .eq('id', itemIdString)
          .single();
        
        if (verifError) {
          console.error(`Erro ao verificar item (tentativa ${tentativasVerificacao + 1}):`, verifError);
          if (tentativasVerificacao === maxTentativasVerificacao - 1) {
            console.warn('Não foi possível verificar o item após todas as tentativas');
            break;
          }
        } else if (data) {
          itemVerificado = data;
          console.log(`Item verificado (tentativa ${tentativasVerificacao + 1}):`, itemVerificado);
          
          // Se o motivo foi salvo, podemos parar
          if (itemVerificado.motivo_id === motivoId) {
            console.log('✅ Motivo confirmado no banco de dados!');
            break;
          }
        }
        
        // Se ainda não confirmou, aguardar e tentar novamente
        if (tentativasVerificacao < maxTentativasVerificacao - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        tentativasVerificacao++;
      }
      
      // Se após todas as tentativas o motivo ainda não foi salvo, mostrar erro
      if (!itemVerificado || itemVerificado.motivo_id !== motivoId) {
        console.error('❌ Update não funcionou após todas as tentativas!', {
          esperado: motivoId,
          atual: itemVerificado?.motivo_id || 'null',
          itemVerificado
        });
        toast.error("Erro: Não foi possível salvar o motivo. Pode ser um problema de permissões no banco de dados.");
        return;
      }

      // Atualizar estado local imediatamente
      const getEstadoAtualizado = (devolucao: any) => {
        const itensAtualizados = devolucao.itens?.map((prod: any) =>
          String(prod.id) === itemIdString ? { ...prod, motivo_id: motivoId } : prod
        );

        return {
          itensAtualizados
        };
      };

      // Atualizar estado local
      setData(prevData =>
        prevData.map((d: any) => {
          if (String(d.id) !== devolucaoIdString) return d;
          const next = getEstadoAtualizado(d);
          return { ...d, itens: next.itensAtualizados };
        })
      );
      setAllData(prevData =>
        prevData.map((d: any) => {
          if (String(d.id) !== devolucaoIdString) return d;
          const next = getEstadoAtualizado(d);
          return { ...d, itens: next.itensAtualizados };
        })
      );

      // Aguardar um pouco para garantir que o banco foi atualizado
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verificar no banco de dados se TODOS os produtos têm motivos
      // Usar a mesma query que carrega os dados inicialmente (com join) para garantir que funciona
      let todosItens: any[] | null = null;
      let itensError: any = null;
      let tentativas = 0;
      const maxTentativas = 5;

      // Tentar buscar os itens algumas vezes para garantir que temos os dados atualizados
      while (tentativas < maxTentativas) {
        // Usar a mesma query que funciona no fetchReturns
        const { data: devolucaoData, error: devError } = await supabase
          .from('devolucoes')
          .select(`
            itens:itens_devolucao(id, motivo_id)
          `)
          .eq('id', devolucaoIdString)
          .single();
        
        if (devError) {
          console.error(`Erro ao buscar devolução (tentativa ${tentativas + 1}):`, devError);
          // Tentar método alternativo
          const { data: itensData, error: altError } = await supabase
            .from('itens_devolucao')
            .select('id, motivo_id')
            .eq('devolucao_id', devolucaoIdString);
          
          todosItens = itensData;
          itensError = altError;
        } else if (devolucaoData && devolucaoData.itens) {
          todosItens = devolucaoData.itens;
          itensError = null;
        }
        
        if (itensError) {
          console.error(`Erro ao buscar itens (tentativa ${tentativas + 1}):`, itensError);
          if (tentativas === maxTentativas - 1) break;
        } else if (todosItens) {
          // Verificar se o item atualizado tem o motivo
          const itemAtualizado = todosItens.find((i: any) => String(i.id) === itemIdString);
          console.log(`Tentativa ${tentativas + 1} - Item encontrado:`, itemAtualizado);

          if (itemAtualizado && itemAtualizado.motivo_id === motivoId) {
            console.log(`✅ Item confirmado com motivo na tentativa ${tentativas + 1}`);
            break;
          } else if (itemAtualizado) {
            console.log(`Item ainda não tem o motivo correto. Esperado: ${motivoId}, Atual: ${itemAtualizado.motivo_id}`);
          }
        }
        
        if (tentativas < maxTentativas - 1) {
          console.log(`Aguardando e tentando novamente... (tentativa ${tentativas + 1}/${maxTentativas})`);
          await new Promise(resolve => setTimeout(resolve, 400));
        }
        
        tentativas++;
      }

      if (itensError) {
        console.error('Erro ao buscar itens após todas as tentativas:', itensError);
        throw itensError;
      }

      if (!todosItens) {
        console.error('Não foi possível buscar os itens');
        toast.error("Erro: Não foi possível buscar os itens da devolução");
        return;
      }

      console.log('Itens encontrados:', todosItens);

      // Verificar se todos os produtos têm motivos (verificação no banco de dados)
      // Verificar se há itens e se todos têm motivo_id não nulo
      const temItens = todosItens && todosItens.length > 0;
      const todosTemMotivo = temItens && todosItens.every((item: any) => {
        const temMotivo = Boolean(item.motivo_id) && item.motivo_id !== null && item.motivo_id !== '';
        console.log('Item:', item.id, 'tem motivo?', temMotivo, 'motivo_id:', item.motivo_id);
        return temMotivo;
      });
      
      console.log('Todos têm motivo?', todosTemMotivo, 'Total de itens:', todosItens.length, 'Itens com motivos:', todosItens.filter((i: any) => Boolean(i.motivo_id)).length);

      // Calcular motivo mais repetido baseado nos dados do banco
      const motivoCounts: Record<string, number> = {};
      let motivoMaisRepetido: string | null = null;
      let maxCount = 0;

      if (todosItens) {
        todosItens.forEach((item: any) => {
          if (!item.motivo_id || item.motivo_id === null || item.motivo_id === '') return;
          const id = String(item.motivo_id);
          const count = (motivoCounts[id] || 0) + 1;
          motivoCounts[id] = count;
          if (count > maxCount) {
            maxCount = count;
            motivoMaisRepetido = id;
          }
        });
      }

      console.log('Motivo mais repetido:', motivoMaisRepetido, 'Contagem:', motivoCounts);

      // Só mudar para VALIDADA se TODOS os produtos tiverem motivos
      // Se todos têm motivos, sempre haverá um motivo mais repetido (pelo menos um)
      if (todosTemMotivo) {
        // Se não encontrou motivo mais repetido mas todos têm motivos, usar o primeiro
        const motivoParaSalvar = motivoMaisRepetido || (todosItens && todosItens.length > 0 && todosItens[0]?.motivo_id ? String(todosItens[0].motivo_id) : null);
        
        if (!motivoParaSalvar) {
          console.error('Erro: Todos têm motivos mas não foi possível determinar o motivo principal');
          toast.error("Erro ao validar: não foi possível determinar o motivo principal");
          return;
        }

        console.log('Validando nota...', { motivoParaSalvar });
        
        const { data: devolucaoAntes, error: devolucaoError } = await supabase
          .from('devolucoes')
          .select('resultado, motivo_id')
          .eq('id', devolucaoIdString)
          .single();

        if (devolucaoError) {
          console.error('Erro ao buscar devolução:', devolucaoError);
          throw devolucaoError;
        }

        const motivoObj = motivos.find(m => m.id === motivoParaSalvar);
        const motivoNome = motivoObj?.nome || '';

        const updateData: any = {
          resultado: 'VALIDADA',
          prazo: 'CONCLUIDO',
          nome_validador: nomeValidador,
          motivo_id: motivoParaSalvar
        };

        // Salvar data_validacao se o resultado anterior era PENDENTE VALIDAÇÃO
        const resultadoAnterior = devolucaoAntes?.resultado || 'PENDENTE VALIDAÇÃO';
        if (resultadoAnterior === 'PENDENTE VALIDAÇÃO') {
          updateData.data_validacao = new Date().toISOString();
        }

        console.log('Atualizando devolução com:', updateData);

        const { error: updateError } = await supabase
          .from('devolucoes')
          .update(updateData)
          .eq('id', devolucaoIdString);

        if (updateError) {
          console.error('Erro ao atualizar devolução:', updateError);
          throw updateError;
        }

        console.log('Devolução atualizada com sucesso!');

        await supabase.from('logs_validacao').insert({
          devolucao_id: devolucaoIdString,
          usuario_id: user.id,
          acao: 'SELECIONAR_MOTIVO_PRODUTO',
          status_anterior: devolucaoAntes?.resultado || 'PENDENTE VALIDAÇÃO',
          status_novo: 'VALIDADA'
        });

        // Atualizar estado local com resultado VALIDADA
        setData(prevData =>
          prevData.map((d: any) => {
            if (String(d.id) !== devolucaoIdString) return d;
            return {
              ...d,
              resultado: 'VALIDADA',
              prazo: 'CONCLUIDO',
              nome_validador: nomeValidador,
              motivo_id: motivoParaSalvar,
              motivo: motivoNome || d.motivo
            };
          })
        );
        setAllData(prevData =>
          prevData.map((d: any) => {
            if (String(d.id) !== devolucaoIdString) return d;
            return {
              ...d,
              resultado: 'VALIDADA',
              prazo: 'CONCLUIDO',
              nome_validador: nomeValidador,
              motivo_id: motivoParaSalvar,
              motivo: motivoNome || d.motivo
            };
          })
        );

        toast.success("Motivo salvo! Todos os produtos têm motivos. Resultado alterado para VALIDADA!");
      } else {
        const itensComMotivo = todosItens?.filter((i: any) => Boolean(i.motivo_id)).length || 0;
        const totalItens = todosItens?.length || 0;
        toast.success(`Motivo salvo para o produto! (${itensComMotivo}/${totalItens} produtos com motivos)`);
      }

    } catch (error: any) {
        console.error('Erro completo:', error);
        toast.error("Erro ao atualizar motivo: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem || !user) return;

    try {
      // Deletar itens primeiro
      const { error: itemsError } = await supabase
        .from('itens_devolucao')
        .delete()
        .eq('devolucao_id', deletingItem);

      if (itemsError) throw itemsError;

      // Deletar registro principal
      const { error: deleteError } = await supabase
        .from('devolucoes')
        .delete()
        .eq('id', deletingItem);

      if (deleteError) throw deleteError;

      toast.success('Registro excluído com sucesso!');
      setDeletingItem(null);
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

    if (!deletingMultiple) {
      setDeletingMultiple(true);
      return;
    }

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
      setDeletingMultiple(false);
      fetchReturns(); // Recarregar dados
      setSelectedItems(new Set());
      setIsSelectMode(false);
    } catch (error: any) {
      toast.error("Erro ao excluir registros: " + error.message);
      setDeletingMultiple(false);
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


  return (
    <div className="space-y-6">
      <PageHeader 
        title="Validação" 
        description="Valide e gerencie devoluções pendentes. Selecione motivos, altere resultados e adicione comentários para cada devolução."
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <FilterBar />
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
          {isSelectMode && selectedItems.size > 0 && (
            <Button variant="destructive" onClick={() => setDeletingMultiple(true)} className="w-full sm:w-auto" disabled={selectedItems.size === 0}>
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
            className="w-full sm:w-auto"
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
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">NF Validadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.nfValidadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Validadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">R$ {stats.totalValidadas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
        <div>
        {/* Paginação no topo */}
        {allData.length > itemsPerPage && (
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, allData.length)} de {allData.length} registros
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {Math.ceil(allData.length / itemsPerPage)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(allData.length / itemsPerPage), prev + 1))}
                disabled={currentPage >= Math.ceil(allData.length / itemsPerPage)}
              >
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
        {/* Tabela com layout melhorado */}
        <div className="overflow-x-auto border rounded-lg">
        <Table>
            <TableHeader className="bg-muted/50">
            <TableRow>
              {isSelectMode && (
                  <TableHead className="w-[50px] sticky left-0 bg-muted/50 z-10">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-muted rounded">
                    {selectedItems.size === data.length && data.length > 0 ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </TableHead>
              )}
                <TableHead className="w-[50px] sticky left-0 bg-muted/50 z-10"></TableHead>
                <TableHead className="min-w-[100px] cursor-pointer hover:bg-muted/50 text-xs font-semibold px-3 py-3" onClick={() => handleSort('data_emissao')}>
                  <div className="flex items-center gap-1">
                  Data Emissão
                  <SortIcon field="data_emissao" />
                </div>
              </TableHead>
                <TableHead className="min-w-[120px] cursor-pointer hover:bg-muted/50 text-xs font-semibold px-3 py-3" onClick={() => handleSort('numero')}>
                  <div className="flex items-center gap-1">
                  Nota Fiscal
                  <SortIcon field="numero" />
                </div>
              </TableHead>
                <TableHead className="min-w-[200px] cursor-pointer hover:bg-muted/50 text-xs font-semibold px-3 py-3" onClick={() => handleSort('nome_cliente')}>
                  <div className="flex items-center gap-1">
                  Cliente
                  <SortIcon field="nome_cliente" />
                </div>
              </TableHead>
                <TableHead className="min-w-[150px] cursor-pointer hover:bg-muted/50 text-xs font-semibold px-3 py-3" onClick={() => handleSort('vendedor')}>
                  <div className="flex items-center gap-1">
                  Vendedor
                  <SortIcon field="vendedor" />
                </div>
              </TableHead>
                <TableHead className="min-w-[150px] cursor-pointer hover:bg-muted/50 text-xs font-semibold px-3 py-3" onClick={() => handleSort('motivo')}>
                  <div className="flex items-center gap-1">
                  Motivo
                  <SortIcon field="motivo" />
                </div>
              </TableHead>
                <TableHead className="min-w-[100px] cursor-pointer hover:bg-muted/50 text-xs font-semibold px-3 py-3" onClick={() => handleSort('valor_total_nota')}>
                  <div className="flex items-center gap-1">
                  Valor Total
                  <SortIcon field="valor_total_nota" />
                </div>
              </TableHead>
                <TableHead className="min-w-[60px] cursor-pointer hover:bg-muted/50 text-xs font-semibold px-3 py-3" onClick={() => handleSort('dias')}>
                  <div className="flex items-center gap-1">
                  Dias
                  <SortIcon field="dias" />
                </div>
              </TableHead>
                <TableHead className="min-w-[100px] cursor-pointer hover:bg-muted/50 text-xs font-semibold px-3 py-3" onClick={() => handleSort('prazo')}>
                  <div className="flex items-center gap-1">
                  Prazo
                  <SortIcon field="prazo" />
                </div>
              </TableHead>
                <TableHead className="min-w-[120px] cursor-pointer hover:bg-muted/50 text-xs font-semibold px-3 py-3" onClick={() => handleSort('resultado')}>
                  <div className="flex items-center gap-1">
                  Resultado
                  <SortIcon field="resultado" />
                </div>
              </TableHead>
                <TableHead className="min-w-[150px] text-xs font-semibold px-3 py-3">Validado Por</TableHead>
                <TableHead className="min-w-[200px] text-xs font-semibold px-3 py-3">Comentário</TableHead>
                <TableHead className="min-w-[120px] text-xs font-semibold px-3 py-3">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const resultado = (item.resultado || 'PENDENTE VALIDAÇÃO') as ResultadoStatus;
              
              return (
              <TableRow key={item.id} className="group hover:bg-muted/30">
                <TableCell colSpan={isSelectMode ? 15 : 14} className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={item.id} className="border-0">
                            <div className="flex items-center w-full py-3 px-3 hover:bg-muted/50 transition-colors">
                                {isSelectMode && (
                                  <button 
                                    onClick={() => toggleSelectItem(item.id)}
                                    className="w-[50px] flex items-center justify-center flex-shrink-0"
                                  >
                                    {selectedItems.has(item.id) ? (
                                      <CheckSquare className="h-4 w-4 text-primary" />
                                    ) : (
                                      <Square className="h-4 w-4" />
                                    )}
                                  </button>
                                )}
                                <div className="flex items-center gap-3 w-full text-xs">
                                    <AccordionTrigger className="w-[50px] py-0 pr-2 hover:no-underline flex-shrink-0">
                                        {/* Trigger Icon is automatic */}
                                    </AccordionTrigger>
                                    <div className="min-w-[100px] text-xs">{item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</div>
                                    <div className="min-w-[120px] font-medium text-xs">{item.numero}</div>
                                    <div className="min-w-[200px] truncate text-xs" title={item.nome_cliente}>{item.nome_cliente}</div>
                                    <div className="min-w-[150px] truncate text-xs" title={item.vendedor}>{item.vendedor}</div>
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
                                          : item.prazo === 'FINALIZADO'
                                          ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
                                          : item.prazo === 'TRATANDO'
                                          ? 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                          : item.prazo === 'CONCLUIDO'
                                          ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                          : 'bg-gray-500 text-white'
                                      }`}>
                                        {item.prazo || '-'}
                                      </span>
                                    </div>
                                    <div className="w-32">
                                        <Select
                                          value={resultado}
                                          onValueChange={(value) => {
                                            handleResultadoChange(item.id, value);
                                          }}
                                        >
                                          <SelectTrigger 
                                            className={`h-6 w-full text-[8px] px-1 py-0.5 ${RESULTADO_CORES[resultado]} border-0 cursor-pointer hover:opacity-90`}
                                            onClick={(e) => e.stopPropagation()}
                                            onMouseDown={(e) => e.stopPropagation()}
                                          >
                                            <SelectValue className="text-white">{resultado}</SelectValue>
                                          </SelectTrigger>
                                          <SelectContent 
                                            onClick={(e) => e.stopPropagation()}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            className="z-[10000]"
                                        >
                                            {RESULTADO_CICLO.map((res) => (
                                              <SelectItem 
                                                key={res} 
                                                value={res}
                                                className={`${RESULTADO_CORES[res]} text-white cursor-pointer hover:opacity-90`}
                                              >
                                                {res}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-28 truncate text-[9px]" title={item.nome_validador || '-'}>
                                      {item.nome_validador || '-'}
                                    </div>
                                    <div className="w-48 flex gap-1">
                                      <Textarea
                                        className={`h-7 text-[9px] min-h-[28px] max-h-[28px] resize-none flex-1 ${
                                          comentarios[item.id] || item.justificativa
                                            ? 'bg-red-100/50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                                            : ''
                                        }`}
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
                                      {(user?.role === 'ADMIN' || user?.role === 'LOGISTICA') && (
                                        <>
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
                                              setDeletingItem(item.id);
                                            }}
                                            title="Excluir"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                            <AccordionContent>
                              <div className="px-4 pb-4">
                                <div className="rounded-md border bg-muted/50 p-4">
                                  <div className="mb-3 pb-2 border-b">
                                    <p className="text-sm font-medium text-muted-foreground">
                                      <span className="font-semibold">Origem:</span> {item.cidade_origem || '-'}/{item.uf_origem || '-'}
                                    </p>
                                  </div>
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
                                                  const motivoSelecionado = e.target.value;
                                                  console.log('Select onChange:', { 
                                                    motivoSelecionado, 
                                                    prodId: prod.id, 
                                                    itemId: item.id,
                                                    produto: prod
                                                  });
                                                  if (motivoSelecionado && prod.id && item.id) {
                                                    handleMotivoItemChange(prod.id, motivoSelecionado, item.id);
                                                  } else {
                                                    console.error('Valores inválidos:', { 
                                                      motivoSelecionado, 
                                                      prodId: prod.id, 
                                                      itemId: item.id 
                                                    });
                                                    toast.error("Erro: Dados inválidos para salvar motivo");
                                                  }
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
        
        {/* Paginação */}
        {allData.length > itemsPerPage && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, allData.length)} de {allData.length} registros
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {Math.ceil(allData.length / itemsPerPage)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(allData.length / itemsPerPage), prev + 1))}
                disabled={currentPage >= Math.ceil(allData.length / itemsPerPage)}
              >
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
        </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="pt-2">
              Tem certeza que deseja excluir este registro?
            </DialogDescription>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Esta ação não pode ser desfeita.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeletingItem(null)}
              className="flex-1 sm:flex-initial"
            >
              Não
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="flex-1 sm:flex-initial"
            >
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Confirmação de Exclusão Múltipla */}
      <Dialog open={deletingMultiple} onOpenChange={(open) => !open && setDeletingMultiple(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="pt-2">
              Tem certeza que deseja excluir <span className="font-semibold text-foreground">{selectedItems.size} registro(s)</span>?
            </DialogDescription>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Esta ação não pode ser desfeita.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeletingMultiple(false)}
              className="flex-1 sm:flex-initial"
            >
              Não
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteMultiple}
              className="flex-1 sm:flex-initial"
            >
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Edição - Melhorado */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Editar Registro
            </DialogTitle>
            <DialogDescription className="pt-2">
              Alterar informações da nota fiscal
            </DialogDescription>
          </DialogHeader>
      {editingItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número da Nota</Label>
                  <Input
                    value={editingItem.numero || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, numero: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Input
                    value={editingItem.nome_cliente || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, nome_cliente: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vendedor</Label>
                  <Input
                    value={editingItem.vendedor || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, vendedor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cidade Origem</Label>
                  <Input
                    value={editingItem.cidade_origem || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, cidade_origem: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>UF Origem</Label>
                  <Input
                    value={editingItem.uf_origem || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, uf_origem: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Emissão</Label>
                  <Input
                    type="date"
                    value={editingItem.data_emissao ? new Date(editingItem.data_emissao).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, data_emissao: e.target.value })}
                                  />
                                </div>
                <div className="space-y-2">
                  <Label>Valor Total</Label>
                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.valor_total_nota || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, valor_total_nota: e.target.value })}
                                  />
                                </div>
                <div className="space-y-2">
                  <Label>Peso Líquido</Label>
                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.peso_liquido || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, peso_liquido: e.target.value })}
                                  />
                                </div>
                                </div>
              <div className="space-y-2">
                <Label>Motivo Principal</Label>
                                  <Select
                                    value={editingItem.motivo_id || ''}
                                    onValueChange={(value) => setEditingItem({ ...editingItem, motivo_id: value })}
                                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um motivo" />
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
              <div className="space-y-2">
                <Label>Justificativa</Label>
                                <Textarea
                                  value={editingItem.justificativa || ''}
                                  onChange={(e) => setEditingItem({ ...editingItem, justificativa: e.target.value })}
                                />
                              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setEditingItem(null)}
              className="flex-1 sm:flex-initial"
            >
                                  Cancelar
                                </Button>
            <Button 
              onClick={handleSaveEdit}
              className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90"
            >
              Salvar Alterações
                                </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
                    </div>
                  );
                }
