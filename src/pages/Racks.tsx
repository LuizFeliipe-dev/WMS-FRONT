
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Rack } from '@/types/warehouse';
import { rackService } from '@/services/racks';

// Mock data para tipos de prateleiras e zonas
interface ShelfType {
  id: string;
  name: string;
  height: number;
  width: number;
  depth: number;
  maxWeight: number;
  isStackable: boolean;
}

interface Zone {
  id: string;
  name: string;
}

const mockShelfTypes: ShelfType[] = [
  { id: '1', name: 'Tipo Standard', height: 200, width: 100, depth: 60, maxWeight: 500, isStackable: true },
  { id: '2', name: 'Tipo Heavy Duty', height: 250, width: 120, depth: 80, maxWeight: 1000, isStackable: false },
  { id: '3', name: 'Tipo Compacto', height: 150, width: 80, depth: 40, maxWeight: 300, isStackable: true },
];

const mockZones: Zone[] = [
  { id: '1', name: 'Zona A - Recebimento' },
  { id: '2', name: 'Zona B - Picking' },
  { id: '3', name: 'Zona C - Expedição' },
];

const rackFormSchema = z.object({
  code: z.string().min(1, { message: 'Código é obrigatório' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  description: z.string().optional(),
  shelfTypeId: z.string().min(1, { message: 'Selecione um tipo de prateleira' }),
  zoneId: z.string().min(1, { message: 'Selecione uma zona' }),
  verticalShelves: z.coerce.number().int().min(1, { message: 'Deve ter pelo menos 1 prateleira para cima' }),
  horizontalShelves: z.coerce.number().int().min(1, { message: 'Deve ter pelo menos 1 prateleira para o lado' }),
});

type RackFormValues = z.infer<typeof rackFormSchema>;

const RacksPage = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRack, setEditingRack] = useState<Rack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<RackFormValues>({
    resolver: zodResolver(rackFormSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      shelfTypeId: '',
      zoneId: '',
      verticalShelves: 1,
      horizontalShelves: 1,
    }
  });

  useEffect(() => {
    const fetchRacks = async () => {
      try {
        setIsLoading(true);
        const data = await rackService.getAll();
        setRacks(data);
      } catch (error) {
        console.error('Failed to fetch racks:', error);
        toast({
          title: "Erro ao buscar prateleiras",
          description: "Não foi possível carregar a lista de prateleiras",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRacks();
  }, [toast]);

  const filteredRacks = racks.filter(rack => 
    rack.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rack.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: RackFormValues) => {
    try {
      if (editingRack) {
        const updatedRack = await rackService.update(editingRack.id.toString(), {
          code: data.code,
          name: data.name,
          description: data.description,
          corridorId: editingRack.corridorId,
          // Campos adicionais para armazenar na estrutura
          shelfTypeId: data.shelfTypeId,
          zoneId: data.zoneId,
          verticalShelves: data.verticalShelves,
          horizontalShelves: data.horizontalShelves,
        });

        setRacks(racks.map(rack => rack.id === editingRack.id ? updatedRack : rack));

        toast({
          title: 'Prateleira atualizada',
          description: 'A prateleira foi atualizada com sucesso',
        });
      } else {
        const newRack = await rackService.create({
          code: data.code,
          name: data.name,
          description: data.description,
          corridorId: '1', // Valor padrão para manter compatibilidade com a estrutura existente
          // Campos adicionais para armazenar na estrutura
          shelfTypeId: data.shelfTypeId,
          zoneId: data.zoneId,
          verticalShelves: data.verticalShelves,
          horizontalShelves: data.horizontalShelves,
        });

        setRacks([...racks, newRack]);

        toast({
          title: 'Prateleira adicionada',
          description: 'A prateleira foi adicionada com sucesso',
        });
      }

      setOpenDialog(false);
      form.reset();
    } catch (error) {
      console.error('Failed to save rack:', error);
      toast({
        title: "Erro ao salvar prateleira",
        description: "Não foi possível salvar as informações da prateleira",
        variant: "destructive"
      });
    }
  };

  const handleAddRack = () => {
    setEditingRack(null);
    form.reset({
      code: '',
      name: '',
      description: '',
      shelfTypeId: '',
      zoneId: '',
      verticalShelves: 1,
      horizontalShelves: 1,
    });
    setOpenDialog(true);
  };

  const handleEditRack = (rack: Rack) => {
    setEditingRack(rack);
    form.reset({
      code: rack.code,
      name: rack.name,
      description: rack.description || '',
      shelfTypeId: rack.shelfTypeId || '',
      zoneId: rack.zoneId || '',
      verticalShelves: rack.verticalShelves || 1,
      horizontalShelves: rack.horizontalShelves || 1,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // API doesn't have a delete endpoint specified, so just update local state
      setRacks(racks.filter(rack => rack.id !== id));
      toast({
        title: 'Prateleira excluída',
        description: 'A prateleira foi removida com sucesso',
      });
    } catch (error) {
      console.error('Failed to delete rack:', error);
      toast({
        title: "Erro ao excluir prateleira",
        description: "Não foi possível remover a prateleira",
        variant: "destructive"
      });
    }
  };

  // Função para obter o nome do tipo de prateleira
  const getShelfTypeName = (typeId: string) => {
    const shelfType = mockShelfTypes.find(type => type.id === typeId);
    return shelfType ? shelfType.name : 'Não definido';
  };

  // Função para obter o nome da zona
  const getZoneName = (zoneId: string) => {
    const zone = mockZones.find(zone => zone.id === zoneId);
    return zone ? zone.name : 'Não definido';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Racks/Prateleiras</h1>
            <Button onClick={handleAddRack}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Prateleira
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Lista de Prateleiras</CardTitle>
              <div className="flex items-center mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por código ou nome..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      {!isMobile && <TableHead>Descrição</TableHead>}
                      {!isMobile && <TableHead>Tipo</TableHead>}
                      <TableHead>Zona</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 4 : 6} className="text-center py-8">
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Carregando prateleiras...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredRacks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 4 : 6} className="text-center py-6 text-muted-foreground">
                          Nenhuma prateleira encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRacks.map((rack) => (
                        <TableRow key={rack.id}>
                          <TableCell className="font-medium">{rack.code}</TableCell>
                          <TableCell>{rack.name}</TableCell>
                          {!isMobile && <TableCell>{rack.description}</TableCell>}
                          {!isMobile && <TableCell>{rack.shelfTypeId ? getShelfTypeName(rack.shelfTypeId) : '-'}</TableCell>}
                          <TableCell>{rack.zoneId ? getZoneName(rack.zoneId) : '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditRack(rack)}
                              >
                                <Edit className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(rack.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editingRack ? 'Editar Prateleira' : 'Adicionar Nova Prateleira'}
              </DialogTitle>
              <DialogDescription>
                {editingRack 
                  ? 'Edite as informações da prateleira abaixo.' 
                  : 'Preencha os campos abaixo para adicionar uma nova prateleira.'}
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
                          <Input placeholder="R01" {...field} />
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
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da prateleira" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shelfTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Prateleira</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockShelfTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
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
                    name="zoneId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zona</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a zona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockZones.map((zone) => (
                              <SelectItem key={zone.id} value={zone.id}>
                                {zone.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="verticalShelves"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prateleiras Verticais</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Número de prateleiras para cima
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="horizontalShelves"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prateleiras Horizontais</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Número de prateleiras para o lado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">
                    {editingRack ? 'Salvar Alterações' : 'Adicionar Prateleira'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </ResponsiveContainer>
    </div>
  );
};

export default RacksPage;
