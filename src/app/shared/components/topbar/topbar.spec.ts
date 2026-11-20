import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Topbar } from './topbar';

describe('Topbar', () => {
  let fixture: ComponentFixture<Topbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Topbar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Topbar);
  });

  it('deve criar a barra superior', () => {
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve exibir o nome da empresa selecionada', () => {
    fixture.componentRef.setInput('empresa', 'Papelaria Aurora');
    fixture.detectChanges();

    const elemento: HTMLElement = fixture.nativeElement;
    expect(elemento.querySelector('a')?.textContent)
      .toContain('Papelaria Aurora');
  });
});