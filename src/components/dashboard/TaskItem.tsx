
import React from 'react';

export interface TaskItemProps {
  title: string;
  dueDate: string;
  status: 'pending' | 'processing' | 'allocated' | 'completed' | 'received' | 'inspection' | 'awaiting storage' | 'in storage process';
  to: string;
  onClick?: () => void;
}

const TaskItem = ({ title, dueDate, status, to, onClick }: TaskItemProps) => {
  const statusColors = {
    pending: 'text-amber-600 bg-amber-50 border-amber-200',
    processing: 'text-blue-600 bg-blue-50 border-blue-200',
    allocated: 'text-green-600 bg-green-50 border-green-200',
    completed: 'text-gray-600 bg-gray-50 border-gray-200',
    received: 'text-purple-600 bg-purple-50 border-purple-200',
    inspection: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    'awaiting storage': 'text-orange-600 bg-orange-50 border-orange-200',
    'in storage process': 'text-indigo-600 bg-indigo-50 border-indigo-200',
  };
  
  const statusDisplay = {
    pending: 'Pendente',
    processing: 'Processando',
    allocated: 'Alocado',
    completed: 'Completo',
    received: 'Recebido',
    inspection: 'Inspeção',
    'awaiting storage': 'Aguardando Armazenamento',
    'in storage process': 'Em Processo de Armazenamento',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div 
      className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{dueDate}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[status]}`}>
        {statusDisplay[status]}
      </span>
    </div>
  );
};

export default TaskItem;
