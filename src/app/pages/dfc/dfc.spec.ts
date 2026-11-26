import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dfc } from './dfc';

describe('Dfc', () => {
  let component: Dfc;
  let fixture: ComponentFixture<Dfc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dfc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dfc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
