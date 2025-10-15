import { TestBed } from '@angular/core/testing';

import { PatientApi } from './patient-api';

describe('PatientApi', () => {
  let service: PatientApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
