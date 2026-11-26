import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarVenda } from './registrar-venda';

describe('RegistrarVenda', () => {
  let component: RegistrarVenda;
  let fixture: ComponentFixture<RegistrarVenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarVenda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarVenda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
