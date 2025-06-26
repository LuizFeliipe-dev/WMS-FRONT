
import { UserPermission, PermissionData } from './auth';
import { IRole } from './role';

export interface UserFormValues {
  name: string;
  email: string;
  role: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  cargo?: string;
  role: string;
  permissions: PermissionData[];
  permission: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  roles: IRole[];
}
