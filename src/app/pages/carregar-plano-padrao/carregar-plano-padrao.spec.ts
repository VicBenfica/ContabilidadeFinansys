import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarregarPlanoPadrao } from './carregar-plano-padrao';

describe('CarregarPlanoPadrao', () => {
  let component: CarregarPlanoPadrao;
  let fixture: ComponentFixture<CarregarPlanoPadrao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarregarPlanoPadrao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarregarPlanoPadrao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
