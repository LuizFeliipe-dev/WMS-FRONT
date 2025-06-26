import { ApiResponse } from '@/types/apiResponse';
import { ApiProductRequest, IProduct } from '@/types/product';
import { request } from './httpService';
import { GetParams } from '@/types/getParams';

export const productService = {
  getAll: (params?: GetParams): Promise<ApiResponse<IProduct>> => {
    return request<ApiResponse<IProduct>>('get', '/product', params);
  },

  create: (productData: ApiProductRequest): Promise<IProduct> => {
    return request<IProduct>('post', '/product', productData);
  },

  update: (id: string, productData: ApiProductRequest): Promise<IProduct> => {
    return request<IProduct>('put', `/product/${id}`, productData);
  },

  inactivate: (id: string): Promise<IProduct> => {
    return request<IProduct>('put', `/product/inactivate/${id}`);
  },

  reactivate: (id: string): Promise<IProduct> => {
    return request<IProduct>('put', `/product/reactivate/${id}`);
  },
};
