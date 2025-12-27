import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { supabase } from "@/lib/supabase";

// Mapping configuration - Todas as colunas serão salvas no banco, mas apenas algumas aparecem na pré-visualização
const COLUMN_MAPPING: Record<string, { dbField: string, visible: boolean, type: 'string' | 'number' | 'date' }> = {
    // Colunas que NÃO aparecem na pré-visualização (mas são salvas no banco)
    'CNPJ Destinatário': { dbField: 'cnpj_destinatario', visible: false, type: 'string' },
    'Destinatário': { dbField: 'destinatario', visible: false, type: 'string' },
    'Cidade Destino': { dbField: 'cidade_destino', visible: false, type: 'string' },
    'UF Destino': { dbField: 'uf_destino', visible: false, type: 'string' },
    'CNPJ Emitente': { dbField: 'cnpj_emitente', visible: false, type: 'string' },
    'Nome PJ Emitente': { dbField: 'nome_pj_emitente', visible: false, type: 'string' },
    'Chave de Acesso': { dbField: 'chave_acesso', visible: false, type: 'string' },
    'Série': { dbField: 'serie', visible: false, type: 'string' },
    'Tipo': { dbField: 'tipo', visible: false, type: 'string' },
    'Status': { dbField: 'status_nfe', visible: false, type: 'string' },
    'Nome ou e-mail do usuário que fez a sincronização': { dbField: 'nome_usuario_sync', visible: false, type: 'string' },
    'Data da sincronização': { dbField: 'data_sync', visible: false, type: 'date' },
    'Natureza Operação': { dbField: 'natureza_operacao', visible: false, type: 'string' },
    'CFOPs da Nota': { dbField: 'cfops', visible: false, type: 'string' },
    'Etiquetas': { dbField: 'etiquetas', visible: false, type: 'string' },
    
    // Colunas que APARECEM na pré-visualização
    'Nome Filial': { dbField: 'nome_filial', visible: true, type: 'string' },
    'FILIAL': { dbField: 'nome_filial', visible: true, type: 'string' },
    'Nome Cliente': { dbField: 'nome_cliente', visible: true, type: 'string' },
    'Cidade Origem': { dbField: 'cidade_origem', visible: true, type: 'string' },
    'UF Origem': { dbField: 'uf_origem', visible: true, type: 'string' },
    'Data Emissão': { dbField: 'data_emissao', visible: true, type: 'date' },
    'Número': { dbField: 'numero', visible: true, type: 'string' },
    'Valor Total da Nota': { dbField: 'valor_total_nota', visible: true, type: 'number' },
    'Peso líquido': { dbField: 'peso_liquido', visible: true, type: 'number' },
    'Sincronização ERP': { dbField: 'sincronizacao_erp', visible: true, type: 'string' },
    'Finalidade NFe': { dbField: 'finalidade_nfe', visible: true, type: 'string' },
    'Dados Adicionais': { dbField: 'dados_adicionais', visible: true, type: 'string' },
    'Vendedor': { dbField: 'vendedor', visible: true, type: 'string' },
    'Motivo': { dbField: 'motivo', visible: true, type: 'string' },
    'Resultado': { dbField: 'resultado', visible: true, type: 'string' },
    
    // Itens (aparecem na pré-visualização mas ficam ocultos com expansão na validação)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        // Buscar dados dos clientes e emitentes para preencher automaticamente na pré-visualização
        const cnpjsEmitentes = jsonData
          .map((row: any) => String(row['CNPJ Emitente'] || ''))
          .filter(cnpj => cnpj && cnpj.trim() !== '');
        
        let clientesMap = new Map();
        let emitentesMap = new Map();
        
        // Normalizar CNPJs para busca
        const normalizeCNPJForSearch = (cnpj: string): string => {
          if (!cnpj) return '';
          return cnpj.replace(/[^\d]/g, '');
        };
        
        // Buscar clientes usando CNPJs Emitentes (para nome, vendedor, rede)
        if (cnpjsEmitentes.length > 0) {
          const { data: clientes } = await supabase
            .from('clientes')
            .select('cnpj_cpf, nome, vendedor, rede, uf, municipio');
          
          if (clientes) {
            clientes.forEach(cliente => {
              const normalized = normalizeCNPJForSearch(cliente.cnpj_cpf || '');
              if (normalized && normalized.length >= 11) {
                clientesMap.set(normalized, cliente);
              }
            });
          }
        }
        
        // Buscar TODOS os emitentes (para FILIAL baseado em CNPJ Destinatário)
        const { data: emitentes } = await supabase
          .from('emitentes')
          .select('cnpj, nome_fantasia');
        
        if (emitentes) {
          emitentes.forEach(emitente => {
            const normalized = normalizeCNPJForSearch(emitente.cnpj || '');
            if (normalized && normalized.length >= 11) {
              // Usar nome_fantasia da tabela emitentes para preencher Nome Filial
              const nomeFilial = emitente.nome_fantasia || '';
              // Adicionar ao mapa mesmo se nome_fantasia estiver vazio (para debug)
              emitentesMap.set(normalized, nomeFilial);
            }
          });
        }
        
        const formattedPreview = jsonData.slice(0, 10).map((row: any) => {
            const newRow = { ...row };
            if (newRow['Data Emissão'] instanceof Date) {
                newRow['Data Emissão'] = newRow['Data Emissão'].toLocaleDateString('pt-BR');
            }
            
            // Preencher Nome Cliente, Vendedor e Rede baseado no CNPJ Emitente (buscar na tabela clientes)
            const cnpjEmitente = String(row['CNPJ Emitente'] || '');
            const normalizedCNPJEmit = normalizeCNPJForSearch(cnpjEmitente);
            const cliente = normalizedCNPJEmit.length >= 11 ? clientesMap.get(normalizedCNPJEmit) : null;
            
            if (cliente) {
              newRow['Nome Cliente'] = cliente.nome || '';
              newRow['Vendedor'] = cliente.vendedor || '';
              // Rede não aparece na pré-visualização, mas será salva no banco
            } else {
              // Se não encontrou cliente, deixar vazio
              newRow['Nome Cliente'] = '';
              newRow['Vendedor'] = '';
            }
            
            // Preencher FILIAL baseado no CNPJ Destinatário (buscar na tabela emitentes)
            const cnpjDestinatario = String(row['CNPJ Destinatário'] || '');
            const normalizedCNPJDest = normalizeCNPJForSearch(cnpjDestinatario);
            
            if (normalizedCNPJDest && normalizedCNPJDest.length >= 11) {
              const filial = emitentesMap.get(normalizedCNPJDest);
              if (filial && filial.trim() !== '') {
                newRow['Nome Filial'] = filial;
                newRow['FILIAL'] = filial;
              } else {
                newRow['Nome Filial'] = '';
                newRow['FILIAL'] = '';
              }
            } else {
              newRow['Nome Filial'] = '';
              newRow['FILIAL'] = '';
            }
            
            return newRow;
        });
        
        setPreviewData(formattedPreview);
      }
    };
    reader.readAsBinaryString(file);
  };


  // Função para normalizar CNPJ (remover pontos, traços, barras, espaços)
  const normalizeCNPJ = (cnpj: string): string => {
      if (!cnpj) return '';
      return String(cnpj).replace(/[.\-\/\s]/g, '').trim();
  };

  // Função para carregar todos os clientes e criar um mapa CNPJ -> Dados do Cliente
  const loadCustomersMap = async (): Promise<Map<string, { nome: string, vendedor: string, rede: string }>> => {
      const customersMap = new Map<string, { nome: string, vendedor: string, rede: string }>();
      
      try {
          const { data: clients, error } = await supabase
              .from('clientes')
              .select('nome, razao_social, cnpj_cpf, vendedor, rede')
              .not('cnpj_cpf', 'is', null);

          if (error) {
              console.error('Erro ao buscar clientes:', error);
              return customersMap;
          }

          if (clients && clients.length > 0) {
              clients.forEach(client => {
                  if (client.cnpj_cpf) {
                      const normalizedCNPJ = normalizeCNPJ(client.cnpj_cpf);
                      if (normalizedCNPJ && normalizedCNPJ.length >= 11) {
                          const name = client.nome || client.razao_social || '';
                          customersMap.set(normalizedCNPJ, {
                              nome: name,
                              vendedor: client.vendedor || '',
                              rede: client.rede || ''
                          });
                      }
                  }
              });
          }
      } catch (error) {
          console.error('Erro ao carregar clientes:', error);
      }

      return customersMap;
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

                    returnsMap.set(invoiceNumber, {
                        invoice_number: String(invoiceNumber),
                        customer_cnpj: String(row['CNPJ Destinatário'] || ''),
                        destinatario: String(row['Destinatário'] || ''),
                        cidade_origem: String(row['Cidade Origem'] || ''),
                        uf_origem: String(row['UF Origem'] || ''),
                        cidade_destino: String(row['Cidade Destino'] || ''),
                        uf_destino: String(row['UF Destino'] || ''),
                        cnpj_emitente: String(row['CNPJ Emitente'] || ''),
                        nome_pj_emitente: String(row['Nome PJ Emitente'] || ''),
                        chave_acesso: String(row['Chave de Acesso'] || ''),
                        serie: String(row['Série'] || ''),
                        peso_liquido: parseFloat(row['Peso líquido'] || '0'),
                        tipo: String(row['Tipo'] || ''),
                        status_nfe: String(row['Status'] || ''),
                        sincronizacao_erp: String(row['Sincronização ERP'] || ''),
                        finalidade_nfe: String(row['Finalidade NFe'] || ''),
                        natureza_operacao: String(row['Natureza Operação'] || ''),
                        cfops: String(row['CFOPs da Nota'] || ''),
                        dados_adicionais: String(row['Dados Adicionais'] || ''),
                        nfe_referenciada: String(row['NFe Referenciada'] || ''),
                        etiquetas: String(row['Etiquetas'] || ''),
                        invoice_date: invoiceDate,
                        total_value: 0,
                        motivo_id: null, // Será preenchido depois na tela de validação
                        sector_id: null, // Será preenchido depois na tela de validação
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
            let skippedCount = 0;
            const returnsArray = Array.from(returnsMap.values());

            // Carregar mapas de clientes e emitentes uma única vez para melhor performance
            const customersMap = await loadCustomersMap();
            
            // Carregar emitentes
            const emitentesMap = new Map<string, string>();
            try {
                const { data: emitentes } = await supabase
                    .from('emitentes')
                    .select('cnpj, nome_fantasia')
                    .not('cnpj', 'is', null);

                if (emitentes) {
                    emitentes.forEach(emitente => {
                        if (emitente.cnpj) {
                            const normalizedCNPJ = normalizeCNPJ(emitente.cnpj);
                            if (normalizedCNPJ && normalizedCNPJ.length >= 11) {
                                // Usar nome_fantasia da tabela emitentes para preencher Nome Filial
                                const nomeFilial = emitente.nome_fantasia || '';
                                // Adicionar ao mapa mesmo se nome_fantasia estiver vazio (será filtrado depois)
                                emitentesMap.set(normalizedCNPJ, nomeFilial);
                            }
                        }
                    });
                }
            } catch (err) {
                console.error('Erro ao carregar emitentes:', err);
            }

            // Carregar todas as chaves de acesso existentes para verificar duplicatas
            const { data: existingKeys } = await supabase
                .from('devolucoes')
                .select('chave_acesso')
                .not('chave_acesso', 'is', null);
            
            const existingKeysSet = new Set(
                (existingKeys || [])
                    .map((r: any) => r.chave_acesso)
                    .filter((key: string) => key && key.trim() !== '')
            );

            // Processamento em lote (um por um para garantir integridade)
            for (const returnData of returnsArray) {
                // REGRA 1: Verificar se a chave de acesso já existe no Supabase
                if (returnData.chave_acesso && returnData.chave_acesso.trim() !== '') {
                    if (existingKeysSet.has(returnData.chave_acesso)) {
                        console.log(`Chave de acesso duplicada ignorada: ${returnData.chave_acesso}`);
                        skippedCount++;
                        continue; // Pular este registro
                    }
                }
                
                // REGRA 2: Descartar registros onde "Sincronização ERP" = "Sincronizado"
                const sincronizacaoERP = String(returnData.sincronizacao_erp || '').trim().toUpperCase();
                if (sincronizacaoERP === 'SINCRONIZADO' || sincronizacaoERP === 'SIM' || sincronizacaoERP === 'S') {
                    console.log(`Registro descartado - já sincronizado: ${returnData.invoice_number} (Chave: ${returnData.chave_acesso})`);
                    skippedCount++;
                    continue; // Pular este registro - não salvar no Supabase
                }
                
                // REGRA 3: Processar apenas registros com "Sincronização ERP" = "Não Sincronizado"
                // (ou vazio/null, que também será processado)
                // Se chegou até aqui, o registro pode ser processado
                // Buscar dados do cliente na tabela clientes usando CNPJ Emitente
                let customerName = '';
                let vendedor = '';
                let redeCliente = '';
                
                if (returnData.cnpj_emitente) {
                    const normalizedCNPJEmit = normalizeCNPJ(returnData.cnpj_emitente);
                    
                    // Buscar no mapa de clientes usando CNPJ Emitente
                    if (normalizedCNPJEmit && normalizedCNPJEmit.length >= 11) {
                        const clienteData = customersMap.get(normalizedCNPJEmit);
                        if (clienteData) {
                            customerName = clienteData.nome || '';
                            vendedor = clienteData.vendedor || '';
                            redeCliente = clienteData.rede || '';
                        }
                    }
                }

                // Buscar nome da filial na tabela emitentes usando CNPJ Destinatário
                let nomeFilial = '';
                
                if (returnData.customer_cnpj) {
                    const normalizedCNPJDest = normalizeCNPJ(returnData.customer_cnpj);
                    
                    // Buscar no mapa de emitentes usando CNPJ Destinatário
                    if (normalizedCNPJDest && normalizedCNPJDest.length >= 11) {
                        const foundFilial = emitentesMap.get(normalizedCNPJDest);
                        if (foundFilial && foundFilial.trim() !== '') {
                            nomeFilial = foundFilial;
                        }
                    }
                }

                const { data: insertedReturn, error: returnError } = await supabase
                    .from('devolucoes')
                    .insert({
                        numero: returnData.invoice_number,
                        nome_cliente: customerName, // Preenchido baseado no CNPJ Emitente da tabela clientes
                        cnpj_destinatario: returnData.customer_cnpj,
                        destinatario: returnData.destinatario,
                        cidade_origem: returnData.cidade_origem,
                        uf_origem: returnData.uf_origem,
                        cidade_destino: returnData.cidade_destino,
                        uf_destino: returnData.uf_destino,
                        cnpj_emitente: returnData.cnpj_emitente,
                        nome_pj_emitente: returnData.nome_pj_emitente,
                        chave_acesso: returnData.chave_acesso || null,
                        serie: returnData.serie,
                        peso_liquido: returnData.peso_liquido || null,
                        tipo: returnData.tipo,
                        status_nfe: returnData.status_nfe,
                        sincronizacao_erp: returnData.sincronizacao_erp,
                        finalidade_nfe: returnData.finalidade_nfe,
                        natureza_operacao: returnData.natureza_operacao,
                        cfops: returnData.cfops,
                        dados_adicionais: returnData.dados_adicionais,
                        nfe_referenciada: returnData.nfe_referenciada,
                        etiquetas: returnData.etiquetas,
                        nome_filial: nomeFilial, // Preenchido baseado no CNPJ Destinatário da tabela emitentes
                        data_emissao: returnData.invoice_date,
                        valor_total_nota: returnData.total_value,
                        vendedor: vendedor, // Preenchido baseado no CNPJ Emitente da tabela clientes
                        rede: redeCliente, // Preenchido baseado no CNPJ Emitente da tabela clientes
                        resultado: 'PENDENTE VALIDAÇÃO',
                        motivo_id: returnData.reason_id,
                        setor_id: returnData.sector_id
                    })
                    .select()
                    .single();

                if (returnError) {
                    // Verificar se é erro de chave duplicada
                    if (returnError.code === '23505' || returnError.message?.includes('unique') || returnError.message?.includes('duplicate')) {
                        console.log(`Chave de acesso duplicada ignorada (constraint): ${returnData.chave_acesso}`);
                        skippedCount++;
                        continue;
                    }
                    console.error('Erro ao inserir devolução:', returnError);
                    continue;
                }

                if (insertedReturn) {
                    // Adicionar chave de acesso ao conjunto de existentes para evitar duplicatas no mesmo batch
                    if (returnData.chave_acesso && returnData.chave_acesso.trim() !== '') {
                        existingKeysSet.add(returnData.chave_acesso);
                    }

                    const itemsToInsert = returnData.items.map((item: any) => ({
                        devolucao_id: insertedReturn.id,
                        descricao: item.description,
                        quantidade: item.quantity,
                        unidade: item.unit,
                        valor_unitario: item.unit_value,
                        valor_total_bruto: item.total_value,
                        numero_item: item.item_number
                    }));

                    const { error: itemsError } = await supabase
                        .from('itens_devolucao')
                        .insert(itemsToInsert);
                    
                    if (!itemsError) successCount++;
                }
            }

            // Mensagem de resultado
            if (successCount > 0) {
                let message = `${successCount} devolução(ões) importada(s) com sucesso!`;
                if (skippedCount > 0) {
                    message += ` ${skippedCount} registro(s) ignorado(s) (duplicados ou já sincronizados).`;
                }
                toast.success(message);
            } else {
                if (skippedCount > 0) {
                    toast.warning(`${skippedCount} registro(s) ignorado(s) (duplicados ou já sincronizados). Nenhuma devolução nova foi importada.`);
                } else {
                    toast.warning("Nenhuma devolução importada. Verifique o arquivo.");
                }
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
      <PageHeader 
        title="Sincronização" 
        description="Importe arquivos CSV ou XLSX para sincronizar devoluções. O sistema busca automaticamente dados de clientes e filiais."
      />
      
      <div className="grid gap-6 md:grid-cols-1">
        <Card>
            <CardHeader>
                <CardTitle>Importar Arquivo</CardTitle>
                <CardDescription>Faça upload de arquivos CSV ou XLSX. O sistema identificará automaticamente os Motivos, Setores e buscará o nome do cliente na base de dados usando o CNPJ.</CardDescription>
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
                        <div className="overflow-x-auto rounded-md border">
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
                        </div>
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
