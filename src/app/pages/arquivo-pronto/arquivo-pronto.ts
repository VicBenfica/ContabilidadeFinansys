
import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Card } from '../../shared/components/card/card';

interface ResultadoExportacao {
  concluido?: boolean;
  relatorio?: string;
  formato?: string;
  origem?: string;
}

@Component({
  selector: 'app-arquivo-pronto',
  standalone: true,
  imports: [Card, RouterLink],
  templateUrl: './arquivo-pronto.html',
  styleUrl: './arquivo-pronto.css',
})
export class ArquivoPronto {
  private readonly location = inject(Location);

  private readonly resultado =
    this.location.getState() as ResultadoExportacao;

  readonly concluido = this.resultado.concluido === true;

  readonly relatorio =
    this.resultado.relatorio ?? 'Relatório contábil';

  readonly formato =
    this.resultado.formato ?? 'Excel';

  readonly origem =
    this.resultado.origem?.startsWith('/relatorios/')
      ? this.resultado.origem
      : '/relatorios/balancete';
}
