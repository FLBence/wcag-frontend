import { TestBed } from '@angular/core/testing';
import { ScanApi } from './scan-api';

describe('ScanApi', () => {
  let service: ScanApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
