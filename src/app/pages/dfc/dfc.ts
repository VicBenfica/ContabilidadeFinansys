
import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Card } from '../../shared/components/card/card';
import {
  ExportacaoService,
  type DocumentoExportacao,
} from '../../shared/services/exportacao.service';
import { EmpresasService } from '../../shared/services/empresas.service';

export interface LinhaMovimentoCaixa {
  id: string;
  grupo: 'Operacional' | 'Investimento' | 'Financiamento';
  movimento: string;
  valor: number;
}

const MOVIMENTOS_INICIAIS: LinhaMovimentoCaixa[] = [
  {
    id: 'op-1',
    grupo: 'Operacional',
    movimento: 'Recebimento de venda à vista',
    valor: 20,
  },
  {
    id: 'op-2',
    grupo: 'Operacional',
    movimento: 'Pagamento de mercadorias',
    valor: -100,
  },
  {
    id: 'op-3',
    grupo: 'Operacional',
    movimento: 'Pagamento de despesa',
    valor: -25,
  },
  {
    id: 'inv-1',
    grupo: 'Investimento',
    movimento: 'Sem movimentação',
    valor: 0,
  },
  {
    id: 'fin-1',
    grupo: 'Financiamento',
    movimento: 'Sem movimentação',
    valor: 0,
  },
];

@Component({
  selector: 'app-dfc',
  standalone: true,
  imports: [Card, CurrencyPipe, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './dfc.html',
  styleUrl: './dfc.css',
})
export class Dfc {
  private readonly exportacao = inject(ExportacaoService);
  private readonly router = inject(Router);

  readonly empresa = inject(EmpresasService).selecionada;

  filtros = {
    dataInicial: '2026-11-01',
    dataFinal: '2026-11-30',
  };

  readonly filtrosAplicados = signal({ ...this.filtros });

  erroExportacao = '';

  readonly caixaInicio = signal(1000);

  readonly movimentos =
    signal<LinhaMovimentoCaixa[]>(MOVIMENTOS_INICIAIS);

  readonly variacaoLiquida = computed(() =>
    this.movimentos().reduce(
      (acc, item) => acc + item.valor,
      0,
    ),
  );

  readonly caixaFim = computed(
    () => this.caixaInicio() + this.variacaoLiquida(),
  );

  aplicarFiltros(): void {
    if (
      !this.filtros.dataInicial ||
      !this.filtros.dataFinal ||
      this.filtros.dataInicial > this.filtros.dataFinal
    ) {
      this.erroExportacao = 'Informe um período válido.';
      return;
    }

    this.erroExportacao = '';
    this.filtrosAplicados.set({ ...this.filtros });
  }

  // Monta o documento usando os mesmos dados exibidos na DFC.
  private montarDocumento(): DocumentoExportacao {
    const filtros = this.filtrosAplicados();

    return {
      titulo: `DFC - ${filtros.dataInicial} a ${filtros.dataFinal}`,
      colunas: ['Grupo', 'Movimento', 'Valor'],
      linhas: [
        ...this.movimentos().map((item) => [
          item.grupo,
          item.movimento,
          item.valor,
        ]),
      ],
    };
  }

  // Abre a página reutilizável de exportação.
  async abrirExportacao(
    formato: 'pdf' | 'xlsx',
  ): Promise<void> {
    const empresa = this.empresa();

    if (!empresa) {
      this.erroExportacao = 'Selecione uma empresa antes de exportar.';
      return;
    }

    const documento = this.montarDocumento();

    const filtros = this.filtrosAplicados();

    const periodo =
      `${filtros.dataInicial} a ${filtros.dataFinal}`;

    this.erroExportacao = '';

    this.exportacao.prepararDfc(
      empresa.id,
      periodo,
      documento,
    );

    await this.router.navigate(
      ['/relatorios/dfc/exportar'],
      {
        queryParams: {
          tipo: 'dfc',
          formato,
        },
      },
    );
  }

  gerarPdf(): void {
    void this.abrirExportacao('pdf');
  }

  exportarExcel(): void {
    void this.abrirExportacao('xlsx');
  }
}
