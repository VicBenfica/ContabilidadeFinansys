import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exportacoes } from './exportacoes';

describe('Exportacoes', () => {
  let component: Exportacoes;
  let fixture: ComponentFixture<Exportacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exportacoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exportacoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
