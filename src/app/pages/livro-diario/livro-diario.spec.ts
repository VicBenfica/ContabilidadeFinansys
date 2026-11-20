import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LivroDiario } from './livro-diario';

describe('LivroDiario', () => {
  let fixture: ComponentFixture<LivroDiario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivroDiario],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LivroDiario);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});