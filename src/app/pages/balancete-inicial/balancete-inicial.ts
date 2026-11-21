import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Card } from '../../shared/components/card/card';
import {
  ContaContabil,
  PlanoContasService,
} from '../../shared/services/plano-contas.service';

export interface LinhaBalanceteInicial {
  id: number;
  codigo: string;
  nome: string;
  debito: number | null;
  credito: number | null;
}

@Component({
  selector: 'app-balancete-inicial',
  standalone: true,
  imports: [Card, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './balancete-inicial.html',
  styleUrl: './balancete-inicial.css',
})
export class BalanceteInicial {
  private readonly planoService = inject(PlanoContasService);
  private readonly router = inject(Router);

  private proximoId = 3;

  readonly contasPatrimoniais = computed<ContaContabil[]>(() =>
    this.planoService
      .contas()
      .filter(
        (c) =>
          c.tipo === 'Analítica' &&
          (c.grupo === 'Ativo' ||
            c.grupo === 'Passivo' ||
            c.grupo === 'Patrimônio Líquido'),
      ),
  );

  dataAbertura = '2026-11-12';
  historico = 'Saldos de abertura';
  mensagemFeedback = '';

  readonly linhas = signal<LinhaBalanceteInicial[]>([
    {
      id: 1,
      codigo: '1.0.1',
      nome: 'Caixa',
      debito: 1000,
      credito: null,
    },
    {
      id: 2,
      codigo: '4.0.1',
      nome: 'Capital Social',
      debito: null,
      credito: 1000,
    },
  ]);

  readonly totalDebitos = computed(() =>
    this.linhas().reduce((acc, item) => acc + (Number(item.debito) || 0), 0),
  );

  readonly totalCreditos = computed(() =>
    this.linhas().reduce((acc, item) => acc + (Number(item.credito) || 0), 0),
  );

  readonly diferenca = computed(() =>
    Math.abs(this.totalDebitos() - this.totalCreditos()),
  );

  readonly equilibrado = computed(
    () =>
      this.linhas().length >= 2 &&
      this.totalDebitos() > 0 &&
      this.diferenca() < 0.005,
  );

  adicionarConta(): void {
    const usadas = new Set(this.linhas().map((l) => l.codigo));
    const proximaConta =
      this.contasPatrimoniais().find((c) => !usadas.has(c.codigo)) ??
      this.contasPatrimoniais()[0];

    if (!proximaConta) return;

    this.linhas.update((atual) => [
      ...atual,
      {
        id: this.proximoId++,
        codigo: proximaConta.codigo,
        nome: proximaConta.nome,
        debito: null,
        credito: null,
      },
    ]);
  }

  removerLinha(id: number): void {
    this.linhas.update((atual) => atual.filter((item) => item.id !== id));
  }

  aoTrocarConta(id: number, novoCodigo: string): void {
    const conta = this.contasPatrimoniais().find((c) => c.codigo === novoCodigo);
    if (!conta) return;

    this.linhas.update((atual) =>
      atual.map((item) =>
        item.id === id
          ? { ...item, codigo: conta.codigo, nome: conta.nome }
          : item,
      ),
    );
  }

  aoAlterarDebito(id: number, valor: string): void {
    const numero = valor === '' ? null : Math.max(0, Number(valor));
    this.linhas.update((atual) =>
      atual.map((item) =>
        item.id === id
          ? {
              ...item,
              debito: numero,
              credito: numero && numero > 0 ? null : item.credito,
            }
          : item,
      ),
    );
  }

  aoAlterarCredito(id: number, valor: string): void {
    const numero = valor === '' ? null : Math.max(0, Number(valor));
    this.linhas.update((atual) =>
      atual.map((item) =>
        item.id === id
          ? {
              ...item,
              credito: numero,
              debito: numero && numero > 0 ? null : item.debito,
            }
          : item,
      ),
    );
  }

  contabilizarAbertura(): void {
    if (!this.equilibrado() || !this.dataAbertura || !this.historico.trim()) {
      return;
    }

    this.mensagemFeedback = 'Abertura contabilizada com sucesso!';
    void this.router.navigate(['/livro-diario']);
  }
}