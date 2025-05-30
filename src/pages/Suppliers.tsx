
import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
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
  Phone,
  Mail,
  MapPin,
  Building,
  UserPlus
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
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';

const supplierFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  code: z.string().min(3, { message: 'Código deve ter pelo menos 3 caracteres' }),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' }),
  city: z.string().min(2, { message: 'Cidade deve ter pelo menos 2 caracteres' }),
  state: z.string().min(2, { message: 'Estado deve ter pelo menos 2 caracteres' }),
  active: z.boolean().default(true),
  contacts: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(2, { message: 'Nome do contato deve ter pelo menos 2 caracteres' }),
    role: z.string().optional(),
    email: z.string().email({ message: 'Email inválido' }),
    phone: z.string().min(8, { message: 'Telefone deve ter pelo menos 8 caracteres' }),
  })).min(1, { message: 'Adicione pelo menos um contato' }),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

interface SupplierContact {
  id: string;
  name: string;
  role?: string;
  email: string;
  phone: string;
}

interface Supplier {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  active: boolean;
  contacts: SupplierContact[];
}

const initialSuppliers: Supplier[] = [
  {
    id: '1',
    code: 'SUP001',
    name: 'Dell Computadores',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    active: true,
    contacts: [
      {
        id: '1-1',
        name: 'Carlos Silva',
        role: 'Gerente de Vendas',
        email: 'carlos.silva@dell.com',
        phone: '(11) 3333-4444',
      }
    ],
  },
  {
    id: '2',
    code: 'SUP002',
    name: 'LG Brasil',
    address: 'Rua Augusta, 500',
    city: 'São Paulo',
    state: 'SP',
    active: true,
    contacts: [
      {
        id: '2-1',
        name: 'Maria Oliveira',
        role: 'Diretora Comercial',
        email: 'maria.oliveira@lg.com',
        phone: '(11) 2222-3333',
      }
    ],
  },
  {
    id: '3',
    code: 'SUP003',
    name: 'MobiliaCorp',
    address: 'Av. Rio Branco, 100',
    city: 'Rio de Janeiro',
    state: 'RJ',
    active: false,
    contacts: [
      {
        id: '3-1',
        name: 'João Santos',
        role: 'Representante',
        email: 'joao.santos@mobiliacorp.com',
        phone: '(21) 4444-5555',
      }
    ],
  },
  {
    id: '4',
    code: 'SUP004',
    name: 'Logitech Brasil',
    address: 'Av. Faria Lima, 200',
    city: 'São Paulo',
    state: 'SP',
    active: true,
    contacts: [
      {
        id: '4-1',
        name: 'Ana Pereira',
        role: 'Gerente de Contas',
        email: 'ana.pereira@logitech.com',
        phone: '(11) 5555-6666',
      }
    ],
  },
  {
    id: '5',
    code: 'SUP005',
    name: 'Café Especial SA',
    address: 'Rua dos Cafezais, 150',
    city: 'Belo Horizonte',
    state: 'MG',
    active: true,
    contacts: [
      {
        id: '5-1',
        name: 'Roberto Almeida',
        role: 'Diretor',
        email: 'roberto.almeida@cafeespecial.com',
        phone: '(31) 6666-7777',
      }
    ],
  },
];

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      active: true,
      contacts: [
        {
          name: '',
          role: '',
          email: '',
          phone: '',
        }
      ],
    },
  });

  const onSubmit = (data: SupplierFormValues) => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(supplier => {
        if (supplier.id === editingSupplier.id) {
          return {
            ...supplier,
            name: data.name,
            code: data.code,
            address: data.address,
            city: data.city,
            state: data.state,
            active: data.active,
            contacts: data.contacts.map((contact, index) => ({
              id: contact.id || `${supplier.id}-${index+1}`,
              name: contact.name,
              role: contact.role || '',
              email: contact.email,
              phone: contact.phone,
            })),
          };
        }
        return supplier;
      }));

      toast({
        title: "Fornecedor atualizado",
        description: "As informações do fornecedor foram atualizadas com sucesso",
      });
    } else {
      const newSupplier: Supplier = {
        id: (suppliers.length + 1).toString(),
        code: data.code,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        active: data.active,
        contacts: data.contacts.map((contact, index) => ({
          id: `${suppliers.length + 1}-${index+1}`,
          name: contact.name,
          role: contact.role || '',
          email: contact.email,
          phone: contact.phone,
        })),
      };

      setSuppliers([...suppliers, newSupplier]);

      toast({
        title: "Fornecedor adicionado",
        description: "Novo fornecedor foi adicionado com sucesso",
      });
    }

    setOpenDialog(false);
    form.reset();
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    form.reset({
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      active: true,
      contacts: [
        {
          name: '',
          role: '',
          email: '',
          phone: '',
        }
      ],
    });
    setOpenDialog(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.reset({
      name: supplier.name,
      code: supplier.code,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state,
      active: supplier.active,
      contacts: supplier.contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        role: contact.role || '',
        email: contact.email,
        phone: contact.phone,
      })),
    });
    setOpenDialog(true);
  };

  const handleToggleSupplierStatus = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (selectedSupplier) {
      setSuppliers(suppliers.map(supplier => {
        if (supplier.id === selectedSupplier.id) {
          return {
            ...supplier,
            active: !supplier.active,
          };
        }
        return supplier;
      }));

      toast({
        title: selectedSupplier.active ? "Fornecedor inativado" : "Fornecedor ativado",
        description: `O fornecedor ${selectedSupplier.name} foi ${selectedSupplier.active ? "inativado" : "ativado"} com sucesso.`,
      });
      setStatusDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  const addContactField = () => {
    const contacts = form.getValues('contacts');
    form.setValue('contacts', [
      ...contacts,
      { name: '', role: '', email: '', phone: '' }
    ]);
  };

  const removeContactField = (index: number) => {
    const contacts = form.getValues('contacts');
    if (contacts.length > 1) {
      form.setValue('contacts', contacts.filter((_, i) => i !== index));
    }
  };

  // Apply filters
  const filteredSuppliers = suppliers.filter(supplier => {
    // Text search
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          supplier.contacts.some(contact => 
                            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
                          );
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = supplier.active;
    } else if (statusFilter === 'inactive') {
      matchesStatus = !supplier.active;
    }
    
    return matchesSearch && matchesStatus;
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
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      {!isMobile && <TableHead>Contato</TableHead>}
                      {!isMobile && <TableHead>Email</TableHead>}
                      {!isMobile && <TableHead>Telefone</TableHead>}
                      {!isMobile && <TableHead>Localização</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 4 : 8} className="text-center py-6 text-muted-foreground">
                          Nenhum fornecedor encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSuppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.code}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{supplier.name}</TableCell>
                          {!isMobile && <TableCell>
                            {supplier.contacts.length > 0 ? supplier.contacts[0].name : '-'}
                            {supplier.contacts.length > 1 && 
                              <span className="text-xs ml-1 text-muted-foreground">(+{supplier.contacts.length - 1})</span>
                            }
                          </TableCell>}
                          {!isMobile && <TableCell className="max-w-[150px] truncate">
                            {supplier.contacts.length > 0 ? supplier.contacts[0].email : '-'}
                          </TableCell>}
                          {!isMobile && <TableCell>{supplier.contacts.length > 0 ? supplier.contacts[0].phone : '-'}</TableCell>}
                          {!isMobile && <TableCell>{`${supplier.city}, ${supplier.state}`}</TableCell>}
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              supplier.active 
                                ? 'bg-green-50 text-green-600 border border-green-200' 
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                            }`}>
                              {supplier.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </TableCell>
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
              
              <div className="p-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500 w-full md:w-auto text-center md:text-left">
                  Exibindo {filteredSuppliers.length} de {suppliers.length} fornecedores
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
        <DialogContent className="sm:max-w-[650px] w-[calc(100%-2rem)] overflow-y-auto max-h-[80vh]">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="SUP001" {...field} />
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
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do fornecedor" {...field} />
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
                      <Input placeholder="Rua, número, complemento" {...field} />
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
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Contatos</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addContactField}
                    className="gap-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    Adicionar Contato
                  </Button>
                </div>
                
                {form.watch('contacts').map((_, index) => (
                  <div key={index} className="border p-4 rounded-md mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Contato {index + 1}</h4>
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeContactField(index)}
                          className="h-7 text-destructive hover:text-destructive"
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`contacts.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do contato" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`contacts.${index}.role`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo</FormLabel>
                            <FormControl>
                              <Input placeholder="Cargo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <FormField
                        control={form.control}
                        name={`contacts.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`contacts.${index}.phone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 0000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
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
