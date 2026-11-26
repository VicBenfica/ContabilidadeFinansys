import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface PartidaValidacao {
  id: string;
  natureza: 'Débito' | 'Crédito';
  codigoConta: string;
  nomeConta: string;
  valor: number;
}

const PARTIDAS_EXEMPLO: PartidaValidacao[] = [
  {
    id: 'p-1',
    natureza: 'Débito',
    codigoConta: '6.1',
    nomeConta: 'Despesas operacionais',
    valor: 25,
  },
  {
    id: 'p-2',
    natureza: 'Crédito',
    codigoConta: '1.1.01',
    nomeConta: 'Caixa',
    valor: 20,
  },
];

@Component({
  selector: 'app-lancamento-desequilibrado',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './lancamento-desequilibrado.html',
  styleUrl: './lancamento-desequilibrado.css',
})
export class LancamentoDesequilibrado {
  readonly partidas = signal<PartidaValidacao[]>(PARTIDAS_EXEMPLO);

  readonly totalDebitos = computed(() =>
    this.partidas()
      .filter((p) => p.natureza === 'Débito')
      .reduce((acc, p) => acc + p.valor, 0),
  );

  readonly totalCreditos = computed(() =>
    this.partidas()
      .filter((p) => p.natureza === 'Crédito')
      .reduce((acc, p) => acc + p.valor, 0),
  );

  readonly diferenca = computed(() =>
    Math.abs(this.totalDebitos() - this.totalCreditos()),
  );

  readonly isDesequilibrado = computed(() => this.diferenca() > 0);
}