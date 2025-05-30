
import React from 'react';
import Stats3DView from '@/components/Stats3DView';
import { useIsMobile } from '@/hooks/use-mobile';

const WarehouseViewSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
      <div className="p-4 md:p-6 pb-2">
        <h2 className="text-lg md:text-xl font-semibold">Visualização 3D do Armazém</h2>
        <p className="text-sm text-gray-500 mt-1">Clique nos itens para ver detalhes</p>
      </div>
      <div className={isMobile ? "h-60" : "h-80"}>
        <Stats3DView />
      </div>
    </div>
  );
};

export default WarehouseViewSection;
