import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { productService } from '@/services/products';
import { supplierService } from '@/services/suppliers';
import { getAuthHeader } from '@/utils/auth';

// Tipo de pacote
type PackageType = 'BX' | 'PK' | 'UN' | 'CT' | 'PL';

// Interface para o item de produto
interface ProductItem {
  id: string;
  productId: string;
  quantity: number;
  width: number;
  height: number;
  length: number;
  weight: number;
  stackable: number;
  pkgType: PackageType;
  pkgQty: number;
}

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  onSuccess?: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EntryModal = ({ isOpen, onClose, orderNumber, onSuccess }: EntryModalProps) => {
  const [supplier, setSupplier] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: '1',
      productId: '',
      quantity: 1,
      width: 0,
      height: 0,
      length: 0,
      weight: 0,
      stackable: 1,
      pkgType: 'BX',
      pkgQty: 1
    }
  ]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Carregar fornecedores da API
  useEffect(() => {
    const loadSuppliers = async () => {
      setIsLoadingSuppliers(true);
      try {
        const data = await supplierService.getAll();
        setSuppliers(data);
      } catch (error) {
        console.error('Error loading suppliers:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar fornecedores",
          variant: "destructive"
        });
      } finally {
        setIsLoadingSuppliers(false);
      }
    };

    if (isOpen) {
      loadSuppliers();
    }
  }, [isOpen, toast]);

  // Carregar produtos da API
  useEffect(() => {
    const loadItems = async () => {
      setIsLoadingItems(true);
      try {
        const data = await productService.getAll();
        setItems(data);
      } catch (error) {
        console.error('Error loading items:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar produtos",
          variant: "destructive"
        });
      } finally {
        setIsLoadingItems(false);
      }
    };

    if (isOpen) {
      loadItems();
    }
  }, [isOpen, toast]);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        productId: '',
        quantity: 1,
        width: 0,
        height: 0,
        length: 0,
        weight: 0,
        stackable: 1,
        pkgType: 'BX',
        pkgQty: 1
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

  const handleSubmit = async () => {
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
      product.productId && product.quantity > 0 && 
      product.width > 0 && product.height > 0 && 
      product.length > 0 && product.weight > 0 &&
      product.stackable > 0 && product.pkgQty > 0
    );

    if (!isValid) {
      toast({
        title: "Erro",
        description: "Por favor, preencha corretamente todos os itens",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar payload para a API com os nomes corretos dos campos
      const loadData = {
        supplierId: supplier,
        documentNumber: orderNumber,
        value: totalValue ? parseFloat(totalValue) : 0,
        packages: products.map(product => ({
          productId: product.productId,
          quantity: product.quantity,
          height: product.height,
          width: product.width,
          length: product.length,
          weight: product.weight,
          stackable: product.stackable,
          pkgType: product.pkgType,
          pkgQty: product.pkgQty
        }))
      };

      const response = await fetch(`${API_BASE_URL}/load`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loadData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao registrar entrada');
      }

      toast({
        title: "Sucesso",
        description: `Entrada da ordem #${orderNumber} registrada com sucesso`
      });
      
      // Chamar callback de sucesso para limpar o campo
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating load:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao registrar entrada",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
                <Select value={supplier} onValueChange={setSupplier} disabled={isLoadingSuppliers}>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder={isLoadingSuppliers ? "Carregando..." : "Selecione um fornecedor"} />
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
                  disabled={isSubmitting}
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
                      disabled={products.length === 1 || isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`product-${product.id}-id`}>Produto *</Label>
                    <Select 
                      value={product.productId} 
                      onValueChange={(value) => handleProductChange(product.id, 'productId', value)}
                      disabled={isLoadingItems}
                    >
                      <SelectTrigger id={`product-${product.id}-id`}>
                        <SelectValue placeholder={isLoadingItems ? "Carregando..." : "Selecione um produto"} />
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
                      value={product.pkgType} 
                      onValueChange={(value) => handleProductChange(
                        product.id, 
                        'pkgType', 
                        value as PackageType
                      )}
                    >
                      <SelectTrigger id={`product-${product.id}-type`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UN">Unidade</SelectItem>
                        <SelectItem value="PK">Pacote</SelectItem>
                        <SelectItem value="BX">Caixa</SelectItem>
                        <SelectItem value="CT">Cartucho</SelectItem>
                        <SelectItem value="PL">Palete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`product-${product.id}-pkgQty`}>Qtd. Pacote *</Label>
                    <Input
                      id={`product-${product.id}-pkgQty`}
                      type="number"
                      min="1"
                      value={product.pkgQty}
                      onChange={(e) => handleProductChange(
                        product.id, 
                        'pkgQty', 
                        parseInt(e.target.value) || 1
                      )}
                    />
                  </div>
                  
                  <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`product-${product.id}-width`} className="text-xs">Largura (cm) *</Label>
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
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`product-${product.id}-length`} className="text-xs">Comprimento (cm) *</Label>
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
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`product-${product.id}-height`} className="text-xs">Altura (cm) *</Label>
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
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`product-${product.id}-weight`} className="text-xs">Peso (kg) *</Label>
                      <Input
                        id={`product-${product.id}-weight`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={product.weight}
                        onChange={(e) => handleProductChange(
                          product.id, 
                          'weight', 
                          parseFloat(e.target.value) || 0
                        )}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`product-${product.id}-stackable`} className="text-xs">Empilhamento Máx *</Label>
                      <Input
                        id={`product-${product.id}-stackable`}
                        type="number"
                        min="1"
                        value={product.stackable}
                        onChange={(e) => handleProductChange(
                          product.id, 
                          'stackable', 
                          parseInt(e.target.value) || 1
                        )}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar Entrada"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EntryModal;
