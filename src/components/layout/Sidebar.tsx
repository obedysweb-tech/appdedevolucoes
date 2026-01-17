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
  Moon,
  Sun,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = false, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  
  const toggleTheme = () => {
      const html = document.querySelector('html');
      if (html) {
          if (html.classList.contains('dark')) {
              html.classList.remove('dark');
          } else {
              html.classList.add('dark');
          }
      }
  };

  if (!user) return null;

  // Debug: verificar o role do usuário
  console.log('Sidebar - User role:', user.role, 'Tipo:', typeof user.role);

  const routes = [
    {
      label: "Dashboard Pendências",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["GESTOR", "COMERCIAL", "LOGISTICA", "ADMIN", "VENDEDOR"],
    },
    {
      label: "Dashboard Lançadas",
      icon: LayoutDashboard,
      href: "/dashboard-lancadas",
      roles: ["GESTOR", "COMERCIAL", "LOGISTICA", "ADMIN", "VENDEDOR"],
    },
    {
      label: "Validação",
      icon: CheckSquare,
      href: "/validation",
      roles: ["COMERCIAL", "LOGISTICA", "ADMIN", "VENDEDOR"],
    },
    {
      label: "Relatórios",
      icon: FileBarChart,
      href: "/reports",
      roles: ["GESTOR", "COMERCIAL", "LOGISTICA", "ADMIN", "VENDEDOR"],
    },
    {
      label: "Sincronização",
      icon: RefreshCw,
      href: "/sync",
      roles: ["LOGISTICA", "ADMIN"],
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/settings",
      roles: ["ADMIN"],
    },
  ];

  // Se usuário não tem role ou é tipo NOVO, mostrar apenas botão de logout
  const isNovoUser = !user.role || user.role === 'NOVO';
  
  // Garantir que o role seja sempre uma string em maiúsculas para comparação
  const userRole = typeof user.role === 'string' ? user.role.toUpperCase() : user.role;
  console.log('Sidebar - Filtrando rotas com role:', userRole);
  
  const filteredRoutes = isNovoUser ? [] : routes.filter(route => route.roles.includes(userRole as any));
  
  console.log('Sidebar - Rotas filtradas:', filteredRoutes.map(r => r.label));

  return (
    <>
      {/* Sidebar Desktop - pode ser ocultado */}
      <div className={cn(
        "hidden lg:flex pb-12 w-64 border-r bg-card h-screen fixed left-0 top-0 z-30 shadow-lg flex-col dark:border-r-zinc-800 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Logo */}
        <div className="px-6 py-8 flex flex-col items-center border-b border-border/50">
          <div className="h-24 w-24 relative mb-3 flex items-center justify-center overflow-hidden">
            <img 
              src="https://i.ibb.co/b095hpJ/Chat-GPT-Image-25-de-dez-de-2025-15-24-45.png" 
              alt="Logo Doce Mel" 
              className="object-contain rounded"
            />

          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#004100] font-serif">TRIELO CD BA</h2>
          <p className="text-[10px] text-[#004100] font-bold uppercase tracking-widest mt-1">Gestão de Devoluções</p>
        </div>
        
        {/* Menu Items - apenas se não for usuário NOVO */}
        {!isNovoUser && (
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {filteredRoutes.map((route) => (
              <Link key={route.href} to={route.href}>
                <Button 
                  variant={location.pathname === route.href ? "secondary" : "ghost"} 
                  className={cn(
                    "w-full justify-start transition-all duration-200 mb-1",
                    location.pathname === route.href 
                        ? "bg-[#004100]/10 text-[#004100] font-bold border-r-4 border-[#004100] rounded-r-none dark:text-[#004100] dark:bg-[#004100]/20" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <route.icon className={cn("mr-3 h-4 w-4", location.pathname === route.href ? "text-[#004100]" : "text-muted-foreground")} />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        )}
        
        {/* Footer / User Profile */}
        <div className="p-4 border-t border-border/50 bg-muted/10">
          {!isNovoUser && (
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs font-semibold text-muted-foreground">Tema</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleTheme}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
          )}

          <div className="space-y-1 mb-4">
            {!isNovoUser && (
            <Link to="/profile">
              <Button variant={location.pathname === "/profile" ? "secondary" : "ghost"} className="w-full justify-start h-9">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Button>
            </Link>
            )}
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

      {/* Sidebar Mobile - com animação */}
      <div 
        className={cn(
          "lg:hidden pb-12 w-64 border-r bg-card h-screen fixed left-0 top-0 z-40 shadow-lg flex flex-col dark:border-r-zinc-800 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Logo e Botão Fechar */}
        <div className="px-6 py-8 flex flex-col items-center border-b border-border/50 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="h-24 w-24 relative mb-3 flex items-center justify-center overflow-hidden">
            <img 
              src="https://i.ibb.co/b095hpJ/Chat-GPT-Image-25-de-dez-de-2025-15-24-45.png" 
              alt="Logo Doce Mel" 
              className="object-contain rounded"
            />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-serif">TRIELO CD BA</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Gestão de Devoluções</p>
        </div>
        
        {/* Menu Items - apenas se não for usuário NOVO */}
        {!isNovoUser && (
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {filteredRoutes.map((route) => (
              <Link key={route.href} to={route.href} onClick={onClose}>
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
        )}
        
        {/* Footer / User Profile */}
        <div className="p-4 border-t border-border/50 bg-muted/10">
          {!isNovoUser && (
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs font-semibold text-muted-foreground">Tema</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleTheme}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
          )}

          <div className="space-y-1 mb-4">
            {!isNovoUser && (
            <Link to="/profile" onClick={onClose}>
              <Button variant={location.pathname === "/profile" ? "secondary" : "ghost"} className="w-full justify-start h-9">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Button>
            </Link>
            )}
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
    </>
  );
}
