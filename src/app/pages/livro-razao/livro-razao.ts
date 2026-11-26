
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import { LancamentosService } from '../../shared/services/lancamentos.service';
import {
  chaveConta,
  montarRazao
} from '../../shared/utils/livro-razao';

@Component({
  selector: 'app-livro-razao',
  imports: [Card, FormsModule, RouterLink],
  templateUrl: './livro-razao.html',
  styleUrls: [
    '../livro-diario/livro-diario.css',
    './livro-razao.css'
  ],
})
export class LivroRazao {

  private readonly empresas = inject(EmpresasService);
  private readonly lancamentosService = inject(LancamentosService);

  private readonly moeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  filtros = {
    conta: '',
    inicio: '2026-11-01',
    fim: '2026-11-30',
  };

  erroFiltro = '';

  private filtrosAplicados: {
    empresaId: number;
    conta: string;
    inicio: string;
    fim: string;
  } | null = null;

  private get lancamentosDaEmpresa() {
    const empresa = this.empresas.selecionada();

    return empresa
      ? this.lancamentosService.listar(empresa.id)
      : [];
  }

  get contas(): { chave: string; nome: string }[] {
    const contas = new Map<string, string>();

    for (const lancamento of this.lancamentosDaEmpresa) {
      for (const partida of lancamento.partidas) {

        const chave = chaveConta(partida.conta);

        if (chave && !contas.has(chave)) {
          contas.set(
            chave,
            chave === 'estoque'
              ? 'Estoque'
              : partida.conta.trim()
          );
        }
      }
    }

    return [...contas]
      .map(([chave, nome]) => ({
        chave,
        nome,
      }))
      .sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR')
      );
  }

  aplicarFiltros(): void {
    const empresa = this.empresas.selecionada();
    const { conta, inicio, fim } = this.filtros;

    if (!empresa || !this.contas.some(item => item.chave === conta)) {
      this.erroFiltro = 'Selecione uma conta da empresa atual.';
      return;
    }

    if (!inicio || !fim || inicio > fim) {
      this.erroFiltro =
        'Informe um período válido. A data inicial não pode ser posterior à final.';
      return;
    }

    this.erroFiltro = '';

    this.filtrosAplicados = {
      empresaId: empresa.id,
      conta,
      inicio,
      fim,
    };
  }

  get relatorio() {
    const filtro = this.filtrosAplicados;

    if (
      !filtro ||
      this.empresas.selecionada()?.id !== filtro.empresaId
    ) {
      return null;
    }

    return montarRazao(
      this.lancamentosDaEmpresa,
      filtro.conta,
      filtro.inicio,
      filtro.fim,
    );
  }

  get parametrosExportacao() {
    const filtro = this.filtrosAplicados;

    if (!filtro || !this.relatorio) {
      return null;
    }

    return {
      tipo: 'razao',
      empresaId: filtro.empresaId,
      conta: filtro.conta,
      inicio: filtro.inicio,
      fim: filtro.fim,
    };
  }

  get nomeEmpresa(): string {
    return this.empresas.selecionada()?.nomeFantasia ?? '';
  }

  formatarData(data: string): string {
    return data.split('-').reverse().join('/');
  }

  formatarValor(centavos: number): string {
    return this.moeda.format(centavos / 100);
  }

  formatarSaldo(centavos: number): string {
    const valor = this.formatarValor(Math.abs(centavos));

    if (centavos === 0) {
      return valor;
    }

    return `${valor} ${centavos > 0 ? 'D' : 'C'}`;
  }
}
