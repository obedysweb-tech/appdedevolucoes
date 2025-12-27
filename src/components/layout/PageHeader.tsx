import { useEffect, useState } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className={`w-full rounded-lg p-6 mb-6 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30' 
          : 'bg-gradient-to-r from-green-600/10 to-green-700/10 border border-green-500/30'
      }`}
    >
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
  );
}

