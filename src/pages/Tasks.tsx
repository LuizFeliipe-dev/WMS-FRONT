
import React from 'react';
import { useEntries } from '@/hooks/useEntries';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import TaskItem from '@/components/dashboard/TaskItem';

const Tasks = () => {
  const { entries } = useEntries();
  
  // Filter entries that don't have "allocated" status
  const pendingEntries = entries.filter(entry => entry.status !== 'allocated');

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold">Tarefas Pendentes</h1>
            <p className="text-gray-500 mt-1">
              Gerencie suas tarefas pendentes no sistema
            </p>
          </header>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="space-y-3">
              {pendingEntries.length > 0 ? (
                pendingEntries.map(entry => (
                  <TaskItem 
                    key={entry.id}
                    title={`Entrada de mercadorias - Pedido #${entry.orderNumber}`}
                    dueDate={entry.date}
                    priority={entry.priority}
                    to={`/entry?order=${entry.orderNumber}`}
                  />
                ))
              ) : (
                <div className="text-gray-500 py-6 text-center">
                  Não há tarefas pendentes no momento
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </ResponsiveContainer>
    </div>
  );
};

export default Tasks;
