import { useAuth } from '@/contexts/useAuth';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface HeaderComponentProps {
  url?: string;
  setFormOpen: (open: boolean) => void;
  name: string;
  description: string;
}

const HeaderComponent = ({ url, setFormOpen, name, description }: HeaderComponentProps) => {
  const { hasWriteAccess } = useAuth();

  const canWrite = hasWriteAccess(url || '');

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold">{name}</h1>
        <p className="text-gray-500">{description}</p>
      </div>
      {canWrite && (
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      )}
    </header>
  )
}

export default HeaderComponent
