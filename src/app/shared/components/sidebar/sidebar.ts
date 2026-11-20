import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly itens: { nome: string; icone: string; rota: string | null }[] = [
    { nome: 'Visão geral', icone: '▦', rota: '/home' },
    { nome: 'Plano de contas', icone: '▤', rota: '/plano-contas' },
    { nome: 'Livro Diário', icone: '≡', rota: '/livro-diario' },
    { nome: 'Livro Razão', icone: '◫', rota: '/livro-razao' },
    { nome: 'Relatórios', icone: '▧', rota: null },
    { nome: 'Estoque', icone: '◇', rota: null },
  ];
}