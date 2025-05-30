import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Target, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { MultiSelect } from './components/MultiSelect';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRacks } from '@/hooks/useRacks';

const zoneFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  racks: z.array(z.string()).min(1, { message: 'Selecione pelo menos um rack' }),
});

type ZoneFormValues = z.infer<typeof zoneFormSchema>;

interface Zone {
  id: number;
  name: string;
  racks: string[];
}

// Mock data
const initialZones: Zone[] = [
  {
    id: 1,
    name: 'Zona A - Recebimento',
    racks: ['R01', 'R02'],
  },
  {
    id: 2,
    name: 'Zona B - Expedição',
    racks: ['R03', 'R04', 'R05'],
  },
  {
    id: 3,
    name: 'Zona C - Estoque',
    racks: ['R01', 'R03'],
  },
];

const Zones = () => {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { racks } = useRacks();

  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneFormSchema),
    defaultValues: {
      name: '',
      racks: [],
    }
  });

  const handleAddZone = () => {
    setEditingZone(null);
    form.reset({
      name: '',
      racks: [],
    });
    setOpenDialog(true);
  };

  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone);
    form.reset({
      name: zone.name,
      racks: zone.racks,
    });
    setOpenDialog(true);
  };

  const handleDeleteZone = (id: number) => {
    setZones(zones.filter(z => z.id !== id));
    toast({
      title: "Zona excluída",
      description: "A zona foi removida com sucesso",
    });
  };

  const onSubmit = (data: ZoneFormValues) => {
    if (editingZone) {
      setZones(zones.map(z => {
        if (z.id === editingZone.id) {
          return {
            ...z,
            name: data.name,
            racks: data.racks,
          };
        }
        return z;
      }));
      toast({
        title: "Zona atualizada",
        description: "As informações da zona foram atualizadas com sucesso",
      });
    } else {
      const newZone: Zone = {
        id: Math.max(0, ...zones.map(z => z.id)) + 1,
        name: data.name,
        racks: data.racks,
      };
      setZones([...zones, newZone]);
      toast({
        title: "Zona adicionada",
        description: "Nova zona foi adicionada com sucesso",
      });
    }
    setOpenDialog(false);
  };

  const filteredZones = zones.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rackOptions = racks.map(rack => ({
    value: rack.code,
    label: `${rack.code} - ${rack.name}`,
  }));

  return (
    <AuthRequired>
      <div className="min-h-screen flex flex-col">
        <Sidebar />
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Target className="mr-3 h-6 w-6 text-primary" />
                  Zonas
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie as zonas do armazém
                </p>
              </div>
              
              <Button onClick={handleAddZone}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Zona
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 border-b">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Racks</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredZones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          Nenhuma zona encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredZones.map((zone) => (
                        <TableRow key={zone.id}>
                          <TableCell className="font-medium">{zone.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {zone.racks.map(rackCode => (
                                <span 
                                  key={rackCode} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {rackCode}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditZone(zone)}
                              >
                                <Edit className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteZone(zone.id)}
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
            </div>
          </motion.div>
        </ResponsiveContainer>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingZone ? 'Editar Zona' : 'Adicionar Nova Zona'}</DialogTitle>
            <DialogDescription>
              {editingZone 
                ? 'Edite as informações da zona abaixo.' 
                : 'Preencha os campos abaixo para adicionar uma nova zona.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da zona" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="racks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Racks</FormLabel>
                    <FormControl>
                      <MultiSelect
                        selected={field.value}
                        options={rackOptions}
                        onChange={field.onChange}
                        placeholder="Selecione os racks..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  {editingZone ? 'Salvar Alterações' : 'Cadastrar Zona'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default Zones;
