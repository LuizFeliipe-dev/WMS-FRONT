
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useItems } from '@/hooks/useItems';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useLocations } from '@/hooks/useLocations';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Tipo de pacote
type PackageType = 'Unit' | 'Pack' | 'Box' | 'Carton' | 'Pallet';

// Interface para o item de produto
interface ProductItem {
  id: string;
  itemId: string;
  quantity: number;
  width: number;
  height: number;
  length: number;
  maxStack: number;
  packageType: PackageType;
  shelfId: string;
}

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

const EntryModal = ({ isOpen, onClose, orderNumber }: EntryModalProps) => {
  const [supplier, setSupplier] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: '1',
      itemId: '',
      quantity: 1,
      width: 0,
      height: 0,
      length: 0,
      maxStack: 1,
      packageType: 'Box',
      shelfId: ''
    }
  ]);
  const { toast } = useToast();
  const { items } = useItems();
  const { suppliers } = useSuppliers();
  const { locations } = useLocations();

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        itemId: '',
        quantity: 1,
        width: 0,
        height: 0,
        length: 0,
        maxStack: 1,
        packageType: 'Box',
        shelfId: ''
      }
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    if (products.length === 1) {
      return;
    }
    setProducts(products.filter(product => product.id !== id));
  };

  const handleProductChange = (id: string, field: keyof ProductItem, value: any) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const handleSubmit = () => {
    // Validação básica
    if (!supplier) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um fornecedor",
        variant: "destructive"
      });
      return;
    }

    // Validação dos produtos
    const isValid = products.every(product => 
      product.itemId && product.quantity > 0 && 
      product.width > 0 && product.height > 0 && 
      product.length > 0 && product.maxStack > 0 &&
      product.shelfId
    );

    if (!isValid) {
      toast({
        title: "Erro",
        description: "Por favor, preencha corretamente todos os itens",
        variant: "destructive"
      });
      return;
    }

    // Aqui processaríamos os dados do formulário
    toast({
      title: "Sucesso",
      description: `Entrada da ordem #${orderNumber} registrada com sucesso`
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Entrada de Produtos</DialogTitle>
          <DialogDescription>
            Ordem #{orderNumber} - Registre os detalhes dos produtos recebidos
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-4 max-h-[calc(80vh-120px)] overflow-y-auto">
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor *</Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalValue">Valor Total (opcional)</Label>
                <Input 
                  id="totalValue" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  placeholder="Valor total da nota"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Produtos</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddProduct}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Produto
                </Button>
              </div>

              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-md relative"
                >
                  <div className="absolute right-2 top-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveProduct(product.id)}
                      disabled={products.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`product-${product.id}-id`}>Item *</Label>
                    <Select 
                      value={product.itemId} 
                      onValueChange={(value) => handleProductChange(product.id, 'itemId', value)}
                    >
                      <SelectTrigger id={`product-${product.id}-id`}>
                        <SelectValue placeholder="Selecione um item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`product-${product.id}-quantity`}>Quantidade *</Label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => handleProductChange(
                          product.id, 
                          'quantity', 
                          Math.max(1, product.quantity - 1)
                        )}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        id={`product-${product.id}-quantity`}
                        type="number"
                        min="1"
                        className="rounded-none text-center"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(
                          product.id, 
                          'quantity', 
                          parseInt(e.target.value) || 1
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => handleProductChange(
                          product.id, 
                          'quantity', 
                          product.quantity + 1
                        )}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`product-${product.id}-type`}>Tipo do Pacote *</Label>
                    <Select 
                      value={product.packageType} 
                      onValueChange={(value) => handleProductChange(
                        product.id, 
                        'packageType', 
                        value as PackageType
                      )}
                    >
                      <SelectTrigger id={`product-${product.id}-type`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unit">Unidade</SelectItem>
                        <SelectItem value="Pack">Pacote</SelectItem>
                        <SelectItem value="Box">Caixa</SelectItem>
                        <SelectItem value="Carton">Cartucho</SelectItem>
                        <SelectItem value="Pallet">Palete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`product-${product.id}-shelf`}>Prateleira *</Label>
                    <Select 
                      value={product.shelfId} 
                      onValueChange={(value) => handleProductChange(
                        product.id, 
                        'shelfId', 
                        value
                      )}
                    >
                      <SelectTrigger id={`product-${product.id}-shelf`}>
                        <SelectValue placeholder="Selecione uma prateleira" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id.toString()}>
                            {location.code} - {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`product-${product.id}-stack`}>Empilhamento Máx *</Label>
                    <Input
                      id={`product-${product.id}-stack`}
                      type="number"
                      min="1"
                      value={product.maxStack}
                      onChange={(e) => handleProductChange(
                        product.id, 
                        'maxStack', 
                        parseInt(e.target.value) || 1
                      )}
                    />
                  </div>
                  
                  <div className="md:col-span-3 grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`product-${product.id}-width`}>Largura (cm) *</Label>
                      <Input
                        id={`product-${product.id}-width`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={product.width}
                        onChange={(e) => handleProductChange(
                          product.id, 
                          'width', 
                          parseFloat(e.target.value) || 0
                        )}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`product-${product.id}-length`}>Comprimento (cm) *</Label>
                      <Input
                        id={`product-${product.id}-length`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={product.length}
                        onChange={(e) => handleProductChange(
                          product.id, 
                          'length', 
                          parseFloat(e.target.value) || 0
                        )}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`product-${product.id}-height`}>Altura (cm) *</Label>
                      <Input
                        id={`product-${product.id}-height`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={product.height}
                        onChange={(e) => handleProductChange(
                          product.id, 
                          'height', 
                          parseFloat(e.target.value) || 0
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Registrar Entrada</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EntryModal;
