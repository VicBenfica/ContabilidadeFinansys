import { Lancamento } from "../services/lancamentos.service";

export function chaveConta(nome: string): string {
  const chave = nome.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');
  return chave === 'estoque de mercadorias' ? 'estoque' : chave;
}

export function montarRazao(
  lancamentos: Lancamento[],
  conta: string,
  inicio: string,
  fim: string,
) {
  if (!conta || !inicio || !fim || inicio > fim) return null;

  const partidaDaConta = lancamentos
    .flatMap((item) => item.partidas)
    .find((partida) => chaveConta(partida.conta) === conta);

  if (!partidaDaConta) return null;

  const nomeConta = conta === 'estoque' ? 'Estoque' : partidaDaConta.conta.trim();

  let saldoInicial = 0;
  let debitos = 0;
  let creditos = 0;
  let saldo = 0;

  const movimentos: {
    id: string;
    numero: string;
    data: string;
    historico: string;
    debito: number;
    credito: number;
    saldo: number;
  }[] = [];

  const ordenados = [...lancamentos].sort(
    (a, b) => a.data.localeCompare(b.data) || Number(a.numero) - Number(b.numero),
  );

  for (const lancamento of ordenados) {
    if (lancamento.data > fim) break;

    lancamento.partidas.forEach((partida, indice) => {
      if (chaveConta(partida.conta) !== conta) return;

      const valor = Math.round(partida.valor * 100);
      const debito = partida.natureza === 'Débito' ? valor : 0;
      const credito = partida.natureza === 'Crédito' ? valor : 0;

      saldo += debito - credito;

      if (lancamento.data < inicio) {
        saldoInicial += debito - credito;
        return;
      }

      debitos += debito;
      creditos += credito;

      movimentos.push({
        id: `${lancamento.numero}-${indice}`,
        numero: lancamento.numero,
        data: lancamento.data,
        historico: lancamento.historico,
        debito,
        credito,
        saldo,
      });
    });
  }

  return {
    conta: nomeConta,
    inicio,
    fim,
    saldoInicial,
    debitos,
    creditos,
    saldoFinal: saldo,
    movimentos,
  };
}