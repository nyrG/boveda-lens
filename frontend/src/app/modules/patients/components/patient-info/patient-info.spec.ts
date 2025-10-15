import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientInfo } from './patient-info';

describe('PatientInfo', () => {
  let component: PatientInfo;
  let fixture: ComponentFixture<PatientInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
