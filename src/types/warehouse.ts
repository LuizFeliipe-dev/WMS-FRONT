
export interface Rack {
  id: string;
  shelfTypeId: string;
  name: string;
  columns: number;
  rows: number;
  active: boolean;
  accessLogId: string;
  createdAt: string;
  updatedAt: string;
  shelfType: {
    id: string;
    name: string;
    height: number;
    width: number;
    depth: number;
    maxWeight: number;
    stackable: boolean;
    active: boolean;
  };
  // Campos legados para compatibilidade com o modal
  code?: string;
  description?: string;
  corridorId?: string;
  zoneId?: string;
  verticalShelves?: number;
  horizontalShelves?: number;
}

export interface Corridor {
  id: number;
  code: string;
  name: string;
  description?: string;
  warehouseId: string;
}

export interface BalanceSummary {
  warehouseId: string;
  warehouseName: string;
  currentValue: number;
  inputValue: number;
  outputValue: number;
  month: string;
  year: number;
}

export interface ShelfType {
  id: string;
  name: string;
  height: number;
  width: number;
  depth: number;
  maxWeight: number;
  isStackable: boolean;
}

export interface ZoneGroup {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Zone {
  id: string;
  name: string;
  groups: ZoneGroup[];
  active: boolean;
  accessLogId: string;
  createdAt: string;
  updatedAt: string;
}
