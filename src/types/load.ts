import { IPackage } from './package'
import { ISupplier } from './supplier'

export interface ILoad {
  id:           string,
  supplierId:     string,
  value:         number,
  status         : 'Received' | 'Processing' | 'Stored' | 'Dispatched' | 'Rejected' | 'Cancelled',
  createdAt      : Date,
  updatedAt      : Date,
  documentNumber: string,
  accessLogId:    string,
  supplier  :     ISupplier,
  package       : IPackage[]
}

export enum LoadStatus {
  Received = 'Recebido',
  Processing = 'Processando',
  Stored = 'Armazenado',
  Dispatched = 'Despachado',
  Rejected = 'Rejeitado',
  Cancelled = 'Cancelado'
}

export interface LoadPackage {
  quantity: number;
  height: number;
  width: number;
  length: number;
  weight: number;
  productId: number;
}

export interface CreateLoadData {
  supplierId: string;
  documentNumber: string;
  value: number;
  package: LoadPackage[];
}
