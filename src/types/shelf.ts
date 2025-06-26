import { IPackage } from './package';
import { IRack } from './rack';
import { ITransaction } from './transaction';

export interface IShelf {
  id               : string,
  rackId           : string,
  position         : string,
  active           : boolean
  createdAt        : Date
  updatedAt        : Date
  accessLogId      : string,
  package          : IPackage[]
  rack             : IRack
  fromTransactions : ITransaction[],
  toTransactions   : ITransaction[],
}

export interface IShelfType {
  id          : string,
  name        : string,
  height      : number,
  width       : number,
  depth       : number,
  maxWeight   : number,
  stackable   : boolean,
  active      : boolean,
  createdAt   : Date,
  updatedAt   : Date,
  accessLogId : string,
  racks       : IRack[],
}
