import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ProdutoEstoque {
  id: string;
  nome: string;
  quantidade: number;
  custoUnitarioMedio: number;
}

export interface MovimentacaoEstoque {
  numeroLancamento: string;
  data: string;
  produto: string;
  tipo: 'Entrada' | 'Saída';
  descricaoMovimento: string;
  quantidade: number;
  custo: number;
}

const PRODUTOS_INICIAIS: ProdutoEstoque[] = [
  {
    id: 'prod-1',
    nome: 'Caderno',
    quantidade: 6,
    custoUnitarioMedio: 10,
  },
];

const MOVIMENTACOES_INICIAIS: MovimentacaoEstoque[] = [
  {
    numeroLancamento: '903',
    data: '15/11/2026',
    produto: 'Caderno',
    tipo: 'Saída',
    descricaoMovimento: 'Saída · venda',
    quantidade: -4,
    custo: 40,
  },
  {
    numeroLancamento: '902',
    data: '14/11/2026',
    produto: 'Caderno',
    tipo: 'Entrada',
    descricaoMovimento: 'Entrada · compra',
    quantidade: 10,
    custo: 100,
  },
];

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './estoque.html',
  styleUrl: './estoque.css',
})
export class Estoque {
  readonly produtos = signal<ProdutoEstoque[]>(PRODUTOS_INICIAIS);
  readonly movimentacoes = signal<MovimentacaoEstoque[]>(MOVIMENTACOES_INICIAIS);

  readonly produtosCadastrados = computed(() => this.produtos().length);

  readonly unidadesEmEstoque = computed(() =>
    this.produtos().reduce((acc, item) => acc + item.quantidade, 0),
  );

  readonly custoTotalEstoque = computed(() =>
    this.produtos().reduce(
      (acc, item) => acc + item.quantidade * item.custoUnitarioMedio,
      0,
    ),
  );

  custoTotalProduto(item: ProdutoEstoque): number {
    return item.quantidade * item.custoUnitarioMedio;
  }

  formatarQuantidadeMovimento(quantidade: number): string {
    const sinal = quantidade > 0 ? '+' : '';
    return `${sinal}${quantidade} un.`;
  }

  rolarParaMovimentacoes(elemento: HTMLElement): void {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}