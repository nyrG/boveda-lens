import { TestBed } from '@angular/core/testing';

import { ExtractionApi } from './extraction-api';

describe('ExtractionApi', () => {
  let service: ExtractionApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtractionApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
