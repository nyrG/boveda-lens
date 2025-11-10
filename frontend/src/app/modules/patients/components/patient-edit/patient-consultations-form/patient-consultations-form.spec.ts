import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientConsultationsForm } from './patient-consultations-form';

describe('PatientConsultationsForm', () => {
  let component: PatientConsultationsForm;
  let fixture: ComponentFixture<PatientConsultationsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientConsultationsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientConsultationsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
