
import React from 'react';

export interface ActivityItemProps {
  title: string;
  time: string;
  icon: React.ReactNode;
}

const ActivityItem = ({ title, time, icon }: ActivityItemProps) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
      <div className="bg-primary/10 text-primary p-2 rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
