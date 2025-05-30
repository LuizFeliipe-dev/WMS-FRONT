
export type UserPermission = 'initial' | 'second' | 'manager';

export type UserPermissionModule = 'USUARIO' | 'ARMAZEM' | 'INVENTARIO' | 'RELATORIO';
export type UserPermissionAction = 'Leitura' | 'Escrita' | 'Administrador';

export interface UserPermissionOption {
  module: UserPermissionModule;
  action: UserPermissionAction;
  value: UserPermission;
}

export interface User {
  id: string;
  name: string;
  email: string;
  permission: UserPermission;
}

export interface PermissionData {
  module: UserPermissionModule;
  read: boolean;
  write: boolean;
}
