import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="list-header">
      <h2>Meine Todos</h2>
      <a mat-raised-button color="primary" routerLink="/todo/new">
        <mat-icon>add</mat-icon> Neues Todo
      </a>
    </div>

    <div *ngIf="loading" class="loading">
      <mat-spinner diameter="40"></mat-spinner>
    </div>

    <table mat-table [dataSource]="visibleTodos" class="mat-elevation-z2 todo-table" *ngIf="!loading">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Titel</th>
        <td mat-cell *matCellDef="let todo">
          <span [class.inactive]="!todo.active">{{ todo.title }}</span>
        </td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Beschreibung</th>
        <td mat-cell *matCellDef="let todo">{{ todo.description }}</td>
      </ng-container>

      <ng-container matColumnDef="closed">
        <th mat-header-cell *matHeaderCellDef>Erledigt</th>
        <td mat-cell *matCellDef="let todo">
          <mat-slide-toggle
            [checked]="todo.closed"
            (change)="onToggleClosed(todo, $event.checked)">
          </mat-slide-toggle>
        </td>
      </ng-container>

      <ng-container matColumnDef="active">
        <th mat-header-cell *matHeaderCellDef>Aktiv</th>
        <td mat-cell *matCellDef="let todo">
          <mat-slide-toggle
            *ngIf="auth.isAdmin()"
            [checked]="todo.active"
            (change)="onToggleActive(todo, $event.checked)">
          </mat-slide-toggle>
          <span *ngIf="!auth.isAdmin()">{{ todo.active ? 'Ja' : 'Nein' }}</span>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Aktionen</th>
        <td mat-cell *matCellDef="let todo">
          <a mat-icon-button [routerLink]="['/todo/edit', todo.id]" title="Bearbeiten">
            <mat-icon>edit</mat-icon>
          </a>
          <button
            mat-icon-button
            color="warn"
            *ngIf="auth.isAdmin()"
            (click)="onDelete(todo)"
            title="Löschen">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <p *ngIf="!loading && visibleTodos.length === 0" class="empty-message">
      Keine Todos vorhanden.
    </p>
  `,
  styles: [`
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .todo-table { width: 100%; }
    .loading { display: flex; justify-content: center; padding: 40px; }
    .inactive { color: #999; text-decoration: line-through; }
    .empty-message { text-align: center; padding: 40px; color: #666; }
  `],
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  loading = true;

  displayedColumns = ['title', 'description', 'closed', 'active', 'actions'];

  constructor(
    public auth: AuthService,
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {}

  get visibleTodos(): Todo[] {
    // Admins see all todos (active and inactive); regular users only see active ones
    if (this.auth.isAdmin()) {
      return this.todos;
    }
    return this.todos.filter((t) => t.active);
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.todoService.getAll().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Fehler beim Laden der Todos', 'OK', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  onToggleClosed(todo: Todo, closed: boolean): void {
    this.todoService.toggleClosed(todo.id, closed).subscribe({
      next: (updated) => {
        todo.closed = updated.closed;
        this.snackBar.open('Status aktualisiert', '', { duration: 2000 });
      },
      error: () =>
        this.snackBar.open('Fehler beim Aktualisieren', 'OK', { duration: 3000 }),
    });
  }

  onToggleActive(todo: Todo, active: boolean): void {
    if (!this.auth.isAdmin()) return;
    this.todoService.toggleActive(todo.id, active).subscribe({
      next: (updated) => {
        todo.active = updated.active;
        this.snackBar.open('Aktiv-Status aktualisiert', '', { duration: 2000 });
      },
      error: () =>
        this.snackBar.open('Fehler beim Aktualisieren', 'OK', { duration: 3000 }),
    });
  }

  onDelete(todo: Todo): void {
    if (!this.auth.isAdmin()) return;
    if (!confirm(`Todo "${todo.title}" wirklich löschen?`)) return;
    this.todoService.delete(todo.id).subscribe({
      next: () => {
        this.todos = this.todos.filter((t) => t.id !== todo.id);
        this.snackBar.open('Todo gelöscht', '', { duration: 2000 });
      },
      error: () =>
        this.snackBar.open('Fehler beim Löschen', 'OK', { duration: 3000 }),
    });
  }
}
