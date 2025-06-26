import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { productService } from '@/services/product';
import { supplierService } from '@/services/suppliers';
import { ISupplier } from '@/types/supplier';
import { IProduct } from '@/types/product';
import type { CreateLoadData } from '@/types/load';
import { loadService } from '@/services/loads';

const defaultProduct = () => ({
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
});

const EntryModal = ({ isOpen, onClose, orderNumber, onSuccess }) => {
  const [supplier, setSupplier] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [products, setProducts] = useState([defaultProduct()]);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [items, setItems] = useState<IProduct[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingSuppliers(true);
    supplierService.getAll({ take: 100 }).then(res => setSuppliers(res.data || []))
      .catch(() => {
        toast({ title: 'Erro', description: 'Falha ao carregar fornecedores', variant: 'destructive' });
        setSuppliers([]);
      }).finally(() => setIsLoadingSuppliers(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingItems(true);
    productService.getAll({ take: 100 }).then(res => setItems(res.data || []))
      .catch(() => {
        toast({ title: 'Erro', description: 'Falha ao carregar produtos', variant: 'destructive' });
        setItems([]);
      }).finally(() => setIsLoadingItems(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSupplier('');
      setTotalValue('');
      setProducts([defaultProduct()]);
    }
  }, [isOpen]);

  const handleAddProduct = () => {
    setProducts(prev => ([...prev, defaultProduct()]));
  };

  const handleRemoveProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleProductChange = (id: string, field: string, value: any) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleSubmit = async () => {
    if (!supplier) {
      toast({ title: 'Erro', description: 'Por favor, selecione um fornecedor', variant: 'destructive' });
      return;
    }

    const isValid = products.every(p => p.productId && p.quantity > 0 && p.width > 0 && p.height > 0 && p.length > 0 && p.weight > 0 && p.stackable > 0 && p.pkgQty > 0);
    if (!isValid) {
      toast({ title: 'Erro', description: 'Por favor, preencha corretamente todos os itens', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateLoadData = {
        supplierId: supplier,
        documentNumber: orderNumber,
        value: totalValue ? parseFloat(totalValue) : 0,
        packages: products.map(({ productId, quantity, height, width, length, weight, stackable, pkgType, pkgQty }) => ({ productId, quantity, height, width, length, weight, stackable, pkgType, pkgQty }))
      };

      await loadService.create(payload);
      toast({ title: 'Sucesso', description: `Entrada da ordem #${orderNumber} registrada com sucesso` });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Falha ao registrar entrada', variant: 'destructive' });
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
                    <SelectValue placeholder={isLoadingSuppliers ? 'Carregando...' : 'Selecione um fornecedor'} />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalValue">Valor Total (opcional)</Label>
                <Input id="totalValue" type="number" min="0" step="0.01" value={totalValue} onChange={e => setTotalValue(e.target.value)} placeholder="Valor total da nota" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Produtos</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddProduct} disabled={isSubmitting} className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Adicionar Produto
                </Button>
              </div>

              {products.map((product, index) => (
                <div key={product.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-md relative">
                  <div className="absolute right-2 top-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveProduct(product.id)} disabled={products.length === 1 || isSubmitting}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <Label>Produto *</Label>
                    <Select value={product.productId} onValueChange={(value) => handleProductChange(product.id, 'productId', value)} disabled={isLoadingItems}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingItems ? 'Carregando...' : 'Selecione um produto'} />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map(item => (
                          <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Quantidade *</Label>
                    <div className="flex items-center">
                      <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-r-none" onClick={() => handleProductChange(product.id, 'quantity', Math.max(1, product.quantity - 1))}><Minus className="h-3 w-3" /></Button>
                      <Input type="number" min="1" className="rounded-none text-center" value={product.quantity} onChange={(e) => handleProductChange(product.id, 'quantity', parseInt(e.target.value) || 1)} />
                      <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-l-none" onClick={() => handleProductChange(product.id, 'quantity', product.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Tipo do Pacote *</Label>
                    <Select value={product.pkgType} onValueChange={value => handleProductChange(product.id, 'pkgType', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Label>Qtd. Pacote *</Label>
                    <Input type="number" min="1" value={product.pkgQty} onChange={(e) => handleProductChange(product.id, 'pkgQty', parseInt(e.target.value) || 1)} />
                  </div>

                  <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Largura (cm) *</Label>
                      <Input type="number" min="0" step="0.1" value={product.width} onChange={(e) => handleProductChange(product.id, 'width', parseFloat(e.target.value) || 0)} className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Comprimento (cm) *</Label>
                      <Input type="number" min="0" step="0.1" value={product.length} onChange={(e) => handleProductChange(product.id, 'length', parseFloat(e.target.value) || 0)} className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Altura (cm) *</Label>
                      <Input type="number" min="0" step="0.1" value={product.height} onChange={(e) => handleProductChange(product.id, 'height', parseFloat(e.target.value) || 0)} className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Peso (kg) *</Label>
                      <Input type="number" min="0" step="0.1" value={product.weight} onChange={(e) => handleProductChange(product.id, 'weight', parseFloat(e.target.value) || 0)} className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Empilhamento Máx *</Label>
                      <Input type="number" min="1" value={product.stackable} onChange={(e) => handleProductChange(product.id, 'stackable', parseInt(e.target.value) || 1)} className="text-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar Entrada'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EntryModal;
