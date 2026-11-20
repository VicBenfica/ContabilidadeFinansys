import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card';

describe('Card', () => {
  let fixture: ComponentFixture<Card>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card],
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    fixture.componentRef.setInput('titulo', 'Nova empresa');
    fixture.detectChanges();
  });

  it('deve criar o card', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve exibir o título recebido', () => {
    const elemento: HTMLElement = fixture.nativeElement;

    expect(elemento.querySelector('h2')?.textContent?.trim())
      .toBe('Nova empresa');
  });
});