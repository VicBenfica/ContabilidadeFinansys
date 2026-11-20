import { Component, inject } from '@angular/core';
import { EmpresasService } from '../../shared/services/empresas.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly periodo = 'Novembro de 2026';
  readonly receitas = 80;
  readonly custosEDespesas = 65;
  readonly resultado = this.receitas - this.custosEDespesas;

  readonly acoes = [
    { titulo: 'Registrar compra', icone: '↓' },
    { titulo: 'Registrar venda', icone: '↑' },
    { titulo: 'Baixar PDF consolidado', icone: '⇩' },
  ];

  readonly lancamentos = [
    { id: '004', data: '16/11/2026', historico: 'Pagamento de despesa', tipo: 'Despesa', classe: 'despesa', valor: 25 },
    { id: '003', data: '16/11/2026', historico: 'Venda de 4 cadernos', tipo: 'Venda', classe: 'venda', valor: 80 },
    { id: '002', data: '14/11/2026', historico: 'Compra de 10 cadernos', tipo: 'Compra', classe: 'compra', valor: 100 },
    { id: '001', data: '12/11/2026', historico: 'Saldos de abertura', tipo: 'Abertura', classe: 'abertura', valor: 1000 },
  ];

  private readonly moeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });


  private readonly empresasService = inject(EmpresasService);

  get temMovimentacao(): boolean {
    return this.empresasService.selecionada()?.comMovimentacao ?? false;
  }
  formatarValor(valor: number): string {
    return this.moeda.format(valor);
  }
}