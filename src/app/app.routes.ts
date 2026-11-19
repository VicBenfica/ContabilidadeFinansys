import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app-layout/app-layout';
import { Empresas } from './pages/empresas/empresas';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [{ path: 'empresas', component: Empresas },

        ],
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];