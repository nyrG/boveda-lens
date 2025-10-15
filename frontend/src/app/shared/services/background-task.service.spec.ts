import { TestBed } from '@angular/core/testing';

import { BackgroundTaskService } from './background-task.service';

describe('BackgroundTaskService', () => {
  let service: BackgroundTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
