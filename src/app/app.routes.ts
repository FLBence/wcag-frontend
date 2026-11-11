import { Routes } from '@angular/router';
import { ScanForm } from './components/scan-form/scan-form';
import { ScanResults } from './components/scan-results/scan-results';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { MyScans } from './components/my-scans/my-scans';
import { authGuard } from './guards/auth-guard';
import { ChangePassword } from './components/change-password/change-password';

export const routes: Routes = [
  {
    path: '',
    component: ScanForm,
  },
  {
    path: ':id/results',
    component: ScanResults,
    canActivate: [authGuard],
  },
  {
    path: 'auth/register',
    component: Register,
  },
  {
    path: 'auth/login',
    component: Login,
  },
  {
    path: 'users/:id/myscans',
    component: MyScans,
    canActivate: [authGuard],
  },
  {
    path: 'auth/changepass',
    component: ChangePassword,
  },
];
