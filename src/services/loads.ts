import { CreateLoadData, ILoad } from '@/types/load';
import { request } from './httpService';
import { ApiResponse } from '@/types/apiResponse';

export const loadService = {
  create: (loadData: CreateLoadData): Promise<ILoad> => {
    return request<ILoad>('post', '/load', loadData);
  },

  getAll: (): Promise<ApiResponse<ILoad>> => {
    return request<ApiResponse<ILoad>>('get', '/load');
  },

  updateStatus: (loadId: string, status: string): Promise<void> => {
    return request<void>('put', '/load/status', { status }, {
      params: { loadId }
    });
  },
};
