import { TestBed } from '@angular/core/testing';

import { ConsumirService } from './consumir.service';

describe('ConsumirService', () => {
  let service: ConsumirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
