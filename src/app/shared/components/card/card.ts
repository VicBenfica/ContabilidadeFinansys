import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <section class="fs-card">
      <h2>{{ titulo() }}</h2>
      @if (descricao()) {
        <p>{{ descricao() }}</p>
      }
      <ng-content />
    </section>
  `,
})
export class Card {
  titulo = input.required<string>();
  descricao = input('');
}