import { ApiResponse } from '@/types/apiResponse';
import { ISupplier, ISupplierContact } from '@/types/supplier';
import { request } from './httpService';

export const supplierContactService = {
  getBySupplierId: (supplierId: string): Promise<ApiResponse<ISupplierContact>> => {
    return request<ApiResponse<ISupplierContact>>(
      'get',
      `/supplier/contact?supplierId=${supplierId}`
    );
  },

  inactivate: (contactId: string): Promise<void> => {
    return request<void>('put', '/supplier/inactivate', undefined, {
      params: { contactId },
    });
  },

  reactivate: (contactId: string): Promise<ISupplier> => {
    return request<ISupplier>('put', '/supplier/reactivate', undefined, {
      params: { contactId },
    });
  },

  addContacts: (supplierId: string, contacts: ISupplierContact[]): Promise<void> => {
    return request<void>('post', '/supplier/contact', {
      supplierId,
      contacts: [contacts],
    }, {params: { supplierId }},);
  },

  update: (supplierId: string, data: ISupplierContact): Promise<ISupplierContact> => {
    return request<ISupplierContact>('put', '/supplier/contact', {
      supplierId,
      contactId: data.id,
      ...data,
    }, {
      params: { contactId: data.id },
    });
  },
};
