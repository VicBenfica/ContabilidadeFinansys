import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import {
  LancamentosService,
  type Lancamento,
} from '../../shared/services/lancamentos.service';

@Component({
  selector: 'app-lancamento-detalhe',
  imports: [Card, RouterLink],
  templateUrl: './lancamento-detalhe.html',
  styleUrl: './lancamento-detalhe.css',
})
export class LancamentoDetalhe {
  private readonly rota = inject(ActivatedRoute);
  private readonly empresas = inject(EmpresasService);
  private readonly lancamentos = inject(LancamentosService);

  private readonly parametros = toSignal(this.rota.paramMap, {
    initialValue: this.rota.snapshot.paramMap,
  });

  private readonly moeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  get numeroDetalhe(): string {
    return this.parametros().get('numero') ?? '';
  }

  get lancamentoDetalhe(): Lancamento | undefined {
    const empresaId = this.empresas.selecionada()?.id;

    return empresaId === undefined
      ? undefined
      : this.lancamentos.buscar(empresaId, this.numeroDetalhe);
  }

  resumoDetalhe(lancamento: Lancamento) {
    let debitos = 0;
    let creditos = 0;
    let valorVenda = 0;
    let custoMercadoria = 0;
    let venda = false;

    for (const partida of lancamento.partidas) {
      const valor = this.emCentavos(partida.valor);

      if (partida.natureza === 'Débito') {
        debitos += valor;

        if (partida.codigo === '5.1') {
          custoMercadoria += valor;
        }
      } else {
        creditos += valor;

        if (partida.codigo === '4.1') {
          venda = true;
          valorVenda += valor;
        }
      }
    }

    return {
      venda,
      debitos: debitos / 100,
      creditos: creditos / 100,
      diferenca: Math.abs(debitos - creditos) / 100,
      valorVenda: valorVenda / 100,
      custoMercadoria: custoMercadoria / 100,
    };
  }

  private emCentavos(valor: number): number {
    return Number.isFinite(valor) ? Math.round(valor * 100) : 0;
  }

  formatarData(data: string): string {
    return data.split('-').reverse().join('/');
  }

  formatarValor(valor: number): string {
    return this.moeda.format(valor);
  }
}