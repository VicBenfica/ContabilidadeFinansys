import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-novo-produto',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './novo-produto.html',
  styleUrl: './novo-produto.css',
})
export class NovoProduto {
  private readonly router = inject(Router);

  readonly unidades = [
    'Unidade',
    'Caixa',
    'Pacote',
    'Quilograma (kg)',
    'Litro (L)',
    'Metro (m)',
  ];

  readonly nome = signal('Caderno');
  readonly unidade = signal('Unidade');

  erroValidacao = '';

  cadastrarProduto(): void {
    this.erroValidacao = '';

    if (!this.nome().trim()) {
      this.erroValidacao = 'Informe o nome do produto.';
      return;
    }

    if (!this.unidade()) {
      this.erroValidacao = 'Selecione a unidade de medida.';
      return;
    }

    this.router.navigateByUrl('/estoque');
  }
}