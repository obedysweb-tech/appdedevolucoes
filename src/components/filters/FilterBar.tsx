import { useState, useEffect } from "react";
import { useFilterStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FilterX, Search, Layers } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Sector } from "@/types";

export function FilterBar() {
  const { filters, setFilters, resetFilters } = useFilterStore();
  const [date, setDate] = useState<Date | undefined>(filters.startDate);
  const [sectors, setSectors] = useState<Sector[]>([]);

  useEffect(() => {
      // Fetch Sectors for filter dropdown
      const fetchSectors = async () => {
          const { data } = await supabase.from('sectors').select('*').order('name');
          if (data) setSectors(data);
      };
      fetchSectors();
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
            
            {/* Sector Filter */}
            <Select 
                value={filters.sector?.[0] || 'all'} 
                onValueChange={(val) => setFilters({ sector: val === 'all' ? undefined : [val] })}
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
        {filters.sector && filters.sector.length > 0 && <Badge variant="secondary">Setor: {sectors.find(s => s.id === filters.sector?.[0])?.name || 'Selecionado'}</Badge>}
      </div>
    </div>
  );
}
