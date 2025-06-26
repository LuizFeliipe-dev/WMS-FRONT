
import { useIsMobile } from '@/hooks/use-mobile';
import { IDashboard } from '@/hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import TaskItem from './TaskItem';
import { useNavigate } from 'react-router-dom';

const ActivitySection = ({ dashboardData, isLoading }: { dashboardData: IDashboard, isLoading: boolean}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Novas</h2>
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

  const handleViewAllTasks = () => {
    navigate('/tasks');
  };

  const handleTaskClick = () => {
    navigate('/tasks');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">Novas entradas</h2>
      <div className="space-y-3">
        {dashboardData?.lastThreeLoads.length > 0 ? (
          dashboardData?.lastThreeLoads.slice(0, 3).map(load => (
            <TaskItem
              key={load.id}
              title={`Carga ${load.value}`}
              dueDate={new Date(load.createdAt).toLocaleDateString('pt-BR')}
              status={load.status.toLowerCase() as any}
              to={`/tasks`}
              onClick={handleTaskClick}
            />
          ))
        ) : (
          <div className="text-gray-500 py-3 text-center">
            Não há entradas novas
          </div>
        )}
      </div>
      <button
        className="mt-4 text-sm text-primary hover:text-primary/80 font-medium"
        onClick={handleViewAllTasks}
      >
        Ver todas as tarefas
      </button>
    </div>
  );
};

export default ActivitySection;
