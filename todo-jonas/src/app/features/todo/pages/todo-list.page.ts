import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TodoService } from '../data/todo.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TodoRowComponent } from '../components/todo-row/todo-row.component';
import { TodoHeaderComponent } from '../components/todo-header/todo-header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TodoDeleteDialogComponent } from '../components/todo-delete-dialog/todo-delete-dialog.component';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-todo-list-page',
  standalone: true,
  imports: [
    TodoHeaderComponent,
    TodoRowComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './todo-list.page.html',
  styleUrl: './todo-list.page.scss',
})
export class TodoListPageComponent {
  protected readonly todoService = inject(TodoService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  protected readonly todos = computed(() => {
    const all = this.todoService.items();
    if (this.authService.isAdmin()) {
      return all;
    }
    return all.filter((todo) => todo.active);
  });
  async ngOnInit(): Promise<void> {
    await this.todoService.load(this.authService.isAdmin());
  }
  async refresh(): Promise<void> {
    await this.todoService.load(this.authService.isAdmin());
  }
  async toggleClosed(event: { id: string; checked: boolean }): Promise<void> {
    try {
      await this.todoService.toggleClosed(event.id, event.checked);
    } catch (error) {
      console.error('Error toggling todo closed state:', error);
      alert('Failed to update todo. Please try again.');
    }
  }
  async toggleActive(event: { id: string; checked: boolean }): Promise<void> {
    if (!this.authService.isAdmin()) {
      return;
    }

    try {
      await this.todoService.toggleActive(event.id, event.checked);
      await this.refresh();
    } catch (error) {
      console.error('Error toggling todo active state:', error);
      alert('Failed to update active state. Please try again.');
    }
  }
  async remove(id: string): Promise<void> {
    if (!this.authService.isAdmin()) {
      return;
    }
    const todo = this.todoService.items().find((entry) => entry.id === id);
    if (!todo) {
      return;
    }
    const dialogRef = this.dialog.open(TodoDeleteDialogComponent, {
      width: '310px',
      data: { name: todo.name },
    });
    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmed) {
      return;
    }
    try {
      await this.todoService.remove(id);
      await this.refresh();
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo. Please try again.');
    }
  }
  createNew(): void {
    void this.router.navigateByUrl('/todo/new');
  }
}
