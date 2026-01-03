import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Atualizar relógio a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Obter data/hora atual no horário de Salvador/Bahia (UTC-3)
  const getSalvadorTime = (date: Date) => {
    const offsetSalvador = -3 * 60; // UTC-3 em minutos
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    return new Date(utc + (offsetSalvador * 60000));
  };

  const salvadorTime = getSalvadorTime(currentTime);

  return (
    <div 
      className={`w-full rounded-lg p-6 mb-6 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30' 
          : 'bg-gradient-to-r from-green-600/10 to-green-700/10 border border-green-500/30'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${
            isDark ? 'text-blue-100' : 'text-green-900'
          }`}>
            {title}
          </h1>
          <p className={`text-sm ${
            isDark ? 'text-blue-200/80' : 'text-green-800/80'
          }`}>
            {description}
          </p>
        </div>
        <div className={`text-right ml-4 ${
          isDark ? 'text-blue-200' : 'text-green-800'
        }`}>
          <div className="text-sm font-medium">
            {format(salvadorTime, "dd/MM/yyyy", { locale: ptBR })}
          </div>
          <div className="text-xs font-mono">
            {format(salvadorTime, "HH:mm:ss", { locale: ptBR })} (BRT)
          </div>
        </div>
      </div>
    </div>
  );
}

