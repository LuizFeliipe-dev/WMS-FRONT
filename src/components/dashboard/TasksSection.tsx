
import React from 'react';
import TaskItem from './TaskItem';
import { useLoads } from '@/hooks/useLoads';
import { useNavigate } from 'react-router-dom';
import { IDashboard } from '@/hooks/useDashboard';

const TasksSection = ({ dashboardData }: { dashboardData: IDashboard }) => {
  const navigate = useNavigate();

  const handleViewAllTasks = () => {
    navigate('/tasks');
  };

  const handleTaskClick = () => {
    navigate('/tasks');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">Tarefas Pendentes</h2>
      <div className="space-y-3">
        {dashboardData?.lastThreeTasks && dashboardData?.lastThreeTasks.length > 0 ? (
          dashboardData?.lastThreeTasks.slice(0, 3).map(load => (
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
            Não há tarefas pendentes
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

export default TasksSection;
