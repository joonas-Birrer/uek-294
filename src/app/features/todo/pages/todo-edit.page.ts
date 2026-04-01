import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoFormComponent } from '../components/todo-form/todo-form.component';
import { TodoService } from '../data/todo.service';
import { TodoItem } from '../data/todo.model';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-todo-edit-page',
  standalone: true,
  imports: [TodoFormComponent],
  templateUrl: './todo-edit.page.html',
})
export class TodoEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly todoService = inject(TodoService);
  protected readonly authService = inject(AuthService);

  readonly todo = signal<TodoItem | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      await this.router.navigateByUrl('/todo/list');
      return;
    }

    const item = await this.todoService.byId(id, this.authService.isAdmin());
    if (!item) {
      await this.router.navigateByUrl('/todo/list');
      return;
    }

    this.todo.set(item);
  }

  async save(value: {
    name: string;
    description: string;
    closed: boolean;
    active: boolean;
  }): Promise<void> {
    const item = this.todo();
    if (!item) {
      return;
    }

    try {
      const nextActive = this.authService.isAdmin() ? value.active : item.active;

      await this.todoService.update(item.id, {
        name: value.name,
        description: value.description,
        closed: value.closed,
        active: nextActive,
      });

      if (this.authService.isAdmin() && nextActive !== item.active) {
        await this.todoService.toggleActive(item.id, nextActive);
      }

      await this.todoService.load();
      await this.router.navigateByUrl('/todo/list');
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo. Please try again.');
    }
  }

  cancel(): void {
    void this.router.navigateByUrl('/todo/list');
  }
}
