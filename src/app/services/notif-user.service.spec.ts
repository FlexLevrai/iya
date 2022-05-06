import { TestBed } from '@angular/core/testing';

import { NotifUserService } from './notif-user.service';

describe('NotifUserService', () => {
  let service: NotifUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
