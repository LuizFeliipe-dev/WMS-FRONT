
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Box, TruckIcon, FileCheck, Search, ArrowLeftRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import DepartureStepCard from './DepartureStepCard';
import TransactionModal from './TransactionModal';

const TransactionSection = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleStartTransaction = () => {
    if (!orderNumber) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de ordem válido",
        variant: "destructive"
      });
      return;
    }
    
    // Abrir o modal em vez de mostrar o toast
    setShowTransactionModal(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base md:text-lg">
            <ArrowLeftRight className="mr-2 h-5 w-5" />
            Transação de Produtos
          </CardTitle>
          <CardDescription>
            Registre a movimentação de itens entre prateleiras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Número da ordem de transação"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>
            <Button onClick={handleStartTransaction} className={isMobile ? "w-full" : ""}>
              <Box className="mr-2 h-4 w-4" />
              Iniciar Transação
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DepartureStepCard 
              title="Localizar Item"
              description="Localize o item para movimentação"
              icon={<Box className="h-5 w-5" />}
              isActive={true}
              isCompleted={false}
            />
            
            <DepartureStepCard 
              title="Transferir"
              description="Mova o item para a nova localização"
              icon={<TruckIcon className="h-5 w-5" />}
              isActive={false}
              isCompleted={false}
            />
            
            <DepartureStepCard 
              title="Confirmar Transação"
              description="Verifique e confirme a nova posição"
              icon={<FileCheck className="h-5 w-5" />}
              isActive={false}
              isCompleted={false}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex flex-col md:flex-row justify-between w-full gap-3 md:gap-0">
            <Button variant="ghost" className="gap-1" size={isMobile ? "sm" : "default"}>
              <Search className="h-4 w-4" />
              Pesquisar Transações
            </Button>
            <Button variant="outline" disabled size={isMobile ? "sm" : "default"}>
              Transação em Andamento
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Transações Recentes</CardTitle>
          <CardDescription>Últimas 5 movimentações registradas no sistema</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-3">Ordem</th>
                  <th className="text-left p-3">Data</th>
                  {!isMobile && <th className="text-left p-3">Origem</th>}
                  {!isMobile && <th className="text-left p-3">Destino</th>}
                  <th className="text-left p-3">Itens</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">#{20000 + index}</td>
                    <td className="p-3">{new Date(Date.now() - index * 86400000).toLocaleDateString()}</td>
                    {!isMobile && <td className="p-3">{`A-${index + 1}-${index * 2}`}</td>}
                    {!isMobile && <td className="p-3">{`B-${index + 2}-${index * 3}`}</td>}
                    <td className="p-3">{3 + index} itens</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        index === 0 
                          ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                          : 'bg-green-50 text-green-600 border border-green-200'
                      }`}>
                        {index === 0 ? 'Em Progresso' : 'Concluído'}
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
          <Button variant="outline" className={isMobile ? "w-full" : ""}>Ver Todas as Transações</Button>
        </CardFooter>
      </Card>

      {/* Modal de Transação */}
      <TransactionModal 
        isOpen={showTransactionModal} 
        onClose={() => setShowTransactionModal(false)} 
        orderNumber={orderNumber} 
      />
    </div>
  );
};

export default TransactionSection;
