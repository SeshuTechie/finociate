import { TestBed } from '@angular/core/testing';

import { TextPatternsService } from './text-patterns.service';

describe('TextPatternsService', () => {
  let service: TextPatternsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextPatternsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
