import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import {
  TodoApiActivePatchDto,
  TodoApiCreateDto,
  TodoApiItem,
  TodoApiUpdateDto,
  TodoCreateDto,
  TodoItem,
  TodoUpdateDto,
} from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/todo/data';
  private readonly adminApiUrl = '/api/todo/admin';

  readonly items = signal<TodoItem[]>([
    {
      id: 'f8c5f42a-3f89-4830-9062-3ac47ce5833f',
      name: 'Prepare milestone board',
      description: 'Create milestones and map issues before implementation starts.',
      closed: false,
      active: true,
    },
    {
      id: '189d22aa-8ce3-4480-b5ed-99d38967679b',
      name: 'Draft README conclusion',
      description: 'Write a personal project conclusion and attach it to the final issue.',
      closed: true,
      active: false,
    },
  ]);
  readonly loading = signal(false);

  private mapApiItemToItem(item: TodoApiItem): TodoItem {
    return {
      id: item.guid,
      name: item.name,
      description: item.description,
      closed: item.state === 'closed',
      active: item.active,
    };
  }

  private mapCreateDto(dto: TodoCreateDto): TodoApiCreateDto {
    return {
      guid: dto.id,
      name: dto.name,
      description: dto.description,
    };
  }

  private mapUpdateDto(id: string, dto: TodoUpdateDto): TodoApiUpdateDto {
    return {
      guid: id,
      name: dto.name,
      description: dto.description,
      state: dto.closed ? 'closed' : 'open',
    };
  }

  async load(showAll = false): Promise<void> {
    this.loading.set(true);

    try {
      const items = await firstValueFrom(
        this.http.get<TodoApiItem[]>(this.apiUrl, {
          params: { showAll: String(showAll) },
        }).pipe(
          map((apiItems) => apiItems.map((item) => this.mapApiItemToItem(item))),
          catchError((error) => {
            console.error('Failed to load todos:', error);
            return of(this.items());
          }),
        ),
      );
      this.items.set(items);
    } finally {
      this.loading.set(false);
    }
  }

  async byId(id: string, showAll = false): Promise<TodoItem | undefined> {
    const local = this.items().find((item) => item.id === id);
    if (local) {
      return local;
    }

    return firstValueFrom(
      this.http.get<TodoApiItem>(`${this.apiUrl}/${id}`, {
        params: { showAll: String(showAll) },
      }).pipe(
        map((item) => (item ? this.mapApiItemToItem(item) : undefined)),
        catchError(() => of(undefined)),
      ),
    );
  }

  async create(dto: TodoCreateDto): Promise<void> {
    const newItem: TodoItem = {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      closed: false,
      active: dto.active,
    };
    const next = [...this.items(), newItem];
    this.items.set(next);

    try {
      const result = await firstValueFrom(
        this.http.post<TodoApiItem>(this.apiUrl, this.mapCreateDto(dto)),
      );
      const mapped = this.mapApiItemToItem(result);
      const updated = this.items().map((item) => (item.id === dto.id ? mapped : item));
      this.items.set(updated);
    } catch (error) {
      this.items.set(this.items().filter((item) => item.id !== dto.id));
      console.error('Failed to create todo:', error);
      throw error;
    }
  }

  async update(id: string, dto: TodoUpdateDto): Promise<void> {
    const original = this.items().find((item) => item.id === id);
    const next = this.items().map((item) => (item.id === id ? { ...item, ...dto } : item));
    this.items.set(next);

    try {
      const payload = this.mapUpdateDto(id, dto);
      const result = await firstValueFrom(
        this.http.put<TodoApiItem>(`${this.apiUrl}/${id}`, payload),
      );
      const mapped = this.mapApiItemToItem(result);
      const updated = this.items().map((item) => (item.id === id ? mapped : item));
      this.items.set(updated);
    } catch (error) {
      if (original) {
        const restored = this.items().map((item) => (item.id === id ? original : item));
        this.items.set(restored);
      }
      console.error('Failed to update todo:', error);
      throw error;
    }
  }

  async toggleClosed(id: string, closed: boolean): Promise<void> {
    const item = this.items().find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    await this.update(id, {
      name: item.name,
      description: item.description,
      closed,
      active: item.active,
    });
  }

  async toggleActive(id: string, active: boolean): Promise<void> {
    const item = this.items().find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    const optimistic = this.items().map((entry) =>
      entry.id === id ? { ...entry, active } : entry,
    );
    this.items.set(optimistic);

    try {
      const payload: TodoApiActivePatchDto = { active };
      const result = await firstValueFrom(
        this.http.patch<TodoApiItem>(`${this.adminApiUrl}/${id}`, payload),
      );
      const mapped = this.mapApiItemToItem(result);
      const updated = this.items().map((entry) => (entry.id === id ? mapped : entry));
      this.items.set(updated);
    } catch (error) {
      const restored = this.items().map((entry) => (entry.id === id ? item : entry));
      this.items.set(restored);
      console.error('Failed to toggle todo active state:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const original = this.items();
    this.items.set(this.items().filter((item) => item.id !== id));

    try {
      await firstValueFrom(
        this.http.delete<void>(`${this.adminApiUrl}/${id}`),
      );
    } catch (error) {
      this.items.set(original);
      console.error('Failed to delete todo:', error);
      throw error;
    }
  }
}

