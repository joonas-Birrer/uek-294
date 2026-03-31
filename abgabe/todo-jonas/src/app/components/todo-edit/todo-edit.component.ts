import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div *ngIf="loading" class="loading">
      <mat-spinner diameter="40"></mat-spinner>
    </div>

    <mat-card class="form-card" *ngIf="!loading && todo">
      <mat-card-header>
        <mat-card-title>Todo bearbeiten</mat-card-title>
        <mat-card-subtitle *ngIf="!todo.active" class="inactive-badge">
          Inaktiv
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <form #editForm="ngForm" (ngSubmit)="onSubmit(editForm)">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Titel</mat-label>
            <input
              matInput
              name="title"
              [(ngModel)]="model.title"
              required
              #title="ngModel"
            />
            <mat-error *ngIf="title.invalid && title.touched">
              Titel ist erforderlich.
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Beschreibung</mat-label>
            <textarea
              matInput
              name="description"
              [(ngModel)]="model.description"
              rows="4">
            </textarea>
          </mat-form-field>

          <div class="toggle-row">
            <mat-slide-toggle name="closed" [(ngModel)]="model.closed">
              Erledigt
            </mat-slide-toggle>

            <mat-slide-toggle
              *ngIf="auth.isAdmin()"
              name="active"
              [(ngModel)]="model.active">
              Aktiv
            </mat-slide-toggle>
          </div>

          <div class="form-actions">
            <a mat-button routerLink="/todo/list">Abbrechen</a>
            <button mat-raised-button color="primary" type="submit" [disabled]="editForm.invalid || saving">
              {{ saving ? 'Speichern...' : 'Speichern' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-card { max-width: 600px; margin: 24px auto; }
    .full-width { width: 100%; margin-bottom: 16px; display: block; }
    .toggle-row { display: flex; gap: 24px; margin-bottom: 16px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
    .loading { display: flex; justify-content: center; padding: 40px; }
    .inactive-badge { color: #f44336; }
  `],
})
export class TodoEditComponent implements OnInit {
  todo: Todo | null = null;
  model = { title: '', description: '', closed: false, active: true };
  loading = true;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
    public auth: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.todoService.getById(id).subscribe({
      next: (todo) => {
        this.todo = todo;
        this.model = {
          title: todo.title,
          description: todo.description ?? '',
          closed: todo.closed,
          active: todo.active,
        };
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Todo nicht gefunden', 'OK', { duration: 3000 });
        this.router.navigate(['/todo/list']);
      },
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.todo) return;
    this.saving = true;
    this.todoService.update(this.todo.id, this.model).subscribe({
      next: () => {
        this.snackBar.open('Todo gespeichert!', '', { duration: 2000 });
        this.router.navigate(['/todo/list']);
      },
      error: () => {
        this.snackBar.open('Fehler beim Speichern', 'OK', { duration: 3000 });
        this.saving = false;
      },
    });
  }
}
