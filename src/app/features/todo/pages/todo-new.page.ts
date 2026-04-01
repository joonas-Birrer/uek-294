import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TodoFormComponent } from '../components/todo-form/todo-form.component';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-todo-new-page',
  standalone: true,
  imports: [TodoFormComponent],
  templateUrl: './todo-new.page.html',
})
export class TodoNewPageComponent {
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  async save(value: {
    name: string;
    description: string;
    closed: boolean;
    active: boolean;
  }): Promise<void> {
    try {
      await this.todoService.create({
        id: crypto.randomUUID(),
        name: value.name,
        description: value.description,
        active: value.active,
      });

      await this.todoService.load();
      await this.router.navigateByUrl('/todo/list');
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo. Please try again.');
    }
  }

  cancel(): void {
    void this.router.navigateByUrl('/todo/list');
  }
}
