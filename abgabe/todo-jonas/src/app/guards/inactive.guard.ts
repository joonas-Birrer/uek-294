import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Guard for deep-linking into inactive todo items.
 * Admins can access inactive todos; regular users are redirected to /todo/list.
 */
export const inactiveGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const todoService = inject(TodoService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const id = Number(route.paramMap.get('id'));

  return todoService.getById(id).pipe(
    map((todo) => {
      if (!todo.active && !authService.isAdmin()) {
        router.navigate(['/todo/list']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/todo/list']);
      return of(false);
    })
  );
};
