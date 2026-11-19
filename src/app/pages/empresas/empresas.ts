import { Component } from '@angular/core';
import { Card } from '../../shared/components/card/card';

@Component({
  selector: 'app-empresas',
  imports: [Card],
  template: `
    <header class="fs-page-header">
      <small>FINANSYS / ESCRITURAÇÃO</small>
      <h1>Empresas</h1>
      <p>Cadastre uma empresa ou selecione uma já salva para continuar.</p>
    </header>

    <app-card titulo="Nova empresa"
              descricao="Os saldos e lançamentos são separados por empresa.">
      <div class="fs-campos">
        <label>
          Razão social
          <input type="text" placeholder="Papelaria Aurora Ltda.">
        </label>
        <label>
          Nome fantasia
          <input type="text" placeholder="Papelaria Aurora">
        </label>
        <label>
          CNPJ (opcional)
          <input type="text" inputmode="numeric" placeholder="00.000.000/0000-00">
        </label>
      </div>

      <button type="button" class="fs-botao fs-primario" disabled>
        Salvar empresa
      </button>
    </app-card>

    <app-card titulo="Minhas empresas"
              descricao="Selecione a empresa que deseja abrir.">
      <div class="fs-table-wrap">
        <table class="fs-table">
          <thead>
            <tr><th>Empresa</th><th>Situação</th><th>Ação</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Papelaria Aurora</td>
              <td>Com movimentação</td>
              <td><button type="button" disabled>Abrir empresa →</button></td>
            </tr>
            <tr>
              <td>Papelaria Horizonte</td>
              <td>Em configuração</td>
              <td><button type="button" disabled>Continuar →</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </app-card>
  `,
})
export class Empresas {}