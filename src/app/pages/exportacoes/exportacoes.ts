import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import { PlanoContasService } from '../../shared/services/plano-contas.service';
import { ArquivoProntoService } from '../../shared/services/arquivo-pronto.service';
import {
  ExportacaoService,
  type DocumentoExportacao,
} from '../../shared/services/exportacao.service';

@Component({
  selector: 'app-exportacoes',
  standalone: true,
  imports: [Card, FormsModule, RouterLink],
  templateUrl: './exportacoes.html',
  styleUrl: './exportacoes.css',
})
export class Exportacoes {
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);
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

  private readonly balancetePreparado = signal<{
    empresaId: number;
    periodo: string;
    documento: DocumentoExportacao;
  } | null>(null);

  prepararBalancete(
    empresaId: number,
    periodo: string,
    documento: DocumentoExportacao,
  ): void {
    this.balancetePreparado.set({
      empresaId,
      periodo,
      documento,
    });
  }

  obterBalancete(empresaId: number) {
    const dados = this.balancetePreparado();
    return dados?.empresaId === empresaId ? dados : null;
  }

  get tipo(): string {
    const tipoParametro = this.parametros().get('tipo');
    if (tipoParametro) return tipoParametro;

    const caminho = this.router.url.split('?')[0];

    if (caminho === '/relatorios/balancete/exportar') {
      return 'balancete';
    }
    if (caminho === '/relatorios/balanco-patrimonial/exportar') {
      return 'balanco-patrimonial';
    }
    if (caminho === '/relatorios/dre/exportar') {
      return 'dre';
    }
    if (caminho === '/relatorios/dfc/exportar') {
      return 'dfc';
    }
    if (caminho === '/livro-razao/exportar') {
      return 'razao';
    }
    if (caminho === '/livro-diario/exportar') {
      return 'diario';
    }
    if (caminho === '/plano-contas/exportar') {
      return 'plano-contas';
    }

    return 'consolidado';
  }

  get modoPlanoContas(): boolean {
    return this.tipo === 'plano-contas';
  }

  get modoBalancoPatrimonial(): boolean {
    return this.tipo === 'balanco-patrimonial';
  }

  get modoRazao(): boolean {
    return this.tipo === 'razao';
  }

  get modoBalancete(): boolean {
    return this.tipo === 'balancete';
  }

  get modoDre(): boolean {
    return this.tipo === 'dre';
  }

  get modoDfc(): boolean {
    return this.tipo === 'dfc';
  }

  get consolidado(): boolean {
    return ![
      'diario',
      'razao',
      'plano-contas',
      'balancete',
      'balanco-patrimonial',
      'dre',
      'dfc',
    ].includes(this.tipo);
  }

  get nomeRelatorio(): string {
    if (this.modoPlanoContas) return 'Plano de Contas';
    if (this.modoRazao) return 'Livro Razão';
    if (this.modoBalancete) return 'Balancete de Verificação';
    if (this.modoBalancoPatrimonial) return 'Balanço Patrimonial';
    if (this.modoDre) return 'DRE';
    if (this.modoDfc) return 'DFC';
    if (this.tipo === 'diario') return 'Livro Diário';

    return 'Relatório Contábil Consolidado';
  }

  get origemExportacao(): string {
    if (this.modoPlanoContas) return '/plano-contas';
    if (this.modoRazao) return '/livro-razao';
    if (this.modoBalancete) return '/relatorios/balancete';
    if (this.modoBalancoPatrimonial) return '/relatorios/balanco-patrimonial';
    if (this.modoDre) return '/relatorios/dre';
    if (this.modoDfc) return '/relatorios/dfc';
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

  get balanceteExportado() {
    const empresa = this.empresa();
    if (!this.modoBalancete || !empresa) return null;
    return this.exportacao.obterBalancete(empresa.id);
  }

  get dreExportada() {
    const empresa = this.empresa();
    if (!this.modoDre || !empresa) return null;
    return this.exportacao.obterDre(empresa.id);
  }

  get dfcExportada() {
    const empresa = this.empresa();
    if (!this.modoDfc || !empresa) return null;
    return this.exportacao.obterDfc(empresa.id);
  }

  get periodoExibido(): string {
    if (this.modoBalancete) {
      return this.balanceteExportado?.periodo ?? 'Período não disponível';
    }

    if (this.modoDre) {
      return this.dreExportada?.periodo ?? 'Período não disponível';
    }

    if (this.modoDfc) {
      return this.dfcExportada?.periodo ?? 'Período não disponível';
    }

    if (this.modoRazao) {
      if (!this.inicioRazao || !this.fimRazao) {
        return 'Período não informado';
      }

      return (
        this.formatarData(this.inicioRazao) +
        ' a ' +
        this.formatarData(this.fimRazao)
      );
    }

    return this.mes;
  }

  formatarData(data: string): string {
    return data.split('-').reverse().join('/');
  }

  get documento(): DocumentoExportacao | null {
    const empresa = this.empresa();

    if (!empresa) return null;

    if (this.modoPlanoContas) {
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

    if (this.modoRazao) {
      return this.razaoExportado?.documento ?? null;
    }

    if (this.modoBalancete) {
      return this.balanceteExportado?.documento ?? null;
    }

    if (this.modoBalancoPatrimonial) {
      return {
        titulo: 'Balanço Patrimonial',
        colunas: ['Código', 'Conta contábil', 'Grupo', 'Subgrupo', 'Tipo'],
        linhas: this.planoService
          .contas()
          .filter(
            (conta) =>
              conta.grupo === 'Ativo' ||
              conta.grupo === 'Passivo' ||
              conta.grupo === 'Patrimônio Líquido',
          )
          .map((conta) => [
            conta.codigo,
            conta.nome,
            conta.grupo,
            conta.subgrupo,
            conta.tipo,
          ]),
      };
    }

    if (this.modoDre) {
      return this.dreExportada?.documento ?? null;
    }

    if (this.modoDfc) {
      return this.dfcExportada?.documento ?? null;
    }

    if (!this.mes) return null;

    if (this.tipo === 'diario') {
      return this.exportacao.gerarDiario(empresa.id, this.mes);
    }

    const diario = this.exportacao.gerarDiario(empresa.id, this.mes);

    if (diario.linhas.length > 0) {
      return {
        ...diario,
        titulo: 'Prévia do relatório contábil consolidado',
      };
    }

    return {
      titulo: 'Prévia do relatório contábil consolidado',
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

  async gerarCSV(): Promise<void> {
    const relatorio = this.documento;
    const empresa = this.empresa();

    if (
      !this.modoPlanoContas ||
      !empresa ||
      !relatorio?.linhas.length ||
      this.gerando
    ) {
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

      const linhas = [relatorio.colunas, ...relatorio.linhas];

      const csv =
        '\uFEFF' +
        linhas.map((linha) => linha.map(escapar).join(';')).join('\r\n');

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

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      }

      await this.arquivoPronto.abrir(
        'Plano de Contas',
        'CSV',
        '/plano-contas',
      );
    } catch (erro) {
      console.error(erro);
      this.erroExportacao = 'Não foi possível gerar o arquivo CSV.';
    } finally {
      this.gerando = false;
    }
  }

  formatarCelula(valor: string | number): string {
    return typeof valor === 'number' ? this.moeda.format(valor) : valor;
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

    this.erroExportacao = '';

    if (this.modoPlanoContas) {
      await this.gerarCSV();
      return;
    }

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
              nomeArquivo: `livro-razao-${this.inicioRazao}-a-${this.fimRazao}.xlsx`,
              larguras: [10, 14, 48, 16, 16, 20],
              colunasMonetarias: [4, 5, 6],
            }
          : this.modoBalancete
            ? {
                nomeArquivo: `balancete-verificacao-${this.mes}.xlsx`,
                larguras: [42, 20, 20, 20, 20],
                colunasMonetarias: [2, 3, 4],
              }
            : this.modoBalancoPatrimonial
              ? {
                  nomeArquivo: `balanco-patrimonial-${this.mes}.xlsx`,
                  larguras: [14, 42, 22, 22, 16],
                  colunasMonetarias: [],
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
      this.erroExportacao = 'Não foi possível gerar o Excel. Tente novamente.';
    } finally {
      this.gerando = false;
    }
  }
}