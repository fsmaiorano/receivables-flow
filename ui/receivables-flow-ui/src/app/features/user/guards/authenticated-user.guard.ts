import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StoreService } from '../../core/store/store.service';

export const authenticatedUserGuard: CanActivateFn = () => {
  const storeService = inject(StoreService);
  const router = inject(Router);
  const store = storeService.getStore();

  if (!store || !store.token || store.token === '') {
    console.log('authenticatedUserGuard: redirecting to /');
    router.navigate(['/']);
    return false;
  }

  return true;
};
