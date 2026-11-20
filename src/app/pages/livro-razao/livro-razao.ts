import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExportacaoService } from '../../shared/services/exportacao.service';
import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import { LancamentosService } from '../../shared/services/lancamentos.service';

interface MovimentoRazao {
  id: string;
  numero: string;
  data: string;
  historico: string;
  debito: number;
  credito: number;
  saldo: number;
}

@Component({
  selector: 'app-livro-razao',
  imports: [Card, FormsModule, RouterLink],
  templateUrl: './livro-razao.html',
  styleUrls: ['../livro-diario/livro-diario.css', './livro-razao.css'],
})
export class LivroRazao {
  private readonly empresas = inject(EmpresasService);
  private readonly lancamentosService = inject(LancamentosService);
  private readonly exportacao = inject(ExportacaoService);

  exportandoExcel = false;
  erroExportacao = '';

  gerarPdf(): void {
    if (this.relatorio) {
      window.print();
    }
  }

  async exportarExcel(): Promise<void> {
    const razao = this.relatorio;
    const empresa = this.empresas.selecionada();

    if (!razao || !empresa || this.exportandoExcel) return;

    this.exportandoExcel = true;
    this.erroExportacao = '';

    try {
      await this.exportacao.baixarExcel(
        {
          titulo: 'Livro Razão',
          colunas: ['Nº', 'Data', 'Histórico', 'Débito', 'Crédito', 'Saldo (+D / −C)'],
          linhas: [
            ['', '', `Conta: ${razao.conta}`, '', '', ''],
            ['', '', 'Saldo inicial', '', '', razao.saldoInicial / 100],
            ...razao.movimentos.map((item) => [
              `#${item.numero}`,
              this.formatarData(item.data),
              item.historico,
              item.debito ? item.debito / 100 : '',
              item.credito ? item.credito / 100 : '',
              item.saldo / 100,
            ]),
            [
              '', '', 'Totais do período',
              razao.debitos / 100,
              razao.creditos / 100,
              razao.saldoFinal / 100,
            ],
          ],
        },
        empresa.nomeFantasia,
        `${this.formatarData(razao.inicio)} a ${this.formatarData(razao.fim)}`,
        {
          nomeArquivo: `livro-razao-${razao.inicio}-a-${razao.fim}.xlsx`,
          larguras: [10, 14, 48, 16, 16, 20],
          colunasMonetarias: [4, 5, 6],
        },
      );
    } catch {
      this.erroExportacao = 'Não foi possível gerar o Excel. Tente novamente.';
    } finally {
      this.exportandoExcel = false;
    }
  }
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

  private filtrosAplicados:
    | { empresaId: number; conta: string; inicio: string; fim: string }
    | null = null;

  private get lancamentosDaEmpresa() {
    const empresa = this.empresas.selecionada();
    return empresa ? this.lancamentosService.listar(empresa.id) : [];
  }

  private chaveConta(nome: string): string {
    const chave = nome.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');

    return chave === 'estoque de mercadorias' ? 'estoque' : chave;
  }

  get contas(): { chave: string; nome: string }[] {
    const contas = new Map<string, string>();

    for (const lancamento of this.lancamentosDaEmpresa) {
      for (const partida of lancamento.partidas) {
        const chave = this.chaveConta(partida.conta);

        if (chave && !contas.has(chave)) {
          contas.set(chave, chave === 'estoque' ? 'Estoque' : partida.conta.trim());
        }
      }
    }

    return [...contas]
      .map(([chave, nome]) => ({ chave, nome }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  aplicarFiltros(): void {
    const empresa = this.empresas.selecionada();
    const { conta, inicio, fim } = this.filtros;

    if (!empresa || !this.contas.some((item) => item.chave === conta)) {
      this.erroFiltro = 'Selecione uma conta da empresa atual.';
      return;
    }

    if (!inicio || !fim || inicio > fim) {
      this.erroFiltro = 'Informe um período válido. A data inicial não pode ser posterior à final.';
      return;
    }

    this.erroFiltro = '';
    this.filtrosAplicados = { empresaId: empresa.id, conta, inicio, fim };
  }

  get relatorio() {
    const filtro = this.filtrosAplicados;
    if (!filtro || this.empresas.selecionada()?.id !== filtro.empresaId) {
      return null;
    }

    const conta = this.contas.find((item) => item.chave === filtro.conta);
    if (!conta) return null;

    let saldoInicial = 0;
    let debitos = 0;
    let creditos = 0;
    let saldo = 0;
    const movimentos: MovimentoRazao[] = [];

    const lancamentos = [...this.lancamentosDaEmpresa].sort(
      (a, b) => a.data.localeCompare(b.data) || Number(a.numero) - Number(b.numero),
    );

    for (const lancamento of lancamentos) {
      if (lancamento.data > filtro.fim) break;

      lancamento.partidas.forEach((partida, indice) => {
        if (this.chaveConta(partida.conta) !== filtro.conta) return;

        const valor = Math.round(partida.valor * 100);
        const debito = partida.natureza === 'Débito' ? valor : 0;
        const credito = partida.natureza === 'Crédito' ? valor : 0;

        saldo += debito - credito;

        if (lancamento.data < filtro.inicio) {
          saldoInicial += debito - credito;
          return;
        }

        debitos += debito;
        creditos += credito;

        movimentos.push({
          id: `${lancamento.numero}-${indice}`,
          numero: lancamento.numero,
          data: lancamento.data,
          historico: lancamento.historico,
          debito,
          credito,
          saldo,
        });
      });
    }

    return {
      conta: conta.nome,
      inicio: filtro.inicio,
      fim: filtro.fim,
      saldoInicial,
      debitos,
      creditos,
      saldoFinal: saldo,
      movimentos,
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
    if (centavos === 0) return valor;
    return `${valor} ${centavos > 0 ? 'D' : 'C'}`;
  }
}