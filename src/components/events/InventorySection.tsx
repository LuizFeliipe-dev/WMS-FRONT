import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clipboard, ClipboardCheck, Search, BarChart3, PackageCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InventoryStepCard from './InventoryStepCard';

const InventorySection = () => {
  const [location, setLocation] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleStartInventory = () => {
    if (!location) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma localização",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Inventário iniciado",
      description: `Inventário para a localização ${location} iniciado com sucesso`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base md:text-lg">
            <Clipboard className="mr-2 h-5 w-5" />
            Inventário de Estoque
          </CardTitle>
          <CardDescription>
            Realize contagens e atualizações de inventário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 mb-6`}>
            <div className="flex-1">
              <Select onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="armazem-a">Armazém A</SelectItem>
                  <SelectItem value="armazem-b">Armazém B</SelectItem>
                  <SelectItem value="corredor-c1">Corredor C1</SelectItem>
                  <SelectItem value="prateleira-d5">Prateleira D5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleStartInventory} className={isMobile ? "w-full" : ""}>
              <Clipboard className="mr-2 h-4 w-4" />
              Iniciar Inventário
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InventoryStepCard 
              title="Preparar Contagem"
              description="Defina o escopo e método de contagem"
              icon={<Clipboard className="h-5 w-5" />}
              isActive={true}
              isCompleted={false}
              percentage={0}
            />
            
            <InventoryStepCard 
              title="Realizar Contagem"
              description="Registre as quantidades de cada item"
              icon={<PackageCheck className="h-5 w-5" />}
              isActive={false}
              isCompleted={false}
              percentage={0}
            />
            
            <InventoryStepCard 
              title="Finalizar Inventário"
              description="Confirme as diferenças e atualize o sistema"
              icon={<ClipboardCheck className="h-5 w-5" />}
              isActive={false}
              isCompleted={false}
              percentage={0}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className={`${isMobile ? 'flex flex-col gap-3 w-full' : 'flex justify-between w-full'}`}>
            <Button variant="ghost" className="gap-1" size={isMobile ? "sm" : "default"}>
              <Search className="h-4 w-4" />
              Pesquisar Inventários
            </Button>
            <Button variant="ghost" className="gap-1" size={isMobile ? "sm" : "default"}>
              <BarChart3 className="h-4 w-4" />
              Relatórios
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Inventários Recentes</CardTitle>
          <CardDescription>Últimos 5 inventários realizados</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="responsive-table">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Localização</th>
                  {!isMobile && <th className="text-left p-3">Itens</th>}
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">INV-{2000 + index}</td>
                    <td className="p-3">{new Date(Date.now() - index * 86400000).toLocaleDateString()}</td>
                    <td className="p-3">{['Armazém A', 'Prateleira B3', 'Corredor C', 'Armazém B', 'Setor D2'][index]}</td>
                    {!isMobile && <td className="p-3">{15 + index * 2} itens</td>}
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        index === 0 
                          ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                          : 'bg-green-50 text-green-600 border border-green-200'
                      }`}>
                        {index === 0 ? 'Em Andamento' : 'Concluído'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className={isMobile ? "w-full" : ""}>Ver Todos os Inventários</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InventorySection;
