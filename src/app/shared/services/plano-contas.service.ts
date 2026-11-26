import { Injectable, signal } from '@angular/core';

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
export type NaturezaConta = 'Devedora' | 'Credora';

export interface ContaContabil {
  codigo: string;
  nome: string;
  grupo: GrupoContabil;
  subgrupo: SubgrupoContabil;
  tipo: TipoConta;
  nivel: number;
  contaSuperior?: string;
  natureza?: NaturezaConta;
}

export const PLANO_PADRAO: ContaContabil[] = [
  { codigo: '1.0.1', nome: 'Caixa', grupo: 'Ativo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '1.0 · Circulante', natureza: 'Devedora' },
  { codigo: '1.0.2', nome: 'Bancos Conta Movimento', grupo: 'Ativo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '1.0 · Circulante', natureza: 'Devedora' },
  { codigo: '1.0.3', nome: 'Clientes', grupo: 'Ativo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '1.0 · Circulante', natureza: 'Devedora' },
  { codigo: '1.0.4', nome: 'Estoques', grupo: 'Ativo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '1.0 · Circulante', natureza: 'Devedora' },
  { codigo: '1.0.5', nome: 'Despesas Antecipadas', grupo: 'Ativo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '1.0 · Circulante', natureza: 'Devedora' },
  { codigo: '2.0.1', nome: 'Clientes - Longo Prazo', grupo: 'Ativo', subgrupo: 'Realizável a Longo Prazo', tipo: 'Analítica', nivel: 2, contaSuperior: '2.0 · Realizável a Longo Prazo', natureza: 'Devedora' },
  { codigo: '2.0.2', nome: 'Depósitos Judiciais', grupo: 'Ativo', subgrupo: 'Realizável a Longo Prazo', tipo: 'Analítica', nivel: 2, contaSuperior: '2.0 · Realizável a Longo Prazo', natureza: 'Devedora' },
  { codigo: '2.1.1', nome: 'Participações Societárias', grupo: 'Ativo', subgrupo: 'Investimento', tipo: 'Analítica', nivel: 2, contaSuperior: '2.1 · Investimento', natureza: 'Devedora' },
  { codigo: '2.1.2', nome: 'Imóveis para Renda', grupo: 'Ativo', subgrupo: 'Investimento', tipo: 'Analítica', nivel: 2, contaSuperior: '2.1 · Investimento', natureza: 'Devedora' },
  { codigo: '2.2.1', nome: 'Máquinas e Equipamentos', grupo: 'Ativo', subgrupo: 'Imobilizado', tipo: 'Analítica', nivel: 2, contaSuperior: '2.2 · Imobilizado', natureza: 'Devedora' },
  { codigo: '2.2.2', nome: 'Veículos', grupo: 'Ativo', subgrupo: 'Imobilizado', tipo: 'Analítica', nivel: 2, contaSuperior: '2.2 · Imobilizado', natureza: 'Devedora' },
  { codigo: '2.2.3', nome: 'Móveis e Utensílios', grupo: 'Ativo', subgrupo: 'Imobilizado', tipo: 'Analítica', nivel: 2, contaSuperior: '2.2 · Imobilizado', natureza: 'Devedora' },
  { codigo: '2.2.4', nome: 'Depreciação Acumulada', grupo: 'Ativo', subgrupo: 'Imobilizado', tipo: 'Analítica', nivel: 2, contaSuperior: '2.2 · Imobilizado', natureza: 'Credora' },
  { codigo: '2.3.1', nome: 'Softwares', grupo: 'Ativo', subgrupo: 'Intangível', tipo: 'Analítica', nivel: 2, contaSuperior: '2.3 · Intangível', natureza: 'Devedora' },
  { codigo: '2.3.2', nome: 'Marcas e Patentes', grupo: 'Ativo', subgrupo: 'Intangível', tipo: 'Analítica', nivel: 2, contaSuperior: '2.3 · Intangível', natureza: 'Devedora' },
  { codigo: '3.0.1', nome: 'Fornecedores', grupo: 'Passivo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '3.0 · Circulante', natureza: 'Credora' },
  { codigo: '3.0.2', nome: 'Salários a Pagar', grupo: 'Passivo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '3.0 · Circulante', natureza: 'Credora' },
  { codigo: '3.0.3', nome: 'Impostos a Recolher', grupo: 'Passivo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '3.0 · Circulante', natureza: 'Credora' },
  { codigo: '3.0.4', nome: 'Empréstimos Bancários CP', grupo: 'Passivo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '3.0 · Circulante', natureza: 'Credora' },
  { codigo: '3.0.5', nome: 'Contas a Pagar', grupo: 'Passivo', subgrupo: 'Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '3.0 · Circulante', natureza: 'Credora' },
  { codigo: '3.1.1', nome: 'Empréstimos Bancários LP', grupo: 'Passivo', subgrupo: 'Não Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '3.1 · Não Circulante', natureza: 'Credora' },
  { codigo: '3.1.2', nome: 'Provisões Trabalhistas', grupo: 'Passivo', subgrupo: 'Não Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '3.1 · Não Circulante', natureza: 'Credora' },
  { codigo: '3.1.3', nome: 'Contas a Pagar LP', grupo: 'Passivo', subgrupo: 'Não Circulante', tipo: 'Analítica', nivel: 2, contaSuperior: '3.1 · Não Circulante', natureza: 'Credora' },
  { codigo: '4.0.1', nome: 'Capital Social', grupo: 'Patrimônio Líquido', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Credora' },
  { codigo: '4.0.2', nome: 'Reservas de Lucros', grupo: 'Patrimônio Líquido', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Credora' },
  { codigo: '4.0.3', nome: 'Lucros Acumulados', grupo: 'Patrimônio Líquido', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Credora' },
  { codigo: '5.0.1', nome: 'CMV', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Devedora' },
  { codigo: '5.0.2', nome: 'CPV', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Devedora' },
  { codigo: '5.0.3', nome: 'CSP', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Devedora' },
  { codigo: '5.1.1', nome: 'Despesa com Salários', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Devedora' },
  { codigo: '5.1.2', nome: 'Despesa com Aluguel', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Devedora' },
  { codigo: '5.1.3', nome: 'Despesa com Energia Elétrica', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Devedora' },
  { codigo: '5.1.4', nome: 'Despesa Financeira', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Devedora' },
  { codigo: '5.1.5', nome: 'Despesa com Material de Escritório', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Devedora' },
  { codigo: '5.2.1', nome: 'Despesa com Depreciação', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Devedora' },
  { codigo: '5.3.0', nome: 'Despesa com IRPJ', grupo: 'Despesa', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Devedora' },
  { codigo: '6.0.1', nome: 'Receita de Vendas', grupo: 'Receita', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Credora' },
  { codigo: '6.0.2', nome: 'Receita de Serviços', grupo: 'Receita', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Credora' },
  { codigo: '6.0.3', nome: 'Receita Financeira', grupo: 'Receita', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Credora' },
  { codigo: '7.0.1', nome: 'Resultado do Exercício', grupo: 'Apuração do Resultado', subgrupo: 'N/A', tipo: 'Analítica', nivel: 2, natureza: 'Credora' },
];

@Injectable({ providedIn: 'root' })
export class PlanoContasService {
  readonly contas = signal<ContaContabil[]>([...PLANO_PADRAO]);

  private ordenar(lista: ContaContabil[]): ContaContabil[] {
    return [...lista].sort((a, b) =>
      a.codigo.localeCompare(b.codigo, 'pt-BR', { numeric: true }),
    );
  }

  buscarPorCodigo(codigo: string): ContaContabil | undefined {
    return this.contas().find((c) => c.codigo === codigo);
  }

  restaurarPadrao(): void {
    this.contas.set([...PLANO_PADRAO]);
  }

  salvarConta(registro: ContaContabil, codigoAnterior?: string | null): void {
    const filtradas = this.contas().filter(
      (c) => c.codigo !== (codigoAnterior ?? registro.codigo),
    );
    this.contas.set(this.ordenar([...filtradas, registro]));
  }

  importarLote(novas: ContaContabil[]): void {
    const codigosNovos = new Set(novas.map((c) => c.codigo));
    const mantidas = this.contas().filter((c) => !codigosNovos.has(c.codigo));
    this.contas.set(this.ordenar([...mantidas, ...novas]));
  }
}