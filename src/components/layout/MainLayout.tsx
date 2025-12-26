import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Desktop começa aberto

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background relative">
      {/* Overlay quando sidebar está aberto - clicar fora fecha (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Botão Toggle - visível em todas as telas */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Conteúdo principal - expande quando sidebar fechado */}
      <main 
        className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} pt-16 lg:pt-0`}
        onClick={() => {
          // Fechar sidebar ao clicar no conteúdo principal
          if (isSidebarOpen) {
            closeSidebar();
          }
        }}
      >
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

