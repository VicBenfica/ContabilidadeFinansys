import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Card } from '../../shared/components/card/card';
import {
  ContaContabil,
  GrupoContabil,
  PlanoContasService,
  SubgrupoContabil,
  TipoConta,
} from '../../shared/services/plano-contas.service';

@Component({
  selector: 'app-plano-contas',
  standalone: true,
  imports: [Card, FormsModule, RouterLink],
  templateUrl: './plano-contas.html',
  styleUrl: './plano-contas.css',
})
export class PlanoContas {
  private readonly planoService = inject(PlanoContasService);

  readonly grupos: GrupoContabil[] = [
    'Ativo',
    'Passivo',
    'Patrimônio Líquido',
    'Despesa',
    'Receita',
    'Apuração do Resultado',
  ];

  readonly subgrupos: SubgrupoContabil[] = [
    'Circulante',
    'Realizável a Longo Prazo',
    'Investimento',
    'Imobilizado',
    'Intangível',
    'Não Circulante',
    'N/A',
  ];

  filtros = {
    busca: '',
    grupo: '',
    tipo: '',
  };

  filtrosAplicados = { ...this.filtros };

  exibirModalConta = false;
  codigoEmEdicao: string | null = null;

  formConta = {
    codigo: '',
    nome: '',
    grupo: 'Ativo' as GrupoContabil,
    subgrupo: 'Circulante' as SubgrupoContabil,
    tipo: 'Analítica' as TipoConta,
  };

  get contasFiltradas(): ContaContabil[] {
    const termo = this.filtrosAplicados.busca.trim().toLowerCase();
    const { grupo, tipo } = this.filtrosAplicados;

    return this.planoService.contas().filter((conta) => {
      const correspondeBusca =
        !termo ||
        conta.codigo.toLowerCase().includes(termo) ||
        conta.nome.toLowerCase().includes(termo) ||
        conta.subgrupo.toLowerCase().includes(termo);
      const correspondeGrupo = !grupo || conta.grupo === grupo;
      const correspondeTipo = !tipo || conta.tipo === tipo;

      return correspondeBusca && correspondeGrupo && correspondeTipo;
    });
  }

  aplicarFiltros(): void {
    this.filtrosAplicados = { ...this.filtros };
  }

  carregarPlanoPadrao(): void {
    this.planoService.restaurarPadrao();
    this.filtros = { busca: '', grupo: '', tipo: '' };
    this.aplicarFiltros();
  }

  abrirModalNovaConta(): void {
    this.codigoEmEdicao = null;
    this.formConta = {
      codigo: '',
      nome: '',
      grupo: 'Ativo',
      subgrupo: 'Circulante',
      tipo: 'Analítica',
    };
    this.exibirModalConta = true;
  }

  abrirModalEditarConta(conta: ContaContabil): void {
    this.codigoEmEdicao = conta.codigo;
    this.formConta = {
      codigo: conta.codigo,
      nome: conta.nome,
      grupo: conta.grupo,
      subgrupo: conta.subgrupo,
      tipo: conta.tipo,
    };
    this.exibirModalConta = true;
  }

  fecharModalConta(): void {
    this.exibirModalConta = false;
    this.codigoEmEdicao = null;
  }

  salvarConta(): void {
    const codigo = this.formConta.codigo.trim();
    const nome = this.formConta.nome.trim();
    if (!codigo || !nome) return;

    const nivel = Math.max(0, codigo.split('.').length - 1);
    const registro: ContaContabil = {
      codigo,
      nome,
      grupo: this.formConta.grupo,
      subgrupo: this.formConta.subgrupo,
      tipo: this.formConta.tipo,
      nivel,
    };

    this.planoService.salvarConta(registro, this.codigoEmEdicao);
    this.fecharModalConta();
  }

  exportarCsv(): void {
    const cabecalho = 'Codigo;Conta contabil;Grupo;Subgrupo;Tipo';
    const linhas = this.contasFiltradas.map(
      (c) => `${c.codigo};${c.nome};${c.grupo};${c.subgrupo};${c.tipo}`,
    );
    const conteudo = '\uFEFF' + [cabecalho, ...linhas].join('\n');
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'plano-de-contas.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}