import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceteInicial } from './balancete-inicial';

describe('BalanceteInicial', () => {
  let component: BalanceteInicial;
  let fixture: ComponentFixture<BalanceteInicial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceteInicial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceteInicial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
