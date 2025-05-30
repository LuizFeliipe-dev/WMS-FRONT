
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ActivityItem from './ActivityItem';
import { Clipboard, ArrowRightToLine, Box } from 'lucide-react';

const ActivitySection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
      <div className="space-y-3">
        <ActivityItem 
          title="Marcelo Silva aprovou inventário do Armazém 002"
          time="Há 35 minutos"
          icon={<Clipboard className="h-5 w-5" />}
        />
        <ActivityItem 
          title={isMobile ? "Nova entrada: 150 itens" : "Nova entrada registrada: 150 itens do Fornecedor ABC"}
          time="Há 2 horas"
          icon={<ArrowRightToLine className="h-5 w-5" />}
        />
        <ActivityItem 
          title="Saída #82730 concluída e expedida"
          time="Há 3 horas"
          icon={<Box className="h-5 w-5" />}
        />
      </div>
      <button className="mt-4 text-sm text-primary hover:text-primary/80 font-medium">
        Ver toda atividade
      </button>
    </div>
  );
};

export default ActivitySection;
