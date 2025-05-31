
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ActivityItem from './ActivityItem';
import { Clipboard, ArrowRightToLine, Box, Package } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';

const ActivitySection = () => {
  const isMobile = useIsMobile();
  const { data: dashboardData, isLoading } = useDashboard();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Há ${diffInMinutes} minutos`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Há ${days} dia${days > 1 ? 's' : ''}`;
    }
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
      <div className="space-y-3">
        {dashboardData?.lastThreeLoads && dashboardData.lastThreeLoads.length > 0 ? (
          dashboardData.lastThreeLoads.map((load, index) => (
            <ActivityItem 
              key={load.id}
              title={
                isMobile 
                  ? `Carga ${formatCurrency(load.value)} - ${load.status}`
                  : `Nova carga registrada: ${formatCurrency(load.value)} - Status: ${load.status}`
              }
              time={formatDate(load.createdAt)}
              icon={<Package className="h-5 w-5" />}
            />
          ))
        ) : (
          <>
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
          </>
        )}
      </div>
      <button className="mt-4 text-sm text-primary hover:text-primary/80 font-medium">
        Ver toda atividade
      </button>
    </div>
  );
};

export default ActivitySection;
