import { TestBed } from '@angular/core/testing';

import { RecordApi } from './record-api';

describe('RecordApi', () => {
  let service: RecordApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
