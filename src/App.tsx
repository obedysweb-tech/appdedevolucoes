import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { DashboardLancadasPage } from "./pages/DashboardLancadasPage";
import { LoginPage } from "./pages/LoginPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SyncPage } from "./pages/SyncPage";
import { ValidationPage } from "./pages/ValidationPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { EmptyPage } from "./pages/EmptyPage";
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
function ProtectedRoute({ children, allowNovo = false }: { children: React.ReactNode; allowNovo?: boolean }) {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();
  
  // Debug
  console.log('ProtectedRoute - isLoading:', isLoading, 'user:', user?.email, 'location:', location.pathname);
  
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
  
  // Se allowNovo é true (para rota /empty), permitir usuários NOVO
  if (allowNovo) {
    return <>{children}</>;
  }
  
  // Usuário NOVO deve ir para página vazia (exceto se já estiver lá)
  if ((!user.role || user.role === 'NOVO') && location.pathname !== '/empty') {
    console.log('ProtectedRoute - Redirecionando usuário NOVO para /empty');
    return <Navigate to="/empty" replace />;
  }
  
  return <>{children}</>;
}

// Componente para redirecionar baseado no role
function IndexRedirect() {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  
  // Usuário NOVO vai para página vazia
  if (!user?.role || user.role === 'NOVO') {
    return <Navigate to="/empty" replace />;
  }
  
  // Outros usuários vão para dashboard pendências
  return <Navigate to="/dashboard" replace />;
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
  
  // Usuário sem role ou tipo NOVO só pode acessar página vazia
  if (!user.role || user.role === 'NOVO') {
    console.warn(`🚫 Acesso negado: usuário ${user.email} (${user.role || 'sem role'}) tentou acessar rota protegida`);
    return <Navigate to="/empty" replace />;
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

    // Timeout de segurança - aumentar para dar mais tempo para queries
    const timeoutId = setTimeout(() => {
      if (isActive) {
        console.warn('⚠️ Timeout de segurança - forçando setIsLoading(false)');
        setIsLoading(false);
      }
    }, 15000);

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
      
      // Verificar se já temos um perfil em cache para este usuário
      const storeState = useAuthStore.getState();
      const cachedUser = storeState.user;
      if (cachedUser && cachedUser.id === userId && cachedUser.role && cachedUser.role !== 'NOVO') {
        console.log('✅ Usando perfil em cache:', cachedUser.role);
        return cachedUser;
      }
      
      // Tentar buscar do banco - com timeout de 8 segundos
      try {
        const queryStartTime = Date.now();
        
        // Criar uma promise com timeout
        const queryPromise = supabase
          .from('profiles')
          .select('id, email, name, role, vendedor')
          .eq('id', userId)
          .maybeSingle();
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Query timeout após 8 segundos')), 8000);
        });
        
        let result: any;
        try {
          result = await Promise.race([queryPromise, timeoutPromise]);
        } catch (timeoutErr) {
          console.warn('⏱️ Query timeout, continuando com fallback...');
          throw timeoutErr;
        }
        
        const { data, error } = result;
        const queryTime = Date.now() - queryStartTime;
        console.log(`📊 Query executada em ${queryTime}ms`, { hasData: !!data, error: error?.message });
        
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
          
          const profileFromDb = {
            id: data.id,
            email,
            name: data.name || email.split('@')[0],
            role,
            vendedor: data.vendedor || null
          };
          
          console.log('✅ Perfil carregado do banco:', profileFromDb);
          
          // Salvar no localStorage para cache persistente
          try {
            const profileWithCache = { ...profileFromDb, _cacheTime: Date.now() };
            localStorage.setItem(`profile_${userId}`, JSON.stringify(profileWithCache));
          } catch (storageErr) {
            console.warn('⚠️ Erro ao salvar perfil no localStorage:', storageErr);
          }
          
          return profileFromDb;
        } else {
          console.warn('⚠️ Sem dados do perfil no banco. Erro:', error);
        }
      } catch (err: any) {
        console.warn('⏱️ Erro na query do banco, tentando fallback...', err?.message || err);
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
            if (isActive) {
              setIsLoading(false);
            }
            return;
          }
          
          // Carregar perfil com timeout de segurança
          const profilePromise = loadProfile(session.user.id, session.user.email!);
          const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
              // Se timeout, usar perfil mínimo para permitir login
              const fallbackProfile = {
                id: session.user.id,
                email: session.user.email!,
                name: session.user.email!.split('@')[0],
                role: 'NOVO' as const,
                vendedor: null
              };
              console.log('⏱️ Timeout no loadProfile - usando perfil mínimo:', fallbackProfile);
              resolve(fallbackProfile);
            }, 10000); // 10 segundos de timeout
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
        // Em caso de erro, garantir que o usuário seja setado para permitir login
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
        }
      }
    });

    // Verificar sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isActive) return;
      
      try {
        if (session?.user) {
          console.log('✅ Sessão encontrada:', session.user.email);
          
          // PRIMEIRO: Verificar se já temos o usuário no store (do localStorage via authStore)
          const storeState = useAuthStore.getState();
          const cachedUser = storeState.user;
          if (cachedUser && cachedUser.id === session.user.id && cachedUser.role && cachedUser.role !== 'NOVO') {
            console.log('✅ Usando perfil do store (cache):', cachedUser.role);
            setIsLoading(false);
            clearTimeout(timeoutId);
            
            // Carregar do banco em background para atualizar o cache
            loadProfile(session.user.id, session.user.email!).then((freshProfile) => {
              if (freshProfile && isActive) {
                setUser(freshProfile);
              }
            }).catch((err) => {
              console.warn('⚠️ Erro ao atualizar perfil em background:', err);
            });
            return;
          }
          
          // SEGUNDO: Tentar carregar do localStorage (cache persistente por perfil)
          try {
            const cachedProfileStr = localStorage.getItem(`profile_${session.user.id}`);
            if (cachedProfileStr) {
              const cachedProfileData = JSON.parse(cachedProfileStr);
              // Verificar se o cache não expirou (24 horas)
              const cacheTime = cachedProfileData._cacheTime || 0;
              const now = Date.now();
              const cacheAge = now - cacheTime;
              const cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas
              
              if (cacheAge < cacheExpiry && cachedProfileData.role && cachedProfileData.role !== 'NOVO') {
                // Remover _cacheTime antes de usar
                const { _cacheTime, ...cachedProfile } = cachedProfileData;
                console.log('✅ Usando perfil do localStorage:', cachedProfile.role);
                setUser(cachedProfile);
                setIsLoading(false);
                clearTimeout(timeoutId);
                
                // Carregar do banco em background para atualizar o cache
                loadProfile(session.user.id, session.user.email!).then((freshProfile) => {
                  if (freshProfile && isActive) {
                    setUser(freshProfile);
                  }
                }).catch((err) => {
                  console.warn('⚠️ Erro ao atualizar perfil em background:', err);
                });
                return;
              } else {
                console.log('⚠️ Cache expirado ou inválido, buscando do banco...');
                localStorage.removeItem(`profile_${session.user.id}`);
              }
            }
          } catch (cacheErr) {
            console.warn('⚠️ Erro ao ler cache do localStorage:', cacheErr);
          }
          
          // Carregar perfil do banco - SEM timeout artificial na verificação inicial
          // Deixar a query completar naturalmente, pois não é um login novo
          const profile = await loadProfile(session.user.id, session.user.email!);
          
          if (isActive && profile) {
            console.log('✅ Setando usuário inicial:', {
              email: profile.email,
              role: profile.role,
              name: profile.name,
              vendedor: profile.vendedor
            });
            
            // Salvar no localStorage para cache persistente
            try {
              const profileWithCache = { ...profile, _cacheTime: Date.now() };
              localStorage.setItem(`profile_${session.user.id}`, JSON.stringify(profileWithCache));
            } catch (storageErr) {
              console.warn('⚠️ Erro ao salvar no localStorage:', storageErr);
            }
            
            setUser(profile);
            setIsLoading(false);
            clearTimeout(timeoutId);
          }
        } else {
          console.log('ℹ️ Sem sessão inicial');
          if (isActive) {
            setUser(null);
            setIsLoading(false);
            clearTimeout(timeoutId);
          }
        }
      } catch (err) {
        console.error('❌ Erro ao carregar sessão inicial:', err);
        // Em caso de erro, tentar usar cache do localStorage como último recurso
        if (isActive && session?.user) {
          // Primeiro tentar o store
          const storeStateOnError = useAuthStore.getState();
          const cachedUserOnError = storeStateOnError.user;
          if (cachedUserOnError && cachedUserOnError.id === session.user.id && cachedUserOnError.role && cachedUserOnError.role !== 'NOVO') {
            console.log('⚠️ Usando perfil do store devido a erro:', cachedUserOnError.role);
            setIsLoading(false);
            clearTimeout(timeoutId);
            return;
          }
          
          // Segundo tentar localStorage
          try {
            const cachedProfileStr = localStorage.getItem(`profile_${session.user.id}`);
            if (cachedProfileStr) {
              const cachedProfileData = JSON.parse(cachedProfileStr);
              const { _cacheTime, ...cachedProfile } = cachedProfileData;
              if (cachedProfile.role && cachedProfile.role !== 'NOVO') {
                console.log('⚠️ Usando perfil do cache devido a erro:', cachedProfile.role);
                setUser(cachedProfile);
                setIsLoading(false);
                clearTimeout(timeoutId);
                return;
              }
            }
          } catch (cacheErr) {
            console.warn('⚠️ Erro ao ler cache em fallback:', cacheErr);
          }
          
          // Se não há cache válido, usar perfil mínimo (mas só se realmente necessário)
          // Não forçar NOVO se já temos um cache válido
          const fallbackProfile = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.email!.split('@')[0],
            role: 'NOVO' as const,
            vendedor: null
          };
          console.log('⚠️ Usando perfil mínimo devido a erro (sem cache válido):', fallbackProfile);
          setUser(fallbackProfile);
          setIsLoading(false);
          clearTimeout(timeoutId);
        } else {
          setUser(null);
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
        {/* Rota para usuários NOVO - fora do MainLayout */}
        <Route 
          path="/empty" 
          element={
            <ProtectedRoute allowNovo={true}>
              <EmptyPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<IndexRedirect />} />
          <Route path="dashboard" element={<RoleProtectedRoute allowedRoles={['GESTOR', 'COMERCIAL', 'LOGISTICA', 'ADMIN', 'VENDEDOR']}><DashboardPage /></RoleProtectedRoute>} />
          <Route path="dashboard-lancadas" element={<RoleProtectedRoute allowedRoles={['GESTOR', 'COMERCIAL', 'LOGISTICA', 'ADMIN', 'VENDEDOR']}><DashboardLancadasPage /></RoleProtectedRoute>} />
          <Route path="validation" element={<RoleProtectedRoute allowedRoles={['COMERCIAL', 'LOGISTICA', 'ADMIN', 'VENDEDOR']}><ValidationPage /></RoleProtectedRoute>} />
          <Route path="reports" element={<RoleProtectedRoute allowedRoles={['GESTOR', 'COMERCIAL', 'LOGISTICA', 'ADMIN', 'VENDEDOR']}><ReportsPage /></RoleProtectedRoute>} />
          <Route path="sync" element={<RoleProtectedRoute allowedRoles={['LOGISTICA', 'ADMIN']}><SyncPage /></RoleProtectedRoute>} />
          <Route path="settings" element={<RoleProtectedRoute allowedRoles={['ADMIN', 'LOGISTICA']}><SettingsPage /></RoleProtectedRoute>} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
