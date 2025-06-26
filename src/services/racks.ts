import { ApiResponse } from '@/types/apiResponse';
import { Rack } from '@/types/warehouse';
import { request } from './httpService';
import { GetParams } from '@/types/getParams';

interface RackBody {
  shelfTypeId: string;
  name: string;
  columns: number;
  rows: number;
}

export const rackService = {
  getAll: (params?: GetParams): Promise<ApiResponse<Rack>> => {
    return request<ApiResponse<Rack>>('get', '/rack', params);
  },

  getById: (id: string): Promise<Rack> => {
    return request<Rack>('get', '/rack', undefined, {
      params: { rackId: id },
    });
  },

  create: (rackData: RackBody): Promise<Rack> => {
    return request<Rack>('post', '/rack', rackData);
  },

  update: (
    id: string,
    rackData: RackBody
  ): Promise<Rack> => {
    return request<Rack>('put', '/rack', rackData, {
      params: { rackId: id },
    });
  },

  inactivate: (rackId: string): Promise<void> => {
    return request<void>('put', '/rack/inactivate', undefined, {
      params: { rackId },
    });
  },

  reactivate: (rackId: string): Promise<void> => {
    return request<void>('put', '/rack/reactivate', undefined, {
      params: { rackId },
    });
  },
};
