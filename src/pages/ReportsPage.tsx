import { useState, useEffect } from "react";
import { FilterBar } from "@/components/filters/FilterBar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useFilterStore, useAuthStore } from "@/lib/store";
import { getDateRangeFromPeriod } from "@/lib/dateUtils";
import { Loader2, FileSpreadsheet, FileText, Download, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RESULTADO_ORDEM: Record<string, number> = {
  'PENDENTE VALIDAÇÃO': 1,
  'VALIDADA': 2,
  'LANÇADA': 3,
  'TRATATIVA DE ANULAÇÃO': 4,
  'ANULADA/CANCELADA': 5
};

type SortField = 'data_emissao' | 'numero' | 'nome_cliente' | 'cidade_origem' | 'vendedor' | 'motivo_nome' | 'valor_total_nota' | 'dias' | 'prazo' | 'resultado';
type SortDirection = 'asc' | 'desc' | null;

export function ReportsPage() {
  const { filters } = useFilterStore();
  const { user } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
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
        itens:itens_devolucao(*),
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
      // Formatar dados para exibição/exportação
      const formatted = devolucoes.map((r: any) => ({
        ...r,
        setor_nome: (typeof r.setores === 'object' && r.setores?.nome) ? r.setores.nome : (typeof r.setores === 'string' ? r.setores : '-'),
        motivo_nome: (typeof r.motivos_devolucao === 'object' && r.motivos_devolucao?.nome) ? r.motivos_devolucao.nome : (typeof r.motivos_devolucao === 'string' ? r.motivos_devolucao : '-'),
        itens_count: r.itens?.length || 0
      }));
      
      // Aplicar ordenação padrão inicialmente (a ordenação customizada será aplicada no useEffect)
      const sortedDefault = formatted.sort((a, b) => {
        const ordemA = RESULTADO_ORDEM[a.resultado] || 999;
        const ordemB = RESULTADO_ORDEM[b.resultado] || 999;
        
        if (ordemA !== ordemB) {
          return ordemA - ordemB;
        }
        
        // Se mesmo resultado, ordenar por data de emissão (mais recente primeiro)
        const dataA = a.data_emissao ? new Date(a.data_emissao).getTime() : 0;
        const dataB = b.data_emissao ? new Date(b.data_emissao).getTime() : 0;
        return dataB - dataA;
      });
      
      setAllData(sortedDefault);
    }
    setLoading(false);
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
      sorted = [...allData].sort((a, b) => {
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

  const exportToExcel = () => {
    if (data.length === 0) {
        toast.warning("Sem dados para exportar");
        return;
    }

    // Preparar dados para exportação (usar allData para exportar tudo)
    const exportData = allData.map(item => ({
        'Data Emissão': item.data_emissao ? format(new Date(item.data_emissao), 'dd/MM/yyyy') : '',
        'Nota Fiscal': item.numero,
        'Cliente': item.nome_cliente,
        'CNPJ': item.cnpj_destinatario,
        'Vendedor': item.vendedor,
        'Cidade': item.cidade_origem,
        'UF': item.uf_origem,
        'Setor': item.setor_nome,
        'Motivo': item.motivo_nome,
        'Dias': item.dias !== null && item.dias !== undefined ? item.dias : '-',
        'Prazo': item.prazo || '-',
        'Status': item.resultado || 'PENDENTE VALIDAÇÃO',
        'Valor Total': item.valor_total_nota,
        'Qtd Itens': item.itens_count
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório Devoluções");
    XLSX.writeFile(wb, `Relatorio_Devolucoes_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success("Relatório Excel gerado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={exportToExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                Exportar Excel
            </Button>
            <Button variant="outline" onClick={generatePDF}>
                <FileText className="mr-2 h-4 w-4" />
                Gerar PDF
            </Button>
        </div>
      </div>
      
      <FilterBar />

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
                                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('data_emissao')}>
                                    <div className="flex items-center">
                                        Data Emissão
                                        <SortIcon field="data_emissao" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('numero')}>
                                    <div className="flex items-center">
                                        Nota Fiscal
                                        <SortIcon field="numero" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('nome_cliente')}>
                                    <div className="flex items-center">
                                        Cliente
                                        <SortIcon field="nome_cliente" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('vendedor')}>
                                    <div className="flex items-center">
                                        Vendedor
                                        <SortIcon field="vendedor" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('motivo')}>
                                    <div className="flex items-center">
                                        Motivo
                                        <SortIcon field="motivo" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('cidade_origem')}>
                                    <div className="flex items-center">
                                        Origem
                                        <SortIcon field="cidade_origem" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('dias')}>
                                    <div className="flex items-center">
                                        Dias
                                        <SortIcon field="dias" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('prazo')}>
                                    <div className="flex items-center">
                                        Prazo
                                        <SortIcon field="prazo" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('resultado')}>
                                    <div className="flex items-center">
                                        Resultado
                                        <SortIcon field="resultado" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort('valor_total_nota')}>
                                    <div className="flex items-center justify-end">
                                        Valor Total
                                        <SortIcon field="valor_total_nota" />
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.data_emissao ? format(new Date(row.data_emissao), 'dd/MM/yyyy') : '-'}</TableCell>
                                    <TableCell>{row.numero}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={row.nome_cliente}>{row.nome_cliente}</TableCell>
                                    <TableCell className="max-w-[150px] truncate">{row.vendedor}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={row.motivo_nome}>{row.motivo_nome || '-'}</TableCell>
                                    <TableCell>{row.cidade_origem}/{row.uf_origem}</TableCell>
                                    <TableCell className="text-center">{row.dias !== null && row.dias !== undefined ? row.dias : '-'}</TableCell>
                                    <TableCell>
                                      <Badge className={
                                        row.prazo === 'EM ATRASO' 
                                          ? 'bg-red-500 hover:bg-red-600' 
                                          : row.prazo === 'NO PRAZO' 
                                          ? 'bg-green-500 hover:bg-green-600' 
                                          : 'bg-gray-500 hover:bg-gray-600'
                                      }>
                                        {row.prazo || '-'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={row.resultado === 'VALIDADA' || row.resultado === 'LANÇADA' ? 'default' : row.resultado === 'ANULADA/CANCELADA' ? 'destructive' : 'secondary'} className="text-[10px]">
                                            {row.resultado || 'PENDENTE VALIDAÇÃO'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        R$ {Number(row.valor_total_nota || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
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
      {!loading && allData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, allData.length)} de {allData.length} registros
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
              {Array.from({ length: Math.ceil(allData.length / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => {
                  const totalPages = Math.ceil(allData.length / itemsPerPage);
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
  );
}
