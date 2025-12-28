import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SyncPage } from "./pages/SyncPage";
import { ValidationPage } from "./pages/ValidationPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MainLayout } from "./components/layout/MainLayout";
import { Toaster } from "./components/ui/sonner";
import { useAuthStore } from "./lib/store";
import { supabase } from "./lib/supabase";
import { Loader2 } from "lucide-react";

// Componente de erro quando Supabase não está configurado
function SupabaseError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md p-8 space-y-4 text-center">
        <div className="text-destructive">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Erro de Configuração</h1>
        <p className="text-muted-foreground">
          As variáveis de ambiente do Supabase não estão configuradas.
        </p>
        <p className="text-sm text-muted-foreground">
          Crie um arquivo <code className="px-2 py-1 bg-muted rounded">.env</code> na raiz do projeto com:
        </p>
        <pre className="p-4 text-left bg-muted rounded-lg text-sm">
          {`VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui`}
        </pre>
        <p className="text-sm text-muted-foreground">
          Após configurar, reinicie o servidor de desenvolvimento.
        </p>
      </div>
    </div>
  );
}

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  
  // Debug
  console.log('ProtectedRoute - isLoading:', isLoading, 'user:', user?.email);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  
  if (!user) {
    console.log('ProtectedRoute - Redirecionando para /login');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Role Protected Route - Verifica se o usuário tem permissão para acessar a rota
function RoleProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: ('GESTOR' | 'COMERCIAL' | 'LOGISTICA' | 'ADMIN' | 'VENDEDOR')[];
}) {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Usuário sem role ou tipo NOVO só pode acessar perfil
  if (!user.role || user.role === 'NOVO') {
    console.warn(`🚫 Acesso negado: usuário ${user.email} (${user.role || 'sem role'}) tentou acessar rota protegida`);
    return <Navigate to="/profile" replace />;
  }
  
  const userRole = typeof user.role === 'string' ? user.role.toUpperCase() : user.role;
  
  if (!allowedRoles.includes(userRole as any)) {
    console.warn(`🚫 Acesso negado: usuário ${user.email} (${userRole}) tentou acessar rota permitida apenas para:`, allowedRoles);
    return <Navigate to="/profile" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { setUser, setIsLoading } = useAuthStore();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;
    
    console.log('🚀 App - Inicializando autenticação...');
    
    // Verificar se Supabase está configurado
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
    const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase não configurado!');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Timeout de segurança
    const timeoutId = setTimeout(() => {
      if (isActive) {
        console.warn('⚠️ Timeout - forçando setIsLoading(false)');
        setIsLoading(false);
      }
    }, 8000);

    // Função para carregar perfil com timeout e retry
    const loadProfile = async (userId: string, email: string): Promise<{
      id: string;
      email: string;
      name: string;
      role: 'GESTOR' | 'COMERCIAL' | 'LOGISTICA' | 'ADMIN' | 'VENDEDOR' | 'NOVO' | null;
      avatar_url?: string;
      vendedor?: string | null;
    }> => {
      console.log('📋 Carregando perfil para:', email, 'userId:', userId);
      
      // Tentar buscar do banco com timeout de 2 segundos
      let profileFromDb: any = null;
      let queryCompleted = false;
      
      try {
        const queryStartTime = Date.now();
        const queryPromise = supabase
          .from('profiles')
          .select('id, email, name, role, vendedor')
          .eq('id', userId)
          .maybeSingle();
        
        // Timeout de 2 segundos - se passar disso, usar fallback imediatamente
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            if (!queryCompleted) {
              reject(new Error('Query timeout após 2 segundos'));
            }
          }, 2000);
        });
        
        const result = await Promise.race([queryPromise, timeoutPromise]) as any;
        queryCompleted = true;
        
        const { data, error } = result;
        const queryTime = Date.now() - queryStartTime;
        console.log(`📊 Query executada em ${queryTime}ms`);
        
        if (data && !error) {
          // Garantir que o role seja uma string válida e em maiúsculas
          let role: 'GESTOR' | 'COMERCIAL' | 'LOGISTICA' | 'ADMIN' | 'VENDEDOR' | 'NOVO' = 'NOVO';
          
          if (data.role) {
            const roleStr = String(data.role).trim().toUpperCase();
            console.log('📋 Role processado:', roleStr);
            
            if (['GESTOR', 'COMERCIAL', 'LOGISTICA', 'ADMIN', 'VENDEDOR', 'NOVO'].includes(roleStr)) {
              role = roleStr as 'GESTOR' | 'COMERCIAL' | 'LOGISTICA' | 'ADMIN' | 'VENDEDOR' | 'NOVO';
            } else {
              console.warn('⚠️ Role inválido no banco:', roleStr, '- usando NOVO');
              role = 'NOVO';
            }
          } else {
            console.warn('⚠️ Role está vazio no banco - usando NOVO');
            role = 'NOVO';
          }
          
          profileFromDb = {
            id: data.id,
            email,
            name: data.name || email.split('@')[0],
            role,
            vendedor: data.vendedor || null
          };
          
          console.log('✅ Perfil carregado do banco:', profileFromDb);
          return profileFromDb;
        } else {
          console.warn('⚠️ Sem dados do perfil no banco. Erro:', error);
        }
      } catch (err: any) {
        queryCompleted = true;
        console.warn('⏱️ Timeout ou erro na query do banco, tentando fallback...', err?.message || err);
        // Continuar para o fallback
      }
      
      // Se chegou aqui, a query do banco falhou ou não retornou dados
      // Fallback 1: Buscar do auth.users metadata (mais rápido que query do banco)
      try {
        console.log('🔄 Tentando fallback 1: metadata do auth...');
        
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        
        if (!authError && authUser?.user) {
          const metadataRole = authUser.user.user_metadata?.role;
          const fallbackRole = (metadataRole && ['GESTOR', 'COMERCIAL', 'LOGISTICA', 'ADMIN', 'VENDEDOR', 'NOVO'].includes(String(metadataRole).toUpperCase()))
            ? String(metadataRole).toUpperCase() as 'GESTOR' | 'COMERCIAL' | 'LOGISTICA' | 'ADMIN' | 'VENDEDOR' | 'NOVO'
            : 'NOVO';
          
          const fallback = {
            id: userId,
            email,
            name: authUser.user.user_metadata?.name || email.split('@')[0],
            role: fallbackRole,
            vendedor: authUser.user.user_metadata?.vendedor || null
          };
          console.log('✅ Usando fallback (metadata):', fallback);
          return fallback;
        } else {
          console.warn('⚠️ Metadata retornou erro ou sem dados:', authError);
        }
      } catch (err) {
        console.warn('⚠️ Erro ao buscar metadata:', err);
      }
      
      // Fallback 2 (FINAL): Perfil mínimo com NOVO
      // IMPORTANTE: Sempre retornar um perfil válido para não travar o app
      // Não tentar mais queries do banco aqui para evitar mais timeouts
      const fallback = {
        id: userId,
        email,
        name: email.split('@')[0],
        role: 'NOVO' as const,
        vendedor: null
      };
      console.log('⚠️ Usando fallback final (NOVO) - query do banco falhou:', fallback);
      return fallback;
    };

    // Listener de mudanças de auth
    // IMPORTANTE: Só recarregar perfil em eventos críticos (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED)
    // Ignorar eventos como USER_UPDATED que podem causar loops
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth mudou:', event, session?.user?.email);
      
      if (!isActive) return;
      
      // Ignorar eventos que não requerem recarregar o perfil
      // TOKEN_REFRESHED acontece periodicamente e não deve sobrescrever o role
      if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token renovado - mantendo perfil atual');
        return;
      }
      
      // Só processar SIGNED_IN, SIGNED_OUT, USER_UPDATED
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT' && event !== 'USER_UPDATED') {
        console.log('⏭️ Evento ignorado:', event);
        return;
      }
      
      try {
        if (session?.user) {
          // Verificar se já temos um usuário carregado com o mesmo ID
          // Se sim, só recarregar se realmente necessário (USER_UPDATED)
          const storeState = useAuthStore.getState();
          const currentUser = storeState.user;
          
          // Se já temos o usuário carregado e não é USER_UPDATED, manter o atual
          if (currentUser && currentUser.id === session.user.id && event !== 'USER_UPDATED') {
            console.log('✅ Usuário já carregado, mantendo perfil atual:', currentUser.role);
            return;
          }
          
          // Usar Promise.race para garantir que sempre retorne em até 3 segundos
          const profilePromise = loadProfile(session.user.id, session.user.email!);
          const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
              // Se timeout, manter perfil atual se existir, senão usar COMERCIAL
              const storeStateOnTimeout = useAuthStore.getState();
              const currentUserOnTimeout = storeStateOnTimeout.user;
              
              if (currentUserOnTimeout && currentUserOnTimeout.id === session.user.id) {
                console.log('⏱️ Timeout - mantendo perfil atual:', currentUserOnTimeout.role);
                resolve(currentUserOnTimeout);
              } else {
                resolve({
                  id: session.user.id,
                  email: session.user.email!,
                  name: session.user.email!.split('@')[0],
                  role: 'NOVO' as const,
                  vendedor: null
                });
              }
            }, 3000);
          });
          
          const profile = await Promise.race([profilePromise, timeoutPromise]) as any;
          
          if (isActive && profile) {
            console.log('✅ Usuário setado:', {
              email: profile.email,
              role: profile.role,
              name: profile.name,
              id: profile.id,
              vendedor: profile.vendedor
            });
            setUser(profile);
          }
        } else {
          if (isActive) {
            console.log('❌ Sem sessão');
            setUser(null);
          }
        }
      } catch (err) {
        console.error('❌ Erro no listener de auth:', err);
        // Em caso de erro, manter perfil atual se existir
        const storeStateOnError = useAuthStore.getState();
        const currentUserOnError = storeStateOnError.user;
        
        if (isActive && session?.user && currentUserOnError && currentUserOnError.id === session.user.id) {
          console.log('⚠️ Erro ao recarregar - mantendo perfil atual:', currentUserOnError.role);
          // Não atualizar, manter o atual
        } else if (isActive && session?.user) {
          const fallbackProfile = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.email!.split('@')[0],
            role: 'NOVO' as const,
            vendedor: null
          };
          console.log('⚠️ Usando perfil mínimo devido a erro:', fallbackProfile);
          setUser(fallbackProfile);
        } else {
          setUser(null);
        }
      } finally {
        // Sempre definir isLoading como false após tentar carregar
        if (isActive) {
          setIsLoading(false);
          clearTimeout(timeoutId);
        }
      }
    });

    // Verificar sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isActive) return;
      
      try {
        if (session?.user) {
          console.log('✅ Sessão encontrada:', session.user.email);
          
          // Usar Promise.race para garantir que sempre retorne em até 3 segundos
          const profilePromise = loadProfile(session.user.id, session.user.email!);
          const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
              // Criar perfil mínimo se timeout
              resolve({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.email!.split('@')[0],
                role: 'NOVO' as const,
                vendedor: null
              });
            }, 3000);
          });
          
          const profile = await Promise.race([profilePromise, timeoutPromise]) as any;
          
          if (isActive && profile) {
            console.log('✅ Setando usuário inicial:', {
              email: profile.email,
              role: profile.role,
              name: profile.name,
              vendedor: profile.vendedor
            });
            setUser(profile);
          }
        } else {
          console.log('ℹ️ Sem sessão inicial');
          if (isActive) {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('❌ Erro ao carregar sessão inicial:', err);
        // Em caso de erro, criar perfil mínimo
        if (isActive && session?.user) {
          const fallbackProfile = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.email!.split('@')[0],
            role: 'NOVO' as const,
            vendedor: null
          };
          console.log('⚠️ Usando perfil mínimo devido a erro:', fallbackProfile);
          setUser(fallbackProfile);
        } else {
          setUser(null);
        }
      } finally {
        // Sempre definir isLoading como false após tentar carregar
        if (isActive) {
          setIsLoading(false);
          clearTimeout(timeoutId);
        }
      }
    }).catch((err) => {
      console.error('❌ Erro ao verificar sessão:', err);
      if (isActive) {
        setUser(null);
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    });

    return () => {
      console.log('🔚 Cleanup');
      isActive = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [setUser, setIsLoading]);

  if (hasError) {
    return <SupabaseError />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="validation" element={<RoleProtectedRoute allowedRoles={['COMERCIAL', 'LOGISTICA', 'ADMIN', 'VENDEDOR']}><ValidationPage /></RoleProtectedRoute>} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="sync" element={<RoleProtectedRoute allowedRoles={['LOGISTICA', 'ADMIN']}><SyncPage /></RoleProtectedRoute>} />
          <Route path="settings" element={<RoleProtectedRoute allowedRoles={['ADMIN']}><SettingsPage /></RoleProtectedRoute>} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
