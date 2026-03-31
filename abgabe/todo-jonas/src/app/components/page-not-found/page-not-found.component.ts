import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found">
      <mat-icon class="icon">search_off</mat-icon>
      <h2>404 – Seite nicht gefunden</h2>
      <p>Die gesuchte Seite existiert leider nicht.</p>
      <a mat-raised-button color="primary" routerLink="/home">Zur Startseite</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 80px 16px;
    }
    .icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #bbb;
      margin-bottom: 16px;
    }
    h2 { margin-bottom: 8px; }
    p { margin-bottom: 24px; color: #666; }
  `],
})
export class PageNotFoundComponent {}
