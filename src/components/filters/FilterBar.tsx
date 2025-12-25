import { useState } from "react";
import { useFilterStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FilterX, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function FilterBar() {
  const { filters, setFilters, resetFilters } = useFilterStore();
  const [date, setDate] = useState<Date | undefined>(filters.startDate);

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
            
            {/* Period Select */}
            <Select 
                value={filters.period} 
                onValueChange={(val: any) => setFilters({ period: val })}
            >
                <SelectTrigger className="w-[180px]">
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
                    <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
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

      {/* Active Filters Badges (Demo) */}
      <div className="flex gap-2">
        {filters.period && <Badge variant="secondary">Período: {filters.period}</Badge>}
        {filters.search && <Badge variant="secondary">Busca: {filters.search}</Badge>}
      </div>
    </div>
  );
}
