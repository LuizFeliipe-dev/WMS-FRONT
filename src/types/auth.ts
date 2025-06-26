export type UserPermission = 'initial' | 'second' | 'manager';

export type UserPermissionModule = 'USUARIO' | 'ARMAZEM' | 'INVENTARIO' | 'RELATORIO';
export type UserPermissionAction = 'Leitura' | 'Escrita' | 'Administrador';

export interface UserPermissionOption {
  module: UserPermissionModule;
  action: UserPermissionAction;
  value: UserPermission;
}

export interface RoutePermission {
  route: string;
  writer: boolean;
}

export interface User {
  userId: string;
  email: string;
  routes: RoutePermission[];
}

export interface LoginResponse {
  userId: string;
  email: string;
  routes: RoutePermission[];
  token: string;
}

export interface PermissionData {
  module: UserPermissionModule;
  read: boolean;
  write: boolean;
}
