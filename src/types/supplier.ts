
export interface ISupplier {
  id: string,
  name: string,
  active: boolean,
  accessLogId: string,
  createdAt: Date | string,
  updatedAt: Date | string,
  email?: string,
  phone?: string,
  address?: string
}
