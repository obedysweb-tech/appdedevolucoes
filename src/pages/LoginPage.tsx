import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Verificar se o usuário já está logado e redirecionar
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    const cleanEmail = email.trim();

    try {
      if (isLogin) {
        // --- LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
             console.log('✅ Login bem-sucedido!');
             toast.success('Login realizado com sucesso!');
             setLoading(false);
             
             // Aguardar um pouco para o onAuthStateChange atualizar o estado
             // Depois navegar - o ProtectedRoute vai verificar se o usuário está setado
             setTimeout(() => {
               navigate("/dashboard");
             }, 300);
        }
      } else {
        // --- CADASTRO (SIGN UP) ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: name,
              role: 'ADMIN' // Criando como ADMIN para facilitar seu teste
            }
          }
        });
        
        if (authError) throw authError;

        if (authData.user) {
            toast.success("Conta criada com sucesso! Você já pode entrar.");
            // Auto login after signup if session exists
            if (authData.session) {
                navigate("/dashboard");
            } else {
                setIsLogin(true);
            }
        }
      }
    } catch (error: any) {
      console.error(error);
      let msg = error.message;
      
      if (msg.includes("Invalid login credentials")) {
          msg = "Usuário não encontrado ou senha incorreta.";
      } else if (msg.includes("User already registered")) {
          msg = "Este email já está cadastrado. Tente fazer login.";
      }
      
      setErrorMsg(msg);
      toast.error("Erro de Autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/10 -skew-y-3 origin-top-left z-0"></div>
      
      <Card className="w-full max-w-md z-10 border-t-4 border-t-primary shadow-2xl bg-card">
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
                {isLogin ? "Entre com suas credenciais." : "Crie sua conta de Administrador."}
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
                        placeholder="Ex: Obedys" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required={!isLogin} 
                    />
                </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@exemplo.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
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
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-muted/20 pt-6">
            <Button type="submit" className="w-full font-bold text-md h-11" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? "ENTRAR" : "CRIAR CONTA"}
            </Button>
            <Button type="button" variant="link" onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}>
                {isLogin ? "Não possui acesso? Solicite aqui" : "Já possui conta? Voltar ao login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="absolute bottom-4 text-center text-xs text-muted-foreground opacity-50">
        &copy; 2025 Grupo Doce Mel.
      </div>
    </div>
  );
}
