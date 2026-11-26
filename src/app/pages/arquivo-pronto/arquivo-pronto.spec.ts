import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArquivoPronto } from './arquivo-pronto';

describe('ArquivoPronto', () => {
  let component: ArquivoPronto;
  let fixture: ComponentFixture<ArquivoPronto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArquivoPronto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArquivoPronto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
