import { useState, useEffect } from 'react';
import AuthRequired from '../components/AuthRequired';
import AppLayout from '@/components/AppLayout';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Truck, 
  Plus, 
  Search, 
  Pencil, 
  ToggleLeft,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Supplier, supplierService } from '@/services/suppliers';

const supplierFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  active: z.boolean().default(true),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      active: true,
    },
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      toast({
        title: "Erro ao carregar fornecedores",
        description: "Não foi possível obter a lista de fornecedores",
        variant: "destructive"
      });
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      // Ensure data matches the required type structure
      const supplierData: Pick<Supplier, 'name' | 'active'> = {
        name: data.name,
        active: data.active
      };

      if (editingSupplier) {
        const updated = await supplierService.update(editingSupplier.id, supplierData);
        setSuppliers(suppliers.map(supplier => {
          if (supplier.id === editingSupplier.id) {
            return updated;
          }
          return supplier;
        }));

        toast({
          title: "Fornecedor atualizado",
          description: "As informações do fornecedor foram atualizadas com sucesso",
        });
      } else {
        const newSupplier = await supplierService.create(supplierData);
        setSuppliers([...suppliers, newSupplier]);

        toast({
          title: "Fornecedor adicionado",
          description: "Novo fornecedor foi adicionado com sucesso",
        });
      }

      setOpenDialog(false);
      form.reset();
      setEditingSupplier(null);
    } catch (error) {
      console.error('Failed to save supplier:', error);
      toast({
        title: "Erro ao salvar fornecedor",
        description: "Não foi possível salvar as informações do fornecedor",
        variant: "destructive"
      });
    }
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    form.reset({
      name: '',
      active: true,
    });
    setOpenDialog(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.reset({
      name: supplier.name,
      active: supplier.active,
    });
    setOpenDialog(true);
  };

  const handleToggleSupplierStatus = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (selectedSupplier) {
      try {
        const updatedSupplier = await supplierService.update(selectedSupplier.id, {
          active: !selectedSupplier.active
        });

        setSuppliers(suppliers.map(supplier => {
          if (supplier.id === selectedSupplier.id) {
            return updatedSupplier;
          }
          return supplier;
        }));

        toast({
          title: selectedSupplier.active ? "Fornecedor inativado" : "Fornecedor ativado",
          description: `O fornecedor ${selectedSupplier.name} foi ${selectedSupplier.active ? "inativado" : "ativado"} com sucesso.`,
        });
      } catch (error) {
        console.error('Failed to toggle supplier status:', error);
        toast({
          title: "Erro ao alterar status",
          description: "Não foi possível alterar o status do fornecedor",
          variant: "destructive"
        });
      } finally {
        setStatusDialogOpen(false);
        setSelectedSupplier(null);
      }
    }
  };

  // Apply filters
  const filteredSuppliers = suppliers.filter(supplier => {
    // Text search
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = supplier.active;
    } else if (statusFilter === 'inactive') {
      matchesStatus = !supplier.active;
    }
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AuthRequired>
      <AppLayout>
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold flex items-center">
                  <Truck className="mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
                  Cadastro de Fornecedores
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie os fornecedores do sistema
                </p>
              </div>
              
              <Button onClick={handleAddSupplier} className={isMobile ? "w-full mt-4 md:mt-0" : ""}>
                <Plus className="mr-2 h-5 w-5" />
                Novo Fornecedor
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 md:p-6 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Buscar fornecedores..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="active">Ativos</SelectItem>
                        <SelectItem value="inactive">Inativos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      {!isMobile && <TableHead>Criado em</TableHead>}
                      {!isMobile && <TableHead>Atualizado em</TableHead>}
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 5} className="text-center py-6">
                          <div className="flex justify-center items-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <span>Carregando fornecedores...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredSuppliers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 5} className="text-center py-6 text-muted-foreground">
                          {searchTerm || statusFilter !== 'all' ? 
                            "Nenhum fornecedor encontrado com os filtros aplicados." : 
                            "Nenhum fornecedor cadastrado."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSuppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              supplier.active 
                                ? 'bg-green-50 text-green-600 border border-green-200' 
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                            }`}>
                              {supplier.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </TableCell>
                          {!isMobile && <TableCell className="text-sm text-gray-500">{formatDate(supplier.createdAt)}</TableCell>}
                          {!isMobile && <TableCell className="text-sm text-gray-500">{formatDate(supplier.updatedAt)}</TableCell>}
                          <TableCell className="text-right">
                            <div className="flex space-x-2 justify-end">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditSupplier(supplier)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleToggleSupplierStatus(supplier)}
                              >
                                <ToggleLeft className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        </ResponsiveContainer>
      </AppLayout>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}
            </DialogTitle>
            <DialogDescription>
              {editingSupplier 
                ? 'Edite as informações do fornecedor abaixo.' 
                : 'Preencha os campos abaixo para adicionar um novo fornecedor.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Fornecedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do fornecedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Status Ativo
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Fornecedor ativo pode ser usado nas operações
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
                  {editingSupplier ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSupplier?.active ? "Inativar" : "Ativar"} Fornecedor
            </DialogTitle>
            <DialogDescription>
              {selectedSupplier?.active
                ? "Você tem certeza que deseja inativar este fornecedor? Fornecedores inativos não aparecem nas operações padrão."
                : "Você tem certeza que deseja ativar este fornecedor? Fornecedores ativos aparecem em todas as operações."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant={selectedSupplier?.active ? "destructive" : "default"}
              onClick={confirmToggleStatus}
            >
              {selectedSupplier?.active ? "Sim, inativar" : "Sim, ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default Suppliers;
