import { TestBed } from '@angular/core/testing';

import { ObjectSerializerService } from './object-serializer.service';

describe('ObjectSerializerService', () => {
  let service: ObjectSerializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectSerializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
