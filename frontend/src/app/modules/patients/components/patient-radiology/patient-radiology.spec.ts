import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRadiology } from './patient-radiology';

describe('PatientRadiology', () => {
  let component: PatientRadiology;
  let fixture: ComponentFixture<PatientRadiology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientRadiology]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientRadiology);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
