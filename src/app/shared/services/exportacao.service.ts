import { Injectable, inject } from '@angular/core';
import { LancamentosService } from './lancamentos.service';
import { montarRazao } from '../utils/livro-razao';
import { signal } from '@angular/core';
export interface DocumentoExportacao {
    titulo: string;
    colunas: string[];
    linhas: (string | number)[][];
}

@Injectable({ providedIn: 'root' })
export class ExportacaoService {
    private readonly lancamentos = inject(LancamentosService);

    private readonly moeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    gerarDiario(empresaId: number, mes: string): DocumentoExportacao {
        const registros = this.lancamentos
            .listar(empresaId)
            .filter((item) => item.data.slice(0, 7) === mes)
            .sort(
                (a, b) =>
                    a.data.localeCompare(b.data) || Number(a.numero) - Number(b.numero),
            );

        return {
            titulo: 'Livro Diário',
            colunas: ['Nº', 'Data', 'Histórico', 'Código', 'Conta', 'Débito', 'Crédito'],
            linhas: registros.flatMap((item) =>
                item.partidas.map((partida) => [
                    `#${item.numero}`,
                    item.data.split('-').reverse().join('/'),
                    item.historico,
                    partida.codigo ?? '',
                    partida.conta,
                    partida.natureza === 'Débito' ? partida.valor : '',
                    partida.natureza === 'Crédito' ? partida.valor : '',
                ]),
            ),
        };
    }
    gerarRazao(
        empresaId: number,
        conta: string,
        inicio: string,
        fim: string,
    ): { conta: string; documento: DocumentoExportacao } | null {
        const razao = montarRazao(this.lancamentos.listar(empresaId), conta, inicio, fim);
        if (!razao) return null;

        return {
            conta: razao.conta,
            documento: {
                titulo: 'Livro Razão',
                colunas: ['Nº', 'Data', 'Histórico', 'Débito', 'Crédito', 'Saldo (+D / −C)'],
                linhas: [
                    ['', '', 'Saldo inicial', '', '', razao.saldoInicial / 100],
                    ...razao.movimentos.map((item) => [
                        `#${item.numero}`,
                        item.data.split('-').reverse().join('/'),
                        item.historico,
                        item.debito ? item.debito / 100 : '',
                        item.credito ? item.credito / 100 : '',
                        item.saldo / 100,
                    ]),
                    [
                        '', '', 'Totais do período e saldo final',
                        razao.debitos / 100,
                        razao.creditos / 100,
                        razao.saldoFinal / 100,
                    ],
                ],
            },
        };
    }
    private readonly dfcPreparada = signal<{
        empresaId: number;
        periodo: string;
        documento: DocumentoExportacao;
    } | null>(null);

    prepararDfc(
        empresaId: number,
        periodo: string,
        documento: DocumentoExportacao
    ): void {
        this.dfcPreparada.set({ empresaId, periodo, documento });
    }

    obterDfc(empresaId: number) {
        const dados = this.dfcPreparada();

        return dados?.empresaId === empresaId ? dados : null;
    }
    async baixarExcel(
        documento: DocumentoExportacao,
        empresa: string,
        periodo: string,
        opcoes?: {
            nomeArquivo: string;
            larguras: number[];
            colunasMonetarias: number[];
        },
    ): Promise<void> {
        const { Workbook } = await import('exceljs');
        const arquivo = new Workbook();
        const planilha = arquivo.addWorksheet(documento.titulo);

        planilha.addRow(['Empresa', empresa]);
        planilha.addRow(['Período', periodo]); planilha.addRow(documento.colunas);
        planilha.addRows(documento.linhas);

        planilha.getRow(3).font = { bold: true };
        planilha.views = [{ state: 'frozen', ySplit: 3 }];
        const larguras = opcoes?.larguras ?? [10, 14, 48, 12, 35, 16, 16];

        larguras.forEach((largura, i) => {
            planilha.getColumn(i + 1).width = largura;
        });

        for (const coluna of opcoes?.colunasMonetarias ?? [6, 7]) {
            planilha.getColumn(coluna).numFmt = '"R$" #,##0.00';
        }

        planilha.getColumn(6).numFmt = '"R$" #,##0.00';
        planilha.getColumn(7).numFmt = '"R$" #,##0.00';

        const buffer = await arquivo.xlsx.writeBuffer();
        const blob = new Blob([new Uint8Array(buffer)], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = opcoes?.nomeArquivo ?? `livro-diario-${periodo}.xlsx`; document.body.appendChild(link);
        link.click();
        link.remove();

        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}