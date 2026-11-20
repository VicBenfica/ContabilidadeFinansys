import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivroDiario } from './livro-diario';

describe('LivroDiario', () => {
  let component: LivroDiario;
  let fixture: ComponentFixture<LivroDiario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivroDiario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivroDiario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
