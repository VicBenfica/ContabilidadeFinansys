import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  senha = '';
  mostrarSenha = false;
  mensagem = '';

  entrar(formulario: NgForm): void {
    this.mensagem = '';

    if (formulario.invalid) {
      formulario.form.markAllAsTouched();
      return;
    }

    this.mensagem = 'Formulário válido. O login ainda não está conectado ao servidor.';
  }
}