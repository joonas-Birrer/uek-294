export interface TodoItem {
  id: string;
  name: string;
  description: string;
  closed: boolean;
  active: boolean;
}

export interface TodoApiItem {
  guid: string;
  name: string;
  description: string;
  state: 'open' | 'closed';
  active: boolean;
}

export interface TodoApiCreateDto {
  guid: string;
  name: string;
  description: string;
}

export interface TodoApiUpdateDto {
  guid: string;
  name: string;
  description: string;
  state: 'open' | 'closed';
}

export interface TodoApiActivePatchDto {
  active: boolean;
}

export interface TodoCreateDto {
  id: string;
  name: string;
  description: string;
}

export interface TodoUpdateDto {
  name: string;
  description: string;
  closed: boolean;
  active: boolean;
}
