import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app-layout/app-layout';
import { Empresas } from './pages/empresas/empresas';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Home } from './pages/home/home';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
        { path: 'home', component: Home }, 
        { path: 'empresas', component: Empresas }
        ],
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'cadastro', component: Cadastro },

]
