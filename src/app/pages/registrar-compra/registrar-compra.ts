import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

export interface ProdutoOpcaoCompra {
  id: string;
  nome: string;
}

const PRODUTOS_DISPONIVEIS: ProdutoOpcaoCompra[] = [
  { id: 'prod-1', nome: 'Caderno' },
];

@Component({
  selector: 'app-registrar-compra',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './registrar-compra.html',
  styleUrl: './registrar-compra.css',
})
export class RegistrarCompra {
  private readonly router = inject(Router);

  readonly produtos = signal<ProdutoOpcaoCompra[]>(PRODUTOS_DISPONIVEIS);

  readonly data = signal('2026-11-14');
  readonly produtoId = signal('prod-1');
  readonly quantidade = signal(10);
  readonly historico = signal('Compra de 10 cadernos');

  readonly valorTotal = signal(100);
  readonly valorAVista = signal(100);
  readonly valorCurtoPrazo = signal(0);
  readonly valorLongoPrazo = signal(0);

  erroValidacao = '';

  readonly somaDistribuicao = computed(
    () =>
      this.valorAVista() + this.valorCurtoPrazo() + this.valorLongoPrazo(),
  );

  readonly partidasFechadas = computed(
    () => Math.abs(this.valorTotal() - this.somaDistribuicao()) < 0.005,
  );

  aoAlterarValorTotal(novoTotal: number): void {
    const valor = Math.max(0, Number(novoTotal) || 0);
    this.valorTotal.set(valor);
    this.valorAVista.set(valor);
    this.valorCurtoPrazo.set(0);
    this.valorLongoPrazo.set(0);
  }

  contabilizarCompra(): void {
    this.erroValidacao = '';

    if (!this.data() || !this.produtoId()) {
      this.erroValidacao = 'Preencha a data e selecione o produto.';
      return;
    }

    if (this.quantidade() <= 0) {
      this.erroValidacao = 'A quantidade deve ser maior que zero.';
      return;
    }

    if (this.valorTotal() <= 0) {
      this.erroValidacao = 'O valor total da compra deve ser maior que zero.';
      return;
    }

    if (!this.partidasFechadas()) {
      this.erroValidacao =
        'A soma de À vista, Curto prazo e Longo prazo deve ser igual ao Valor total.';
      return;
    }

    this.router.navigateByUrl('/estoque');
  }
}