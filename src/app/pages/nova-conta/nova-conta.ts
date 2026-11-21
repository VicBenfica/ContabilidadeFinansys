import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Card } from '../../shared/components/card/card';
import {
  ContaContabil,
  GrupoContabil,
  NaturezaConta,
  PlanoContasService,
  SubgrupoContabil,
  TipoConta,
} from '../../shared/services/plano-contas.service';

@Component({
  selector: 'app-nova-conta',
  standalone: true,
  imports: [Card, FormsModule, RouterLink],
  templateUrl: './nova-conta.html',
  styleUrl: './nova-conta.css',
})
export class NovaConta implements OnInit {
  private readonly planoService = inject(PlanoContasService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly grupos: GrupoContabil[] = [
    'Ativo',
    'Passivo',
    'Patrimônio Líquido',
    'Despesa',
    'Receita',
    'Apuração do Resultado',
  ];

  readonly contasSuperiores: { label: string; subgrupo: SubgrupoContabil }[] = [
    { label: 'Nenhuma (conta raiz)', subgrupo: 'N/A' },
    { label: '1.0 · Circulante', subgrupo: 'Circulante' },
    { label: '1.1 · Ativo circulante', subgrupo: 'Circulante' },
    { label: '2.0 · Realizável a Longo Prazo', subgrupo: 'Realizável a Longo Prazo' },
    { label: '2.1 · Investimento', subgrupo: 'Investimento' },
    { label: '2.2 · Imobilizado', subgrupo: 'Imobilizado' },
    { label: '2.3 · Intangível', subgrupo: 'Intangível' },
    { label: '3.0 · Passivo Circulante', subgrupo: 'Circulante' },
    { label: '3.1 · Passivo Não Circulante', subgrupo: 'Não Circulante' },
  ];

  codigoEmEdicao: string | null = null;
  erroCodigo = '';

  form = {
    codigo: '',
    nome: '',
    grupo: 'Ativo' as GrupoContabil,
    tipo: 'Analítica' as TipoConta,
    contaSuperior: '1.1 · Ativo circulante',
    natureza: 'Devedora' as NaturezaConta,
  };

  ngOnInit(): void {
    const codigoParam = this.route.snapshot.paramMap.get('codigo');
    if (!codigoParam) return;

    const existente = this.planoService.buscarPorCodigo(codigoParam);
    if (!existente) return;

    this.codigoEmEdicao = existente.codigo;
    this.form = {
      codigo: existente.codigo,
      nome: existente.nome,
      grupo: existente.grupo,
      tipo: existente.tipo,
      contaSuperior: existente.contaSuperior ?? 'Nenhuma (conta raiz)',
      natureza:
        existente.natureza ??
        (existente.grupo === 'Ativo' || existente.grupo === 'Despesa'
          ? 'Devedora'
          : 'Credora'),
    };
  }

  aoMudarGrupo(): void {
    this.form.natureza =
      this.form.grupo === 'Ativo' || this.form.grupo === 'Despesa'
        ? 'Devedora'
        : 'Credora';
  }

  get podeSalvar(): boolean {
    return Boolean(this.form.codigo.trim() && this.form.nome.trim());
  }

  salvarConta(): void {
    const codigo = this.form.codigo.trim();
    const nome = this.form.nome.trim();
    if (!codigo || !nome) return;

    const duplicado = this.planoService
      .contas()
      .some((c) => c.codigo === codigo && c.codigo !== this.codigoEmEdicao);

    if (duplicado) {
      this.erroCodigo = 'Já existe uma conta cadastrada com esse código.';
      return;
    }

    this.erroCodigo = '';
    const superiorEncontrado = this.contasSuperiores.find(
      (s) => s.label === this.form.contaSuperior,
    );

    const registro: ContaContabil = {
      codigo,
      nome,
      grupo: this.form.grupo,
      subgrupo: superiorEncontrado?.subgrupo ?? 'N/A',
      tipo: this.form.tipo,
      nivel: Math.max(0, codigo.split('.').length - 1),
      contaSuperior: this.form.contaSuperior,
      natureza: this.form.natureza,
    };

    this.planoService.salvarConta(registro, this.codigoEmEdicao);
    void this.router.navigate(['/plano-contas']);
  }
}