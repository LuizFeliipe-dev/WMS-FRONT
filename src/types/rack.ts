import { IShelf, IShelfType } from './shelf'

export interface IRack {
  id          : string,
  shelfTypeId : string,
  rows        : number,
  active      : boolean,
  createdAt   : Date,
  updatedAt   : Date,
  columns     : number,
  accessLogId : string,
  name        : string,
  shelfType   : IShelfType
  shelves     : IShelf[]
}
