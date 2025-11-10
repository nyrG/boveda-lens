import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLabsForm } from './patient-labs-form';

describe('PatientLabsForm', () => {
  let component: PatientLabsForm;
  let fixture: ComponentFixture<PatientLabsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientLabsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientLabsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
