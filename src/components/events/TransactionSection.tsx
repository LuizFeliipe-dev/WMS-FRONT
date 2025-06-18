
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Box, TruckIcon, FileCheck, Search, ArrowLeftRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTransactions } from '@/hooks/useTransactions';
import DepartureStepCard from './DepartureStepCard';
import TransactionModal from './TransactionModal';

const TransactionSection = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { transactions, isLoading } = useTransactions(currentPage, 5);
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
    
    setShowTransactionModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'Em Progresso';
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
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
          <CardDescription>Últimas movimentações registradas no sistema</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Carregando transações...</div>
            </div>
          ) : (
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
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="p-3">{transaction.orderNumber}</td>
                      <td className="p-3">{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                      {!isMobile && <td className="p-3">{transaction.fromLocation}</td>}
                      {!isMobile && <td className="p-3">{transaction.toLocation}</td>}
                      <td className="p-3">{transaction.items} itens</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(transaction.status)}`}>
                          {getStatusDisplay(transaction.status)}
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
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className={isMobile ? "w-full" : ""}>Ver Todas as Transações</Button>
        </CardFooter>
      </Card>

      <TransactionModal 
        isOpen={showTransactionModal} 
        onClose={() => setShowTransactionModal(false)} 
        orderNumber={orderNumber} 
      />
    </div>
  );
};

export default TransactionSection;
