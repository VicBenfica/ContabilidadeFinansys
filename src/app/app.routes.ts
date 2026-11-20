import { Routes } from '@angular/router';

import { AppLayout } from './layouts/app-layout/app-layout';
import { Empresas } from './pages/empresas/empresas';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Home } from './pages/home/home';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'cadastro', component: Cadastro },

    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'home', component: Home },
            { path: 'empresas', component: Empresas },
            {
                path: 'livro-razao',
                loadComponent: () =>
                    import('./pages/livro-razao/livro-razao').then((m) => m.LivroRazao),
            },
            {
                path: 'livro-diario/exportar',
                loadComponent: () =>
                    import('./pages/exportacoes/exportacoes').then((m) => m.Exportacoes),
            },
            {
                path: 'exportacoes',
                loadComponent: () =>
                    import('./pages/exportacoes/exportacoes').then((m) => m.Exportacoes),
            },
            {
                path: 'livro-diario/lancamentos/:numero',
                loadComponent: () =>
                    import('./pages/lancamento-detalhe/lancamento-detalhe')
                        .then((m) => m.LancamentoDetalhe),
            }, {
                path: 'livro-diario/lancamentos/:numero/estorno',
                loadComponent: () =>
                    import('./pages/estorno-lancamento/estorno-lancamento')
                        .then((m) => m.EstornoLancamento),
            },
            {
                path: 'livro-diario',
                loadComponent: () =>
                    import('./pages/livro-diario/livro-diario').then((m) => m.LivroDiario),
            },

        ],
    },
];