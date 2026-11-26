
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArquivoProntoService } from '../../shared/services/arquivo-pronto.service';
import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import {
  ExportacaoService,
  type DocumentoExportacao,
} from '../../shared/services/exportacao.service';
import { PlanoContasService } from '../../shared/services/plano-contas.service';

@Component({
  selector: 'app-exportacoes',
  standalone: true,
  imports: [Card, FormsModule, RouterLink],
  templateUrl: './exportacoes.html',
  styleUrl: './exportacoes.css',
})
export class Exportacoes {
  private readonly rota = inject(ActivatedRoute);
  private readonly exportacao = inject(ExportacaoService);
  private readonly planoService = inject(PlanoContasService);
  private readonly arquivoPronto = inject(ArquivoProntoService);
  readonly empresa = inject(EmpresasService).selecionada;

  private readonly parametros = toSignal(this.rota.queryParamMap, {
    initialValue: this.rota.snapshot.queryParamMap,
  });

  mes = '2026-11';

  formato: 'pdf' | 'xlsx' =
    this.parametros().get('formato') === 'xlsx' ? 'xlsx' : 'pdf';

  gerando = false;
  erroExportacao = '';

  private readonly moeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  get tipo(): string {
    return this.parametros().get('tipo') ?? 'consolidado';
  }

  get modoRazao(): boolean {
    return this.tipo === 'razao';
  }

  get consolidado(): boolean {
    return !['diario', 'razao', 'plano-contas'].includes(this.tipo);
  }
  get modoPlanoContas(): boolean {
    return this.tipo === 'plano-contas';
  }
  get nomeRelatorio(): string {
    if (this.modoPlanoContas) return 'Plano de Contas';
    if (this.modoRazao) return 'Livro Razão';
    if (this.tipo === 'diario') return 'Livro Diário';

    return 'Relatório Contábil Consolidado';
  }

  get origemExportacao(): string {
    if (this.modoPlanoContas) return '/plano-contas';
    if (this.modoRazao) return '/livro-razao';
    if (this.tipo === 'diario') return '/livro-diario';

    return '/home';
  }
  get inicioRazao(): string {
    return this.parametros().get('inicio') ?? '';
  }

  get fimRazao(): string {
    return this.parametros().get('fim') ?? '';
  }

  get razaoExportado() {
    const empresa = this.empresa();
    const parametros = this.parametros();

    if (
      !this.modoRazao ||
      !empresa ||
      parametros.get('empresaId') !== String(empresa.id)
    ) {
      return null;
    }

    return this.exportacao.gerarRazao(
      empresa.id,
      parametros.get('conta') ?? '',
      this.inicioRazao,
      this.fimRazao,
    );
  }

  get periodoExibido(): string {
    if (!this.modoRazao) {
      return this.mes;
    }

    if (!this.inicioRazao || !this.fimRazao) {
      return 'Período não informado';
    }

    const inicio = this.inicioRazao.split('-').reverse().join('/');
    const fim = this.fimRazao.split('-').reverse().join('/');

    return `${inicio} a ${fim}`;
  }

  get documento(): DocumentoExportacao | null {
    const empresa = this.empresa();

    if (!empresa) {
      return null;
    }

    if (this.modoRazao) {
      return this.razaoExportado?.documento ?? null;
    }

    if (!this.mes) {
      return null;
    } if (this.modoPlanoContas) {
      return {
        titulo: 'Plano de Contas',
        colunas: ['Código', 'Conta contábil', 'Grupo', 'Subgrupo', 'Tipo'],
        linhas: this.planoService.contas().map((conta) => [
          conta.codigo,
          conta.nome,
          conta.grupo,
          conta.subgrupo,
          conta.tipo,
        ]),
      };
    }

    if (this.tipo === 'diario') {
      return this.exportacao.gerarDiario(
        empresa.id,
        this.mes,
      );
    }

    const diario = this.exportacao.gerarDiario(
      empresa.id,
      this.mes,
    );

    if (diario.linhas.length > 0) {
      return {
        ...diario,
        titulo:
          'Relatório Contábil Consolidado (Diário, Razão, Balancete, Balanço, DRE e DFC)',
      };
    }

    return {
      titulo:
        'Relatório Contábil Consolidado (Diário, Razão, Balancete, Balanço, DRE e DFC)',
      colunas: [
        'Código',
        'Conta contábil',
        'Grupo',
        'Subgrupo',
        'Tipo',
      ],
      linhas: this.planoService.contas().map((conta) => [
        conta.codigo,
        conta.nome,
        conta.grupo,
        conta.subgrupo,
        conta.tipo,
      ]),
    };
  }

  async gerarCSV(): Promise<void> {
    const relatorio = this.documento;
    const empresa = this.empresa();

    if (!empresa || !relatorio?.linhas.length || this.gerando) {
      return;
    }

    this.gerando = true;
    this.erroExportacao = '';

    try {
      const escapar = (valor: string | number): string => {
        let texto = String(valor ?? '');

        if (/^\s*[=+\-@\t\r]/.test(texto)) {
          texto = "'" + texto;
        }

        return `"${texto.replace(/"/g, '""')}"`;
      };

      const linhas = [
        relatorio.colunas,
        ...relatorio.linhas,
      ];

      const csv = '\uFEFF' + linhas
        .map((linha) => linha.map(escapar).join(';'))
        .join('\r\n');

      const blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      try {
        link.href = url;
        link.download = `plano-de-contas-${empresa.id}.csv`;

        document.body.appendChild(link);
        link.click();

      } finally {
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      await this.arquivoPronto.abrir(
        'Plano de Contas',
        'CSV',
        '/plano-contas',
      );

    } catch (erro) {
      console.error(erro);
      this.erroExportacao =
        'Não foi possível gerar o arquivo CSV.';
    } finally {
      this.gerando = false;
    }
  }

  formatarCelula(valor: string | number): string {
    return typeof valor === 'number'
      ? this.moeda.format(valor)
      : valor;
  }

  async gerarArquivo(): Promise<void> {
    const relatorio = this.documento;
    const empresa = this.empresa();

    if (
      !empresa ||
      !relatorio ||
      relatorio.linhas.length === 0 ||
      this.gerando
    ) {
      return;
    }
    if (this.modoPlanoContas) {
      await this.gerarCSV();
      return;
    }
    this.erroExportacao = '';

    if (this.consolidado || this.formato === 'pdf') {
      window.print();
      return;
    }

    this.gerando = true;

    try {
      await this.exportacao.baixarExcel(
        relatorio,
        empresa.nomeFantasia,
        this.periodoExibido,
        this.modoRazao
          ? {
            nomeArquivo:
              `livro-razao-${this.inicioRazao}-a-${this.fimRazao}.xlsx`,
            larguras: [10, 14, 48, 16, 16, 20],
            colunasMonetarias: [4, 5, 6],
          }
          : undefined,
      );
      await this.arquivoPronto.abrir(
        this.nomeRelatorio,
        'Excel (.xlsx)',
        this.origemExportacao,
      );
    } catch (erro) {
      console.error(erro);

      this.erroExportacao =
        'Não foi possível gerar o Excel. Tente novamente.';
    } finally {
      this.gerando = false;
    }
  }
}
