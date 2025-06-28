import { TestBed } from '@angular/core/testing';

import { UserRegisterService } from './user.service';

describe('UserRegisterService', () => {
  let service: UserRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
