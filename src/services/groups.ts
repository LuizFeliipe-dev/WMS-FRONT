import { IProductGroup } from '@/types/group';
import { ApiResponse } from '@/types/apiResponse';
import { request } from './httpService';
import { GetParams } from '@/types/getParams';

export const groupService = {
  getAll: async (params?: GetParams): Promise<ApiResponse<IProductGroup>> => {
    return await request<ApiResponse<IProductGroup>>('get', '/product/group', params);
  },

  getById: (id: string): Promise<IProductGroup> => {
    return request<IProductGroup>('get', `/product/group/${id}`);
  },

  create: (groupData: Omit<IProductGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProductGroup> => {
    return request<IProductGroup>('post', '/product/group', groupData);
  },

  update: (id: string, groupData: Partial<Omit<IProductGroup, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IProductGroup> => {
    return request<IProductGroup>('put', '/product/group', groupData, {
      params: { productGroupId: id },
    });
  },

  inactivate: (id: string): Promise<IProductGroup> => {
    return request<IProductGroup>('put', '/product/group/inactivate', undefined, {
      params: { productGroupId: id },
    });
  },

  reactivate: (id: string): Promise<IProductGroup> => {
    return request<IProductGroup>('put', '/product/group/reactivate', undefined, {
      params: { productGroupId: id },
    });
  },
};
