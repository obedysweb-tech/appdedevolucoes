import { useState, useEffect } from "react";
import { FilterBar } from "@/components/filters/FilterBar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useFilterStore, useAuthStore } from "@/lib/store";
import { getDateRangeFromPeriod } from "@/lib/dateUtils";
import { Loader2, FileSpreadsheet, FileText, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ExcelJS from 'exceljs';
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { generateReportHTML } from "@/components/reports/ReportHTMLPage";

const RESULTADO_ORDEM: Record<string, number> = {
  'PENDENTE VALIDAÇÃO': 1,
  'VALIDADA': 2,
  'LANÇADA': 3,
  'TRATATIVA DE ANULAÇÃO': 4,
  'ANULADA/CANCELADA': 5
};

type SortField = 'data_emissao' | 'numero' | 'nome_cliente' | 'cidade_origem' | 'vendedor' | 'motivo' | 'motivo_nome' | 'valor_total_nota' | 'dias' | 'prazo' | 'resultado';
type SortDirection = 'asc' | 'desc' | null;

export function ReportsPage() {
  const { filters } = useFilterStore();
  const { user } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]); // Todos os dados para relatório HTML
  const [filteredData, setFilteredData] = useState<any[]>([]); // Dados filtrados para exibição na tela
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const itemsPerPage = 100;

  useEffect(() => {
    fetchReportData();
    // Resetar ordenação quando filtros mudarem
    setSortField(null);
    setSortDirection(null);
    setCurrentPage(1);
  }, [filters]);

  const fetchReportData = async () => {
    setLoading(true);
    
    // Usar vendedor do objeto user (já carregado no App.tsx)
    const userVendedor = user?.role === 'VENDEDOR' ? user.vendedor : null;
    
    let query = supabase
      .from('devolucoes')
      .select(`
        *,
        itens:itens_devolucao(*, motivo_item:motivos_devolucao(id, nome)),
        setores(nome),
        motivos_devolucao(nome, setores:setores(nome))
      `);
    
    // Filtrar por vendedor do usuário (apenas se for tipo VENDEDOR)
    if (user && user.role === 'VENDEDOR' && userVendedor) {
      query = query.eq('vendedor', userVendedor);
      console.log('🔒 Reports - Filtrando por vendedor:', userVendedor);
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
    
    // Filtro de Data
    if (effectiveStartDate) {
        query = query.gte('data_emissao', effectiveStartDate.toISOString().split('T')[0]);
    }
    if (effectiveEndDate) {
        query = query.lte('data_emissao', effectiveEndDate.toISOString().split('T')[0]);
    }

    const { data: devolucoes, error } = await query;

    if (error) {
      console.error(error);
      toast.error("Erro ao carregar dados do relatório");
    } else if (devolucoes) {
      // Buscar dados dos clientes baseado no CNPJ (para TODOS os dados)
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
      
      // Formatar TODOS os dados (sem filtro de resultado) para o relatório HTML
      const formattedAll = devolucoes.map((r: any) => {
        const cliente = clientesMap.get(r.cnpj_destinatario);
        return {
          ...r,
          setor_nome: (typeof r.setores === 'object' && r.setores?.nome) ? r.setores.nome : (typeof r.setores === 'string' ? r.setores : '-'),
          motivo_nome: (typeof r.motivos_devolucao === 'object' && r.motivos_devolucao?.nome) ? r.motivos_devolucao.nome : (typeof r.motivos_devolucao === 'string' ? r.motivos_devolucao : '-'),
          itens_count: r.itens?.length || 0,
          nome_cliente: cliente?.nome || r.nome_cliente || 'Cliente não encontrado',
          vendedor: cliente?.vendedor || r.vendedor || '-',
          rede: cliente?.rede || r.rede || '-',
          uf_destino: cliente?.uf || r.uf_destino || '-',
          cidade_destino: cliente?.municipio || r.cidade_destino || '-',
          prazo: r.prazo || (r.resultado === 'LANÇADA' || r.resultado === 'ANULADA/CANCELADA' ? 'FINALIZADO' : r.prazo),
          nome_validador: r.nome_validador || '-',
          finalizada_por: r.finalizada_por || '-',
          justificativa: r.justificativa || ''
        };
      });
      
      // Salvar TODOS os dados em allData (para relatório HTML usar todos os resultados)
      const sortedAll = formattedAll.sort((a, b) => {
        const ordemA = RESULTADO_ORDEM[a.resultado] || 999;
        const ordemB = RESULTADO_ORDEM[b.resultado] || 999;
        if (ordemA !== ordemB) return ordemA - ordemB;
        const dataA = a.data_emissao ? new Date(a.data_emissao).getTime() : 0;
        const dataB = b.data_emissao ? new Date(b.data_emissao).getTime() : 0;
        return dataB - dataA;
      });
      
      setAllData(sortedAll);
      
      // Filtrar apenas LANÇADA e ANULADA/CANCELADA para exibição na tela
      const devolucoesFiltradas = formattedAll.filter((d: any) => {
        return d.resultado === 'LANÇADA' || d.resultado === 'ANULADA/CANCELADA';
      });
      
      const sortedDefault = devolucoesFiltradas.sort((a, b) => {
        const ordemA = RESULTADO_ORDEM[a.resultado] || 999;
        const ordemB = RESULTADO_ORDEM[b.resultado] || 999;
        if (ordemA !== ordemB) return ordemA - ordemB;
        const dataA = a.data_emissao ? new Date(a.data_emissao).getTime() : 0;
        const dataB = b.data_emissao ? new Date(b.data_emissao).getTime() : 0;
        return dataB - dataA;
      });
      
      setFilteredData(sortedDefault);
    }
    setLoading(false);
  };

  // Função antiga de PDF - substituída pelo ReportHTML (mantida para referência)
  // @ts-ignore - função legada não utilizada
  const generatePDFLegacy = () => {
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

      // Calcular estatísticas
      const stats = {
        nfPendentes: allData.filter(d => d.resultado === 'PENDENTE VALIDAÇÃO').length,
        totalPendente: allData
          .filter(d => d.resultado === 'PENDENTE VALIDAÇÃO')
          .reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0),
        nfCancelamento: allData.filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO').length,
        totalCancelamento: allData
          .filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO')
          .reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0),
        nfAtraso: allData.filter(d => d.prazo === 'EM ATRASO').length,
        totalAtraso: allData
          .filter(d => d.prazo === 'EM ATRASO')
          .reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0)
      };

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

      // Card 1: NF Pendentes
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

      // ========== GRÁFICOS ==========
      // Calcular dados dos gráficos
      const topClientesChart = allData.reduce((acc: any, curr) => {
        const name = curr.nome_cliente || 'Desconhecido';
        const valor = Number(curr.valor_total_nota) || 0;
        acc[name] = (acc[name] || 0) + valor;
        return acc;
      }, {});
      const topClientesList = Object.entries(topClientesChart)
        .map(([name, value]) => ({ name, value }))
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 5);

      const topVendedoresChart = allData.reduce((acc: any, curr) => {
        const vendedor = curr.vendedor || 'Desconhecido';
        const valor = Number(curr.valor_total_nota) || 0;
        acc[vendedor] = (acc[vendedor] || 0) + valor;
        return acc;
      }, {});
      const topVendedoresList = Object.entries(topVendedoresChart)
        .map(([name, value]) => ({ name, value }))
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 5);

      const topRedesChart = allData.reduce((acc: any, curr) => {
        const rede = curr.rede || 'Sem rede';
        const valor = Number(curr.valor_total_nota) || 0;
        acc[rede] = (acc[rede] || 0) + valor;
        return acc;
      }, {});
      const topRedesList = Object.entries(topRedesChart)
        .map(([name, value]) => ({ name, value }))
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 5);

      const cancelamentoChart = allData
        .filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO')
        .reduce((acc: any, curr) => {
          const date = new Date(curr.data_emissao || curr.created_at);
          const day = format(date, 'dd/MM', { locale: ptBR });
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {});

      const municipioChart = allData.reduce((acc: any, curr) => {
        const municipio = curr.cidade_origem || 'N/A';
        acc[municipio] = (acc[municipio] || 0) + (Number(curr.valor_total_nota) || 0);
        return acc;
      }, {});
      const municipioList = Object.entries(municipioChart)
        .map(([name, value]) => ({ name, value }))
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 6);

      const motivosChart = allData.reduce((acc: any, curr) => {
        const motivo = curr.motivo_nome || 'Não informado';
        acc[motivo] = (acc[motivo] || 0) + 1;
        return acc;
      }, {});
      const motivosList = Object.entries(motivosChart)
        .map(([name, value]) => ({ name, value }))
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 5);

      const produtosMap: Record<string, number> = {};
      allData.forEach(devol => {
        const itens = devol.itens || [];
        itens.forEach((item: any) => {
          const produto = item.descricao || 'Desconhecido';
          const palavras = produto.split(' ');
          const nomeReduzido = palavras.slice(0, 2).join(' ');
          const quantidade = Number(item.quantidade) || 0;
          produtosMap[nomeReduzido] = (produtosMap[nomeReduzido] || 0) + quantidade;
        });
      });
      const topProdutosList = Object.entries(produtosMap)
        .map(([name, quantidade]) => ({ name, quantidade }))
        .sort((a: any, b: any) => b.quantidade - a.quantidade)
        .slice(0, 10);

      // Título da seção de gráficos
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Analises Graficas', 15, yPosition);
      yPosition += 10;

      // Gráfico 1: Top Clientes
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Top 5 Clientes (Valor)', 15, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      topClientesList.forEach((item: any, index) => {
        const nome = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;
        doc.text(`${index + 1}. ${nome}: R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      // Gráfico 2: Top Vendedores
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Top 5 Vendedores (Valor)', 15, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      topVendedoresList.forEach((item: any, index) => {
        const nome = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;
        doc.text(`${index + 1}. ${nome}: R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      // Gráfico 3: Top Redes
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Top 5 Redes (Valor)', 15, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      topRedesList.forEach((item: any, index) => {
        const nome = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;
        doc.text(`${index + 1}. ${nome}: R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      // Gráfico 4: Notas em Cancelamento
      const cancelamentoEntries = Object.entries(cancelamentoChart).sort((a: any, b: any) => {
        const dateA = new Date(a[0].split('/').reverse().join('-'));
        const dateB = new Date(b[0].split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      }).slice(0, 10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Notas em Cancelamento', 15, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      cancelamentoEntries.forEach(([date, count]: any) => {
        doc.text(`${date}: ${count} nota(s)`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      // Gráfico 5: Distribuição por Município
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Distribuição por Município', 15, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      municipioList.forEach((item: any, index) => {
        const nome = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;
        doc.text(`${index + 1}. ${nome}: R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      // Gráfico 6: Principais Motivos
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Principais Motivos', 15, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      motivosList.forEach((item: any, index) => {
        const nome = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;
        doc.text(`${index + 1}. ${nome}: ${item.value} ocorrência(s)`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      // Gráfico 7: Produtos Críticos
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Produtos Críticos (Top 10)', 15, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      topProdutosList.forEach((item: any, index) => {
        const nome = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;
        doc.text(`${index + 1}. ${nome}: ${item.quantidade.toFixed(2)} unidades`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 10;

      // Nova página se necessário
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

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
        body: produtosData.slice(0, 50),
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
      doc.text('Inteligencia e Analises', 15, yPosition + 3);
      yPosition += 15;

      // Calcular insights automáticos
      const totalValue = allData.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0);
      const totalReturns = allData.length;
      const totalProducts = allData.reduce((acc, curr) => {
        const itens = curr.itens || [];
        return acc + itens.reduce((sum: number, item: any) => sum + (Number(item.quantidade) || 0), 0);
      }, 0);
      const avgTicket = totalReturns > 0 ? totalValue / totalReturns : 0;
      const avgProductsPerReturn = totalProducts > 0 && totalReturns > 0 ? totalProducts / totalReturns : 0;

      const insightsList: string[] = [];
      
      // Insight básico
      if (totalReturns > 0) {
        insightsList.push(`Total de ${totalReturns} devolucao(oes) no periodo selecionado, totalizando R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`);
      }
      
      // Cliente concentrado
      if (topClientesList.length > 0 && totalValue > 0) {
        const top1Percent = ((topClientesList[0].value as number) / totalValue) * 100;
        if (top1Percent > 20) {
          insightsList.push(`Cliente "${topClientesList[0].name}" concentra ${top1Percent.toFixed(1)}% do valor total de devolucoes.`);
        }
      }
      
      // Média de produtos
      if (avgProductsPerReturn > 0) {
        insightsList.push(`Media de ${avgProductsPerReturn.toFixed(1)} produtos por devolucao.`);
      }
      
      // Vendedor líder
      if (topVendedoresList.length > 0) {
        insightsList.push(`Vendedor "${topVendedoresList[0].name}" lidera em devolucoes com R$ ${(topVendedoresList[0].value as number).toLocaleString('pt-BR')}.`);
      }
      
      // Produto mais devolvido
      if (topProdutosList.length > 0) {
        insightsList.push(`Produto "${topProdutosList[0].name}" e o mais devolvido com ${topProdutosList[0].quantidade.toFixed(2)} unidades.`);
      }
      
      // Taxa de cancelamento
      const cancelamentoCount = allData.filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO' || d.resultado === 'ANULADA/CANCELADA').length;
      const taxaCancelamento = totalReturns > 0 ? (cancelamentoCount / totalReturns) * 100 : 0;
      if (taxaCancelamento > 10) {
        insightsList.push(`Taxa de cancelamento alta: ${taxaCancelamento.toFixed(1)}% das devolucoes estao em cancelamento.`);
      } else if (cancelamentoCount > 0) {
        insightsList.push(`${cancelamentoCount} devolucao(oes) em processo de cancelamento.`);
      }
      
      // Motivo mais comum
      if (motivosList.length > 0) {
        insightsList.push(`Motivo mais frequente: "${motivosList[0].name}" com ${motivosList[0].value} ocorrencia(s).`);
      }
      
      // Ticket alto
      if (avgTicket > 0) {
        const ticketAlto = allData.filter(d => Number(d.valor_total_nota) > avgTicket * 1.5).length;
        if (ticketAlto > 0) {
          insightsList.push(`${ticketAlto} devolucao(oes) com valor acima de 150% do ticket medio.`);
        }
      }
      
      // Rede mais problemática
      if (topRedesList.length > 0 && totalValue > 0) {
        const redePercent = ((topRedesList[0].value as number) / totalValue) * 100;
        if (redePercent > 15) {
          insightsList.push(`Rede "${topRedesList[0].name}" representa ${redePercent.toFixed(1)}% do valor devolvido.`);
        }
      }

      // Exibir Insights Automáticos
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Insights Automaticos:', 15, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      insightsList.forEach((insight) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(insight, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 5;

      // Alertas
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Alertas e Recomendacoes:', 15, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      const alertas: string[] = [];
      if (stats.nfAtraso > 0) {
        alertas.push(`${stats.nfAtraso} nota(s) fiscal(is) em atraso requerem atencao imediata`);
      }
      if (stats.nfPendentes > 10) {
        alertas.push(`Alto volume de pendencias (${stats.nfPendentes}) - considere revisar processos`);
      }
      if (stats.totalCancelamento > totalGeral * 0.1) {
        alertas.push(`Taxa de cancelamento acima de 10% - investigar causas`);
      }
      if (allData.length > 0) {
        const mediaDias = allData
          .filter(d => d.dias !== null && d.dias !== undefined)
          .reduce((sum, d) => sum + (d.dias || 0), 0) / allData.filter(d => d.dias !== null && d.dias !== undefined).length;
        if (mediaDias > 30) {
          alertas.push(`Tempo medio de processamento alto (${mediaDias.toFixed(1)} dias)`);
        }
      }

      if (alertas.length === 0) {
        alertas.push('Nenhum alerta critico identificado');
      }

      alertas.forEach((alerta) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(alerta, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 5;

      // Tendências
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text('Tendencias:', 15, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      const taxaValidacao = allData.length > 0 
        ? ((validadas.length / allData.length) * 100).toFixed(1)
        : '0';
      const taxaCancelamentoFinal = allData.length > 0
        ? ((stats.nfCancelamento / allData.length) * 100).toFixed(1)
        : '0';

      doc.text(`Taxa de Validacao: ${taxaValidacao}%`, 20, yPosition);
      yPosition += 5;
      doc.text(`Taxa de Cancelamento: ${taxaCancelamentoFinal}%`, 20, yPosition);
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
          { align: 'center' as any }
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
  
  // Aplicar ordenação customizada quando o usuário clicar nos cabeçalhos
  useEffect(() => {
    if (filteredData.length === 0) return;
    
    let sorted = [...filteredData];
    
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
          case 'motivo_nome':
            aValue = (a.motivo_nome || '').toLowerCase();
            bValue = (b.motivo_nome || '').toLowerCase();
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
            aValue = RESULTADO_ORDEM[a.resultado] || 999;
            bValue = RESULTADO_ORDEM[b.resultado] || 999;
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
      sorted = [...filteredData].sort((a, b) => {
        const ordemA = RESULTADO_ORDEM[a.resultado] || 999;
        const ordemB = RESULTADO_ORDEM[b.resultado] || 999;
        
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
  }, [sortField, sortDirection, filteredData, currentPage]);

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

  const handleDelete = async (id: string) => {
    if (!user) return;

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
      fetchReportData(); // Recarregar dados
    } catch (error: any) {
      toast.error("Erro ao excluir registro: " + error.message);
    }
  };

  const exportToExcel = async () => {
    if (allData.length === 0) {
        toast.warning("Sem dados para exportar");
        return;
    }

    try {
      // Buscar dados completos incluindo logs de validação
      const devolucaoIds = allData.map(d => d.id);
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

      // Preparar dados expandidos (uma linha por produto)
      const exportData: any[] = [];
      
      allData.forEach((item) => {
        const resultado = item.resultado || 'PENDENTE VALIDAÇÃO';
        const nomeValidador = resultado !== 'PENDENTE VALIDAÇÃO' 
          ? (validadoresMap.get(`${item.id}_${resultado}`) || '-')
          : '-';

        // Se não houver itens, criar uma linha só com dados da nota
        if (!item.itens || item.itens.length === 0) {
          exportData.push({
            'Data Emissão': item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy') : '',
            'Data Criação': item.created_at ? format(new Date(item.created_at), 'dd/MM/yyyy HH:mm') : '',
            'Nota Fiscal': item.numero || '',
            'Série': item.serie || '',
            'Chave de Acesso': item.chave_acesso || '',
            'Cliente': item.nome_cliente || '',
            'CNPJ Cliente': item.cnpj_destinatario || '',
            'CNPJ Emitente': item.cnpj_emitente || '',
            'Razão Social Emitente': item.razao_social_emitente || '',
            'Vendedor': item.vendedor || '',
            'Rede': item.rede || '',
            'Cidade Origem': item.cidade_origem || '',
            'UF Origem': item.uf_origem || '',
            'Cidade Destino': item.cidade_destino || '',
            'UF Destino': item.uf_destino || '',
            'Setor': item.setor_nome || '',
            'Motivo': item.motivo_nome || '',
            'Status': resultado,
            'Validado Por': nomeValidador,
            'Comentário': item.justificativa || '',
            'Dias': item.dias !== null && item.dias !== undefined ? item.dias : '',
            'Prazo': item.prazo || '',
            'Valor Total Nota': item.valor_total_nota ? Number(item.valor_total_nota).toFixed(2) : '0.00',
            'Peso Líquido': item.peso_liquido || '',
            'Sincronização ERP': item.sincronizacao_erp || '',
            'Finalidade NFe': item.finalidade_nfe || '',
            'Natureza Operação': item.natureza_operacao || '',
            'CFOP': item.cfop || '',
            'Número Item': '',
            'Descrição Produto': '',
            'Unidade': '',
            'Quantidade': '',
            'Valor Unitário': '',
            'Valor Total Item': ''
          });
        } else {
          // Criar uma linha por produto
          item.itens.forEach((produto: any, index: number) => {
            exportData.push({
              'Data Emissão': index === 0 ? (item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy') : '') : '',
              'Data Criação': index === 0 ? (item.created_at ? format(new Date(item.created_at), 'dd/MM/yyyy HH:mm') : '') : '',
              'Nota Fiscal': index === 0 ? (item.numero || '') : '',
              'Série': index === 0 ? (item.serie || '') : '',
              'Chave de Acesso': index === 0 ? (item.chave_acesso || '') : '',
              'Cliente': index === 0 ? (item.nome_cliente || '') : '',
              'CNPJ Cliente': index === 0 ? (item.cnpj_destinatario || '') : '',
              'CNPJ Emitente': index === 0 ? (item.cnpj_emitente || '') : '',
              'Razão Social Emitente': index === 0 ? (item.razao_social_emitente || '') : '',
              'Vendedor': index === 0 ? (item.vendedor || '') : '',
              'Rede': index === 0 ? (item.rede || '') : '',
              'Cidade Origem': index === 0 ? (item.cidade_origem || '') : '',
              'UF Origem': index === 0 ? (item.uf_origem || '') : '',
              'Cidade Destino': index === 0 ? (item.cidade_destino || '') : '',
              'UF Destino': index === 0 ? (item.uf_destino || '') : '',
              'Setor': index === 0 ? (item.setor_nome || '') : '',
              'Motivo': index === 0 ? (item.motivo_nome || '') : '',
              'Status': index === 0 ? resultado : '',
              'Validado Por': index === 0 ? nomeValidador : '',
              'Comentário': index === 0 ? (item.justificativa || '') : '',
              'Dias': index === 0 ? (item.dias !== null && item.dias !== undefined ? item.dias : '') : '',
              'Prazo': index === 0 ? (item.prazo || '') : '',
              'Valor Total Nota': index === 0 ? (item.valor_total_nota ? Number(item.valor_total_nota).toFixed(2) : '0.00') : '',
              'Peso Líquido': index === 0 ? (item.peso_liquido || '') : '',
              'Sincronização ERP': index === 0 ? (item.sincronizacao_erp || '') : '',
              'Finalidade NFe': index === 0 ? (item.finalidade_nfe || '') : '',
              'Natureza Operação': index === 0 ? (item.natureza_operacao || '') : '',
              'CFOP': index === 0 ? (item.cfop || '') : '',
              'Número Item': produto.numero_item || '',
              'Descrição Produto': produto.descricao || '',
              'Unidade': produto.unidade || '',
              'Quantidade': produto.quantidade ? Number(produto.quantidade).toFixed(2) : '',
              'Valor Unitário': produto.valor_unitario ? Number(produto.valor_unitario).toFixed(2) : '',
              'Valor Total Item': produto.valor_total_bruto ? Number(produto.valor_total_bruto).toFixed(2) : ''
            });
          });
        }
      });

      // Criar workbook com ExcelJS
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Devoluções');
      
      // Definir colunas e seus nomes
      const columnHeaders = [
        'Data Emissão', 'Data Criação', 'Nota Fiscal', 'Série', 'Chave de Acesso',
        'Cliente', 'CNPJ Cliente', 'CNPJ Emitente', 'Razão Social Emitente',
        'Vendedor', 'Rede', 'Cidade Origem', 'UF Origem', 'Cidade Destino', 'UF Destino',
        'Setor', 'Motivo', 'Status', 'Validado Por', 'Comentário',
        'Dias', 'Prazo', 'Valor Total Nota', 'Peso Líquido', 'Sincronização ERP',
        'Finalidade NFe', 'Natureza Operação', 'CFOP',
        'Número Item', 'Descrição Produto', 'Unidade', 'Quantidade', 'Valor Unitário', 'Valor Total Item'
      ];
      
      const columnWidths = [
        12, 18, 12, 8, 45, 30, 18, 18, 30, 20, 20, 20, 5, 20, 5,
        15, 30, 20, 20, 40, 8, 12, 15, 12, 18, 15, 20, 8,
        12, 40, 8, 12, 15, 15
      ];
      
      // Adicionar cabeçalho
      const headerRow = worksheet.addRow(columnHeaders);
      
      // Formatar cabeçalho (verde escuro #073e29 com texto branco em negrito)
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF073E29' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      });
      headerRow.height = 25;
      
      // Definir larguras das colunas
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });
      
      // Adicionar dados
      exportData.forEach(row => {
        const dataRow = worksheet.addRow(columnHeaders.map(header => row[header] || ''));
        dataRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
          };
        });
      });
      
      // Formatar coluna de Chave de Acesso como texto
      const chaveColIndex = columnHeaders.indexOf('Chave de Acesso') + 1;
      worksheet.getColumn(chaveColIndex).numFmt = '@';
      
      // Aplicar filtros automáticos
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: exportData.length + 1, column: columnHeaders.length }
      };
      
      // Congelar primeira linha
      worksheet.views = [{ state: 'frozen', ySplit: 1 }];
      
      // Gerar buffer e download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Relatorio_Devolucoes_${format(new Date(), 'yyyy-MM-dd_HHmm')}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Relatório Excel gerado com sucesso!");
    } catch (error: any) {
      console.error('Erro ao gerar Excel:', error);
      toast.error("Erro ao gerar relatório Excel: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios" 
        description="Visualize e exporte relatórios detalhados das devoluções. Gere PDFs e planilhas Excel com todos os dados filtrados."
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <FilterBar />
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
            <Button variant="outline" onClick={exportToExcel} className="w-full sm:w-auto">
                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                Exportar Excel
            </Button>
            <Button variant="outline" onClick={() => {
              const htmlContent = generateReportHTML({
                data: allData,
                stats: {
                  nfPendentes: allData.filter(d => d.resultado === 'PENDENTE VALIDAÇÃO').length,
                  totalPendente: allData.filter(d => d.resultado === 'PENDENTE VALIDAÇÃO').reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0),
                  nfCancelamento: allData.filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO').length,
                  totalCancelamento: allData.filter(d => d.resultado === 'TRATATIVA DE ANULAÇÃO').reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0),
                  nfAtraso: allData.filter(d => d.prazo === 'EM ATRASO').length,
                  totalAtraso: allData.filter(d => d.prazo === 'EM ATRASO').reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0),
                  nfValidadas: allData.filter(d => d.resultado === 'VALIDADA').length,
                  totalValidadas: allData.filter(d => d.resultado === 'VALIDADA').reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0),
                  nfLancadas: allData.filter(d => d.resultado === 'LANÇADA').length,
                  totalLancadas: allData.filter(d => d.resultado === 'LANÇADA').reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0),
                  totalGeral: allData.reduce((sum, d) => sum + (Number(d.valor_total_nota) || 0), 0)
                },
                filters
              });
              
              const newWindow = window.open('', '_blank');
              if (newWindow) {
                newWindow.document.write(htmlContent);
                newWindow.document.close();
              }
            }} className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" />
                Gerar Relatório
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Detalhamento de Devoluções</CardTitle>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
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
                                <TableHead className="text-[10px] px-2">Finalizada Por</TableHead>
                                <TableHead className="text-[10px] px-2">Comentário</TableHead>
                                <TableHead className="text-[10px] px-2">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="group">
                                    <TableCell colSpan={13} className="p-0 border-b">
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value={item.id} className="border-b-0">
                                                <div className="flex items-center w-full py-2 px-4 hover:bg-muted/50">
                                                    <div className="flex gap-2 w-full items-center text-[10px]">
                                                        <AccordionTrigger className="w-[50px] py-0 pr-4 hover:no-underline flex-shrink-0"></AccordionTrigger>
                                                        <div className="w-20">{item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy') : '-'}</div>
                                                        <div className="w-20 font-medium">{item.numero}</div>
                                                        <div className="w-32 truncate" title={item.nome_cliente}>{item.nome_cliente}</div>
                                                        <div className="w-24 truncate" title={item.vendedor}>{item.vendedor}</div>
                                                        <div className="w-40 truncate" title={item.motivo_nome}>{item.motivo_nome || '-'}</div>
                                                        <div className="w-28 text-right">R$ {Number(item.valor_total_nota || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                                        <div className="w-20">
                                                            <span className={`text-[9px] px-1 py-0.5 rounded ${
                                                                item.prazo === 'EM ATRASO' 
                                                                    ? 'bg-red-500 text-white' 
                                                                    : item.prazo === 'NO PRAZO' 
                                                                    ? 'bg-green-500 text-white'
                                                                    : item.prazo === 'FINALIZADO'
                                                                    ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                    : 'bg-gray-500 text-white'
                                                            }`}>
                                                                {item.prazo || '-'}
                                                            </span>
                                                        </div>
                                                        <div className="w-32">
                                                            <span className={`text-[9px] px-1 py-0.5 rounded ${
                                                                item.resultado === 'VALIDADA' || item.resultado === 'LANÇADA'
                                                                    ? 'bg-blue-500 text-white'
                                                                    : item.resultado === 'ANULADA/CANCELADA'
                                                                    ? 'bg-red-500 text-white'
                                                                    : 'bg-gray-500 text-white'
                                                            }`}>
                                                                {item.resultado || '-'}
                                                            </span>
                                                        </div>
                                                        <div className="w-28 truncate text-[9px]" title={item.nome_validador || '-'}>
                                                            {item.nome_validador || '-'}
                                                        </div>
                                                        <div className="w-28 truncate text-[9px]" title={item.finalizada_por || '-'}>
                                                            {item.finalizada_por || '-'}
                                                        </div>
                                                        <div className="w-48 truncate text-[9px]" title={item.justificativa || '-'}>
                                                            {item.justificativa || '-'}
                                                        </div>
                                                        <div className="w-28 flex gap-1">
                                                            {(user?.role === 'ADMIN' || user?.role === 'LOGISTICA') && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        className="h-7 px-1"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (confirm('Tem certeza que deseja excluir este registro?')) {
                                                                                handleDelete(item.id);
                                                                            }
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
                                                                                <TableCell className="text-xs">
                                                                                    {prod.motivo_item?.nome || '-'}
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
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                                        Nenhum dado encontrado com os filtros atuais.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {!loading && filteredData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} registros
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => {
                  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
                  return page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2);
                })
                .map((page, index, array) => {
                  const prevPage = array[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;
                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsis && <span className="px-2">...</span>}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    </div>
                  );
                })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredData.length / itemsPerPage), prev + 1))}
              disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
            >
              Próxima
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
