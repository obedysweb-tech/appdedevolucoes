import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { setUser } = useAuthStore();
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    // Remove espaços em branco acidentais
    const cleanEmail = email.trim();

    try {
      if (isLogin) {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
             // Buscar perfil
             const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
              
             if (profile) {
                 setUser(profile);
                 toast.success(`Bem-vindo, ${profile.name}!`);
                 navigate("/dashboard");
             } else {
                 // Se o usuário existe no Auth mas não tem perfil (caso raro agora que o trigger foi corrigido)
                 console.warn("Perfil não encontrado no banco. Verifique se o script SQL foi executado.");
                 setUser({
                    id: data.user.id,
                    email: data.user.email!,
                    name: data.user.user_metadata?.name || 'Usuário',
                    role: 'COMERCIAL'
                 });
                 navigate("/dashboard");
                 toast.warning("Perfil incompleto. Contate o administrador.");
             }
        }
      } else {
        // CADASTRO
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: name,
              role: 'COMERCIAL' // Padrão inicial, Admin pode mudar depois
            }
          }
        });
        if (authError) throw authError;

        if (authData.user) {
            toast.success("Conta criada com sucesso!");
            // Se o Auto Confirm estiver desligado no Supabase, o usuário já loga
            if (authData.session) {
                navigate("/dashboard");
            } else {
                // Se precisar confirmar email
                toast.info("Verifique seu email para confirmar o cadastro (se necessário).");
                setIsLogin(true);
            }
        }
      }
    } catch (error: any) {
      console.error(error);
      let msg = "Ocorreu um erro ao conectar.";
      
      if (error.message.includes("Invalid login credentials")) {
          msg = "Email ou senha incorretos. Se você ainda não tem conta, clique em 'Solicite aqui' abaixo.";
      } else if (error.message.includes("User already registered")) {
          msg = "Este email já está cadastrado. Tente fazer login.";
      }
      
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration - Doce Mel Style */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/10 -skew-y-3 origin-top-left z-0"></div>
      
      <Card className="w-full max-w-md z-10 border-t-4 border-t-primary shadow-2xl dark:shadow-[0_4px_20px_-2px_rgba(255,255,255,0.05)] bg-card">
        <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-6 flex items-center justify-center">
                <div className="h-32 w-32 relative flex items-center justify-center bg-white rounded-full shadow-md p-3">
                    <img 
                        src="https://i.ibb.co/b095hpJ/Chat-GPT-Image-25-de-dez-de-2025-15-24-45.png" 
                        alt="Logo Doce Mel" 
                        className="object-contain h-full w-full"
                    />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-primary font-serif tracking-wide">GRUPO DOCE MEL</h1>
            <CardTitle className="text-lg font-medium text-foreground/80">Gestão de Devoluções</CardTitle>
            <CardDescription>
                {isLogin ? "Entre com suas credenciais para acessar." : "Preencha os dados para criar sua conta."}
            </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMsg && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
            )}
            
            {!isLogin && (
                <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                        id="name" 
                        placeholder="Ex: João Silva" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required={!isLogin} 
                        className="bg-background"
                    />
                </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nome@docemel.com.br" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="bg-background"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-muted/20 pt-6">
            <Button type="submit" className="w-full font-bold text-md h-11 shadow-md hover:shadow-lg transition-all" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? "ACESSAR SISTEMA" : "CRIAR CONTA"}
            </Button>
            <Button type="button" variant="link" onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }} className="text-muted-foreground hover:text-primary">
                {isLogin ? "Não possui acesso? Solicite aqui" : "Já possui conta? Voltar ao login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="absolute bottom-4 text-center text-xs text-muted-foreground opacity-50">
        &copy; 2025 Grupo Doce Mel. Todos os direitos reservados.
      </div>
    </div>
  );
}
