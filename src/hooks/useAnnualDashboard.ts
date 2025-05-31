
import { useQuery } from '@tanstack/react-query';
import { getAuthHeader } from '@/utils/auth';

export interface AnnualDashboardItem {
  year: number;
  month: number;
  loadsCount: number;
  loadsValue: number;
  uniqueSuppliers: number;
  pendingLoadsCount: number;
}

export interface AnnualDashboardData {
  dashboard: AnnualDashboardItem[];
}

const fetchAnnualDashboardData = async (): Promise<AnnualDashboardData> => {
  const response = await fetch('https://33kg2j8r-3000.brs.devtunnels.ms/dashboard/annual', {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch annual dashboard data: ${response.statusText}`);
  }

  return response.json();
};

export const useAnnualDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'annual'],
    queryFn: fetchAnnualDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
