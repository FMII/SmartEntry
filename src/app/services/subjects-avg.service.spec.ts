import { TestBed } from '@angular/core/testing';

import { SubjectsAvgService } from './subjects-avg.service';

describe('SubjectsAvgService', () => {
  let service: SubjectsAvgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectsAvgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
