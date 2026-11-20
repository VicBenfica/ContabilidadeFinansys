import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Topbar } from '../../shared/components/topbar/topbar';
import { EmpresasService } from '../../shared/services/empresas.service';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, Topbar, RouterOutlet],
  template: `
    <div class="fs-layout">
      <app-sidebar />

      <div class="fs-area">
        <app-topbar
          [empresa]="empresas.selecionada()?.nomeFantasia ?? 'Selecionar empresa'"
        />

        <main class="fs-conteudo">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppLayout {
  readonly empresas = inject(EmpresasService);
}