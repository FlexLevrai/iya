import { TestBed } from '@angular/core/testing';

import { OplocalizeService } from './oplocalize.service';

describe('OplocalizeService', () => {
  let service: OplocalizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OplocalizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
