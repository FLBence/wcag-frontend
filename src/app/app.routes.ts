
import { Routes } from '@angular/router';
import { ScanForm } from './components/scan-form/scan-form';
import { ScanResults } from './components/scan-results/scan-results';

export const routes: Routes = [
    {
        path: '',
        component: ScanForm
    },
    {
        path: ':id/results',
        component: ScanResults
    }
];
