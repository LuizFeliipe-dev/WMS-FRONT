// services/shelfTypeService.ts
import { ApiResponse } from '@/types/apiResponse';
import { IShelfType } from '@/types/shelf';
import { request } from './httpService';
import { GetParams } from '@/types/getParams';

type ShelfTypePayload = {
  name: string;
  height: number;
  width: number;
  depth: number;
  maxWeight: number;
  stackable: boolean;
};

export const shelfTypeService = {
  getAll: (params?: GetParams): Promise<ApiResponse<IShelfType>> => {
    return request<ApiResponse<IShelfType>>('get', '/shelf/type', params)
  },

  getById: (id: string): Promise<IShelfType> => {
    return request<IShelfType>('get', '/shelf/type', undefined, {
      params: { shelfTypeId: id },
    });
  },

  create: (data: ShelfTypePayload): Promise<IShelfType> => {
    return request<IShelfType>('post', '/shelf/type', data);
  },

  update: (id: string, data: ShelfTypePayload): Promise<IShelfType> => {
    return request<IShelfType>('put', '/shelf/type', data, {
      params: { shelfTypeId: id },
    });
  },

  reactivate: (id: string): Promise<IShelfType> => {
    return request<IShelfType>('put', '/shelf/type/reactivate', undefined, {
      params: { shelfTypeId: id },
    });
  },

  inactivate: (id: string): Promise<IShelfType> => {
    return request<IShelfType>('put', '/shelf/type/inactivate', undefined, {
      params: { shelfTypeId: id },
    });
  },
};
