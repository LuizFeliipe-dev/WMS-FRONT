
export interface ISupplier {
  id: string,
  name: string,
  active: boolean,
  accessLogId: string,
  createdAt: Date | string,
  updatedAt: Date | string,
  email?: string,
  phone?: string,
  address?: string
}

export interface ISupplierContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  supplierId: string;
  createdAt: string;
  updatedAt: string;
}
