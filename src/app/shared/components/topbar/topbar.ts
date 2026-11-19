import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink],
  template: `
    <header class="fs-topbar">
      <span>Escrituração contábil</span>

      <div class="fs-topbar-acoes">
        <a class="fs-botao" routerLink="/empresas">
          {{ empresa() }} <span aria-hidden="true">▾</span>
        </a>
        <button class="fs-botao fs-primario" type="button" disabled>
          + Novo lançamento
        </button>
      </div>
    </header>
  `,
})
export class Topbar {
  empresa = input('Selecionar empresa');
}