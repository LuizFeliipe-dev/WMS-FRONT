
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useItems } from '@/hooks/useItems';
import { useProductLocations, ProductLocation } from '@/hooks/useProductLocations';
import { useRacksWithFilters } from '@/hooks/useRacksWithFilters';
import { useShelvesFromRack } from '@/hooks/useShelvesFromRack';
import { transactionService } from '@/services/transactions';
import { ArrowLeftRight, Package, MapPin, Users, Calendar } from 'lucide-react';

const NewTransactionSection = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<ProductLocation | null>(null);
  const [transactionType, setTransactionType] = useState<'OUTBOUND' | 'INTERNAL_TRANSFER'>('OUTBOUND');
  const [quantity, setQuantity] = useState<string>('1');
  const [destinationRackId, setDestinationRackId] = useState<string>('');
  const [destinationShelfId, setDestinationShelfId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items } = useItems(10000);
  const { locations, isLoading: isLoadingLocations } = useProductLocations(selectedProductId);
  const { racks, isLoading: isLoadingRacks } = useRacksWithFilters();
  const { shelves, isLoading: isLoadingShelves } = useShelvesFromRack(destinationRackId);
  const { toast } = useToast();

  console.log('Items:', items);
  console.log('Locations:', locations);

  // Ensure items and locations are arrays
  const safeItems = Array.isArray(items) ? items : [];
  const safeLocations = Array.isArray(locations) ? locations : [];
  console.log('safeLocations:', safeLocations, locations);
  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    setSelectedLocation(null);
    setDestinationRackId('');
    setDestinationShelfId('');
  };

  const handleLocationSelect = (location: ProductLocation) => {
    setSelectedLocation(location);
  };

  const handleTransactionTypeChange = (type: 'OUTBOUND' | 'INTERNAL_TRANSFER') => {
    setTransactionType(type);
    setDestinationRackId('');
    setDestinationShelfId('');
  };

  const handleRackChange = (rackId: string) => {
    setDestinationRackId(rackId);
    setDestinationShelfId(''); // Reset shelf when rack changes
  };

  const handleSubmit = async () => {
    if (!selectedProductId || !selectedLocation) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // For OUTBOUND, check quantity
    if (transactionType === 'OUTBOUND') {
      if (!quantity) {
        toast({
          title: "Erro",
          description: "Por favor, preencha a quantidade",
          variant: "destructive"
        });
        return;
      }

      const quantityNum = parseInt(quantity);
      if (quantityNum <= 0 || quantityNum > selectedLocation.quantity) {
        toast({
          title: "Erro",
          description: `Quantidade deve ser entre 1 e ${selectedLocation.quantity}`,
          variant: "destructive"
        });
        return;
      }
    }

    if (transactionType === 'INTERNAL_TRANSFER' && !destinationShelfId) {
      toast({
        title: "Erro",
        description: "Para transferência interna, a prateleira de destino é obrigatória",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const transactionData = {
        id: selectedLocation.id,
        transactionType,
        quantity: transactionType === 'OUTBOUND' ? parseInt(quantity) : selectedLocation.quantity,
        shelfFromId: selectedLocation.shelfId,
        shelfToId: transactionType === 'OUTBOUND' ? '' : destinationShelfId,
      };

      await transactionService.create(transactionData);

      toast({
        title: "Sucesso",
        description: "Transação registrada com sucesso"
      });

      // Reset form
      setSelectedProductId('');
      setSelectedLocation(null);
      setTransactionType('OUTBOUND');
      setQuantity('1');
      setDestinationRackId('');
      setDestinationShelfId('');
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao registrar transação",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base md:text-lg">
            <ArrowLeftRight className="mr-2 h-5 w-5" />
            Nova Transação
          </CardTitle>
          <CardDescription>
            Registre a movimentação de itens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seletor de Produto */}
          <div className="space-y-2">
            <Label htmlFor="product">Produto *</Label>
            <Select value={selectedProductId} onValueChange={handleProductChange}>
              <SelectTrigger id="product">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {safeItems.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {product.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de Localizações */}
          {selectedProductId && (
            <div className="space-y-2">
              <Label>Selecione uma Localização *</Label>
              {isLoadingLocations ? (
                <div className="text-center py-4">Carregando localizações...</div>
              ) : safeLocations.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma localização encontrada para este produto
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rack</TableHead>
                        <TableHead>Posição</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Document Number</TableHead>
                        <TableHead>Último Usuário</TableHead>
                        <TableHead className="w-[100px]">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safeLocations.map((location) => (
                        <TableRow
                          key={location.id}
                          className={`cursor-pointer transition-colors ${
                            selectedLocation?.id === location.id
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleLocationSelect(location)}
                        >
                          <TableCell className="font-medium">
                            {location.shelf.rack.name}
                          </TableCell>
                          <TableCell>
                            {location.shelf.position}
                          </TableCell>
                          <TableCell>
                            {location.product.name}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{location.quantity}</span>
                          </TableCell>
                          <TableCell>
                            {location.load.documentNumber}
                          </TableCell>
                          <TableCell>
                            {location.accessLog.user.name}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={selectedLocation?.id === location.id ? "default" : "outline"}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLocationSelect(location);
                              }}
                            >
                              {selectedLocation?.id === location.id ? "Selecionado" : "Selecionar"}
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

          {/* Informações da Localização Selecionada */}
          {selectedLocation && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Localização Selecionada
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span><strong>Produto:</strong> {selectedLocation.product.name}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span><strong>Rack:</strong> {selectedLocation.shelf.rack.name}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span><strong>Posição:</strong> {selectedLocation.shelf.position}</span>
                </div>
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span><strong>Quantidade:</strong> {selectedLocation.quantity} itens</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span><strong>Último usuário:</strong> {selectedLocation.accessLog.user.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span><strong>Document Number:</strong> {selectedLocation.load.documentNumber}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tipo de Transação */}
          {selectedLocation && (
            <div className="space-y-2">
              <Label htmlFor="transaction-type">Tipo de Transação *</Label>
              <Select
                value={transactionType}
                onValueChange={handleTransactionTypeChange}
              >
                <SelectTrigger id="transaction-type">
                  <SelectValue placeholder="Selecione o tipo de transação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUTBOUND">Saída</SelectItem>
                  <SelectItem value="INTERNAL_TRANSFER">Transferência Interna</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantidade - apenas para OUTBOUND */}
          {selectedLocation && transactionType === 'OUTBOUND' && (
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedLocation.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Digite a quantidade"
              />
            </div>
          )}

          {/* Seletor de Rack de Destino (apenas para transferência interna) */}
          {transactionType === 'INTERNAL_TRANSFER' && selectedLocation && (
            <div className="space-y-2">
              <Label htmlFor="destination-rack">Rack de Destino *</Label>
              <Select
                value={destinationRackId}
                onValueChange={handleRackChange}
                disabled={isLoadingRacks}
              >
                <SelectTrigger id="destination-rack">
                  <SelectValue placeholder={isLoadingRacks ? "Carregando..." : "Selecione o rack de destino"} />
                </SelectTrigger>
                <SelectContent>
                  {racks.filter(rack => rack.id !== selectedLocation.shelfId).map((rack) => (
                    <SelectItem key={rack.id} value={rack.id}>
                      {rack.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Seletor de Prateleira de Destino (apenas para transferência interna) */}
          {transactionType === 'INTERNAL_TRANSFER' && destinationRackId && (
            <div className="space-y-2">
              <Label htmlFor="destination-shelf">Prateleira de Destino *</Label>
              <Select
                value={destinationShelfId}
                onValueChange={setDestinationShelfId}
                disabled={isLoadingShelves}
              >
                <SelectTrigger id="destination-shelf">
                  <SelectValue placeholder={isLoadingShelves ? "Carregando..." : "Selecione a prateleira de destino"} />
                </SelectTrigger>
                <SelectContent>
                  {shelves.map((shelf) => (
                    <SelectItem key={shelf.id} value={shelf.id}>
                      {shelf.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Botão de Confirmação */}
          {selectedLocation && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Transação'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTransactionSection;
