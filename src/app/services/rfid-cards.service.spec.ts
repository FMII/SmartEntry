import { TestBed } from '@angular/core/testing';

import { RfidCardsService } from './rfid-cards.service';

describe('RfidCardsService', () => {
  let service: RfidCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfidCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
