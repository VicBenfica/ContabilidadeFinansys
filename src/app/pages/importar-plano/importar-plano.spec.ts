import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarPlano } from './importar-plano';

describe('ImportarPlano', () => {
  let component: ImportarPlano;
  let fixture: ComponentFixture<ImportarPlano>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportarPlano]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportarPlano);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
