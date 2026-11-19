import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './password.html',
  styleUrl: './password.css'
})
export class Password {
  email = '';
  mensagem = '';

  enviar(formulario: NgForm): void {
    this.mensagem = '';

    if (formulario.invalid) {
      formulario.form.markAllAsTouched();
      return;
    }

    this.mensagem =
      'E-mail validado. O envio do link ainda não está conectado ao servidor.';
  }
}
