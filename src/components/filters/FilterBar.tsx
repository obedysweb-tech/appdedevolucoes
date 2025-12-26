import { useState, useEffect } from "react";
import { useFilterStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FilterX, Search, Layers } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Sector } from "@/types";

export function FilterBar() {
  const { filters, setFilters, resetFilters } = useFilterStore();
  const [date, setDate] = useState<Date | undefined>(filters.startDate);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [motivos, setMotivos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [vendedores, setVendedores] = useState<string[]>([]);

  useEffect(() => {
      // Fetch dados para filtros
      const fetchFilterData = async () => {
          const [sectorsData, motivosData, clientesData, vendedoresData] = await Promise.all([
              supabase.from('setores').select('*').order('nome'),
              supabase.from('motivos_devolucao').select('id, nome').order('nome'),
              supabase.from('clientes').select('nome').order('nome'),
              supabase.from('devolucoes').select('vendedor').not('vendedor', 'is', null)
          ]);
          
          if (sectorsData.data) setSectors(sectorsData.data.map(s => ({ id: s.id, name: s.nome })));
          if (motivosData.data) setMotivos(motivosData.data);
          if (clientesData.data) {
              const uniqueClientes = Array.from(new Set(clientesData.data.map(c => c.nome))).filter(Boolean);
              setClientes(uniqueClientes.map(nome => ({ nome })));
          }
          if (vendedoresData.data) {
              const uniqueVendedores = Array.from(new Set(vendedoresData.data.map(v => v.vendedor))).filter(Boolean);
              setVendedores(uniqueVendedores as string[]);
          }
      };
      fetchFilterData();
  }, []);

  return (
    <div className="w-full bg-card border-b p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por cliente, vendedor, cidade..." 
            className="pl-8" 
            value={filters.search || ''}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            
            {/* Resultado Filter */}
            <Select 
                value={filters.resultado?.[0] || 'all'} 
                onValueChange={(val) => setFilters({ resultado: val === 'all' ? undefined : [val] })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Resultado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Resultados</SelectItem>
                    <SelectItem value="PENDENTE VALIDAÇÃO">PENDENTE VALIDAÇÃO</SelectItem>
                    <SelectItem value="VALIDADA">VALIDADA</SelectItem>
                    <SelectItem value="LANÇADA">LANÇADA</SelectItem>
                    <SelectItem value="TRATATIVA DE ANULAÇÃO">TRATATIVA DE ANULAÇÃO</SelectItem>
                    <SelectItem value="ANULADA/CANCELADA">ANULADA/CANCELADA</SelectItem>
                </SelectContent>
            </Select>

            {/* Motivo Filter */}
            <Select 
                value={filters.motivo?.[0] || 'all'} 
                onValueChange={(val) => setFilters({ motivo: val === 'all' ? undefined : [val] })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Motivo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Motivos</SelectItem>
                    {motivos.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Cliente Filter */}
            <Select 
                value={filters.cliente?.[0] || 'all'} 
                onValueChange={(val) => setFilters({ cliente: val === 'all' ? undefined : [val] })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Cliente" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Clientes</SelectItem>
                    {clientes.slice(0, 100).map((c, i) => (
                        <SelectItem key={i} value={c.nome}>{c.nome}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Vendedor Filter */}
            <Select 
                value={filters.vendedor?.[0] || 'all'} 
                onValueChange={(val) => setFilters({ vendedor: val === 'all' ? undefined : [val] })}
            >
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Vendedor" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Vendedores</SelectItem>
                    {vendedores.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            
            {/* Sector Filter */}
            <Select 
                value={filters.setor?.[0] || 'all'} 
                onValueChange={(val) => setFilters({ setor: val === 'all' ? undefined : [val] })}
            >
                <SelectTrigger className="w-[160px]">
                    <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Setores</SelectItem>
                    {sectors.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Period Select */}
            <Select 
                value={filters.period} 
                onValueChange={(val: any) => setFilters({ period: val })}
            >
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="TODAY">Hoje</SelectItem>
                    <SelectItem value="YESTERDAY">Ontem</SelectItem>
                    <SelectItem value="THIS_WEEK">Esta Semana</SelectItem>
                    <SelectItem value="LAST_WEEK">Semana Passada</SelectItem>
                    <SelectItem value="THIS_MONTH">Mês Atual</SelectItem>
                    <SelectItem value="LAST_MONTH">Mês Anterior</SelectItem>
                    <SelectItem value="THIS_QUARTER">Trimestre Atual</SelectItem>
                    <SelectItem value="THIS_SEMESTER">Semestre Atual</SelectItem>
                    <SelectItem value="THIS_YEAR">Ano Atual</SelectItem>
                </SelectContent>
            </Select>

            {/* Date Range Picker (Simplified as Single Date for UI demo) */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd/MM/yyyy") : <span>Data Específica</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => { setDate(d); setFilters({ startDate: d }); }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            {/* Clear Filters */}
            <Button variant="ghost" size="icon" onClick={() => { resetFilters(); setDate(undefined); }}>
                <FilterX className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* Active Filters Badges */}
      <div className="flex gap-2 flex-wrap">
        {filters.period && <Badge variant="secondary">Período: {filters.period}</Badge>}
        {filters.search && <Badge variant="secondary">Busca: {filters.search}</Badge>}
        {filters.setor && filters.setor.length > 0 && <Badge variant="secondary">Setor: {sectors.find(s => s.id === filters.setor?.[0])?.name || 'Selecionado'}</Badge>}
        {filters.resultado && filters.resultado.length > 0 && <Badge variant="secondary">Resultado: {filters.resultado[0]}</Badge>}
        {filters.motivo && filters.motivo.length > 0 && <Badge variant="secondary">Motivo: {motivos.find(m => m.id === filters.motivo?.[0])?.nome || 'Selecionado'}</Badge>}
        {filters.cliente && filters.cliente.length > 0 && <Badge variant="secondary">Cliente: {filters.cliente[0]}</Badge>}
        {filters.vendedor && filters.vendedor.length > 0 && <Badge variant="secondary">Vendedor: {filters.vendedor[0]}</Badge>}
      </div>
    </div>
  );
}
