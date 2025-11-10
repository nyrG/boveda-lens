import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSponsorForm } from './patient-sponsor-form';

describe('PatientSponsorForm', () => {
  let component: PatientSponsorForm;
  let fixture: ComponentFixture<PatientSponsorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSponsorForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSponsorForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
