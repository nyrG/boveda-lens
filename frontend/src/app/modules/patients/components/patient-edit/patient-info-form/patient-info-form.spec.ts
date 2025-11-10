import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientInfoForm } from './patient-info-form';

describe('PatientInfoForm', () => {
  let component: PatientInfoForm;
  let fixture: ComponentFixture<PatientInfoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientInfoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientInfoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
