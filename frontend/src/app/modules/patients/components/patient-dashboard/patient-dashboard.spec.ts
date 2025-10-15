import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDashboard } from './patient-dashboard';

describe('PatientDashboard', () => {
  let component: PatientDashboard;
  let fixture: ComponentFixture<PatientDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
