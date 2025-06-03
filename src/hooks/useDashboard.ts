
import { useQuery } from '@tanstack/react-query';
import { getAuthHeader } from '@/utils/auth';

export interface DashboardLoad {
  id: string;
  value: number;
  createdAt: string;
  status: string;
  supplierId: string;
}

export interface DashboardData {
  loadsThisMonth: number;
  suppliersThisMonth: number;
  totalValueThisMonth: number;
  pendingAllocationCount: number;
  lastThreeLoads: DashboardLoad[];
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/monthly`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
  }

  return response.json();
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'monthly'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
