import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import {
  ExportacaoService,
  type DocumentoExportacao,
} from '../../shared/services/exportacao.service';

export interface LinhaBalanceteVerificacao {
  codigo: string;
  nome: string;
  saldoAnterior: number;
  debitos: number;
  creditos: number;
  saldoFinal: number;
  naturezaSaldo: 'D' | 'C' | null;
}

const MOVIMENTACOES_INICIAIS: LinhaBalanceteVerificacao[] = [
  {
    codigo: '1.1.01',
    nome: 'Caixa',
    saldoAnterior: 0,
    debitos: 1020,
    creditos: 125,
    saldoFinal: 895,
    naturezaSaldo: 'D',
  },
  {
    codigo: '1.1.03',
    nome: 'Clientes curto prazo',
    saldoAnterior: 0,
    debitos: 30,
    creditos: 0,
    saldoFinal: 30,
    naturezaSaldo: 'D',
  },
  {
    codigo: '1.1.04',
    nome: 'Estoque de mercadorias',
    saldoAnterior: 0,
    debitos: 100,
    creditos: 40,
    saldoFinal: 60,
    naturezaSaldo: 'D',
  },
  {
    codigo: '1.2.01',
    nome: 'Clientes longo prazo',
    saldoAnterior: 0,
    debitos: 30,
    creditos: 0,
    saldoFinal: 30,
    naturezaSaldo: 'D',
  },
  {
    codigo: '3.1',
    nome: 'Capital social',
    saldoAnterior: 0,
    debitos: 0,
    creditos: 1000,
    saldoFinal: 1000,
    naturezaSaldo: 'C',
  },
  {
    codigo: '4.1 / 5.1 / 6.1',
    nome: 'Contas de resultado',
    saldoAnterior: 0,
    debitos: 65,
    creditos: 80,
    saldoFinal: 15,
    naturezaSaldo: 'C',
  },
  {
    codigo: '1.1.02',
    nome: 'Bancos Conta Movimento',
    saldoAnterior: 0,
    debitos: 0,
    creditos: 0,
    saldoFinal: 0,
    naturezaSaldo: null,
  },
  {
    codigo: '2.1.01',
    nome: 'Fornecedores',
    saldoAnterior: 0,
    debitos: 0,
    creditos: 0,
    saldoFinal: 0,
    naturezaSaldo: null,
  },
];

@Component({
  selector: 'app-balancete-verificacao',
  standalone: true,
  imports: [Card, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './balancete-verificacao.html',
  styleUrl: './balancete-verificacao.css',
})
export class BalanceteVerificacao {
  private readonly exportacao = inject(ExportacaoService);
  private readonly router = inject(Router);
  readonly empresa = inject(EmpresasService).selecionada;

  filtros = {
    dataInicial: '2026-11-01',
    dataFinal: '2026-11-30',
    contas: 'movimentacao' as 'movimentacao' | 'todas' | 'com-saldo',
  };

  readonly filtrosAplicados = signal({ ...this.filtros });
  readonly registros = signal<LinhaBalanceteVerificacao[]>(MOVIMENTACOES_INICIAIS);

  gerandoExcel = false;
  erroExportacao = '';

  readonly linhasFiltradas = computed(() => {
    const modo = this.filtrosAplicados().contas;
    return this.registros().filter((item) => {
      if (modo === 'movimentacao') {
        return item.debitos > 0 || item.creditos > 0;
      }
      if (modo === 'com-saldo') {
        return item.saldoFinal > 0;
      }
      return true;
    });
  });

  readonly totais = computed(() => {
    const lista = this.linhasFiltradas();
    const saldoAnterior = lista.reduce((acc, i) => acc + i.saldoAnterior, 0);
    const debitos = lista.reduce((acc, i) => acc + i.debitos, 0);
    const creditos = lista.reduce((acc, i) => acc + i.creditos, 0);
    const diferenca = Math.abs(debitos - creditos);

    return { saldoAnterior, debitos, creditos, diferenca };
  });

  readonly tituloPeriodo = computed(() => {
    const data = this.filtrosAplicados().dataInicial;
    if (!data) return 'Movimentação e saldo final';

    const [ano, mes] = data.split('-').map(Number);
    if (!ano || !mes) return 'Movimentação e saldo final';

    const referencia = new Date(ano, mes - 1, 1);
    const mesExtenso = referencia.toLocaleDateString('pt-BR', { month: 'long' });
    const mesCapitalizado =
      mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);

    return `Movimentação e saldo final - ${mesCapitalizado} de ${ano}`;
  });

  aplicarFiltros(): void {
    this.filtrosAplicados.set({ ...this.filtros });
  }


  private montarDocumento(): DocumentoExportacao {
    const totais = this.totais();

    return {
      titulo: this.tituloPeriodo(),
      colunas: [
        'Conta',
        'Saldo anterior',
        'Débitos',
        'Créditos',
        'Saldo final',
      ],
      linhas: [
        ...this.linhasFiltradas().map((item) => [
          `${item.codigo} · ${item.nome}`,
          item.saldoAnterior,
          item.debitos,
          item.creditos,
          item.saldoFinal > 0 && item.naturezaSaldo
            ? `${item.saldoFinal.toFixed(2)} ${item.naturezaSaldo}`
            : '—',
        ]),
        [
          'Total',
          totais.saldoAnterior,
          totais.debitos,
          totais.creditos,
          totais.diferenca,
        ],
      ],
    };
  }

  async abrirExportacao(
    formato: 'pdf' | 'xlsx',
  ): Promise<void> {
    const empresa = this.empresa();

    if (!empresa) {
      this.erroExportacao = 'Selecione uma empresa.';
      return;
    }

    const filtros = this.filtrosAplicados();

    if (
      !filtros.dataInicial ||
      !filtros.dataFinal ||
      filtros.dataInicial > filtros.dataFinal
    ) {
      this.erroExportacao = 'Informe um período válido.';
      return;
    }

    const documento = this.montarDocumento();

    const periodo =
      `${filtros.dataInicial} a ${filtros.dataFinal}`;

    this.erroExportacao = '';

    this.exportacao.prepararBalancete(
      empresa.id,
      periodo,
      documento,
    );

    await this.router.navigate(
      ['/relatorios/balancete/exportar'],
      {
        queryParams: {
          tipo: 'balancete',
          formato,
        },
      },
    );
  }

  gerarPdf(): void {
    void this.abrirExportacao('pdf');
  }

  exportarExcel(): void {
    void this.abrirExportacao('xlsx');
  }


}