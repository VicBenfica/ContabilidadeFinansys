import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app-layout/app-layout';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
        ],
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];