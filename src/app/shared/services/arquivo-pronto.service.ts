
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

export type FormatoExportado = 'PDF' | 'Excel (.xlsx)' | 'CSV';

@Injectable({
  providedIn: 'root',
})
export class ArquivoProntoService {
  private readonly router = inject(Router);

  abrir(
    relatorio: string,
    formato: FormatoExportado,
    origem: string,
  ): Promise<boolean> {
    return this.router.navigate(['/relatorios/arquivo-pronto'], {
      state: {
        concluido: true,
        relatorio,
        formato,
        origem,
      },
    });
  }
}
