import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keycloak: KeycloakService) {}

  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout(window.location.origin);
  }

  getUsername(): string {
    const profile = this.keycloak.getKeycloakInstance().tokenParsed;
    return profile?.['preferred_username'] ?? '';
  }

  /**
   * Check if the current user is member of a specific role.
   * Checks both realm roles and resource (client) roles.
   */
  isMemberOfRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }

  isAdmin(): boolean {
    return this.isMemberOfRole('admin');
  }

  isUser(): boolean {
    return this.isMemberOfRole('user');
  }

  getToken(): Promise<string> {
    return this.keycloak.getToken();
  }
}
