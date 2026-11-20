import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Card } from '../../shared/components/card/card';
import {
  ContaContabil,
  GrupoContabil,
  PlanoContasService,
  SubgrupoContabil,
  TipoConta,
} from '../../shared/services/plano-contas.service';

interface LinhaPrevia {
  codigo: string;
  nome: string;
  grupo: GrupoContabil;
  subgrupo: SubgrupoContabil;
  tipo: TipoConta;
  valida: boolean;
  status: string;
}

const GRUPOS_VALIDOS: GrupoContabil[] = [
  'Ativo',
  'Passivo',
  'Patrimônio Líquido',
  'Despesa',
  'Receita',
  'Apuração do Resultado',
];

const SUBGRUPOS_VALIDOS: SubgrupoContabil[] = [
  'Circulante',
  'Realizável a Longo Prazo',
  'Investimento',
  'Imobilizado',
  'Intangível',
  'Não Circulante',
  'N/A',
];

@Component({
  selector: 'app-importar-plano',
  standalone: true,
  imports: [Card, RouterLink],
  templateUrl: './importar-plano.html',
  styleUrl: './importar-plano.css',
})
export class ImportarPlano {
  private readonly planoService = inject(PlanoContasService);
  private readonly router = inject(Router);

  mensagemArquivo = 'Arquivo de exemplo selecionado · plano-complementar.csv';
  previa: LinhaPrevia[] = [
    {
      codigo: '1.3',
      nome: 'Investimentos',
      grupo: 'Ativo',
      subgrupo: 'Investimento',
      tipo: 'Sintética',
      valida: true,
      status: 'Válida',
    },
    {
      codigo: '1.3.01',
      nome: 'Aplicações financeiras',
      grupo: 'Ativo',
      subgrupo: 'Investimento',
      tipo: 'Analítica',
      valida: true,
      status: 'Válida',
    },
  ];

  get contasValidas(): LinhaPrevia[] {
    return this.previa.filter((item) => item.valida);
  }

  usarExemploCsv(): void {
    this.mensagemArquivo = 'Arquivo de exemplo selecionado · plano-complementar.csv';
    this.previa = [
      {
        codigo: '1.3',
        nome: 'Investimentos',
        grupo: 'Ativo',
        subgrupo: 'Investimento',
        tipo: 'Sintética',
        valida: true,
        status: 'Válida',
      },
      {
        codigo: '1.3.01',
        nome: 'Aplicações financeiras',
        grupo: 'Ativo',
        subgrupo: 'Investimento',
        tipo: 'Analítica',
        valida: true,
        status: 'Válida',
      },
    ];
  }

  aoSelecionarCsv(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) return;

    this.mensagemArquivo = `Arquivo selecionado · ${arquivo.name}`;

    const leitor = new FileReader();
    leitor.onload = () => {
      const texto = String(leitor.result ?? '');
      const linhas = texto
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      const codigosExistentes = new Set(
        this.planoService.contas().map((c) => c.codigo),
      );
      const codigosNoArquivo = new Set<string>();
      const resultado: LinhaPrevia[] = [];

      // Ignora a primeira linha se for cabeçalho
      const inicio = linhas[0]?.toLowerCase().startsWith('c') ? 1 : 0;

      for (const linha of linhas.slice(inicio)) {
        const colunas = linha.split(';').map((s) => s?.trim());
        const codigo = colunas[0] ?? '';
        const nome = colunas[1] ?? '';
        const grupoBruto = colunas[2] ?? '';
        const subgrupoBruto = colunas.length >= 5 ? colunas[3] : 'N/A';
        const tipoBruto = colunas.length >= 5 ? colunas[4] : colunas[3] ?? '';

        const grupo = (
          GRUPOS_VALIDOS.includes(grupoBruto as GrupoContabil)
            ? grupoBruto
            : 'Ativo'
        ) as GrupoContabil;

        const subgrupo = (
          SUBGRUPOS_VALIDOS.includes(subgrupoBruto as SubgrupoContabil)
            ? subgrupoBruto
            : 'N/A'
        ) as SubgrupoContabil;

        const tipo: TipoConta =
          tipoBruto.toLowerCase() === 'sintética' ||
          tipoBruto.toLowerCase() === 'sintetica'
            ? 'Sintética'
            : 'Analítica';

        let status = 'Válida';
        let valida = true;

        if (!codigo || !nome || !tipoBruto) {
          valida = false;
          status = 'Campos obrigatórios ausentes';
        } else if (!/^\d+(\.\d+)*$/.test(codigo)) {
          valida = false;
          status = 'Hierarquia inválida';
        } else if (codigosNoArquivo.has(codigo) || codigosExistentes.has(codigo)) {
          valida = false;
          status = 'Código repetido';
        }

        if (codigo) codigosNoArquivo.add(codigo);

        resultado.push({
          codigo,
          nome,
          grupo,
          subgrupo,
          tipo,
          valida,
          status,
        });
      }

      this.previa = resultado;
      input.value = '';
    };

    leitor.readAsText(arquivo, 'utf-8');
  }

  confirmarImportacao(): void {
    const validas: ContaContabil[] = this.contasValidas.map((item) => ({
      codigo: item.codigo,
      nome: item.nome,
      grupo: item.grupo,
      subgrupo: item.subgrupo,
      tipo: item.tipo,
      nivel: Math.max(0, item.codigo.split('.').length - 1),
    }));

    if (validas.length === 0) return;

    this.planoService.importarLote(validas);
    void this.router.navigate(['/plano-contas']);
  }
}