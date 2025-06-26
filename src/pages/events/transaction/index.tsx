import { useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/pages/product/hooks/useProducts';
import { useProductLocations, ProductLocation } from '@/hooks/useProductLocations';
import { useShelvesFromRack } from '@/hooks/useShelvesFromRack';
import { useRackList } from '@/pages/rack/hooks/useRackList';
import { transactionService } from '@/services/transactions';
import { ArrowLeftRight, Package, MapPin, Users, Calendar, Table } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from 'react-day-picker';
import { Label } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TransactionSection = () => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ProductLocation | null>(null);
  const [transactionType, setTransactionType] = useState<'OUTBOUND' | 'INTERNAL_TRANSFER'>('OUTBOUND');
  const [quantity, setQuantity] = useState('1');
  const [destinationRackId, setDestinationRackId] = useState('');
  const [destinationShelfId, setDestinationShelfId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { products } = useProducts(10000);
  const { locations, isLoading: isLoadingLocations } = useProductLocations(selectedProductId);
  const { shelves, isLoading: isLoadingShelves } = useShelvesFromRack(destinationRackId);

  const [searchTerm] = useState('');
  const [showActive] = useState(true);
  const [currentPage] = useState(1);

  const { racks, isLoading: isLoadingRacks } = useRackList({
    take: 10,
    page: currentPage,
    name: searchTerm,
    active: showActive,
  });

  const safeItems = Array.isArray(products) ? products : [];
  const safeLocations = Array.isArray(locations) ? locations : [];

  const handleSubmit = async () => {
    if (!selectedProductId || !selectedLocation) {
      toast({ title: 'Erro', description: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
      return;
    }

    if (transactionType === 'OUTBOUND') {
      const qty = parseInt(quantity);
      if (!quantity || qty <= 0 || qty > selectedLocation.quantity) {
        toast({ title: 'Erro', description: `Quantidade deve ser entre 1 e ${selectedLocation.quantity}`, variant: 'destructive' });
        return;
      }
    }

    if (transactionType === 'INTERNAL_TRANSFER' && !destinationShelfId) {
      toast({ title: 'Erro', description: 'Prateleira de destino obrigatória', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await transactionService.create({
        id: selectedLocation.id,
        transactionType,
        quantity: transactionType === 'OUTBOUND' ? parseInt(quantity) : selectedLocation.quantity,
        shelfFromId: selectedLocation.shelfId,
        shelfToId: transactionType === 'OUTBOUND' ? '' : destinationShelfId,
      });

      toast({ title: 'Sucesso', description: 'Transação registrada com sucesso' });

      setSelectedProductId('');
      setSelectedLocation(null);
      setTransactionType('OUTBOUND');
      setQuantity('1');
      setDestinationRackId('');
      setDestinationShelfId('');
    } catch (err) {
      toast({ title: 'Erro', description: err instanceof Error ? err.message : 'Falha ao registrar transação', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base md:text-lg">
            <ArrowLeftRight className="mr-2 h-5 w-5" /> Nova Transação
          </CardTitle>
          <CardDescription>Registre a movimentação de itens</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Produto *</Label>
            <Select value={selectedProductId} onValueChange={(id) => {
              setSelectedProductId(id);
              setSelectedLocation(null);
              setDestinationRackId('');
              setDestinationShelfId('');
            }}>
              <SelectTrigger><SelectValue placeholder="Selecione um produto" /></SelectTrigger>
              <SelectContent>
                {safeItems.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name} - {p.description}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProductId && (
            <div className="space-y-2">
              <Label>Selecione uma Localização *</Label>
              {isLoadingLocations ? (
                <div className="text-center py-4">Carregando localizações...</div>
              ) : safeLocations.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">Nenhuma localização encontrada</div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rack</TableHead>
                        <TableHead>Posição</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safeLocations.map(loc => (
                        <TableRow
                          key={loc.id}
                          className={`cursor-pointer ${selectedLocation?.id === loc.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                          onClick={() => setSelectedLocation(loc)}
                        >
                          <TableCell>{loc.shelf.rack.name}</TableCell>
                          <TableCell>{loc.shelf.position}</TableCell>
                          <TableCell>{loc.product.name}</TableCell>
                          <TableCell>{loc.quantity}</TableCell>
                          <TableCell>{loc.load.documentNumber}</TableCell>
                          <TableCell>{loc.accessLog.user.name}</TableCell>
                          <TableCell>
                            <Button size="sm" variant={selectedLocation?.id === loc.id ? 'default' : 'outline'}>
                              {selectedLocation?.id === loc.id ? 'Selecionado' : 'Selecionar'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {selectedLocation && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium flex items-center"><Package className="mr-2 h-4 w-4" /> Localização Selecionada</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center"><Package className="mr-2 h-4 w-4 text-muted-foreground" /><strong>Produto:</strong> {selectedLocation.product.name}</div>
                <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /><strong>Rack:</strong> {selectedLocation.shelf.rack.name}</div>
                <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /><strong>Posição:</strong> {selectedLocation.shelf.position}</div>
                <div className="flex items-center"><Package className="mr-2 h-4 w-4 text-muted-foreground" /><strong>Quantidade:</strong> {selectedLocation.quantity}</div>
                <div className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" /><strong>Usuário:</strong> {selectedLocation.accessLog.user.name}</div>
                <div className="flex items-center"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /><strong>Documento:</strong> {selectedLocation.load.documentNumber}</div>
              </div>
            </div>
          )}

          {selectedLocation && (
            <div className="space-y-2">
              <Label>Tipo de Transação *</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo de transação" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUTBOUND">Saída</SelectItem>
                  <SelectItem value="INTERNAL_TRANSFER">Transferência Interna</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedLocation && transactionType === 'OUTBOUND' && (
            <div className="space-y-2">
              <Label>Quantidade *</Label>
              <Input
                type="number"
                min="1"
                max={selectedLocation.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          )}

          {transactionType === 'INTERNAL_TRANSFER' && selectedLocation && (
            <div className="space-y-2">
              <Label>Rack de Destino *</Label>
              <Select
                value={destinationRackId}
                onValueChange={(id) => {
                  setDestinationRackId(id);
                  setDestinationShelfId('');
                }}
                disabled={isLoadingRacks}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o rack de destino" />
                </SelectTrigger>
                <SelectContent>
                  {racks.filter(r => r.id !== selectedLocation.shelf.rack.id).map(rack => (
                    <SelectItem key={rack.id} value={rack.id}>{rack.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {transactionType === 'INTERNAL_TRANSFER' && destinationRackId && (
            <div className="space-y-2">
              <Label>Prateleira de Destino *</Label>
              <Select
                value={destinationShelfId}
                onValueChange={setDestinationShelfId}
                disabled={isLoadingShelves}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prateleira de destino" />
                </SelectTrigger>
                <SelectContent>
                  {shelves.map(shelf => (
                    <SelectItem key={shelf.id} value={shelf.id}>{shelf.position}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedLocation && (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Processando...' : 'Confirmar Transação'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionSection;
