import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancamentoDetalhe } from './lancamento-detalhe';

describe('LancamentoDetalhe', () => {
  let component: LancamentoDetalhe;
  let fixture: ComponentFixture<LancamentoDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancamentoDetalhe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LancamentoDetalhe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
