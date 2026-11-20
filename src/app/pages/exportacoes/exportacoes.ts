import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import {
  ExportacaoService,
  type DocumentoExportacao,
} from '../../shared/services/exportacao.service';

@Component({
  selector: 'app-exportacoes',
  imports: [Card, FormsModule, RouterLink],
  templateUrl: './exportacoes.html',
  styleUrl: './exportacoes.css',
})
export class Exportacoes {
  private readonly rota = inject(ActivatedRoute);
  private readonly exportacao = inject(ExportacaoService);

  readonly empresa = inject(EmpresasService).selecionada;

  private readonly parametros = toSignal(this.rota.queryParamMap, {
    initialValue: this.rota.snapshot.queryParamMap,
  });
  formato: 'pdf' | 'xlsx' =
    this.parametros().get('formato') === 'xlsx' ? 'xlsx' : 'pdf';

  gerando = false;
  erroExportacao = '';

  private readonly moeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  formatarCelula(valor: string | number): string {
    return typeof valor === 'number' ? this.moeda.format(valor) : valor;
  }

  async gerarArquivo(): Promise<void> {
    const relatorio = this.documento;
    const empresa = this.empresa();

    if (!empresa || !relatorio?.linhas.length || this.gerando) return;

    this.erroExportacao = '';

    if (this.formato === 'pdf') {
      window.print();
      return;
    }

    this.gerando = true;

    try {
      await this.exportacao.baixarExcel(relatorio, empresa.nomeFantasia, this.mes);
    } catch {
      this.erroExportacao = 'Não foi possível gerar o Excel. Tente novamente.';
    } finally {
      this.gerando = false;
    }
  }
  mes = '2026-11';

  get consolidado(): boolean {
    return this.parametros().get('tipo') !== 'diario';
  }

  get documento(): DocumentoExportacao | null {
    const empresa = this.empresa();

    if (!empresa || !this.mes || this.consolidado) return null;

    return this.exportacao.gerarDiario(empresa.id, this.mes);
  }

  imprimir(): void {
    if (this.documento?.linhas.length) {
      window.print();
    }
  }
}