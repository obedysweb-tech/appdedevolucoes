import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileBarChart, 
  RefreshCw, 
  Settings, 
  User, 
  LogOut,
  Package,
  Moon,
  Sun
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  
  const toggleTheme = () => {
      const html = document.querySelector('html');
      if (html?.classList.contains('dark')) {
          html.classList.remove('dark');
      } else {
          html.classList.add('dark');
      }
  };

  if (!user) return null;

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["GESTOR", "COMERCIAL", "LOGISTICA", "ADMIN"],
    },
    {
      label: "Validação",
      icon: CheckSquare,
      href: "/validacao",
      roles: ["COMERCIAL", "LOGISTICA", "ADMIN"],
    },
    {
      label: "Relatórios",
      icon: FileBarChart,
      href: "/relatorios",
      roles: ["GESTOR", "COMERCIAL", "LOGISTICA", "ADMIN"],
    },
    {
      label: "Sincronização",
      icon: RefreshCw,
      href: "/sincronizacao",
      roles: ["LOGISTICA", "ADMIN"],
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/configuracoes",
      roles: ["ADMIN"],
    },
  ];

  const filteredRoutes = routes.filter(route => route.roles.includes(user.role));

  return (
    <div className="pb-12 w-64 border-r bg-card h-screen fixed left-0 top-0 z-30 shadow-lg flex flex-col dark:border-r-zinc-800">
      
      {/* Header com Logo */}
      <div className="px-6 py-8 flex flex-col items-center border-b border-border/50">
          <div className="h-24 w-24 relative mb-3 bg-white rounded-full p-2 shadow-sm flex items-center justify-center overflow-hidden">
             <img 
                src="https://i.ibb.co/b095hpJ/Chat-GPT-Image-25-de-dez-de-2025-15-24-45.png" 
                alt="Logo Doce Mel" 
                className="object-contain h-full w-full"
            />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-primary font-serif">Doce Mel</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Gestão de Devoluções</p>
      </div>
      
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {filteredRoutes.map((route) => (
            <Link key={route.href} to={route.href}>
              <Button 
                variant={location.pathname === route.href ? "secondary" : "ghost"} 
                className={cn(
                  "w-full justify-start transition-all duration-200 mb-1",
                  location.pathname === route.href 
                      ? "bg-primary/10 text-primary font-bold border-r-4 border-primary rounded-r-none dark:text-primary dark:bg-primary/20" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <route.icon className={cn("mr-3 h-4 w-4", location.pathname === route.href ? "text-primary" : "text-muted-foreground")} />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border/50 bg-muted/10">
        <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs font-semibold text-muted-foreground">Tema</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleTheme}>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
        </div>

        <div className="space-y-1 mb-4">
            <Link to="/perfil">
                <Button variant={location.pathname === "/perfil" ? "secondary" : "ghost"} className="w-full justify-start h-9">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-9" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
            </Button>
        </div>
        
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-card border shadow-sm">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-foreground leading-none">{user.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1 truncate">{user.role}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
