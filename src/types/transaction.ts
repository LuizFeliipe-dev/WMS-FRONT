import { IUser } from './user';
import { IPackage } from './package'
import { IShelf } from './shelf';

export interface ITransaction {
  id              : string,
  userId          : string,
  shelfFromId     : string,
  shelfToId       : string,
  createdAt       : Date
  packageId       : string,
  accessLogId     : string,
  transactionType : 'INBOUND' | 'OUTBOUND' | 'INTERNAL_TRANSFER',
  quantity        : number,
  package         : IPackage,
  shelfFrom       : IShelf,
  shelfTo         : IShelf,
  User            : IUser
}


export interface CreateTransactionRequest {
  id: string;
  transactionType: 'OUTBOUND' | 'INTERNAL_TRANSFER';
  quantity: number;
  shelfFromId: string;
  shelfToId: string;
}
