import { TestBed } from '@angular/core/testing';

import { PageTitleStoreService } from './page-title-store.service';

describe('PageTitleStoreService', () => {
  let service: PageTitleStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageTitleStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
