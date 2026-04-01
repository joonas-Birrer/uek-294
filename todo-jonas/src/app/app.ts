import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly swaggerDocsUrl = '/api/docs';
  private readonly keycloakAdminUrl = '/auth/admin';

  protected async login(): Promise<void> {
    await this.authService.login('/todo/list');
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/home');
  }

  protected async goToHome(): Promise<void> {
    await this.router.navigateByUrl('/home');
  }

  protected async goToTodo(): Promise<void> {
    if (!this.authService.authenticated()) {
      await this.router.navigateByUrl('/home');
      return;
    }

    await this.router.navigateByUrl('/todo/list');
  }

  protected openSwaggerDocs(): void {
    window.open(this.swaggerDocsUrl, '_blank', 'noopener,noreferrer');
  }

  protected openKeycloakAdmin(): void {
    window.open(this.keycloakAdminUrl, '_blank', 'noopener,noreferrer');
  }

  protected async authShortcut(): Promise<void> {
    if (this.authService.authenticated()) {
      await this.logout();
      return;
    }

    await this.login();
  }
}
