// services/userService.ts
import { ApiResponse } from '@/types/apiResponse';
import { GetParams } from '@/types/getParams';
import { IUser } from '@/types/user';
import { request } from './httpService';

type UserPayload = Partial<IUser> & { password: string; role?: string };

export const userService = {
  getAll: (params?: GetParams): Promise<IUser[]> => {
    return request<ApiResponse<IUser>>('get', '/user', params).then(
      (res) => res.data || []
    );
  },

  getById: (id: string): Promise<IUser> => {
    return request<IUser>('get', `/user/${id}`);
  },

  create: (userData: UserPayload): Promise<IUser> => {
    return request<IUser>('post', '/user', {
      name: userData.name,
      email: userData.email,
      cargo: userData.role,
      password: userData.password,
    });
  },

  update: (id: string, userData: UserPayload): Promise<IUser> => {
    return request<IUser>('put', '/user', {
      name: userData.name,
      email: userData.email,
      cargo: userData.role,
      password: userData.password,
    }, {
      params: { userId: id },
    });
  },

  inactivate: (userId: string): Promise<void> => {
    return request<void>('put', '/user/inactivate', undefined, {
      params: { userId },
    });
  },

  reactivate: (userId: string): Promise<void> => {
    return request<void>('put', '/user/reactivate', undefined, {
      params: { userId },
    });
  },

  saveUserRoles: (
    userId: string,
    payload: { roles: { roleId: string; writer: boolean }[] },
    method: 'POST' | 'PUT' = 'POST'
  ): Promise<void> => {
    return request<void>(method.toLowerCase() as 'post' | 'put', '/user/role', payload, {
      params: { userId },
    });
  },

  deleteUserRole: (userId: string, roleId: string): Promise<void> => {
    return request<void>('delete', '/user/role', undefined, {
      params: { userId, roleId },
    });
  },
};
