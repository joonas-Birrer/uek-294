import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-todo-new',
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
  ],
  template: `
    <mat-card class="form-card">
      <mat-card-header>
        <mat-card-title>Neues Todo erstellen</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form #todoForm="ngForm" (ngSubmit)="onSubmit(todoForm)">
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

          <div class="form-actions">
            <a mat-button routerLink="/todo/list">Abbrechen</a>
            <button mat-raised-button color="primary" type="submit" [disabled]="todoForm.invalid || saving">
              {{ saving ? 'Speichern...' : 'Erstellen' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-card { max-width: 600px; margin: 24px auto; }
    .full-width { width: 100%; margin-bottom: 16px; display: block; }
    .form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
  `],
})
export class TodoNewComponent {
  model = { title: '', description: '' };
  saving = false;

  constructor(
    private todoService: TodoService,
    public auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    this.saving = true;
    this.todoService.create(this.model).subscribe({
      next: () => {
        this.snackBar.open('Todo erstellt!', '', { duration: 2000 });
        this.router.navigate(['/todo/list']);
      },
      error: () => {
        this.snackBar.open('Fehler beim Erstellen', 'OK', { duration: 3000 });
        this.saving = false;
      },
    });
  }
}
