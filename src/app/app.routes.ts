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
        path: 'plano-contas/nova',
        loadComponent: () =>
          import('./pages/nova-conta/nova-conta').then((m) => m.NovaConta),
      },
      {
        path: 'plano-contas/editar/:codigo',
        loadComponent: () =>
          import('./pages/nova-conta/nova-conta').then((m) => m.NovaConta),
      },
      {
        path: 'plano-contas/importar',
        loadComponent: () =>
          import('./pages/importar-plano/importar-plano').then(
            (m) => m.ImportarPlano,
          ),
      },
      {
        path: 'plano-contas/balancete-inicial',
        loadComponent: () =>
          import('./pages/balancete-inicial/balancete-inicial').then(
            (m) => m.BalanceteInicial,
          ),
      },
      {
        path: 'plano-contas',
        loadComponent: () =>
          import('./pages/plano-contas/plano-contas').then(
            (m) => m.PlanoContas,
          ),
      },
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
          import('./pages/lancamento-detalhe/lancamento-detalhe').then(
            (m) => m.LancamentoDetalhe,
          ),
      },
      {
        path: 'livro-diario/lancamentos/:numero/estorno',
        loadComponent: () =>
          import('./pages/estorno-lancamento/estorno-lancamento').then(
            (m) => m.EstornoLancamento,
          ),
      },
      {
        path: 'livro-diario',
        loadComponent: () =>
          import('./pages/livro-diario/livro-diario').then((m) => m.LivroDiario),
      },
      {
        path: 'relatorios',
        redirectTo: 'relatorios/balancete',
        pathMatch: 'full',
      },
      {
        path: 'relatorios/balancete',
        loadComponent: () =>
          import('./pages/balancete-verificacao/balancete-verificacao').then(
            (m) => m.BalanceteVerificacao,
          ),
      },
    ],
  },
];