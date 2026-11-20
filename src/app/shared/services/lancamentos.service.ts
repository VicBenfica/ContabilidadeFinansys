import { Injectable } from '@angular/core';
export type Natureza = 'Débito' | 'Crédito';

interface Partida {
    codigo?: string;
    conta: string;
    natureza: Natureza;
    valor: number;
}

export interface Lancamento {
    numero: string;
    data: string;
    historico: string;
    resumo: string;
    valor: number;
    estorno?: boolean;
    estornoDe?: string;
    notaEstoque?: string;
    partidas: Partida[];
}

@Injectable({ providedIn: 'root' })
export class LancamentosService {
    private readonly novosPorEmpresa = new Map<number, Lancamento[]>();

    private readonly lancamentosDemo: Lancamento[] = [
        {
            numero: '004',
            data: '2026-11-16',
            historico: 'Pagamento de despesa',
            resumo: 'Despesa / Caixa',
            valor: 25,
            partidas: [
                { conta: 'Despesas operacionais', natureza: 'Débito', valor: 25 },
                { conta: 'Caixa', natureza: 'Crédito', valor: 25 },
            ],
        },
        {
            numero: '003',
            data: '2026-11-16',
            historico: 'Venda de 4 cadernos',
            resumo: '6 partidas — ver detalhe',
            valor: 80,
            notaEstoque: 'Estoque: saída de 4 unidades de Caderno · 6 unidades restantes.',
            partidas: [
                { codigo: '1.1.01', conta: 'Caixa', natureza: 'Débito', valor: 20 },
                { codigo: '1.1.03', conta: 'Clientes de curto prazo', natureza: 'Débito', valor: 30 },
                { codigo: '1.2.01', conta: 'Clientes de longo prazo', natureza: 'Débito', valor: 30 },
                { codigo: '4.1', conta: 'Receita de vendas', natureza: 'Crédito', valor: 80 },
                { codigo: '5.1', conta: 'Custo das mercadorias vendidas', natureza: 'Débito', valor: 40 },
                { codigo: '1.1.04', conta: 'Estoque de mercadorias', natureza: 'Crédito', valor: 40 },
            ],
        },
        {
            numero: '002',
            data: '2026-11-14',
            historico: 'Compra de 10 cadernos',
            resumo: 'Estoque / Caixa',
            valor: 100,
            partidas: [
                { conta: 'Estoque', natureza: 'Débito', valor: 100 },
                { conta: 'Caixa', natureza: 'Crédito', valor: 100 },
            ],
        },
        {
            numero: '001',
            data: '2026-11-12',
            historico: 'Saldos de abertura',
            resumo: 'Caixa / Capital',
            valor: 1000,
            partidas: [
                { conta: 'Caixa', natureza: 'Débito', valor: 1000 },
                { conta: 'Capital social', natureza: 'Crédito', valor: 1000 },
            ],
        },
    ];

    listar(empresaId: number): Lancamento[] {
        const demonstracao = empresaId === 1 ? this.lancamentosDemo : [];
        const novos = this.novosPorEmpresa.get(empresaId) ?? [];

        return [...novos, ...demonstracao].sort(
            (a, b) =>
                b.data.localeCompare(a.data) || Number(b.numero) - Number(a.numero),
        );
    }
    buscarEstorno(empresaId: number, numeroOriginal: string): Lancamento | undefined {
        return this.listar(empresaId).find(
            (item) => item.estorno === true && item.estornoDe === numeroOriginal,
        );
    }

    registrarEstorno(
        empresaId: number,
        numeroOriginal: string,
        data: string,
        motivo: string,
    ): Lancamento | undefined {
        const original = this.buscar(empresaId, numeroOriginal);
        const justificativa = motivo.trim();

        if (
            !original ||
            original.estorno ||
            !data ||
            data < original.data ||
            !justificativa ||
            this.buscarEstorno(empresaId, numeroOriginal)
        ) {
            return undefined;
        }

        const maiorNumero = this.listar(empresaId).reduce(
            (maior, item) => Math.max(maior, Number(item.numero)),
            0,
        );

        const estorno: Lancamento = {
            numero: String(maiorNumero + 1).padStart(3, '0'),
            data,
            historico: `Estorno do lançamento #${original.numero} — ${justificativa}`,
            resumo: `Reversão do lançamento #${original.numero}`,
            valor: original.valor,
            estorno: true,
            estornoDe: original.numero,
            partidas: original.partidas.map((partida) => ({
                ...partida,
                natureza: partida.natureza === 'Débito' ? 'Crédito' : 'Débito',
            })),
        };

        this.adicionar(empresaId, estorno);
        return estorno;
    }

    buscar(empresaId: number, numero: string): Lancamento | undefined {
        return this.listar(empresaId).find((item) => item.numero === numero);
    }

    adicionar(empresaId: number, lancamento: Lancamento): void {
        const anteriores = this.novosPorEmpresa.get(empresaId) ?? [];
        this.novosPorEmpresa.set(empresaId, [lancamento, ...anteriores]);
    }
}