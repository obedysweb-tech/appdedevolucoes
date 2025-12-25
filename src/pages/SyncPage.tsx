import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReturnReason } from "@/types";

// Mapping configuration
const COLUMN_MAPPING: Record<string, { dbField: string, visible: boolean, type: 'string' | 'number' | 'date' }> = {
    'CNPJ Destinatário': { dbField: 'customer_cnpj', visible: false, type: 'string' },
    'Destinatário': { dbField: 'customer_name', visible: false, type: 'string' },
    'Nome Filial': { dbField: 'network', visible: true, type: 'string' },
    'Nome Cliente': { dbField: 'customer_name_display', visible: true, type: 'string' },
    'Cidade Origem': { dbField: 'origin_city', visible: true, type: 'string' },
    'UF Origem': { dbField: 'origin_uf', visible: true, type: 'string' },
    'Chave de Acesso': { dbField: 'access_key', visible: false, type: 'string' },
    'Data Emissão': { dbField: 'invoice_date', visible: true, type: 'date' },
    'Número': { dbField: 'invoice_number', visible: true, type: 'string' },
    'Valor Total da Nota': { dbField: 'total_value', visible: true, type: 'number' },
    'Vendedor': { dbField: 'seller_name', visible: true, type: 'string' },
    'Motivo': { dbField: 'reason_name', visible: true, type: 'string' },
    // Items
    '[Item] Descrição': { dbField: 'item_description', visible: true, type: 'string' },
    '[Item] Unidade': { dbField: 'item_unit', visible: true, type: 'string' },
    '[Item] Quantidade': { dbField: 'item_quantity', visible: true, type: 'number' },
    '[Item] Valor Unitário': { dbField: 'item_unit_value', visible: true, type: 'number' },
    '[Item] Valor Total Bruto': { dbField: 'item_total_value', visible: true, type: 'number' },
    '[Item] Número do Item.': { dbField: 'item_number', visible: true, type: 'string' },
};

export function SyncPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reasonsMap, setReasonsMap] = useState<ReturnReason[]>([]);

  // 1. Carregar Motivos e Setores do Banco para fazer o "De-Para"
  useEffect(() => {
      const fetchMasterData = async () => {
          const { data } = await supabase.from('return_reasons').select('*, sector:sectors(*)');
          if (data) setReasonsMap(data);
      };
      fetchMasterData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        const formattedPreview = jsonData.slice(0, 10).map((row: any) => {
            const newRow = { ...row };
            if (newRow['Data Emissão'] instanceof Date) {
                newRow['Data Emissão'] = newRow['Data Emissão'].toLocaleDateString('pt-BR');
            }
            return newRow;
        });
        
        setPreviewData(formattedPreview);
      }
    };
    reader.readAsBinaryString(file);
  };

  const findReasonAndSector = (reasonName: string) => {
      if (!reasonName) return { reason_id: null, sector_id: null };
      
      // Busca insensível a maiúsculas/minúsculas e acentos
      const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      const target = normalize(reasonName);

      const match = reasonsMap.find(r => normalize(r.name) === target);
      
      if (match) {
          return { reason_id: match.id, sector_id: match.sector_id };
      }
      return { reason_id: null, sector_id: null };
  };

  const processAndUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const returnsMap = new Map<string, any>();

            for (const row of jsonData as any[]) {
                const invoiceNumber = row['Número'];
                if (!invoiceNumber) continue;

                if (!returnsMap.has(invoiceNumber)) {
                    let invoiceDate = new Date().toISOString();
                    if (row['Data Emissão']) {
                        if (row['Data Emissão'] instanceof Date) {
                            invoiceDate = row['Data Emissão'].toISOString();
                        } else {
                            const parsed = new Date(row['Data Emissão']);
                            if (!isNaN(parsed.getTime())) invoiceDate = parsed.toISOString();
                        }
                    }

                    // Lógica de Lookup Inteligente
                    const reasonText = row['Motivo'] || '';
                    const { reason_id, sector_id } = findReasonAndSector(reasonText);

                    returnsMap.set(invoiceNumber, {
                        invoice_number: String(invoiceNumber),
                        customer_name: row['Destinatário'] || row['Nome Cliente'] || 'Desconhecido',
                        customer_cnpj: String(row['CNPJ Destinatário'] || ''),
                        origin_city: row['Cidade Origem'],
                        origin_uf: row['UF Origem'],
                        invoice_date: invoiceDate,
                        total_value: 0,
                        seller_name: row['Vendedor'],
                        network: row['Nome Filial'],
                        status: 'PENDING',
                        reason_id: reason_id, // ID Real
                        sector_id: sector_id, // ID Real
                        items: []
                    });
                }

                const returnEntry = returnsMap.get(invoiceNumber);
                const itemTotal = parseFloat(row['[Item] Valor Total Bruto'] || '0');
                returnEntry.total_value += itemTotal;
                
                returnEntry.items.push({
                    description: row['[Item] Descrição'],
                    quantity: parseFloat(row['[Item] Quantidade'] || '0'),
                    unit: row['[Item] Unidade'],
                    unit_value: parseFloat(row['[Item] Valor Unitário'] || '0'),
                    total_value: itemTotal,
                    item_number: String(row['[Item] Número do Item.'] || '')
                });
            }

            let successCount = 0;
            const returnsArray = Array.from(returnsMap.values());

            // Processamento em lote (um por um para garantir integridade)
            for (const returnData of returnsArray) {
                const { data: insertedReturn, error: returnError } = await supabase
                    .from('returns')
                    .insert({
                        invoice_number: returnData.invoice_number,
                        customer_name: returnData.customer_name,
                        customer_cnpj: returnData.customer_cnpj,
                        origin_city: returnData.origin_city,
                        origin_uf: returnData.origin_uf,
                        invoice_date: returnData.invoice_date,
                        total_value: returnData.total_value,
                        seller_name: returnData.seller_name,
                        network: returnData.network,
                        status: 'PENDING',
                        reason_id: returnData.reason_id, // Importante para gráficos
                        sector_id: returnData.sector_id  // Importante para gráficos
                    })
                    .select()
                    .single();

                if (returnError) {
                    console.error('Erro ao inserir devolução:', returnError);
                    continue;
                }

                if (insertedReturn) {
                    const itemsToInsert = returnData.items.map((item: any) => ({
                        return_id: insertedReturn.id,
                        description: item.description,
                        quantity: item.quantity,
                        unit: item.unit,
                        unit_value: item.unit_value,
                        total_value: item.total_value,
                        item_number: item.item_number
                    }));

                    const { error: itemsError } = await supabase
                        .from('return_items')
                        .insert(itemsToInsert);
                    
                    if (!itemsError) successCount++;
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} devoluções importadas com sucesso!`);
            } else {
                toast.warning("Nenhuma devolução importada. Verifique o arquivo.");
            }
            
            setIsProcessing(false);
            setFile(null);
            setPreviewData([]);
        };
        reader.readAsBinaryString(file);

    } catch (error) {
        console.error(error);
        toast.error("Erro crítico ao processar arquivo");
        setIsProcessing(false);
    }
  };

  const visibleColumns = Object.keys(COLUMN_MAPPING).filter(key => COLUMN_MAPPING[key].visible);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Sincronização</h1>
      
      <div className="grid gap-6 md:grid-cols-1">
        <Card>
            <CardHeader>
                <CardTitle>Importar Arquivo</CardTitle>
                <CardDescription>Faça upload de arquivos CSV ou XLSX. O sistema identificará automaticamente os Motivos e Setores.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 hover:bg-muted/50 transition-colors relative">
                    <Input 
                        type="file" 
                        accept=".csv, .xlsx, .xls"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium mb-1">
                        {file ? file.name : "Arraste e solte ou clique para selecionar"}
                    </p>
                    <p className="text-xs text-muted-foreground">Suporta .csv e .xlsx</p>
                </div>

                {previewData.length > 0 && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold">Pré-visualização</h3>
                            <Button onClick={processAndUpload} disabled={isProcessing}>
                                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirmar e Processar
                            </Button>
                        </div>
                        <ScrollArea className="h-[300px] rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {visibleColumns.map((col) => (
                                            <TableHead key={col} className="whitespace-nowrap">{col}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {previewData.map((row, i) => (
                                        <TableRow key={i}>
                                            {visibleColumns.map((col) => (
                                                <TableCell key={`${i}-${col}`} className="whitespace-nowrap">
                                                    {row[col]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Certifique-se de que os nomes dos "Motivos" no Excel correspondam exatamente aos cadastrados em Configurações para que os gráficos funcionem.</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
