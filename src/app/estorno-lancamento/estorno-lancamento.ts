import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

export interface PartidaEstorno {
  codigo: string;
  nome: string;
  debito: number;
  credito: number;
}

const PARTIDAS_INVERTIDAS_PADRAO: PartidaEstorno[] = [
  {
    codigo: '1.1.01',
    nome: 'Caixa',
    debito: 25,
    credito: 0,
  },
  {
    codigo: '6.1',
    nome: 'Despesas operacionais',
    debito: 0,
    credito: 25,
  },
];

@Component({
  selector: 'app-estorno-lancamento',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './estorno-lancamento.html',
  styleUrl: './estorno-lancamento.css',
})
export class EstornoLancamento {
  private readonly router = inject(Router);

  readonly numero = input<string>('004');

  readonly numeroFormatado = computed(() => {
    const raw = (this.numero() || '004').replace(/^#/, '');
    return raw.padStart(3, '0');
  });

  readonly dataEstorno = signal('2026-11-16');
  readonly motivo = signal('');
  readonly partidas = signal<PartidaEstorno[]>(PARTIDAS_INVERTIDAS_PADRAO);

  erroValidacao = '';

  confirmarEstorno(): void {
    this.erroValidacao = '';

    if (!this.dataEstorno()) {
      this.erroValidacao = 'Informe a data do estorno.';
      return;
    }

    if (!this.motivo().trim()) {
      this.erroValidacao = 'Informe o motivo do estorno.';
      return;
    }

    this.router.navigate(['/livro-diario/lancamentos', this.numeroFormatado()]);
  }
}