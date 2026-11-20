import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import {
  LancamentosService,
  type Lancamento,
} from '../../shared/services/lancamentos.service';

@Component({
  selector: 'app-estorno-lancamento',
  imports: [Card, FormsModule, RouterLink],
  templateUrl: './estorno-lancamento.html',
  styleUrls: ['../livro-diario/livro-diario.css', './estorno-lancamento.css'],
})
export class EstornoLancamento {
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

  dataEstorno = '';
  motivo = '';
  erro = '';
  erroFiltro = '';

  filtros = { inicio: '', fim: '', exibirEstornos: true };
  filtrosAplicados = { ...this.filtros };

  get numero(): string {
    return this.parametros().get('numero') ?? '';
  }

  get original(): Lancamento | undefined {
    const empresa = this.empresas.selecionada();
    return empresa ? this.lancamentos.buscar(empresa.id, this.numero) : undefined;
  }

  get estorno(): Lancamento | undefined {
    const empresa = this.empresas.selecionada();
    return empresa
      ? this.lancamentos.buscarEstorno(empresa.id, this.numero)
      : undefined;
  }

  get registros(): Lancamento[] {
    const original = this.original;
    const estorno = this.estorno;

    if (!original || !estorno) return [];

    const { inicio, fim, exibirEstornos } = this.filtrosAplicados;

    return [estorno, original].filter(
      (item) =>
        (!inicio || item.data >= inicio) &&
        (!fim || item.data <= fim) &&
        (exibirEstornos || !item.estorno),
    );
  }

  confirmar(): void {
    const empresa = this.empresas.selecionada();
    if (!empresa) return;

    const estorno = this.lancamentos.registrarEstorno(
      empresa.id,
      this.numero,
      this.dataEstorno,
      this.motivo,
    );

    if (!estorno) {
      this.erro = 'Não foi possível registrar o estorno. Confira a data e o motivo.';
      return;
    }

    this.erro = '';
    this.motivo = '';
  }

  aplicarFiltros(): void {
    const { inicio, fim } = this.filtros;

    if (inicio && fim && inicio > fim) {
      this.erroFiltro = 'A data inicial não pode ser posterior à data final.';
      return;
    }

    this.erroFiltro = '';
    this.filtrosAplicados = { ...this.filtros };
  }

  formatarValor(valor: number): string {
    return this.moeda.format(valor);
  }
}