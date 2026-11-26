import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import {
  ExportacaoService,
  type DocumentoExportacao,
} from '../../shared/services/exportacao.service';
import { ArquivoProntoService } from '../../shared/services/arquivo-pronto.service';

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
  private readonly arquivoPronto = inject(ArquivoProntoService);
  readonly empresa = inject(EmpresasService).selecionada;

  filtros = {
    dataInicial: '2026-11-01',
    dataFinal: '2026-11-30',
  };

  readonly filtrosAplicados = signal({ ...this.filtros });

  gerandoExcel = false;
  erroExportacao = '';

  readonly caixaInicio = signal(1000);
  readonly movimentos = signal<LinhaMovimentoCaixa[]>(MOVIMENTOS_INICIAIS);

  readonly variacaoLiquida = computed(() =>
    this.movimentos().reduce((acc, item) => acc + item.valor, 0),
  );

  readonly caixaFim = computed(
    () => this.caixaInicio() + this.variacaoLiquida(),
  );

  aplicarFiltros(): void {
    this.filtrosAplicados.set({ ...this.filtros });
  }

  gerarPdf(): void {
    window.print();
  }

  async exportarExcel(): Promise<void> {
    if (this.gerandoExcel) return;

    this.erroExportacao = '';
    this.gerandoExcel = true;

    const nomeEmpresa = this.empresa()?.nomeFantasia ?? 'Papelaria Aurora';
    const periodo = this.filtrosAplicados().dataInicial.slice(0, 7) || '2026-11';

    const documento: DocumentoExportacao = {
      titulo: `DFC - ${this.filtrosAplicados().dataInicial} a ${this.filtrosAplicados().dataFinal}`,
      colunas: ['Grupo', 'Movimento', 'Valor'],
      linhas: this.movimentos().map((item) => [
        item.grupo,
        item.movimento,
        item.valor,
      ]),
    };

    try {
      await this.exportacao.baixarExcel(documento, nomeEmpresa, periodo);
      await this.arquivoPronto.abrir(
        'Demonstração dos Fluxos de Caixa (DFC)',
        'Excel (.xlsx)',
        '/relatorios/dfc',
      );
    } catch {
      this.erroExportacao = 'Não foi possível gerar o Excel. Tente novamente.';
    } finally {
      this.gerandoExcel = false;
    }
  }
}