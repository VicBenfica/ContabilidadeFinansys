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

export interface LinhaGrupoPatrimonial {
  grupo: string;
  composicao: string;
  total: number;
}

@Component({
  selector: 'app-balanco-patrimonial',
  standalone: true,
  imports: [Card, CurrencyPipe, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './balanco-patrimonial.html',
  styleUrl: './balanco-patrimonial.css',
})
export class BalancoPatrimonial {
  private readonly exportacao = inject(ExportacaoService);
  readonly empresa = inject(EmpresasService).selecionada;

  dataReferencia = '2026-11-30';
  readonly dataAplicada = signal(this.dataReferencia);

  gerandoExcel = false;
  erroExportacao = '';

  readonly ativoCirculante = signal(985);
  readonly ativoNaoCirculante = signal(30);
  readonly passivoTotal = signal(0);
  readonly patrimonioLiquido = signal(1015);

  readonly ativoTotal = computed(
    () => this.ativoCirculante() + this.ativoNaoCirculante(),
  );

  readonly passivoMaisPl = computed(
    () => this.passivoTotal() + this.patrimonioLiquido(),
  );

  readonly gruposPatrimoniais = computed<LinhaGrupoPatrimonial[]>(() => [
    {
      grupo: 'Ativo circulante',
      composicao: 'Caixa, clientes de curto prazo e estoque',
      total: this.ativoCirculante(),
    },
    {
      grupo: 'Ativo não circulante',
      composicao: 'Clientes de longo prazo',
      total: this.ativoNaoCirculante(),
    },
    {
      grupo: 'Passivo circulante e não circulante',
      composicao: 'Sem obrigações em aberto no exemplo',
      total: this.passivoTotal(),
    },
    {
      grupo: 'Patrimônio líquido',
      composicao: 'Capital social e resultado acumulado',
      total: this.patrimonioLiquido(),
    },
    {
      grupo: 'Passivo + patrimônio líquido',
      composicao: 'Conferência do total do ativo',
      total: this.passivoMaisPl(),
    },
  ]);

  aplicarFiltros(): void {
    if (!this.dataReferencia) return;
    this.dataAplicada.set(this.dataReferencia);
  }

  gerarPdf(): void {
    window.print();
  }

  async exportarExcel(): Promise<void> {
    if (this.gerandoExcel) return;

    this.erroExportacao = '';
    this.gerandoExcel = true;

    const nomeEmpresa = this.empresa()?.nomeFantasia ?? 'Papelaria Aurora';
    const periodo = this.dataAplicada().slice(0, 7) || '2026-11';

    const documento: DocumentoExportacao = {
      titulo: `Balanço Patrimonial - Referência ${this.dataAplicada()}`,
      colunas: ['Grupo', 'Composição', 'Total'],
      linhas: this.gruposPatrimoniais().map((item) => [
        item.grupo,
        item.composicao,
        item.total,
      ]),
    };

    try {
      await this.exportacao.baixarExcel(documento, nomeEmpresa, periodo);
    } catch {
      this.erroExportacao = 'Não foi possível gerar o Excel. Tente novamente.';
    } finally {
      this.gerandoExcel = false;
    }
  }
}