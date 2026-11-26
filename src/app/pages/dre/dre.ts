
import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import {
  ExportacaoService,
  type DocumentoExportacao,
} from '../../shared/services/exportacao.service';

export interface LinhaComposicaoResultado {
  contaGrupo: string;
  descricao: string;
  total: number;
  redutora?: boolean;
}

@Component({
  selector: 'app-dre',
  standalone: true,
  imports: [Card, CurrencyPipe, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './dre.html',
  styleUrl: './dre.css',
})
export class Dre {
  private readonly exportacao = inject(ExportacaoService);
  private readonly router = inject(Router);

  readonly empresa = inject(EmpresasService).selecionada;

  filtros = {
    dataInicial: '2026-11-01',
    dataFinal: '2026-11-30',
  };

  readonly filtrosAplicados = signal({ ...this.filtros });

  gerandoExcel = false;
  erroExportacao = '';

  readonly receitaVendas = signal(80);
  readonly cmv = signal(40);
  readonly despesasOperacionais = signal(25);

  readonly resultadoBruto = computed(
    () => this.receitaVendas() - this.cmv(),
  );

  readonly lucroPeriodo = computed(
    () => this.resultadoBruto() - this.despesasOperacionais(),
  );

  readonly composicaoResultado = computed<LinhaComposicaoResultado[]>(() => [
    {
      contaGrupo: '4.1 · Receita de vendas',
      descricao: 'Venda registrada no período',
      total: this.receitaVendas(),
    },
    {
      contaGrupo: '5.1 · CMV',
      descricao: 'Custo das mercadorias vendidas',
      total: this.cmv(),
      redutora: true,
    },
    {
      contaGrupo: 'Resultado bruto',
      descricao: 'Receita menos CMV',
      total: this.resultadoBruto(),
    },
    {
      contaGrupo: '6.1 · Despesas operacionais',
      descricao: 'Despesas do período',
      total: this.despesasOperacionais(),
      redutora: true,
    },
    {
      contaGrupo: 'Lucro líquido do exemplo',
      descricao: 'Resultado após despesas',
      total: this.lucroPeriodo(),
    },
  ]);

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

  private montarDocumento(): DocumentoExportacao {
    const filtros = this.filtrosAplicados();

    return {
      titulo: `DRE - ${filtros.dataInicial} a ${filtros.dataFinal}`,
      colunas: ['Conta / grupo', 'Descrição', 'Total'],
      linhas: this.composicaoResultado().map((item) => [
        item.contaGrupo,
        item.descricao,
        item.redutora ? -item.total : item.total,
      ]),
    };
  }

  private periodoExportacao(): string {
    const filtros = this.filtrosAplicados();

    return `${filtros.dataInicial} a ${filtros.dataFinal}`;
  }

  async abrirExportacao(
    formato: 'pdf' | 'xlsx',
  ): Promise<void> {
    const empresa = this.empresa();

    if (!empresa) {
      this.erroExportacao = 'Selecione uma empresa antes de exportar.';
      return;
    }

    const filtros = this.filtrosAplicados();

    if (
      !filtros.dataInicial ||
      !filtros.dataFinal ||
      filtros.dataInicial > filtros.dataFinal
    ) {
      this.erroExportacao = 'Informe um período válido.';
      return;
    }

    const documento = this.montarDocumento();
    const periodo = this.periodoExportacao();

    this.erroExportacao = '';

    this.exportacao.prepararDre(
      empresa.id,
      periodo,
      documento,
    );

    await this.router.navigate(
      ['/relatorios/dre/exportar'],
      {
        queryParams: {
          tipo: 'dre',
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
