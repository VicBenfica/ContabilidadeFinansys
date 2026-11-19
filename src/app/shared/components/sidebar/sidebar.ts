import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './sidebar.css',
  template: `
    <aside class="fs-sidebar">
      <a routerLink="/empresas" class="fs-brand" aria-label="Voltar para Empresas">
        <img
          src="logoFinanSysBranco.png"
          alt="FinanSys — Sistema Contábil"
        />
      </a>

      <nav class="fs-nav" aria-labelledby="fs-nav-title">
        <p id="fs-nav-title" class="fs-nav-label">Área de trabalho</p>

        @for (item of itens; track item.nome) {
          @if (item.rota) {
            <a
              class="fs-nav-item"
              [routerLink]="item.rota"
              routerLinkActive="fs-active"
              ariaCurrentWhenActive="page"
            >
              <span class="fs-nav-icon" aria-hidden="true">{{ item.icone }}</span>
              <span>{{ item.nome }}</span>
            </a>
          } @else {
            <span
              class="fs-nav-item fs-nav-pendente"
              [class.fs-active]="item.nome === 'Visão geral'"
            >
              <span class="fs-nav-icon" aria-hidden="true">{{ item.icone }}</span>
              <span>{{ item.nome }}</span>
            </span>
          }
        }
      </nav>
    </aside>
  `,
})
export class Sidebar {
  readonly itens: { nome: string; icone: string; rota: string | null }[] = [
    { nome: 'Visão geral', icone: '▦', rota: null },
    { nome: 'Plano de contas', icone: '▤', rota: null },
    { nome: 'Livro Diário', icone: '≡', rota: null },
    { nome: 'Livro Razão', icone: '◫', rota: null },
    { nome: 'Relatórios', icone: '▧', rota: null },
    { nome: 'Estoque', icone: '◇', rota: null },
  ];
}