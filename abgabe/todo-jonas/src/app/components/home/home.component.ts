import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="home-card">
      <mat-card-header>
        <mat-card-title>Willkommen bei der Todo App</mat-card-title>
        <mat-card-subtitle *ngIf="auth.isLoggedIn()">
          Eingeloggt als: {{ auth.getUsername() }}
          <span *ngIf="auth.isAdmin()"> (Admin)</span>
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>Verwalte deine Aufgaben einfach und übersichtlich.</p>
      </mat-card-content>
      <mat-card-actions>
        <a mat-raised-button color="primary" routerLink="/todo/list">
          Zu den Todos
        </a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .home-card {
      max-width: 600px;
      margin: 40px auto;
    }
    mat-card-content { padding-top: 16px; }
    mat-card-actions { padding: 16px; }
  `],
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}
