import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Card } from '../../shared/components/card/card';
import {
  DadosEmpresa,
  EmpresasService,
} from '../../shared/services/empresas.service';

@Component({
  selector: 'app-empresas',
  imports: [Card, FormsModule],
  templateUrl: './empresas.html',
  styleUrl: './empresas.css',
})
export class Empresas {
  private readonly router = inject(Router);
  private readonly empresasService = inject(EmpresasService);

  readonly empresas = this.empresasService.lista;
  mensagem = '';

  novaEmpresa: DadosEmpresa = {
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
  };

  salvarEmpresa(formulario: NgForm): void {
    const razaoSocial = this.novaEmpresa.razaoSocial.trim();
    const nomeFantasia = this.novaEmpresa.nomeFantasia.trim();

    if (formulario.invalid || !razaoSocial || !nomeFantasia) return;

    this.empresasService.cadastrar({
      razaoSocial,
      nomeFantasia,
      cnpj: this.novaEmpresa.cnpj.trim(),
    });

    this.novaEmpresa = { razaoSocial: '', nomeFantasia: '', cnpj: '' };
    formulario.resetForm(this.novaEmpresa);
    this.mensagem = `${nomeFantasia} foi cadastrada.`;
  }

  abrirEmpresa(id: number): void {
    this.empresasService.selecionar(id);
    void this.router.navigate(['/visao-geral']);
  }
}