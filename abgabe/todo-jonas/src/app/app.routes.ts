import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { inactiveGuard } from './guards/inactive.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'todo',
    redirectTo: '/todo/list',
    pathMatch: 'full',
  },
  {
    path: 'todo/list',
    loadComponent: () =>
      import('./components/todo-list/todo-list.component').then(
        (m) => m.TodoListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'todo/new',
    loadComponent: () =>
      import('./components/todo-new/todo-new.component').then(
        (m) => m.TodoNewComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'todo/edit/:id',
    loadComponent: () =>
      import('./components/todo-edit/todo-edit.component').then(
        (m) => m.TodoEditComponent
      ),
    canActivate: [authGuard, inactiveGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
