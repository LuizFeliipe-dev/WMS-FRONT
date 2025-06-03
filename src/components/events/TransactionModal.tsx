import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useShelves } from '@/hooks/useShelves';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

const TransactionModal = ({ isOpen, onClose, orderNumber }: TransactionModalProps) => {
  const [packageId, setPackageId] = useState('');
  const [sourceShelf, setSourceShelf] = useState('');
  const [destinationShelf, setDestinationShelf] = useState('');
  const { toast } = useToast();
  const { locations } = useShelves();

  // Filtra prateleiras para não mostrar a selecionada como origem nas opções de destino
  const availableDestinationShelves = locations.filter(loc => loc.id.toString() !== sourceShelf);
  
  // Filtra prateleiras para não mostrar a selecionada como destino nas opções de origem
  const availableSourceShelves = locations.filter(loc => loc.id.toString() !== destinationShelf);
  
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

  const handleSubmit = () => {
    // Validação básica
    if (!packageId || !sourceShelf || !destinationShelf) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    // Aqui processaríamos os dados do formulário
    toast({
      title: "Sucesso",
      description: `Transação da ordem #${orderNumber} registrada com sucesso`
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Label htmlFor="source-shelf">Prateleira de Origem *</Label>
            <Select
              value={sourceShelf}
              onValueChange={setSourceShelf}
            >
              <SelectTrigger id="source-shelf">
                <SelectValue placeholder="Selecione a prateleira de origem" />
              </SelectTrigger>
              <SelectContent>
                {availableSourceShelves.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.code} - {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination-shelf">Prateleira de Destino *</Label>
            <Select
              value={destinationShelf}
              onValueChange={setDestinationShelf}
            >
              <SelectTrigger id="destination-shelf">
                <SelectValue placeholder="Selecione a prateleira de destino" />
              </SelectTrigger>
              <SelectContent>
                {availableDestinationShelves.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.code} - {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Confirmar Transação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
