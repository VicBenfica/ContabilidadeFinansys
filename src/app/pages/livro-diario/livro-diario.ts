import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Card } from '../../shared/components/card/card';
import { EmpresasService } from '../../shared/services/empresas.service';
import { LancamentosService, type Lancamento, type Natureza} from '../../shared/services/lancamentos.service';


interface PartidaEmEdicao {
  id: number;
  conta: string;
  natureza: Natureza;
  valor: number | null;
}
@Component({
  selector: 'app-livro-diario',
  imports: [Card, FormsModule, RouterLink],
  templateUrl: './livro-diario.html',
  styleUrl: './livro-diario.css',
})
export class LivroDiario {
  private readonly empresas = inject(EmpresasService);
  private proximaLinha = 0;
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly lancamentosService = inject(LancamentosService);


  private readonly parametros = toSignal(this.rota.queryParamMap, {
    initialValue: this.rota.snapshot.queryParamMap,
  });

  get exibirFormulario(): boolean {
    return this.parametros().get('novo') === '1' || !this.temMovimentacao;
  }

  private readonly moeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });


  filtros = {
    inicio: '2026-11-01',
    fim: '2026-11-30',
    exibirEstornos: true,
  };

  filtrosAplicados = { ...this.filtros };
  erroFiltro = '';
  lancamentoAberto: string | null = null;

  dataLancamento = '';
  historicoNovo = '';
  exibirExemplo = false;

  partidasNovas: PartidaEmEdicao[] = [
    this.criarLinha('Débito'),
    this.criarLinha('Crédito'),
  ];

  private get historicoDaEmpresa(): Lancamento[] {
    const id = this.empresas.selecionada()?.id;
    return id === undefined ? [] : this.lancamentosService.listar(id);
  }

  get temMovimentacao(): boolean {
    return this.historicoDaEmpresa.length > 0;
  }

  get lancamentos(): Lancamento[] {
    const { inicio, fim, exibirEstornos } = this.filtrosAplicados;

    return this.historicoDaEmpresa.filter(
      (item) =>
        (!inicio || item.data >= inicio) &&
        (!fim || item.data <= fim) &&
        (exibirEstornos || !item.estorno),
    );
  }

  get periodo(): string {
    const { inicio, fim } = this.filtrosAplicados;

    if (inicio === '2026-11-01' && fim === '2026-11-30') {
      return 'Novembro de 2026';
    }

    if (inicio && inicio === fim) return this.formatarData(inicio);
    if (inicio && fim) {
      return `${this.formatarData(inicio)} a ${this.formatarData(fim)}`;
    }
    if (inicio) return `A partir de ${this.formatarData(inicio)}`;
    if (fim) return `Até ${this.formatarData(fim)}`;

    return 'Todos os períodos';
  }

  aplicarFiltros(): void {
    const { inicio, fim } = this.filtros;

    if (inicio && fim && inicio > fim) {
      this.erroFiltro = 'A data inicial não pode ser posterior à data final.';
      return;
    }

    this.erroFiltro = '';
    this.filtrosAplicados = { ...this.filtros };
    this.lancamentoAberto = null;
  }

  alternarPartidas(numero: string): void {
    this.lancamentoAberto = this.lancamentoAberto === numero ? null : numero;
  }

  private criarLinha(natureza: Natureza): PartidaEmEdicao {
    return { id: this.proximaLinha++, natureza, conta: '', valor: null };
  }

  adicionarPartida(): void {
    this.partidasNovas = [...this.partidasNovas, this.criarLinha('Débito')];
  }

  removerPartida(id: number): void {
    if (this.partidasNovas.length <= 2) return;

    this.partidasNovas = this.partidasNovas.filter((linha) => linha.id !== id);
  }



  private somarCentavos(natureza: Natureza): number {
    return this.partidasNovas
      .filter((linha) => linha.natureza === natureza)
      .reduce((total, linha) => total + this.emCentavos(linha.valor), 0);
  }

  get debitosCentavos(): number {
    return this.somarCentavos('Débito');
  }
private emCentavos(valor: number | null): number {
  if (valor === null || !Number.isFinite(valor)) return 0;

  return Math.round(valor * 100);
}
  get creditosCentavos(): number {
    return this.somarCentavos('Crédito');
  }

  get diferencaCentavos(): number {
    return Math.abs(this.debitosCentavos - this.creditosCentavos);
  }

  get podeContabilizar(): boolean {
    return Boolean(
      this.empresas.selecionada() &&
      this.dataLancamento &&
      this.historicoNovo.trim() &&
      this.debitosCentavos > 0 &&
      this.diferencaCentavos === 0 &&
      this.partidasNovas.every(
        (linha) => linha.conta.trim() && this.emCentavos(linha.valor) > 0,
      ),
    );
  }

  contabilizar(): void {
    const empresa = this.empresas.selecionada();
    if (!empresa || !this.podeContabilizar) return;

    const maiorNumero = this.historicoDaEmpresa.reduce(
      (maior, item) => Math.max(maior, Number(item.numero)),
      0,
    );

    const novo: Lancamento = {
      numero: String(maiorNumero + 1).padStart(3, '0'),
      data: this.dataLancamento,
      historico: this.historicoNovo.trim(),
      resumo: `${this.partidasNovas.length} partidas — ver detalhe`,
      valor: this.debitosCentavos / 100,
      partidas: this.partidasNovas.map((linha) => ({
        conta: linha.conta.trim(),
        natureza: linha.natureza,
        valor: this.emCentavos(linha.valor) / 100,
      })),
    };

    this.lancamentosService.adicionar(empresa.id, novo);

    this.filtros = { ...this.filtros, inicio: novo.data, fim: novo.data };
    this.aplicarFiltros();
    this.lancamentoAberto = novo.numero;

    this.dataLancamento = '';
    this.historicoNovo = '';
    this.partidasNovas = [this.criarLinha('Débito'), this.criarLinha('Crédito')];
    this.exibirExemplo = false;

    void this.router.navigate([], {
      relativeTo: this.rota,
      queryParams: { novo: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  formatarData(data: string): string {
    return data.split('-').reverse().join('/');
  }

  formatarValor(valor: number): string {
    return this.moeda.format(valor);
  }
}