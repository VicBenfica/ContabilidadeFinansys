import { Injectable, inject } from '@angular/core';

import { LancamentosService } from './lancamentos.service';

export interface DocumentoExportacao {
  titulo: string;
  colunas: string[];
  linhas: string[][];
}

@Injectable({ providedIn: 'root' })
export class ExportacaoService {
  private readonly lancamentos = inject(LancamentosService);

  private readonly moeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  gerarDiario(empresaId: number, mes: string): DocumentoExportacao {
    const registros = this.lancamentos
      .listar(empresaId)
      .filter((item) => item.data.slice(0, 7) === mes)
      .sort((a, b) =>
        a.data.localeCompare(b.data) || Number(a.numero) - Number(b.numero),
      );

    return {
      titulo: 'Livro Diário',
      colunas: ['Nº', 'Data', 'Histórico', 'Valor da operação'],
      linhas: registros.map((item) => [
        `#${item.numero}`,
        item.data.split('-').reverse().join('/'),
        item.historico,
        this.moeda.format(item.valor),
      ]),
    };
  }
}