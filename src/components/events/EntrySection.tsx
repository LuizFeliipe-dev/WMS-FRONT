
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightToLine, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import EntryModal from './EntryModal';
import { useLoads } from '@/hooks/useLoads';
import { EntrySectionStatusBgEnum, EntrySectionStatusColorEnum, EntrySectionStatusEnum } from '@/types/entrySection';

const EntrySection = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const { loads, fetchLoads } = useLoads(1, 5);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleStartEntry = () => {
    if (!orderNumber) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de ordem válido",
        variant: "destructive"
      });
      return;
    }

    setShowEntryModal(true);
  };

  const handleEntrySuccess = () => {
    setOrderNumber('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base md:text-lg">
            <ArrowRightToLine className="mr-2 h-5 w-5" />
            Entrada de Mercadorias
          </CardTitle>
          <CardDescription>
            Registre a entrada de novos itens no estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 mb-6`}>
            <div className="flex-1">
              <Input
                placeholder="Número do documento de entrada"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>
            <Button onClick={handleStartEntry} className={isMobile ? "w-full" : ""}>
              <Plus className="mr-2 h-4 w-4" />
              Iniciar Entrada
            </Button>
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Entradas Recentes</CardTitle>
          <CardDescription>Últimas 5 entradas registradas no sistema</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="responsive-table">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-3">Ordem</th>
                  <th className="text-left p-3">Data</th>
                  {!isMobile && <th className="text-left p-3">Fornecedor</th>}
                  <th className="text-left p-3">Itens</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loads.map((load, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{load.documentNumber}</td>
                    <td className="p-3">{new Date(load.createdAt).toLocaleDateString()}</td>
                    {!isMobile && <td className="p-3">{load.supplierId}</td>}
                    <td className="p-3">{load.package.length} itens</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-50 border" style={{ color: EntrySectionStatusColorEnum[load.status], borderColor: EntrySectionStatusBgEnum[load.status] }}>
                        {EntrySectionStatusEnum[load.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className={isMobile ? "w-full" : ""}>Ver Todas as Entradas</Button>
        </CardFooter>
      </Card>

      <EntryModal
        isOpen={showEntryModal}
        onClose={async () => {setShowEntryModal(false); await fetchLoads();}}
        orderNumber={orderNumber}
        onSuccess={handleEntrySuccess}
      />
    </div>
  );
};

export default EntrySection;
