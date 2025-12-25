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
import { useFilterStore } from "@/lib/store";
import { Loader2, FileSpreadsheet, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as XLSX from 'xlsx';
import { toast } from "sonner";

export function ReportsPage() {
  const { filters } = useFilterStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  const fetchReportData = async () => {
    setLoading(true);
    
    let query = supabase
      .from('returns')
      .select(`
        *,
        items:return_items(*),
        sectors(name),
        return_reasons(name)
      `)
      .order('created_at', { ascending: false });

    // Apply Filters
    if (filters.search) {
      query = query.or(`customer_name.ilike.%${filters.search}%,seller_name.ilike.%${filters.search}%,invoice_number.ilike.%${filters.search}%`);
    }
    
    // Date Range Filter (Basic implementation)
    if (filters.startDate) {
        query = query.gte('invoice_date', filters.startDate.toISOString());
    }
    if (filters.endDate) {
        query = query.lte('invoice_date', filters.endDate.toISOString());
    }

    const { data: returns, error } = await query;

    if (error) {
      console.error(error);
      toast.error("Erro ao carregar dados do relatório");
    } else {
      // Flatten data for easier display/export
      const formatted = returns.map((r: any) => ({
        ...r,
        sector_name: r.sectors?.name || '-',
        reason_name: r.return_reasons?.name || '-',
        items_count: r.items?.length || 0
      }));
      setData(formatted);
    }
    setLoading(false);
  };

  const exportToExcel = () => {
    if (data.length === 0) {
        toast.warning("Sem dados para exportar");
        return;
    }

    // Prepare data for export (flatten objects)
    const exportData = data.map(item => ({
        'Data Emissão': item.invoice_date ? format(new Date(item.invoice_date), 'dd/MM/yyyy') : '',
        'Nota Fiscal': item.invoice_number,
        'Cliente': item.customer_name,
        'CNPJ': item.customer_cnpj,
        'Vendedor': item.seller_name,
        'Cidade': item.origin_city,
        'UF': item.origin_uf,
        'Setor': item.sector_name,
        'Motivo': item.reason_name,
        'Status': item.status === 'APPROVED' ? 'Aprovado' : item.status === 'REJECTED' ? 'Rejeitado' : 'Pendente',
        'Valor Total': item.total_value,
        'Qtd Itens': item.items_count
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
            <Button variant="outline" onClick={() => window.print()}>
                <FileText className="mr-2 h-4 w-4 text-red-600" />
                Imprimir / PDF
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
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>NF</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Vendedor</TableHead>
                                <TableHead>Setor / Motivo</TableHead>
                                <TableHead>Local</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.invoice_date ? format(new Date(row.invoice_date), 'dd/MM/yyyy') : '-'}</TableCell>
                                    <TableCell>{row.invoice_number}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={row.customer_name}>{row.customer_name}</TableCell>
                                    <TableCell className="max-w-[150px] truncate">{row.seller_name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium">{row.sector_name}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={row.reason_name}>{row.reason_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{row.origin_city}/{row.origin_uf}</TableCell>
                                    <TableCell>
                                        <Badge variant={row.status === 'APPROVED' ? 'default' : row.status === 'REJECTED' ? 'destructive' : 'secondary'} className="text-[10px]">
                                            {row.status === 'APPROVED' ? 'APROVADO' : row.status === 'REJECTED' ? 'REJEITADO' : 'PENDENTE'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        R$ {row.total_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
    </div>
  );
}
