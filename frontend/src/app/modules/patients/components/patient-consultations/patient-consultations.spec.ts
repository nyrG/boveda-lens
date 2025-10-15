import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientConsultations } from './patient-consultations';

describe('PatientConsultations', () => {
  let component: PatientConsultations;
  let fixture: ComponentFixture<PatientConsultations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientConsultations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientConsultations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
