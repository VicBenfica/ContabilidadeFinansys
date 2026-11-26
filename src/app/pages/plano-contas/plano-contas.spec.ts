import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoContas } from './plano-contas';

describe('PlanoContas', () => {
  let component: PlanoContas;
  let fixture: ComponentFixture<PlanoContas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanoContas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanoContas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
