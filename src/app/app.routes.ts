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

      // PLANO DE CONTAS
      {
        path: 'plano-contas/padrao',
        loadComponent: () =>
          import('./pages/carregar-plano-padrao/carregar-plano-padrao').then(
            (m) => m.CarregarPlanoPadrao,
          ),
      },
      {
        path: 'plano-contas/exportar',
        loadComponent: () =>
          import('./pages/exportacoes/exportacoes').then((m) => m.Exportacoes),
      },
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

      // LIVRO RAZÃO
      {
        path: 'livro-razao/exportar',
        loadComponent: () =>
          import('./pages/exportacoes/exportacoes').then((m) => m.Exportacoes),
      },
      {
        path: 'livro-razao',
        loadComponent: () =>
          import('./pages/livro-razao/livro-razao').then((m) => m.LivroRazao),
      },

      // LIVRO DIÁRIO
      {
        path: 'livro-diario/exportar',
        loadComponent: () =>
          import('./pages/exportacoes/exportacoes').then((m) => m.Exportacoes),
      },
      {
        path: 'livro-diario/lancamento-desequilibrado',
        loadComponent: () =>
          import('./pages/lancamento-desequilibrado/lancamento-desequilibrado').then(
            (m) => m.LancamentoDesequilibrado,
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
        path: 'livro-diario/lancamentos/:numero',
        loadComponent: () =>
          import('./pages/lancamento-detalhe/lancamento-detalhe').then(
            (m) => m.LancamentoDetalhe,
          ),
      },
      {
        path: 'livro-diario',
        loadComponent: () =>
          import('./pages/livro-diario/livro-diario').then((m) => m.LivroDiario),
      },

      // EXPORTAÇÕES
      {
        path: 'exportacoes',
        loadComponent: () =>
          import('./pages/exportacoes/exportacoes').then((m) => m.Exportacoes),
      },
      {
        path: 'relatorios/dfc/exportar',
        loadComponent: () =>
          import('./pages/exportacoes/exportacoes').then((m) => m.Exportacoes),
      },

      // RELATÓRIOS
      {
        path: 'relatorios/balancete/exportar',
        loadComponent: () =>
          import('./pages/exportacoes/exportacoes').then((m) => m.Exportacoes),
      },
      {
        path: 'relatorios',
        redirectTo: 'relatorios/balancete',
        pathMatch: 'full',
      },
      {
        path: 'relatorios/arquivo-pronto',
        loadComponent: () =>
          import('./pages/arquivo-pronto/arquivo-pronto').then(
            (m) => m.ArquivoPronto,
          ),
      },
      {
        path: 'relatorios/balancete',
        loadComponent: () =>
          import('./pages/balancete-verificacao/balancete-verificacao').then(
            (m) => m.BalanceteVerificacao,
          ),
      },
      {
        path: 'relatorios/balanco-patrimonial',
        loadComponent: () =>
          import('./pages/balanco-patrimonial/balanco-patrimonial').then(
            (m) => m.BalancoPatrimonial,
          ),
      },
      {
        path: 'relatorios/dre',
        loadComponent: () =>
          import('./pages/dre/dre').then((m) => m.Dre),
      },
      {
        path: 'relatorios/dfc',
        loadComponent: () =>
          import('./pages/dfc/dfc').then((m) => m.Dfc),
      },

      // ESTOQUE
      {
        path: 'estoque/compra',
        loadComponent: () =>
          import('./pages/registrar-compra/registrar-compra').then(
            (m) => m.RegistrarCompra,
          ),
      },
      {
        path: 'estoque/venda',
        loadComponent: () =>
          import('./pages/registrar-venda/registrar-venda').then(
            (m) => m.RegistrarVenda,
          ),
      },
      {
        path: 'estoque/movimentacoes',
        loadComponent: () =>
          import('./pages/movimentacoes-estoque/movimentacoes-estoque').then(
            (m) => m.MovimentacoesEstoque,
          ),
      },
      {
        path: 'estoque/novo',
        loadComponent: () =>
          import('./pages/novo-produto/novo-produto').then(
            (m) => m.NovoProduto,
          ),
      },
      {
        path: 'estoque',
        loadComponent: () =>
          import('./pages/estoque/estoque').then((m) => m.Estoque),
      },
    ],
  },
];