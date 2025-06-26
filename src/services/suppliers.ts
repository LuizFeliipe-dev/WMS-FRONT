import { ApiResponse } from '@/types/apiResponse';
import { ISupplier } from '@/types/supplier';
import { GetParams } from '@/types/getParams';
import { request } from './httpService';

type SupplierPayload = { name: string };

export const supplierService = {
  getAll: (params?: GetParams): Promise<ApiResponse<ISupplier>> => {
    return request<ApiResponse<ISupplier>>('get', '/supplier', params);
  },

  getById: (id: string): Promise<ISupplier> => {
    return request<ISupplier>('get', `/supplier/${id}`);
  },

  create: (data: SupplierPayload): Promise<ISupplier> => {
    return request<ISupplier>('post', '/supplier', data);
  },

  update: (id: string, data: SupplierPayload): Promise<ISupplier> => {
    return request<ISupplier>('put', '/supplier', data, {
      params: { supplierId: id },
    });
  },

  inactivate: (id: string): Promise<void> => {
    return request<void>('put', '/supplier/inactivate', undefined, {
      params: { supplierId: id },
    });
  },

  reactivate: (id: string): Promise<ISupplier> => {
    return request<ISupplier>('put', '/supplier/reactivate', undefined, {
      params: { supplierId: id },
    });
  },
};
