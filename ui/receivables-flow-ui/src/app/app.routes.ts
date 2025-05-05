import { Routes } from '@angular/router';
import { AuthComponent } from './features/user/components/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authenticatedUserGuard } from './features/user/guards/authenticated-user.guard';
import { AssignorsComponent } from './features/assignors/assignors.component';
import { PayablesComponent } from './features/payables/payables.component';

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
    path: 'assignors',
    component: AssignorsComponent,
    canActivate: [authenticatedUserGuard],
  },
  {
    path: 'payables',
    component: PayablesComponent,
    canActivate: [authenticatedUserGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
