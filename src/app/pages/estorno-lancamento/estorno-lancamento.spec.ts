import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstornoLivroDiario } from './estorno-lancamento';

describe('EstornoLivroDiario', () => {
  let component: EstornoLivroDiario;
  let fixture: ComponentFixture<EstornoLivroDiario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstornoLivroDiario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstornoLivroDiario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
