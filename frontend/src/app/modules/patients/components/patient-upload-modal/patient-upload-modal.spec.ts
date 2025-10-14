import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientUploadModal } from './patient-upload-modal';

describe('PatientUploadModal', () => {
  let component: PatientUploadModal;
  let fixture: ComponentFixture<PatientUploadModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientUploadModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientUploadModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
