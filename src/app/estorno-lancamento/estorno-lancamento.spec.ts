import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstornoLancamento } from './estorno-lancamento';

describe('EstornoLancamento', () => {
  let component: EstornoLancamento;
  let fixture: ComponentFixture<EstornoLancamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstornoLancamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstornoLancamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
