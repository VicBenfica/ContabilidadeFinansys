import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceteVerificacao } from './balancete-verificacao';

describe('BalanceteVerificacao', () => {
  let component: BalanceteVerificacao;
  let fixture: ComponentFixture<BalanceteVerificacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceteVerificacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceteVerificacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
