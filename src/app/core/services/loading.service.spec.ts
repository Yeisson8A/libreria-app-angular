/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });

    service = TestBed.inject(LoadingService);
  });

  it('debería iniciar con loading en false', (done) => {
    service.loading$.subscribe((value) => {
      expect(value).toBeFalse();
      done();
    });
  });

  it('debería emitir true cuando se llama show()', (done) => {
    service.show();

    service.loading$.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
  });

  it('debería emitir false cuando se llama hide()', (done) => {
    service.show(); // primero true
    service.hide(); // luego false

    service.loading$.subscribe((value) => {
      expect(value).toBeFalse();
      done();
    });
  });

  it('debería emitir la secuencia correcta (false → true → false)', () => {
    const values: boolean[] = [];

    service.loading$.subscribe((value) => {
      values.push(value);
    });

    service.show();
    service.hide();

    expect(values).toEqual([false, true, false]);
  });
});
