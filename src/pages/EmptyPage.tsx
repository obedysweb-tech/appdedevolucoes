import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyPage() {
  const { user, logout } = useAuthStore();

  console.log('EmptyPage - Renderizando para usuário:', user?.email, 'role:', user?.role);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Acesso Pendente</CardTitle>
          <CardDescription>
            Seu cadastro está aguardando aprovação. Entre em contato com o administrador para obter acesso ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Usuário: <span className="font-semibold">{user?.email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Status: <span className="font-semibold text-orange-600">NOVO</span>
            </p>
          </div>
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

