import { TestBed } from '@angular/core/testing';

import { RecordStateService } from './record-state.service';

describe('RecordStateService', () => {
  let service: RecordStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
