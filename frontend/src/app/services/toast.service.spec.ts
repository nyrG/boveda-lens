import { TestBed } from '@angular/core/testing';

import { ToastServiceTs } from './toast.service.js';

describe('ToastServiceTs', () => {
  let service: ToastServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
