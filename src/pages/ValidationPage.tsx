import { useState, useEffect } from "react";
import { FilterBar } from "@/components/filters/FilterBar";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { ReturnRequest } from "@/types";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

export function ValidationPage() {
  const [data, setData] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    setLoading(true);
    const { data: returns, error } = await supabase
        .from('returns')
        .select(`
            *,
            items:return_items(*),
            sectors(name),
            return_reasons(name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        toast.error("Erro ao carregar devoluções");
        console.error(error);
    } else {
        const formattedData = returns.map((item: any) => ({
            ...item,
            sector: item.sectors?.name,
            reason: item.return_reasons?.name
        }));
        setData(formattedData);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: 'APPROVED' | 'REJECTED', currentStatus: string) => {
      if (!user) return;

      try {
        // 1. Update Return Status
        const { error: updateError } = await supabase
            .from('returns')
            .update({ status: newStatus })
            .eq('id', id);
        
        if (updateError) throw updateError;

        // 2. Log Action
        const { error: logError } = await supabase
            .from('validation_logs')
            .insert({
                return_id: id,
                user_id: user.id,
                action: newStatus,
                previous_status: currentStatus,
                new_status: newStatus
            });

        if (logError) console.error("Erro ao salvar log:", logError);

        toast.success(`Devolução ${newStatus === 'APPROVED' ? 'Aprovada' : 'Rejeitada'}`);
        fetchReturns(); // Refresh list

      } catch (error: any) {
          toast.error("Erro ao processar: " + error.message);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Validação</h1>
        <div className="flex gap-2">
            <Button variant="outline">Exportar</Button>
            <Button>Aprovar Selecionados</Button>
        </div>
      </div>
      
      <FilterBar />

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Data Emissão</TableHead>
              <TableHead>Nota Fiscal</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="group">
                <TableCell colSpan={10} className="p-0 border-b">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={item.id} className="border-b-0">
                            <div className="flex items-center w-full py-2 px-4 hover:bg-muted/50">
                                <AccordionTrigger className="w-[50px] py-0 pr-4 hover:no-underline">
                                    {/* Trigger Icon is automatic */}
                                </AccordionTrigger>
                                <div className="grid grid-cols-9 gap-4 w-full items-center text-sm">
                                    <div className="col-span-1">{item.invoice_date ? format(new Date(item.invoice_date), 'dd/MM/yyyy') : '-'}</div>
                                    <div className="col-span-1 font-medium">{item.invoice_number}</div>
                                    <div className="col-span-1 truncate" title={item.customer_name}>{item.customer_name}</div>
                                    <div className="col-span-1">{item.origin_city}/{item.origin_uf}</div>
                                    <div className="col-span-1 truncate">{item.seller_name}</div>
                                    <div className="col-span-1 truncate" title={(item as any).reason}>{(item as any).reason || '-'}</div>
                                    <div className="col-span-1 font-bold">R$ {item.total_value?.toFixed(2)}</div>
                                    <div className="col-span-1">
                                        <Badge variant={item.status === 'APPROVED' ? 'default' : item.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                                            {item.status === 'APPROVED' ? 'Aprovado' : item.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                                        </Badge>
                                    </div>
                                    <div className="col-span-1 flex gap-2 justify-end">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'APPROVED', item.status); }}
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(item.id, 'REJECTED', item.status); }}
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <AccordionContent className="bg-muted/30 px-4 py-4">
                                <div className="pl-12">
                                    <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Itens da Nota</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="h-8">
                                                <TableHead className="h-8 text-xs">Código</TableHead>
                                                <TableHead className="h-8 text-xs">Descrição</TableHead>
                                                <TableHead className="h-8 text-xs">Qtd</TableHead>
                                                <TableHead className="h-8 text-xs">Vl. Unit</TableHead>
                                                <TableHead className="h-8 text-xs">Vl. Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {item.items?.map((prod) => (
                                                <TableRow key={prod.id} className="h-8">
                                                    <TableCell className="py-1 text-xs">{prod.item_number}</TableCell>
                                                    <TableCell className="py-1 text-xs">{prod.description}</TableCell>
                                                    <TableCell className="py-1 text-xs">{prod.quantity}</TableCell>
                                                    <TableCell className="py-1 text-xs">R$ {prod.unit_value?.toFixed(2)}</TableCell>
                                                    <TableCell className="py-1 text-xs">R$ {prod.total_value?.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                        <div>
                                            <span className="font-semibold">CNPJ Cliente:</span> {item.customer_cnpj}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Rede:</span> {item.network || '-'}
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </div>
    </div>
  );
}
