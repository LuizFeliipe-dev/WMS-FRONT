
import { UserPermission, PermissionData } from './auth';
import { Role } from './role';

export interface UserFormValues {
  name: string;
  email: string;
  role: string;
  department: string;
  permission: UserPermission;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permission: string;
  lastAccess: string;
  permissions?: PermissionData[];
  // New fields from API payload
  cargo: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}
