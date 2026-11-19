import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrls: ['../login/login.css', './cadastro.css'],
})
export class Cadastro {
  nome = '';
  email = '';
  senha = '';
  confirmacao = '';
  mostrarSenha = false;
  mostrarConfirmacao = false;
  mensagem = '';

  get senhasDiferentes(): boolean {
    return this.confirmacao !== '' && this.senha !== this.confirmacao;
  }

  continuar(formulario: NgForm): void {
    this.mensagem = '';

    if (formulario.invalid || !this.nome.trim() || this.senhasDiferentes) {
      formulario.form.markAllAsTouched();
      return;
    }

    this.mensagem = 'Dados validados. O cadastro ainda não está conectado ao servidor.';
  }
}