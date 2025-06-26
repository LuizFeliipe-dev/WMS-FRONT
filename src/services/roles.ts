import { ApiResponse } from '@/types/apiResponse';
import { IRole } from '@/types/role';
import { request } from './httpService';

export const roleService = {
  getAll: (): Promise<IRole[]> => {
    return request<ApiResponse<IRole>>('get', '/role').then(
      (res) => res.data || []
    );
  },

  getById: (id: string): Promise<IRole> => {
    return request<IRole>('get', `/role/${id}`);
  },

  create: (roleData: Partial<IRole>): Promise<IRole> => {
    return request<IRole>('post', '/role', roleData);
  },

  update: (id: string, roleData: Partial<IRole>): Promise<IRole> => {
    return request<IRole>('put', `/role/${id}`, roleData);
  },
};
