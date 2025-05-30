import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Warehouse, 
  Plus, 
  Search, 
  Pencil, 
  MapPin,
  Check,
  X as XIcon,
  Power,
  Edit
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const warehouseFormSchema = z.object({
  code: z.string().length(3, { message: 'Código deve ter exatamente 3 dígitos' })
    .regex(/^\d{3}$/, { message: 'Código deve conter apenas números' }),
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' }),
  city: z.string().min(2, { message: 'Cidade deve ter pelo menos 2 caracteres' }),
  state: z.string().length(2, { message: 'Estado deve ter 2 caracteres' }),
  manager: z.string().min(1, { message: 'Selecione um gerente' }),
  isActive: z.boolean().default(true),
});

type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  manager: string;
  totalArea: number;
  isActive: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Carlos Gomes', email: 'carlos@exemplo.com' },
  { id: '2', name: 'Ana Souza', email: 'ana@exemplo.com' },
  { id: '3', name: 'João Ferreira', email: 'joao@exemplo.com' },
  { id: '4', name: 'Maria Silva', email: 'maria@exemplo.com' },
  { id: '5', name: 'Pedro Santos', email: 'pedro@exemplo.com' },
];

const initialWarehouses: Warehouse[] = [
  {
    id: '1',
    code: '001',
    name: 'Armazém Principal',
    address: 'Av. Industrial, 1000',
    city: 'São Paulo',
    state: 'SP',
    manager: '1',
    totalArea: 5000,
    isActive: true,
  },
  {
    id: '2',
    code: '002',
    name: 'Armazém Regional Sul',
    address: 'Rua das Indústrias, 500',
    city: 'Porto Alegre',
    state: 'RS',
    manager: '2',
    totalArea: 3000,
    isActive: true,
  },
  {
    id: '3',
    code: '003',
    name: 'Armazém Regional Nordeste',
    address: 'Rodovia BR-101, km 30',
    city: 'Recife',
    state: 'PE',
    manager: '3',
    totalArea: 4000,
    isActive: false,
  },
];

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [warehouseToToggle, setWarehouseToToggle] = useState<Warehouse | null>(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
      city: '',
      state: '',
      manager: '',
      isActive: true,
    },
  });

  const onSubmit = (data: WarehouseFormValues) => {
    if (editingWarehouse) {
      setWarehouses(warehouses.map(warehouse => {
        if (warehouse.id === editingWarehouse.id) {
          return {
            ...warehouse,
            code: data.code,
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            manager: data.manager,
            isActive: data.isActive
          };
        }
        return warehouse;
      }));

      toast({
        title: "Armazém atualizado",
        description: "As informações do armazém foram atualizadas com sucesso",
      });
    } else {
      const newWarehouse: Warehouse = {
        id: (warehouses.length + 1).toString(),
        code: data.code,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        manager: data.manager,
        totalArea: 0,
        isActive: data.isActive,
      };

      setWarehouses([...warehouses, newWarehouse]);

      toast({
        title: "Armazém adicionado",
        description: "Novo armazém foi adicionado com sucesso",
      });
    }

    setOpenDialog(false);
    form.reset();
  };

  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    form.reset({
      code: '',
      name: '',
      address: '',
      city: '',
      state: '',
      manager: '',
      isActive: true,
    });
    setOpenDialog(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    form.reset({
      code: warehouse.code,
      name: warehouse.name,
      address: warehouse.address,
      city: warehouse.city,
      state: warehouse.state,
      manager: warehouse.manager,
      isActive: warehouse.isActive,
    });
    setOpenDialog(true);
  };

  const handleToggleWarehouseStatus = (warehouse: Warehouse) => {
    setWarehouseToToggle(warehouse);
    setOpenStatusDialog(true);
  };

  const confirmToggleStatus = () => {
    if (warehouseToToggle) {
      setWarehouses(warehouses.map(wh => {
        if (wh.id === warehouseToToggle.id) {
          const newStatus = !wh.isActive;
          return { ...wh, isActive: newStatus };
        }
        return wh;
      }));

      toast({
        title: warehouseToToggle.isActive ? "Armazém inativado" : "Armazém ativado",
        description: `O armazém foi ${warehouseToToggle.isActive ? "inativado" : "ativado"} com sucesso`,
      });
    }
    setOpenStatusDialog(false);
    setWarehouseToToggle(null);
  };

  const getManagerName = (managerId: string) => {
    const manager = mockUsers.find(user => user.id === managerId);
    return manager ? manager.name : 'Não definido';
  };

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearchTerm = 
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code.includes(searchTerm) ||
      warehouse.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getManagerName(warehouse.manager).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && warehouse.isActive) ||
      (statusFilter === "inactive" && !warehouse.isActive);
    
    return matchesSearchTerm && matchesStatus;
  });

  return (
    <AuthRequired>
      <div className="min-h-screen flex">
        <Sidebar />
        
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold flex items-center">
                  <Warehouse className="mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
                  Cadastro de Armazéns
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie os armazéns do sistema
                </p>
              </div>
              
              <Button onClick={handleAddWarehouse} className={isMobile ? "w-full mt-4 md:mt-0" : ""}>
                <Plus className="mr-2 h-5 w-5" />
                Novo Armazém
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 md:p-6 border-b">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Buscar armazéns..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      {!isMobile && <TableHead>Localização</TableHead>}
                      {!isMobile && <TableHead>Gerente</TableHead>}
                      {!isMobile && <TableHead>Área Total (m³)</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWarehouses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 4 : 7} className="text-center py-6 text-muted-foreground">
                          Nenhum armazém encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWarehouses.map((warehouse) => (
                        <TableRow key={warehouse.id} className={!warehouse.isActive ? "bg-gray-50" : ""}>
                          <TableCell className="font-medium">{warehouse.code}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{warehouse.name}</TableCell>
                          {!isMobile && <TableCell>{`${warehouse.city}, ${warehouse.state}`}</TableCell>}
                          {!isMobile && <TableCell>{getManagerName(warehouse.manager)}</TableCell>}
                          {!isMobile && <TableCell>{warehouse.totalArea.toLocaleString()} m³</TableCell>}
                          <TableCell>
                            <Badge 
                              variant={warehouse.isActive ? "default" : "outline"}
                              className={warehouse.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                            >
                              {warehouse.isActive ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex space-x-2 justify-end">
                              <Button 
                                variant="icon" 
                                onClick={() => handleEditWarehouse(warehouse)}
                                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="icon"
                                onClick={() => handleToggleWarehouseStatus(warehouse)}
                                className="text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                                title={warehouse.isActive ? "Inativar" : "Ativar"}
                              >
                                <Power className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500 w-full md:w-auto text-center md:text-left">
                  Exibindo {filteredWarehouses.length} de {warehouses.length} armazéns
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Anterior</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">Próxima</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </ResponsiveContainer>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px] w-[calc(100%-2rem)] overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {editingWarehouse ? 'Editar Armazém' : 'Adicionar Novo Armazém'}
            </DialogTitle>
            <DialogDescription>
              {editingWarehouse 
                ? 'Edite as informações do armazém abaixo.' 
                : 'Preencha os campos abaixo para adicionar um novo armazém.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código (3 dígitos)</FormLabel>
                      <FormControl>
                        <Input placeholder="001" maxLength={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Armazém</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do armazém" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado (UF)</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gerente Responsável</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um gerente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Status do Armazém</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value ? "Armazém ativo no sistema" : "Armazém inativo no sistema"}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpenDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingWarehouse ? 'Salvar Alterações' : 'Cadastrar Armazém'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {warehouseToToggle?.isActive ? 'Inativar Armazém' : 'Ativar Armazém'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {warehouseToToggle?.isActive
                ? `Tem certeza que deseja inativar o armazém "${warehouseToToggle?.name}"?`
                : `Tem certeza que deseja ativar o armazém "${warehouseToToggle?.name}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              {warehouseToToggle?.isActive ? 'Inativar' : 'Ativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthRequired>
  );
};

export default Warehouses;
