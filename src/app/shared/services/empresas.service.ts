import { Injectable, computed, signal } from '@angular/core';

export interface DadosEmpresa {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
}

export interface Empresa extends DadosEmpresa {
  id: number;
  comMovimentacao: boolean;
}

@Injectable({ providedIn: 'root' })
export class EmpresasService {
  private readonly empresas = signal<Empresa[]>([
    {
      id: 1,
      razaoSocial: 'Papelaria Aurora Ltda.',
      nomeFantasia: 'Papelaria Aurora',
      cnpj: '',
      comMovimentacao: true,
    },
    {
      id: 2,
      razaoSocial: 'Papelaria Horizonte Ltda.',
      nomeFantasia: 'Papelaria Horizonte',
      cnpj: '',
      comMovimentacao: false,
    },
  ]);

  private readonly empresaSelecionadaId = signal(1);
  private proximoId = 3;

  readonly lista = this.empresas.asReadonly();

  readonly selecionada = computed(() =>
    this.empresas().find(
      (empresa) => empresa.id === this.empresaSelecionadaId(),
    ),
  );

  cadastrar(dados: DadosEmpresa): void {
    const empresa: Empresa = {
      ...dados,
      id: this.proximoId++,
      comMovimentacao: false,
    };

    this.empresas.update((lista) => [...lista, empresa]);
  }

  selecionar(id: number): void {
    this.empresaSelecionadaId.set(id);
  }
}