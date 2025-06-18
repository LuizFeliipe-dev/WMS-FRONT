
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { productService } from '@/services/products';
import { transactionService } from '@/services/transactions';
import { shelfTypeService } from '@/services/shelfTypes';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

const TransactionModal = ({ isOpen, onClose, orderNumber }: TransactionModalProps) => {
  const [packageId, setPackageId] = useState('');
  const [productId, setProductId] = useState('');
  const [transactionType, setTransactionType] = useState<'OUTBOUND' | 'INTERNAL_TRANSFER'>('OUTBOUND');
  const [quantity, setQuantity] = useState('1');
  const [sourceShelf, setSourceShelf] = useState('');
  const [destinationShelf, setDestinationShelf] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [shelves, setShelves] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingShelves, setIsLoadingShelves] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Carregar produtos da API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar produtos",
          variant: "destructive"
        });
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (isOpen) {
      loadProducts();
    }
  }, [isOpen, toast]);

  // Carregar tipos de prateleiras da API
  useEffect(() => {
    const loadShelves = async () => {
      setIsLoadingShelves(true);
      try {
        const data = await shelfTypeService.getAll();
        setShelves(data);
      } catch (error) {
        console.error('Error loading shelf types:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar tipos de prateleiras",
          variant: "destructive"
        });
      } finally {
        setIsLoadingShelves(false);
      }
    };

    if (isOpen) {
      loadShelves();
    }
  }, [isOpen, toast]);

  // Filtra prateleiras para não mostrar a selecionada como origem nas opções de destino
  const availableDestinationShelves = shelves.filter(shelf => shelf.id !== sourceShelf);
  
  // Filtra prateleiras para não mostrar a selecionada como destino nas opções de origem
  const availableSourceShelves = shelves.filter(shelf => shelf.id !== destinationShelf);
  
  // Reset destination shelf if it matches the selected source shelf
  useEffect(() => {
    if (sourceShelf && sourceShelf === destinationShelf) {
      setDestinationShelf('');
    }
  }, [sourceShelf]);

  // Reset source shelf if it matches the selected destination shelf
  useEffect(() => {
    if (destinationShelf && sourceShelf === destinationShelf) {
      setSourceShelf('');
    }
  }, [destinationShelf]);

  const resetForm = () => {
    setPackageId('');
    setProductId('');
    setTransactionType('OUTBOUND');
    setQuantity('1');
    setSourceShelf('');
    setDestinationShelf('');
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!packageId || !productId || !sourceShelf) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Para saída, destino pode estar vazio. Para transferência interna, destino é obrigatório
    if (transactionType === 'INTERNAL_TRANSFER' && !destinationShelf) {
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
        packageId,
        transactionType,
        quantity: parseInt(quantity),
        shelfFromId: sourceShelf,
        shelfToId: transactionType === 'OUTBOUND' ? '' : destinationShelf,
      };

      await transactionService.create(transactionData);

      toast({
        title: "Sucesso",
        description: `Transação da ordem #${orderNumber} registrada com sucesso`
      });
      
      resetForm();
      onClose();
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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transação de Produto</DialogTitle>
          <DialogDescription>
            Ordem #{orderNumber} - Registre os detalhes da movimentação
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="package-id">ID do Pacote *</Label>
            <Input
              id="package-id"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              placeholder="Digite o ID do pacote"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Produto *</Label>
            <Select
              value={productId}
              onValueChange={setProductId}
              disabled={isLoadingProducts}
            >
              <SelectTrigger id="product">
                <SelectValue placeholder={isLoadingProducts ? "Carregando..." : "Selecione um produto"} />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name} - {product.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction-type">Tipo de Transação *</Label>
            <Select
              value={transactionType}
              onValueChange={(value: 'OUTBOUND' | 'INTERNAL_TRANSFER') => setTransactionType(value)}
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

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Digite a quantidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source-shelf">Prateleira de Origem *</Label>
            <Select
              value={sourceShelf}
              onValueChange={setSourceShelf}
              disabled={isLoadingShelves}
            >
              <SelectTrigger id="source-shelf">
                <SelectValue placeholder={isLoadingShelves ? "Carregando..." : "Selecione a prateleira de origem"} />
              </SelectTrigger>
              <SelectContent>
                {availableSourceShelves.map((shelf) => (
                  <SelectItem key={shelf.id} value={shelf.id}>
                    {shelf.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {transactionType === 'INTERNAL_TRANSFER' && (
            <div className="space-y-2">
              <Label htmlFor="destination-shelf">Prateleira de Destino *</Label>
              <Select
                value={destinationShelf}
                onValueChange={setDestinationShelf}
                disabled={isLoadingShelves}
              >
                <SelectTrigger id="destination-shelf">
                  <SelectValue placeholder={isLoadingShelves ? "Carregando..." : "Selecione a prateleira de destino"} />
                </SelectTrigger>
                <SelectContent>
                  {availableDestinationShelves.map((shelf) => (
                    <SelectItem key={shelf.id} value={shelf.id}>
                      {shelf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
                </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Processando...' : 'Confirmar Transação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
