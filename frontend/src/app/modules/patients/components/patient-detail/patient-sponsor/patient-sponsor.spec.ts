import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSponsor } from './patient-sponsor';

describe('PatientSponsor', () => {
  let component: PatientSponsor;
  let fixture: ComponentFixture<PatientSponsor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSponsor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSponsor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
