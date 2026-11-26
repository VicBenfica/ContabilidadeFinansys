import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancamentoDesequilibrado } from './lancamento-desequilibrado';

describe('LancamentoDesequilibrado', () => {
  let component: LancamentoDesequilibrado;
  let fixture: ComponentFixture<LancamentoDesequilibrado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancamentoDesequilibrado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LancamentoDesequilibrado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
