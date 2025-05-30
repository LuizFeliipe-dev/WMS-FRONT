
export interface WarehouseLocation {
  id: number;
  code: string;
  name: string;
  description?: string;
  rackId: string;
}

export interface Rack {
  id: number;
  code: string;
  name: string;
  description?: string;
  corridorId: string;
  shelfTypeId?: string;
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

export interface Zone {
  id: string;
  name: string;
  rackIds: string[];
}
