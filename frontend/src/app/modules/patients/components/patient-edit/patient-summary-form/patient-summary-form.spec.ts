import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSummaryForm } from './patient-summary-form';

describe('PatientSummaryForm', () => {
  let component: PatientSummaryForm;
  let fixture: ComponentFixture<PatientSummaryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSummaryForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSummaryForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
