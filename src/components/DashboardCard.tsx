
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value?: string | number;
  description?: string;
  icon: React.ReactNode;
  to: string;
  color?: 'default' | 'blue' | 'green' | 'amber' | 'red' | 'purple';
  className?: string;
}

const DashboardCard = ({
  title,
  value,
  description,
  icon,
  to,
  color = 'default',
  className,
}: DashboardCardProps) => {
  const colors = {
    default: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    green: 'from-green-50 to-green-100 border-green-200 text-green-700',
    amber: 'from-amber-50 to-amber-100 border-amber-200 text-amber-700',
    red: 'from-red-50 to-red-100 border-red-200 text-red-700',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
  };

  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'relative p-6 rounded-xl border shadow-sm overflow-hidden',
          'bg-gradient-to-br',
          colors[color],
          'transition-all duration-300',
          className
        )}
      >
        <div className="absolute top-0 right-0 p-3">{icon}</div>

        <div className="mt-2">
          <h3 className="text-sm font-medium opacity-80">{title}</h3>
          {value && (
            <p className="text-2xl font-semibold mt-1">{value}</p>
          )}
          {description && (
            <p className="text-xs mt-2 opacity-70">{description}</p>
          )}
        </div>

        <div 
          className="absolute bottom-0 right-0 w-24 h-24 -mb-8 -mr-8 rounded-full bg-gradient-to-br from-white/30 to-white/0 opacity-50"
          aria-hidden="true"
        />
      </motion.div>
    </Link>
  );
};

export default DashboardCard;
