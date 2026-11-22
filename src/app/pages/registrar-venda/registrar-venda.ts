import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

export interface ProdutoOpcaoVenda {
  id: string;
  nome: string;
  saldoDisponivel: number;
  custoUnitarioMedio: number;
}

const PRODUTOS_DISPONIVEIS: ProdutoOpcaoVenda[] = [
  {
    id: 'prod-1',
    nome: 'Caderno',
    saldoDisponivel: 10,
    custoUnitarioMedio: 10,
  },
];

@Component({
  selector: 'app-registrar-venda',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './registrar-venda.html',
  styleUrl: './registrar-venda.css',
})
export class RegistrarVenda {
  private readonly router = inject(Router);

  readonly produtos = signal<ProdutoOpcaoVenda[]>(PRODUTOS_DISPONIVEIS);

  readonly data = signal('2026-11-15');
  readonly produtoId = signal('prod-1');
  readonly quantidade = signal(4);
  readonly historico = signal('Venda de 4 cadernos');

  readonly valorTotal = signal(80);
  readonly valorAVista = signal(20);
  readonly valorCurtoPrazo = signal(30);
  readonly valorLongoPrazo = signal(30);

  erroValidacao = '';

  readonly produtoSelecionado = computed(
    () =>
      this.produtos().find((p) => p.id === this.produtoId()) ??
      this.produtos()[0],
  );

  readonly cmvCalculado = computed(() => {
    const prod = this.produtoSelecionado();
    const qtd = Math.max(0, this.quantidade());
    return prod ? qtd * prod.custoUnitarioMedio : 0;
  });

  readonly totalPartidas = computed(
    () => this.valorTotal() + this.cmvCalculado(),
  );

  readonly somaDistribuicao = computed(
    () =>
      this.valorAVista() + this.valorCurtoPrazo() + this.valorLongoPrazo(),
  );

  readonly partidasFechadas = computed(
    () => Math.abs(this.valorTotal() - this.somaDistribuicao()) < 0.005,
  );

  readonly saldoSuficiente = computed(() => {
    const prod = this.produtoSelecionado();
    return prod ? this.quantidade() <= prod.saldoDisponivel : false;
  });

  aoAlterarValorTotal(novoTotal: number): void {
    const valor = Math.max(0, Number(novoTotal) || 0);
    this.valorTotal.set(valor);
    this.valorAVista.set(valor);
    this.valorCurtoPrazo.set(0);
    this.valorLongoPrazo.set(0);
  }

  contabilizarVenda(): void {
    this.erroValidacao = '';

    if (!this.data() || !this.produtoId()) {
      this.erroValidacao = 'Preencha a data e selecione o produto.';
      return;
    }

    if (this.quantidade() <= 0) {
      this.erroValidacao = 'A quantidade deve ser maior que zero.';
      return;
    }

    if (!this.saldoSuficiente()) {
      const saldo = this.produtoSelecionado()?.saldoDisponivel ?? 0;
      this.erroValidacao = `Quantidade superior ao saldo disponível (${saldo} un.).`;
      return;
    }

    if (this.valorTotal() <= 0) {
      this.erroValidacao = 'O valor total da venda deve ser maior que zero.';
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