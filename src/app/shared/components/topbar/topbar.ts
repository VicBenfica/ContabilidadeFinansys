import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmpresasService } from '../../services/empresas.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  readonly empresa = input('Selecionar empresa');
  readonly empresas = inject(EmpresasService);

  selecionarEmpresa(id: number): void {
    this.empresas.selecionar(id);
  }
} 