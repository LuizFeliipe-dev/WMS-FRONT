import { useMemo } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { navigationSections } from '@/constants/navigation';
import { NavigationSection } from '@/types/navigation';
import { canAccessEntry, canAccessTransaction, canAccessTasks, canAccessTaskHistory } from '@/contexts/eventAccess';


export const useFilteredNavigation = (): NavigationSection[] => {
  const { hasRouteAccess, user } = useAuth();

  const filteredNavigationSections = useMemo(() => {
    if (!user) return [];

    return navigationSections
      .map(section => {
        const filteredItems = section.items.filter(item => {
          if (item.name === 'Entrada') return canAccessEntry(user);
          if (item.name === 'Transação') return canAccessTransaction(user);
          if (item.name === 'Tarefas') return canAccessTasks(user);
          if (item.name === 'Histórico de Cargas') return canAccessTaskHistory(user);

          return hasRouteAccess(item.route);
        });

        return { ...section, items: filteredItems };
      })
      .filter(section => section.items.length > 0);
  }, [hasRouteAccess, user]);

  return filteredNavigationSections;
};
