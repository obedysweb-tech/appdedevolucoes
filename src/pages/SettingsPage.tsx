import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Sector, ReturnReason, UserRole, User } from "@/types";
import { useAuthStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export function SettingsPage() {
  const { user } = useAuthStore();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [reasons, setReasons] = useState<ReturnReason[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [vendedores, setVendedores] = useState<string[]>([]);
  const [newVendedor, setNewVendedor] = useState("");

  // Form states
  const [newSector, setNewSector] = useState("");
  const [newReason, setNewReason] = useState("");
  const [selectedSectorForReason, setSelectedSectorForReason] = useState("");
  
  // Cliente form states
  const [newClienteNome, setNewClienteNome] = useState("");
  const [newClienteCNPJ, setNewClienteCNPJ] = useState("");
  const [newClienteVendedor, setNewClienteVendedor] = useState("");
  const [newClienteRede, setNewClienteRede] = useState("");
  const [newClienteUF, setNewClienteUF] = useState("");
  const [newClienteMunicipio, setNewClienteMunicipio] = useState("");
  
  // Edit User State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("COMERCIAL");
  const [editVendedor, setEditVendedor] = useState<string>("");
  const [editPassword, setEditPassword] = useState("");
  
  // Delete confirmation states
  const [deletingUser, setDeletingUser] = useState<{id: string, name: string} | null>(null);
  const [deletingReason, setDeletingReason] = useState<string | null>(null);
  const [deletingVendedor, setDeletingVendedor] = useState<string | null>(null);
  
  // New User State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("NOVO");
  const [newUserVendedor, setNewUserVendedor] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [sectorsData, reasonsData, usersData, clientesData, devolucoesData] = await Promise.all([
      supabase.from('setores').select('*').order('nome'),
      supabase.from('motivos_devolucao').select('*, setor:setores(nome)').order('nome'),
      supabase.from('profiles').select('*').order('name'),
      supabase.from('clientes').select('*').order('nome'),
      supabase.from('devolucoes').select('vendedor').not('vendedor', 'is', null)
    ]);
    
    if (sectorsData.data) setSectors(sectorsData.data.map(s => ({ id: s.id, name: s.nome })));
    if (reasonsData.data) setReasons(reasonsData.data.map(r => ({ id: r.id, name: r.nome, sector_id: r.sector_id, sector: r.setor })));
    if (usersData.data) setUsers(usersData.data as User[]);
    if (clientesData.data) setClientes(clientesData.data);
    
    // Extrair lista única de vendedores
    if (devolucoesData.data) {
      const vendedoresSet = new Set<string>();
      devolucoesData.data.forEach((d: any) => {
        if (d.vendedor && d.vendedor.trim()) {
          vendedoresSet.add(d.vendedor.trim().toUpperCase());
        }
      });
      // Adicionar vendedores dos clientes
      clientesData.data?.forEach((c: any) => {
        if (c.vendedor && c.vendedor.trim()) {
          vendedoresSet.add(c.vendedor.trim().toUpperCase());
        }
      });
      setVendedores(Array.from(vendedoresSet).sort());
    }
    
  };

  const handleAddSector = async () => {
    if (!newSector) return;
    const { error } = await supabase.from('setores').insert({ nome: newSector });
    if (error) {
        toast.error("Erro ao adicionar setor: " + error.message);
    } else {
        toast.success("Setor adicionado!");
        setNewSector("");
        fetchData();
    }
  };

  const handleAddReason = async () => {
    if (!newReason || !newReason.trim()) {
      toast.error("Nome do motivo é obrigatório");
      return;
    }
    
    if (!selectedSectorForReason) {
      toast.error("Selecione um setor para o motivo");
      return;
    }
    
    try {
      const { error } = await supabase.from('motivos_devolucao').insert({ 
        nome: newReason.trim(), 
        sector_id: selectedSectorForReason 
      });
      
      if (error) {
        console.error("Erro ao adicionar motivo:", error);
        toast.error("Erro ao adicionar motivo: " + error.message);
      } else {
        toast.success("Motivo adicionado!");
        setNewReason("");
        setSelectedSectorForReason("");
        fetchData();
      }
    } catch (error: any) {
      console.error("Erro ao adicionar motivo:", error);
      toast.error("Erro ao adicionar motivo: " + (error.message || 'Erro desconhecido'));
    }
  };


  const handleAddCliente = async () => {
    if (!newClienteNome || !newClienteNome.trim()) {
      toast.error("Nome do cliente é obrigatório");
      return;
    }
    
    if (!newClienteCNPJ || !newClienteCNPJ.trim()) {
      toast.error("CNPJ/CPF é obrigatório");
      return;
    }
    
    // Validar UF se preenchido
    if (newClienteUF && newClienteUF.length !== 2) {
      toast.error("UF deve ter 2 caracteres");
      return;
    }
    
    try {
      const { error } = await supabase.from('clientes').insert({
        nome: newClienteNome.trim(),
        cnpj_cpf: newClienteCNPJ.trim(),
        vendedor: newClienteVendedor?.trim() || null,
        rede: newClienteRede?.trim() || null,
        uf: newClienteUF?.trim().toUpperCase() || null,
        municipio: newClienteMunicipio?.trim() || null
      });
      
      if (error) {
        console.error("Erro ao adicionar cliente:", error);
        // Tratamento específico para erros de duplicata
        if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
          toast.error("Cliente com este CNPJ/CPF já está cadastrado");
        } else {
          toast.error("Erro ao adicionar cliente: " + error.message);
        }
      } else {
        toast.success("Cliente adicionado!");
        setNewClienteNome("");
        setNewClienteCNPJ("");
        setNewClienteVendedor("");
        setNewClienteRede("");
        setNewClienteUF("");
        setNewClienteMunicipio("");
        fetchData();
      }
    } catch (error: any) {
      console.error("Erro ao adicionar cliente:", error);
      toast.error("Erro ao adicionar cliente: " + (error.message || 'Erro desconhecido'));
    }
  };

  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      toast.error("Nome, email e senha são obrigatórios");
      return;
    }
    
    // Validar senha mínima
    if (newUserPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserEmail)) {
      toast.error("Email inválido");
      return;
    }
    
    // REMOVIDO: Validação de role - novos usuários não têm role
    // Admin deve atribuir role depois pelo app ou Supabase
    
    try {
      // Preparar metadata do usuário - SEM ROLE (será null)
      const userMetadata: any = {
        name: newUserName
        // NÃO incluir role - novo usuário não terá role até admin atribuir
      };
      
      // Criar usuário no auth (usando signUp que cria o usuário e o perfil via trigger)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail.trim().toLowerCase(),
        password: newUserPassword,
        options: {
          data: userMetadata,
          // Desabilitar confirmação de email se necessário (requer configuração no Supabase)
          emailRedirectTo: undefined
        }
      });
      
      if (authError) {
        console.error("Erro no auth.signUp:", authError);
        // Tratamento específico de erros comuns
        if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
          toast.error("Este email já está cadastrado no sistema");
        } else if (authError.message?.includes('password')) {
          toast.error("Senha inválida. Verifique os requisitos de senha.");
        } else if (authError.message?.includes('email')) {
          toast.error("Email inválido ou já cadastrado");
        } else {
          toast.error(`Erro ao criar usuário: ${authError.message || 'Erro desconhecido'}`);
        }
        return;
      }
      
      if (authData.user) {
        // Aguardar um pouco para garantir que o trigger criou o perfil
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar se o perfil foi criado pelo trigger
        let profileData = null;
        let profileCheckError = null;
        
        const { data: initialProfileData, error: initialError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        
        profileData = initialProfileData;
        profileCheckError = initialError;
        
        if (profileCheckError || !profileData) {
          console.error("Perfil não encontrado após criação, tentando criar manualmente:", profileCheckError);
          
          // Aguardar mais um pouco - às vezes o trigger demora
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Verificar novamente
          const { data: profileDataRetry, error: profileCheckErrorRetry } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
          
          if (profileCheckErrorRetry || !profileDataRetry) {
            // Tentar inserir se não existir (caso o trigger não tenha funcionado)
            // Como ADMIN, devemos ter permissão para inserir
            // NOVO USUÁRIO COM TIPO "NOVO"
            const { error: insertError } = await supabase.from('profiles').insert({
              id: authData.user.id,
              name: newUserName,
              email: newUserEmail.trim().toLowerCase(),
              role: 'NOVO', // Tipo NOVO até admin atribuir outro role
              vendedor: null
            });
            
            if (insertError) {
              console.error("Erro ao inserir perfil:", insertError);
              toast.error(`Usuário criado no Auth, mas erro ao criar perfil: ${insertError.message}. O trigger pode ter falhado. Verifique o perfil manualmente no Supabase.`);
              return;
            }
            // Se inseriu com sucesso, considerar como criado
            profileData = { id: authData.user.id };
          } else {
            // Perfil foi criado na segunda tentativa
            profileData = profileDataRetry;
          }
        }
        
        if (profileData) {
          // Atualizar perfil com dados adicionais (caso o trigger não tenha passado tudo)
          // NOVO USUÁRIO COM TIPO "NOVO" - admin deve atribuir outro role depois
          const { error: profileError } = await supabase.from('profiles').update({
            name: newUserName,
            role: 'NOVO', // Tipo NOVO até admin atribuir outro role
            vendedor: null
          }).eq('id', authData.user.id);
          
          if (profileError) {
            console.warn("Aviso ao atualizar perfil (pode ser normal):", profileError);
            // Não retornar erro aqui, pois o perfil já existe
          }
        }
        
        toast.success("Usuário criado com sucesso! O usuário foi criado como tipo NOVO. Atribua a função apropriada na gestão de usuários.");
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserRole("NOVO");
        setNewUserVendedor("");
        fetchData();
      } else {
        toast.warning("Usuário criado, mas não foi possível obter os dados. Recarregue a página.");
      }
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      toast.error(`Erro ao criar usuário: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const handleUpdateUser = async () => {
      if (!editingUser) return;
      
      // Validar se VENDEDOR tem vendedor selecionado
      if (editRole === 'VENDEDOR' && !editVendedor) {
        toast.error("Usuários do tipo VENDEDOR devem ter um vendedor selecionado");
        return;
      }
      
      // Validar role
      if (!editRole || editRole === 'NOVO') {
        toast.error("Selecione um role válido para o usuário");
        return;
      }
      
      try {
        // Atualizar perfil no Supabase
        const updateData: any = { 
          name: editName.trim()
        };
        
        // Sempre atualizar role se foi fornecido
        if (editRole) {
          updateData.role = editRole;
        }
        
        // Atualizar vendedor se necessário
        if (editRole === 'VENDEDOR') {
          updateData.vendedor = editVendedor || null;
        } else {
          updateData.vendedor = null;
        }
        
        console.log('🔄 Atualizando usuário:', editingUser.id, 'com dados:', updateData);
        console.log('🔄 Usuário atual (ADMIN):', user?.email, 'role:', user?.role);
        
        // Atualizar também o updated_at
        updateData.updated_at = new Date().toISOString();
        
        // Usar RPC ou update direto com permissões corretas
        const { error: profileError, data: updatedData } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', editingUser.id)
          .select();
          
        if (profileError) {
          console.error("❌ Erro ao atualizar perfil:", profileError);
          console.error("❌ Detalhes do erro:", JSON.stringify(profileError, null, 2));
          console.error("❌ Código do erro:", profileError.code);
          console.error("❌ Mensagem:", profileError.message);
          console.error("❌ Detalhes:", profileError.details);
          console.error("❌ Hint:", profileError.hint);
          
          // Mensagem mais específica baseada no tipo de erro
          if (profileError.code === '42501' || profileError.message?.includes('permission') || profileError.message?.includes('policy')) {
            toast.error("Erro de permissão: Verifique se você tem permissão para atualizar este usuário. Apenas ADMINs podem atualizar outros perfis.");
          } else {
            toast.error("Erro ao atualizar usuário: " + (profileError.message || 'Erro desconhecido'));
          }
          return;
        }
        
        console.log('✅ Resposta do update:', updatedData);
        
        // Verificar se realmente foi atualizado
        if (!updatedData || updatedData.length === 0) {
          console.error("❌ Update retornou array vazio - possível problema de RLS");
          toast.error("Usuário não foi atualizado. Verifique se você tem permissão ADMIN para atualizar outros perfis.");
          return;
        }
        
        console.log('✅ Usuário atualizado com sucesso:', updatedData[0]);
        
        // Se houver nova senha, atualizar via auth
        // Nota: A alteração de senha de outro usuário requer admin API ou Edge Function
        // Por enquanto, informamos que a funcionalidade requer configuração adicional
        if (editPassword && editPassword.length >= 6) {
          toast.warning("Alteração de senha de outros usuários requer configuração de Edge Function ou uso da API Admin do Supabase. Por favor, use o Supabase Dashboard para alterar senhas.");
          // TODO: Implementar Edge Function para alterar senha de outros usuários
          setEditPassword("");
        }
        
        toast.success("Usuário atualizado com sucesso!");
        setEditingUser(null);
        setEditPassword("");
        fetchData();
      } catch (error: any) {
        console.error("Erro ao atualizar usuário:", error);
        toast.error("Erro ao atualizar usuário: " + error.message);
      }
  };
  
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    try {
      // Excluir o perfil (o registro no auth.users pode ser removido manualmente no Supabase Dashboard se necessário)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deletingUser.id);
        
      if (profileError) {
        toast.error("Erro ao excluir usuário: " + profileError.message);
        return;
      }
      
      toast.success("Usuário excluído com sucesso! (Nota: O registro no Auth pode precisar ser removido manualmente no Supabase Dashboard)");
      setDeletingUser(null);
      fetchData();
    } catch (error: any) {
      toast.error("Erro ao excluir usuário: " + error.message);
    }
  };
  
  const handleDeleteReasonConfirm = async () => {
    if (!deletingReason) return;
    
    try {
      const { error } = await supabase
        .from('motivos_devolucao')
        .delete()
        .eq('id', deletingReason);
        
      if (error) {
        toast.error("Erro ao excluir: " + error.message);
      } else {
        toast.success("Excluído com sucesso");
        setDeletingReason(null);
        fetchData();
      }
    } catch (error: any) {
      toast.error("Erro ao excluir: " + error.message);
    }
  };
  
  const handleDeleteVendedorConfirm = () => {
    if (!deletingVendedor) return;
    setVendedores(vendedores.filter(v => v !== deletingVendedor));
    toast.success("Vendedor removido da lista!");
    setDeletingVendedor(null);
  };
  
  const handleAddVendedor = async () => {
    if (!newVendedor || !newVendedor.trim()) {
      toast.error("Nome do vendedor é obrigatório");
      return;
    }
    
    const vendedorUpper = newVendedor.trim().toUpperCase();
    
    // Verificar se já existe
    if (vendedores.includes(vendedorUpper)) {
      toast.warning("Este vendedor já está cadastrado");
      return;
    }
    
    // Adicionar à lista (será persistido quando usado em uma devolução ou cliente)
    setVendedores([...vendedores, vendedorUpper].sort());
    setNewVendedor("");
    toast.success("Vendedor adicionado à lista!");
  };

  // ADMIN e LOGISTICA têm acesso
  if (user?.role !== 'ADMIN' && user?.role !== 'LOGISTICA') {
      return <div className="p-8 text-center">Acesso restrito a administradores e logística.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações" 
        description="Gerencie setores, motivos de devolução, vendedores, clientes e usuários do sistema. Acesso restrito a administradores."
      />

      <Tabs defaultValue="master-data">
        <div className="overflow-x-auto">
          <TabsList className="w-full md:w-auto min-w-full md:min-w-0">
              <TabsTrigger value="master-data" className="text-xs sm:text-sm whitespace-nowrap">Master Data (Setores/Motivos)</TabsTrigger>
              <TabsTrigger value="vendedores" className="text-xs sm:text-sm whitespace-nowrap">Vendedores</TabsTrigger>
              <TabsTrigger value="clientes" className="text-xs sm:text-sm whitespace-nowrap">Clientes</TabsTrigger>
              {/* Apenas ADMIN vê aba de Usuários */}
              {user?.role === 'ADMIN' && (
                  <TabsTrigger value="users" className="text-xs sm:text-sm whitespace-nowrap">Usuários</TabsTrigger>
              )}
          </TabsList>
        </div>

        <TabsContent value="master-data" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Sectors */}
                <Card>
                    <CardHeader>
                        <CardTitle>Setores</CardTitle>
                        <CardDescription>Gerencie as áreas responsáveis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mb-4">
                            <Input 
                                placeholder="Novo Setor" 
                                value={newSector}
                                onChange={(e) => setNewSector(e.target.value)}
                            />
                            <Button onClick={handleAddSector} size="icon"><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="rounded-md border max-h-[300px] overflow-y-auto">
                            <Table>
                                <TableBody>
                                    {sectors.map((sector) => (
                                        <TableRow key={sector.id}>
                                            <TableCell>{sector.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Reasons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Motivos de Devolução</CardTitle>
                        <CardDescription>Associe motivos aos setores.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2 mb-4">
                            <Select value={selectedSectorForReason} onValueChange={setSelectedSectorForReason}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o Setor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sectors.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Novo Motivo" 
                                    value={newReason}
                                    onChange={(e) => setNewReason(e.target.value)}
                                />
                                <Button onClick={handleAddReason} size="icon"><Plus className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="rounded-md border max-h-[300px] overflow-y-auto">
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Motivo</TableHead>
                                        <TableHead>Setor</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reasons.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                Nenhum motivo cadastrado
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        reasons.map((reason) => (
                                            <TableRow key={reason.id}>
                                                <TableCell>{reason.name}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {reason.sector?.name || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                                        onClick={() => setDeletingReason(reason.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="vendedores" className="space-y-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cadastro de Vendedores</CardTitle>
                    <CardDescription>Gerencie a lista de vendedores disponíveis no sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Input 
                            placeholder="Nome do Vendedor" 
                            value={newVendedor}
                            onChange={(e) => setNewVendedor(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddVendedor()}
                        />
                        <Button onClick={handleAddVendedor} size="icon"><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="rounded-md border max-h-[400px] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendedores.map((vendedor, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{vendedor}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="hover:bg-destructive/10"
                                                onClick={() => setDeletingVendedor(vendedor)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {vendedores.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                                            Nenhum vendedor cadastrado. Adicione um acima.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cadastro de Clientes</CardTitle>
                    <CardDescription>Adicione novos clientes ao sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 mb-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Nome *</Label>
                                <Input 
                                    value={newClienteNome} 
                                    onChange={(e) => setNewClienteNome(e.target.value)}
                                    placeholder="Nome do cliente"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>CNPJ/CPF *</Label>
                                <Input 
                                    value={newClienteCNPJ} 
                                    onChange={(e) => setNewClienteCNPJ(e.target.value)}
                                    placeholder="00.000.000/0000-00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Vendedor</Label>
                                <Input 
                                    value={newClienteVendedor} 
                                    onChange={(e) => setNewClienteVendedor(e.target.value)}
                                    placeholder="Nome do vendedor"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rede</Label>
                                <Input 
                                    value={newClienteRede} 
                                    onChange={(e) => setNewClienteRede(e.target.value)}
                                    placeholder="Nome da rede"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>UF</Label>
                                <Input 
                                    value={newClienteUF} 
                                    onChange={(e) => setNewClienteUF(e.target.value.toUpperCase())}
                                    placeholder="UF"
                                    maxLength={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Município</Label>
                                <Input 
                                    value={newClienteMunicipio} 
                                    onChange={(e) => setNewClienteMunicipio(e.target.value)}
                                    placeholder="Nome do município"
                                />
                            </div>
                        </div>
                        <Button onClick={handleAddCliente}>
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Cliente
                        </Button>
                    </div>
                    <div className="rounded-md border max-h-[400px] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>CNPJ/CPF</TableHead>
                                    <TableHead>Vendedor</TableHead>
                                    <TableHead>Rede</TableHead>
                                    <TableHead>UF</TableHead>
                                    <TableHead>Município</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clientes.map((cliente) => (
                                    <TableRow key={cliente.id}>
                                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                                        <TableCell>{cliente.cnpj_cpf}</TableCell>
                                        <TableCell>{cliente.vendedor || '-'}</TableCell>
                                        <TableCell>{cliente.rede || '-'}</TableCell>
                                        <TableCell>{cliente.uf || '-'}</TableCell>
                                        <TableCell>{cliente.municipio || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cadastro de Usuários</CardTitle>
                    <CardDescription>Adicione novos usuários ao sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 mb-6 p-4 border rounded-lg">
                        <h3 className="font-semibold mb-4">Novo Usuário</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Nome *</Label>
                                <Input 
                                    value={newUserName} 
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder="Nome completo"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email *</Label>
                                <Input 
                                    type="email"
                                    value={newUserEmail} 
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    placeholder="email@exemplo.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Senha *</Label>
                                <Input 
                                    type="password"
                                    value={newUserPassword} 
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                    placeholder="Senha"
                                />
                            </div>
                            {/* Removido: Novos usuários sempre são criados como tipo NOVO */}
                            {/* Admin deve atribuir role depois na gestão de usuários */}
                            <div className="space-y-2">
                                <Label>Função</Label>
                                <Input 
                                    value="NOVO (Será atribuído pelo Admin)" 
                                    disabled 
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Novos usuários são criados como tipo NOVO. O administrador deve atribuir a função apropriada após o cadastro.
                                </p>
                            </div>
                            {false && newUserRole === 'VENDEDOR' && (
                                <div className="space-y-2">
                                    <Label>Vendedor *</Label>
                                    <Select value={newUserVendedor} onValueChange={setNewUserVendedor}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o vendedor" />
                                        </SelectTrigger>
                                    <SelectContent>
                                        {vendedores.map(v => (
                                            <SelectItem key={v} value={v}>{v}</SelectItem>
                                        ))}
                                        {vendedores.length === 0 && (
                                            <SelectItem value="" disabled>Nenhum vendedor cadastrado</SelectItem>
                                        )}
                                    </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <Button onClick={handleCreateUser}>
                            <Plus className="mr-2 h-4 w-4" />
                            Criar Usuário
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gestão de Usuários</CardTitle>
                    <CardDescription>Visualize e gerencie os usuários do sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Função</TableHead>
                                    <TableHead>Vendedor</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                              u.role === 'ADMIN' ? 'default' : 
                                              u.role === 'NOVO' ? 'destructive' : 
                                              'secondary'
                                            }>
                                                {u.role || 'NOVO'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{(u as any).vendedor || 'GERAL'}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="hover:bg-primary/10"
                                                onClick={() => {
                                                    setEditingUser(u);
                                                    setEditName(u.name);
                                                    setEditRole(u.role);
                                                    setEditVendedor((u as any).vendedor || '');
                                                    setEditPassword("");
                                                }}
                                            >
                                                <Edit2 className="h-4 w-4 text-primary" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="hover:bg-destructive/10"
                                                onClick={() => setDeletingUser({id: u.id, name: u.name})}
                                                disabled={u.id === user?.id}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modal de Confirmação de Exclusão de Usuário */}
      <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="pt-2">
              Tem certeza que deseja excluir o usuário <span className="font-semibold text-foreground">"{deletingUser?.name}"</span>?
            </DialogDescription>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Esta ação não pode ser desfeita. O usuário perderá acesso ao sistema.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeletingUser(null)}
              className="flex-1 sm:flex-initial"
            >
              Não
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
              className="flex-1 sm:flex-initial"
            >
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Confirmação de Exclusão de Motivo */}
      <Dialog open={!!deletingReason} onOpenChange={(open) => !open && setDeletingReason(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="pt-2">
              Tem certeza que deseja excluir este motivo de devolução?
            </DialogDescription>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Esta ação não pode ser desfeita.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeletingReason(null)}
              className="flex-1 sm:flex-initial"
            >
              Não
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteReasonConfirm}
              className="flex-1 sm:flex-initial"
            >
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Confirmação de Exclusão de Vendedor */}
      <Dialog open={!!deletingVendedor} onOpenChange={(open) => !open && setDeletingVendedor(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="pt-2">
              Tem certeza que deseja remover o vendedor <span className="font-semibold text-foreground">"{deletingVendedor}"</span> da lista?
            </DialogDescription>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Esta ação não pode ser desfeita.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeletingVendedor(null)}
              className="flex-1 sm:flex-initial"
            >
              Não
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteVendedorConfirm}
              className="flex-1 sm:flex-initial"
            >
              Sim, Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Edição de Usuário - Melhorado */}
      <Dialog open={!!editingUser} onOpenChange={(open) => {
        if (!open) {
          setEditingUser(null);
          setEditPassword("");
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" />
              Editar Usuário
            </DialogTitle>
            <DialogDescription className="pt-2">
              Alterar permissões e dados de <span className="font-semibold text-foreground">{editingUser?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nome</Label>
              <Input 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Função (Role)</Label>
              <Select 
                value={editRole || ''} 
                onValueChange={(val: string) => {
                  setEditRole(val as UserRole);
                  if (val !== 'VENDEDOR') {
                    setEditVendedor('');
                  }
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="GESTOR">GESTOR</SelectItem>
                  <SelectItem value="COMERCIAL">COMERCIAL</SelectItem>
                  <SelectItem value="LOGISTICA">LOGISTICA</SelectItem>
                  <SelectItem value="VENDEDOR">VENDEDOR</SelectItem>
                  <SelectItem value="NOVO">NOVO (Sem Acesso)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editRole === 'VENDEDOR' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Vendedor *</Label>
                <Select value={editVendedor} onValueChange={setEditVendedor}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione o vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendedores.map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                    {vendedores.length === 0 && (
                      <SelectItem value="" disabled>Nenhum vendedor cadastrado</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nova Senha (opcional)</Label>
              <Input 
                type="password"
                value={editPassword} 
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Deixe em branco para manter a senha atual"
                minLength={6}
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo de 6 caracteres. Deixe em branco para não alterar.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setEditingUser(null);
                setEditPassword("");
              }}
              className="flex-1 sm:flex-initial"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateUser}
              className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
