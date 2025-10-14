import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLabs } from './patient-labs';

describe('PatientLabs', () => {
  let component: PatientLabs;
  let fixture: ComponentFixture<PatientLabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientLabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientLabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
