
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocations } from '@/hooks/useLocations';
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
import { useToast } from '@/hooks/use-toast';

const LocationsPage = () => {
  const { 
    filteredLocations, 
    searchTerm, 
    setSearchTerm,
    deleteLocation 
  } = useLocations();
  
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleDelete = (id: number) => {
    deleteLocation(id);
    toast({
      title: 'Nível excluído',
      description: 'O nível foi removido com sucesso',
    });
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
            <h1 className="text-2xl font-bold">Locações</h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Nível
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Lista de Níveis</CardTitle>
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
                      <TableHead>Prateleira</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 4 : 5} className="text-center py-6 text-muted-foreground">
                          Nenhum nível encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLocations.map((location) => (
                        <TableRow key={location.id}>
                          <TableCell className="font-medium">{location.code}</TableCell>
                          <TableCell>{location.name}</TableCell>
                          {!isMobile && <TableCell>{location.description}</TableCell>}
                          <TableCell>{location.rackId}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(location.id)}
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
      </ResponsiveContainer>
    </div>
  );
};

export default LocationsPage;
