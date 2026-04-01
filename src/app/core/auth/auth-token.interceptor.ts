import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

function isApiRequest(url: string): boolean {
  if (url.startsWith('/api')) {
    return true;
  }

  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const parsedUrl = new URL(url, origin);
    const isApiPath = parsedUrl.pathname.startsWith('/api');
    const isAllowedOrigin = parsedUrl.origin === origin || parsedUrl.origin === 'http://localhost:3001';
    return isApiPath && isAllowedOrigin;
  } catch {
    return false;
  }
}

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isApiRequest(request.url) || request.headers.has('Authorization')) {
    return next(request);
  }

  const authService = inject(AuthService);

  return from(authService.getAccessToken()).pipe(
    switchMap((token) => {
      if (!token) {
        return next(request);
      }

      return next(
        request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
    }),
  );
};

