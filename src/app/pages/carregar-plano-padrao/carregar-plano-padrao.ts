import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Card } from '../../shared/components/card/card';
import { PlanoContasService } from '../../shared/services/plano-contas.service';

@Component({
  selector: 'app-carregar-plano-padrao',
  standalone: true,
  imports: [Card, RouterLink],
  templateUrl: './carregar-plano-padrao.html',
  styleUrl: './carregar-plano-padrao.css',
})
export class CarregarPlanoPadrao {
  private readonly planoService = inject(PlanoContasService);
  private readonly router = inject(Router);

  aplicando = false;
  erro = '';

  aplicarPlano(): void {
    if (this.aplicando) return;

    const confirmado = window.confirm(
      'Deseja aplicar o plano padrão do FinanSys? ' +
      'Essa operação poderá substituir as alterações do plano atual.'
    );

    if (!confirmado) return;

    this.aplicando = true;
    this.erro = '';

    try {
      this.planoService.restaurarPadrao();
      void this.router.navigate(['/plano-contas']);
    } catch (erro) {
      console.error(erro);
      this.erro = 'Não foi possível aplicar o plano padrão.';
    } finally {
      this.aplicando = false;
    }
  }
}