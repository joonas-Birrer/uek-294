import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Todo App</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/home" routerLinkActive="active-link">Home</a>
      <a mat-button routerLink="/todo/list" routerLinkActive="active-link">Todos</a>
      <ng-container *ngIf="auth.isLoggedIn(); else loginBtn">
        <span class="username">{{ auth.getUsername() }}</span>
        <button mat-button (click)="auth.logout()">
          <mat-icon>logout</mat-icon> Logout
        </button>
      </ng-container>
      <ng-template #loginBtn>
        <button mat-button (click)="auth.login()">
          <mat-icon>login</mat-icon> Login
        </button>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .username { margin-right: 8px; font-size: 14px; }
    .active-link { background: rgba(255,255,255,0.15); border-radius: 4px; }
  `],
})
export class NavComponent {
  constructor(public auth: AuthService) {}
}
