export interface Todo {
  id: number;
  title: string;
  description?: string;
  active: boolean;
  closed: boolean;
  createdAt?: string;
  updatedAt?: string;
}
