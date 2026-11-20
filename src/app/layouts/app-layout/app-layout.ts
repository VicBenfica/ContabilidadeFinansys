import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Topbar } from '../../shared/components/topbar/topbar';
import { Home } from '../../pages/home/home';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, Topbar, RouterOutlet, Home],
  template: `
    <div class="fs-layout">
      <app-sidebar />
      <div class="fs-area">
        <app-topbar empresa="Papelaria Aurora" />
        <main class="fs-conteudo">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppLayout {}