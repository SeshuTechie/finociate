import { TestBed } from '@angular/core/testing';

import { RefDataService } from './ref-data.service';

describe('RefDataService', () => {
  let service: RefDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
