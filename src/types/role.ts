
export interface IRole {
  id: string;
  name: string;
  active: boolean;
  accessLogId: string;
  createdAt: string;
  updatedAt: string;
  writer?: boolean
}
