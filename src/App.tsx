import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ValidationPage } from "@/pages/ValidationPage";
import { SyncPage } from "@/pages/SyncPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ReportsPage } from "@/pages/ReportsPage"; // Import ReportsPage
import { useAuthStore } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

// Layout for protected routes
function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-muted/10">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-x-hidden print:ml-0 print:p-0">
        <Outlet />
      </main>
    </div>
  );
}

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}

function App() {
  const { setUser, setIsLoading } = useAuthStore();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              setUser({
                id: data.id,
                email: session.user.email!,
                name: data.name || session.user.email!.split('@')[0],
                role: data.role || 'COMERCIAL',
                avatar_url: data.avatar_url
              });
            } else {
               // Fallback if profile doesn't exist yet
               setUser({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
                role: 'COMERCIAL' // Default role
              });
            }
            setIsLoading(false);
          });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
         const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
          if (data) {
             setUser({
                id: data.id,
                email: session.user.email!,
                name: data.name,
                role: data.role,
                avatar_url: data.avatar_url
              });
          } else {
             setUser({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || '',
                role: 'COMERCIAL'
              });
          }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setIsLoading]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/validacao" element={<ValidationPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
          <Route path="/sincronizacao" element={<SyncPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
