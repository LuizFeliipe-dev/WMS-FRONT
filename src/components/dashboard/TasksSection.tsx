
import React from 'react';
import TaskItem from './TaskItem';
import { useEntries } from '@/hooks/useEntries';
import { useNavigate } from 'react-router-dom';

const TasksSection = () => {
  const { entries } = useEntries();
  const navigate = useNavigate();
  
  // Filter entries that don't have "allocated" status
  const pendingEntries = entries.filter(entry => entry.status !== 'allocated');

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
        {pendingEntries.length > 0 ? (
          pendingEntries.slice(0, 3).map(entry => (
            <TaskItem 
              key={entry.id}
              title={`Entrada de mercadorias - Pedido #${entry.orderNumber}`}
              dueDate={entry.date}
              status={entry.status}
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
