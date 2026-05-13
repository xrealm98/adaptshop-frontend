import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading/loading.service';

const IGNORE_URLS = ['/categories', '/settings'];

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const isIgnored = IGNORE_URLS.some((url) => req.url.includes(url));

  if (!isIgnored) loadingService.show();

  return next(req).pipe(
    finalize(() => {
      if (!isIgnored) loadingService.hide();
    }),
  );
};
