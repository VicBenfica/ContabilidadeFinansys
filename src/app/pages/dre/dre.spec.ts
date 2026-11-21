import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dre } from './dre';

describe('Dre', () => {
  let component: Dre;
  let fixture: ComponentFixture<Dre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
