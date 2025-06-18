
import { UserPermission, PermissionData } from './auth';
import { Role } from './role';

export interface UserFormValues {
  name: string;
  email: string;
  role: string;
}

export interface UserData {
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
  roles: Role[];
}
