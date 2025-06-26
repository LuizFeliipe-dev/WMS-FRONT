export interface IProductGroup {
  id: string;
  name: string;
  parentId?: string;
  zoneId?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  children?: IProductGroup[];
}
