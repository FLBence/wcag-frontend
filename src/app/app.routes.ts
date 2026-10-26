
import { Routes } from '@angular/router';
import { ScanForm } from './components/scan-form/scan-form';
import { ScanResults } from './components/scan-results/scan-results';
import { Register } from './components/register/register';
import { Login } from './components/login/login';

export const routes: Routes = [
    {
        path: '',
        component: ScanForm
    },
    {
        path: ':id/results',
        component: ScanResults
    },
    {
        path: 'auth/register',
        component: Register
    },
    {
        path: 'auth/login',
        component: Login
    }
];
