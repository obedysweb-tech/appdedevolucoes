import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, UserCog, Edit2 } from "lucide-react";
import { Sector, ReturnReason, UserRole, User } from "@/types";
import { useAuthStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export function SettingsPage() {
  const { user } = useAuthStore();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [reasons, setReasons] = useState<ReturnReason[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newSector, setNewSector] = useState("");
  const [newReason, setNewReason] = useState("");
  const [selectedSectorForReason, setSelectedSectorForReason] = useState("");
  
  // Edit User State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("COMERCIAL");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: sectorsData } = await supabase.from('sectors').select('*').order('name');
    const { data: reasonsData } = await supabase.from('return_reasons').select('*, sector:sectors(name)').order('name');
    const { data: usersData } = await supabase.from('profiles').select('*').order('name');
    
    if (sectorsData) setSectors(sectorsData);
    if (reasonsData) setReasons(reasonsData);
    if (usersData) setUsers(usersData as User[]);
    setLoading(false);
  };

  const handleAddSector = async () => {
    if (!newSector) return;
    const { error } = await supabase.from('sectors').insert({ name: newSector });
    if (error) {
        toast.error("Erro ao adicionar setor");
    } else {
        toast.success("Setor adicionado!");
        setNewSector("");
        fetchData();
    }
  };

  const handleAddReason = async () => {
    if (!newReason || !selectedSectorForReason) return;
    const { error } = await supabase.from('return_reasons').insert({ 
        name: newReason, 
        sector_id: selectedSectorForReason 
    });
    if (error) {
        toast.error("Erro ao adicionar motivo");
    } else {
        toast.success("Motivo adicionado!");
        setNewReason("");
        fetchData();
    }
  };

  const handleDeleteReason = async (id: string) => {
      const { error } = await supabase.from('return_reasons').delete().eq('id', id);
      if (error) toast.error("Erro ao excluir");
      else {
          toast.success("Excluído com sucesso");
          fetchData();
      }
  };

  const handleUpdateUser = async () => {
      if (!editingUser) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({ name: editName, role: editRole })
        .eq('id', editingUser.id);
        
      if (error) {
          toast.error("Erro ao atualizar usuário");
      } else {
          toast.success("Usuário atualizado!");
          setEditingUser(null);
          fetchData();
      }
  };

  if (user?.role !== 'ADMIN') {
      return <div className="p-8 text-center">Acesso restrito a administradores.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>

      <Tabs defaultValue="master-data">
        <TabsList>
            <TabsTrigger value="master-data">Master Data (Setores/Motivos)</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

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
                                    {reasons.map((reason) => (
                                        <TableRow key={reason.id}>
                                            <TableCell>{reason.name}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {reason.sector?.name}
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 text-destructive"
                                                    onClick={() => handleDeleteReason(reason.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="users">
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
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>
                                                {u.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditingUser(u);
                                                            setEditName(u.name);
                                                            setEditRole(u.role);
                                                        }}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Editar Usuário</DialogTitle>
                                                        <DialogDescription>
                                                            Alterar permissões e dados de {u.name}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label>Nome</Label>
                                                            <Input 
                                                                value={editName} 
                                                                onChange={(e) => setEditName(e.target.value)} 
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Função (Role)</Label>
                                                            <Select 
                                                                value={editRole} 
                                                                onValueChange={(val: UserRole) => setEditRole(val)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                                    <SelectItem value="GESTOR">GESTOR</SelectItem>
                                                                    <SelectItem value="COMERCIAL">COMERCIAL</SelectItem>
                                                                    <SelectItem value="LOGISTICA">LOGISTICA</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
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
    </div>
  );
}
