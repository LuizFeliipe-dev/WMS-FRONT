import { ILoad } from './load';
import { IProduct } from './product';
import { IShelf } from './shelf';
import { ITransaction } from './transaction';
export interface IPackage {
  id         : string,
  shelfId     : string,
  loadId      : string,
  productId   : string,
  quantity    : number,
  height      : number,
  width       : number,
  length      : number,
  weight      : number,
  stackable   : number,
  packageType : 'BX' | 'CT' | 'PL',
  createdAt   : Date,
  updatedAt   : Date,
  accessLogId : string,
  deducted    : number,
  load       : ILoad,
  product     : IProduct
  shelf       : IShelf
  transaction : ITransaction[]
}

export enum PackageType {
  BX = 'BX',
  CT = 'CT',
  PL = 'PL'
}
