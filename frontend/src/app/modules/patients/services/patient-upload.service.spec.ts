import { TestBed } from '@angular/core/testing';

import { PatientUploadService } from './patient-upload.service';

describe('PatientUploadService', () => {
  let service: PatientUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
