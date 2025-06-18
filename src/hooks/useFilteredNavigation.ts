
import { useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { navigationSections } from '@/constants/navigation';
import { NavigationSection } from '@/types/navigation';

export const useFilteredNavigation = (): NavigationSection[] => {
  const { hasRouteAccess, user } = useAuth();

  const filteredNavigationSections = useMemo(() => {

    const filtered = navigationSections.map(section => {

      const filteredItems = section.items.filter(item => {
        const hasAccess = hasRouteAccess(item.route);
        if (item.name === 'Histórico de cargas') return true;
        return hasAccess;
      });

      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => {
      const keepSection = section.items.length > 0;
      return keepSection;
    });


    return filtered;
  }, [hasRouteAccess, user]);

  return filteredNavigationSections;
};
