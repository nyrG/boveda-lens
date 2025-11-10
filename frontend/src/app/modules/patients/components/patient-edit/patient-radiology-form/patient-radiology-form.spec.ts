import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRadiologyForm } from './patient-radiology-form';

describe('PatientRadiologyForm', () => {
  let component: PatientRadiologyForm;
  let fixture: ComponentFixture<PatientRadiologyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientRadiologyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientRadiologyForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
