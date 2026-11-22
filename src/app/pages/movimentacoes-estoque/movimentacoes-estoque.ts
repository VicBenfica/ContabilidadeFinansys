import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Card } from '../../shared/components/card/card';

export interface ProdutoFiltroEstoque {
  id: string;
  nome: string;
}

export interface RegistroMovimentacaoEstoque {
  referencia: string;
  produtoId: string;
  dataIso: string;
  dataExibicao: string;
  movimento: 'Compra' | 'Venda';
  variacao: number;
  custo: number;
  saldoApos: number;
}

const PRODUTOS_OPCOES: ProdutoFiltroEstoque[] = [
  { id: 'prod-1', nome: 'Caderno' },
];

const MOVIMENTACOES_HISTORICO: RegistroMovimentacaoEstoque[] = [
  {
    referencia: '902',
    produtoId: 'prod-1',
    dataIso: '2026-11-14',
    dataExibicao: '14/11/2026',
    movimento: 'Compra',
    variacao: 10,
    custo: 100,
    saldoApos: 10,
  },
  {
    referencia: '903',
    produtoId: 'prod-1',
    dataIso: '2026-11-15',
    dataExibicao: '15/11/2026',
    movimento: 'Venda',
    variacao: -4,
    custo: 40,
    saldoApos: 6,
  },
];

@Component({
  selector: 'app-movimentacoes-estoque',
  standalone: true,
  imports: [Card, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './movimentacoes-estoque.html',
  styleUrl: './movimentacoes-estoque.css',
})
export class MovimentacoesEstoque {
  readonly produtos = signal<ProdutoFiltroEstoque[]>(PRODUTOS_OPCOES);
  readonly registros = signal<RegistroMovimentacaoEstoque[]>(
    MOVIMENTACOES_HISTORICO,
  );

  filtros = {
    produtoId: 'prod-1',
    dataInicial: '2026-11-01',
    dataFinal: '2026-11-30',
  };

  readonly filtrosAplicados = signal({ ...this.filtros });

  readonly produtoSelecionadoNome = computed(() => {
    const id = this.filtrosAplicados().produtoId;
    return this.produtos().find((p) => p.id === id)?.nome ?? 'Produto';
  });

  readonly tituloCard = computed(
    () => `Histórico de ${this.produtoSelecionadoNome()}`,
  );

  readonly movimentacoesFiltradas = computed(() => {
    const { produtoId, dataInicial, dataFinal } = this.filtrosAplicados();
    return this.registros().filter((item) => {
      if (produtoId && item.produtoId !== produtoId) return false;
      if (dataInicial && item.dataIso < dataInicial) return false;
      if (dataFinal && item.dataIso > dataFinal) return false;
      return true;
    });
  });

  aplicarFiltros(): void {
    this.filtrosAplicados.set({ ...this.filtros });
  }

  formatarVariacao(valor: number): string {
    return valor < 0 ? `−${Math.abs(valor)} un.` : `${valor} un.`;
  }
}