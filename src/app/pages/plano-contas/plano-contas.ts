import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from '../../shared/components/card/card';

export type GrupoContabil =
  | 'Ativo'
  | 'Passivo'
  | 'Patrimônio Líquido'
  | 'Despesa'
  | 'Receita'
  | 'Apuração do Resultado';

export type SubgrupoContabil =
  | 'Circulante'
  | 'Realizável a Longo Prazo'
  | 'Investimento'
  | 'Imobilizado'
  | 'Intangível'
  | 'Não Circulante'
  | 'N/A';

export type TipoConta = 'Sintética' | 'Analítica';

export interface ContaContabil {
  codigo: string;
  nome: string;
  grupo: GrupoContabil;
  subgrupo: SubgrupoContabil;
  tipo: TipoConta;
  nivel: number;
}

const PLANO_PADRAO: ContaContabil[] = [
  { codigo: '1.0.1', nome: 'Caixa', grupo: 'Ativo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '1.0.2', nome: 'Bancos Conta Movimento', grupo: 'Ativo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '1.0.3', nome: 'Clientes', grupo: 'Ativo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '1.0.4', nome: 'Estoques', grupo: 'Ativo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '1.0.5', nome: 'Despesas Antecipadas', grupo: 'Ativo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '2.0.1', nome: 'Clientes - Longo Prazo', grupo: 'Ativo', subgrupo: 'Realizável a Longo Prazo', tipo: 'Analítica', nivel: 2 },
  { codigo: '2.0.2', nome: 'Depósitos Judiciais', grupo: 'Ativo', subgrupo: 'Realizável a Longo Prazo', tipo: 'Analítica', nivel: 2 },
  { codigo: '2.1.1', nome: 'Participações Societárias', grupo: 'Ativo', subgrupo: 'Investimento', tipo: 'Analítica', nivel: 2 },
  { codigo: '2.1.2', nome: 'Imóveis para Renda', grupo: 'Ativo', subgrupo: 'Investimento', tipo: 'Analítica', nivel: 2 },
  { codigo: '2.2.1', nome: 'Máquinas e Equipamentos', grupo: 'Ativo', subgrupo: 'Imobilizado', tipo: 'Analítica', nivel: 2 },
  { codigo: '2.2.2', nome: 'Veículos', grupo: 'Ativo', subgrupo: 'Imobilizado', tipo: 'Analítica', nivel: 2 },
  { codigo: '2.2.3', nome: 'Móveis e Utensílios', grupo: 'Ativo', subgrupo: 'Imobilizado', tipo: 'Analítica', nivel: 2 },
  { codigo: '2.2.4', nome: 'Depreciação Acumulada', grupo: 'Ativo', subgrupo: 'Imobilizado', tipo: 'Analítica', nivel: 2 },
  { codigo: '2.3.1', nome: 'Softwares', grupo: 'Ativo', subgrupo: 'Intangível', tipo: 'Analítica', nivel: 2 },
  { codigo: '2.3.2', nome: 'Marcas e Patentes', grupo: 'Ativo', subgrupo: 'Intangível', tipo: 'Analítica', nivel: 2 },
  { codigo: '3.0.1', nome: 'Fornecedores', grupo: 'Passivo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '3.0.2', nome: 'Salários a Pagar', grupo: 'Passivo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '3.0.3', nome: 'Impostos a Recolher', grupo: 'Passivo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '3.0.4', nome: 'Empréstimos Bancários CP', grupo: 'Passivo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '3.0.5', nome: 'Contas a Pagar', grupo: 'Passivo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '3.1.1', nome: 'Empréstimos Bancários LP', grupo: 'Passivo', subgrupo: 'Não Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '3.1.2', nome: 'Provisões Trabalhistas', grupo: 'Passivo', subgrupo: 'Não Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '3.1.3', nome: 'Contas a Pagar LP', grupo: 'Passivo', subgrupo: 'Não Circulante', tipo: 'Analítica', nivel: 2 },
  { codigo: '4.0.1', nome: 'Capital Social', grupo: 'Patrimônio Líquido', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '4.0.2', nome: 'Reservas de Lucros', grupo: 'Patrimônio Líquido', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '4.0.3', nome: 'Lucros Acumulados', grupo: 'Patrimônio Líquido', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '5.0.1', nome: 'CMV', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '5.0.2', nome: 'CPV', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '5.0.3', nome: 'CSP', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '5.1.1', nome: 'Despesa com Salários', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '5.1.2', nome: 'Despesa com Aluguel', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '5.1.3', nome: 'Despesa com Energia Elétrica', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '5.1.4', nome: 'Despesa Financeira', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '5.1.5', nome: 'Despesa com Material de Escritório', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '5.2.1', nome: 'Despesa com Depreciação', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '5.3.0', nome: 'Despesa com IRPJ', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '6.0.1', nome: 'Receita de Vendas', grupo: 'Receita', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '6.0.2', nome: 'Receita de Serviços', grupo: 'Receita', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '6.0.3', nome: 'Receita Financeira', grupo: 'Receita', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
  { codigo: '7.0.1', nome: 'Resultado do Exercício', grupo: 'Apuração do Resultado', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2 },
];

@Component({
  selector: 'app-plano-contas',
  standalone: true,
  imports: [Card, FormsModule],
  templateUrl: './plano-contas.html',
  styleUrl: './plano-contas.css',
})
export class PlanoContas {
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

  contas: ContaContabil[] = [...PLANO_PADRAO];

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

    return this.contas.filter((conta) => {
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
    this.contas = [...PLANO_PADRAO];
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

    const listaSemAnterior = this.codigoEmEdicao
      ? this.contas.filter((c) => c.codigo !== this.codigoEmEdicao)
      : this.contas.filter((c) => c.codigo !== codigo);

    this.contas = [...listaSemAnterior, registro].sort((a, b) =>
      a.codigo.localeCompare(b.codigo, 'pt-BR', { numeric: true }),
    );

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

  importarCsv(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = () => {
      const texto = String(leitor.result ?? '');
      const linhas = texto
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      const importadas: ContaContabil[] = [];
      for (const linha of linhas.slice(1)) {
        const colunas = linha.split(';').map((s) => s?.trim());
        const [codigo, nome, grupo] = colunas;
        const subgrupo = colunas.length >= 5 ? colunas[3] : 'N/A';
        const tipo = colunas.length >= 5 ? colunas[4] : colunas[3];

        if (!codigo || !nome) continue;

        importadas.push({
          codigo,
          nome,
          grupo: (this.grupos.includes(grupo as GrupoContabil)
            ? grupo
            : 'Ativo') as GrupoContabil,
          subgrupo: (this.subgrupos.includes(subgrupo as SubgrupoContabil)
            ? subgrupo
            : 'N/A') as SubgrupoContabil,
          tipo: tipo === 'Sintética' ? 'Sintética' : 'Analítica',
          nivel: Math.max(0, codigo.split('.').length - 1),
        });
      }

      if (importadas.length > 0) {
        this.contas = importadas.sort((a, b) =>
          a.codigo.localeCompare(b.codigo, 'pt-BR', { numeric: true }),
        );
      }
      input.value = '';
    };
    leitor.readAsText(arquivo, 'utf-8');
  }
}