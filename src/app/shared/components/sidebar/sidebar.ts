import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="fs-sidebar">
      <a routerLink="/empresas" class="fs-brand">
        <img src="logoFinanSysHorizontal.png" alt="FinanSys — Sistema Contábil">
      </a>

      <p class="fs-nav-label">ÁREA DE TRABALHO</p>

      <nav class="fs-nav" aria-label="Menu principal">
        @for (item of itens; track item.nome) {
          @if (item.rota) {
            <a [routerLink]="item.rota"
               routerLinkActive="fs-active"
               ariaCurrentWhenActive="page">
              <span aria-hidden="true">{{ item.icone }}</span>
              {{ item.nome }}
            </a>
          } @else {
            <span class="fs-nav-pendente" aria-disabled="true">
              <span aria-hidden="true">{{ item.icone }}</span>
              {{ item.nome }}
            </span>
          }
        }
      </nav>
    </aside>
  `,
})
export class Sidebar {
  itens = [
    { nome: 'Empresas', icone: '', rota: '/empresas' },
    { nome: 'Visão geral', icone: '', rota: null },
    { nome: 'Plano de contas', icone: '', rota: null },
    { nome: 'Livro Diário', icone: '', rota: null },
    { nome: 'Livro Razão', icone: '', rota: null },
    { nome: 'Relatórios', icone: '', rota: null },
    { nome: 'Estoque', icone: '', rota: null },
  ];
}