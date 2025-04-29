import { Routes } from '@angular/router';
import { AuthComponent } from './features/user/components/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authenticatedUserGuard } from './features/user/guards/authenticated-user.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authenticatedUserGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
