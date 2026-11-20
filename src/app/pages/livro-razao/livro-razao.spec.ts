import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivroRazao } from './livro-razao';

describe('LivroRazao', () => {
  let component: LivroRazao;
  let fixture: ComponentFixture<LivroRazao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivroRazao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivroRazao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
