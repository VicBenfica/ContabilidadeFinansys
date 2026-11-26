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
  readonly empresa = inject(EmpresasService).selecionada;
  private readonly arquivoPronto = inject(ArquivoProntoService);
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

  readonly resultadoBruto = computed(() => this.receitaVendas() - this.cmv());

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
      titulo: `DRE - ${this.filtrosAplicados().dataInicial} a ${this.filtrosAplicados().dataFinal}`,
      colunas: ['Conta / grupo', 'Descrição', 'Total'],
      linhas: this.composicaoResultado().map((item) => [
        item.contaGrupo,
        item.descricao,
        item.redutora ? -item.total : item.total,
      ]),
    };

    try {
      await this.exportacao.baixarExcel(documento, nomeEmpresa, periodo);
      await this.arquivoPronto.abrir(
        'Demonstração do Resultado do Exercício (DRE)',
        'Excel (.xlsx)',
        '/relatorios/dre',
      );
    } catch {
      this.erroExportacao = 'Não foi possível gerar o Excel. Tente novamente.';
    } finally {
      this.gerandoExcel = false;
    }
  }
}