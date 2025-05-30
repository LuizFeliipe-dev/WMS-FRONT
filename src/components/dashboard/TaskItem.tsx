
import React from 'react';

export interface TaskItemProps {
  title: string;
  dueDate: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  to: string;
}

const TaskItem = ({ title, dueDate, priority, to }: TaskItemProps) => {
  const priorityColors = {
    Alta: 'text-red-600 bg-red-50 border-red-200',
    Média: 'text-amber-600 bg-amber-50 border-amber-200',
    Baixa: 'text-blue-600 bg-blue-50 border-blue-200',
  };
  
  return (
    <div className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{dueDate}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[priority]}`}>
        {priority}
      </span>
    </div>
  );
};

export default TaskItem;
