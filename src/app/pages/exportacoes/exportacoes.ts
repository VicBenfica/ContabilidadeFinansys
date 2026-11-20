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