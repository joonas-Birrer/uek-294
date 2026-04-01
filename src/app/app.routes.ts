import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { inactiveTodoGuard } from './features/todo/guards/inactive-todo.guard';

export const routes: Routes = [
  {
	path: '',
	pathMatch: 'full',
	redirectTo: 'home',
  },
  {
	path: 'home',
	loadComponent: () => import('./features/home/home.page').then((m) => m.HomePageComponent),
  },
  {
	path: 'todo',
	pathMatch: 'full',
	redirectTo: 'todo/list',
  },
  {
	path: 'todo/list',
	canActivate: [authGuard],
	loadComponent: () =>
	  import('./features/todo/pages/todo-list.page').then((m) => m.TodoListPageComponent),
  },
  {
	path: 'todo/new',
	canActivate: [authGuard],
	loadComponent: () =>
	  import('./features/todo/pages/todo-new.page').then((m) => m.TodoNewPageComponent),
  },
  {
	path: 'todo/edit/:id',
	canActivate: [authGuard, inactiveTodoGuard],
	loadComponent: () =>
	  import('./features/todo/pages/todo-edit.page').then((m) => m.TodoEditPageComponent),
  },
  {
	path: '**',
	loadComponent: () =>
	  import('./features/not-found/not-found.page').then((m) => m.NotFoundPageComponent),
  },
];
