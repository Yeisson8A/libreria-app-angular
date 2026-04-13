/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../services/loading.service';

describe('loadingInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: loadingSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería llamar show() al iniciar la petición', () => {
    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');

    expect(loadingService.show).toHaveBeenCalled();
  });

  it('debería llamar hide() al completar la petición', () => {
    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');

    req.flush({}); // éxito

    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('debería llamar hide() incluso si hay error', () => {
    http.get('/test').subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne('/test');

    req.flush({}, { status: 500, statusText: 'Error' });

    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('debería llamar show antes que hide', () => {
    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');

    req.flush({});

    expect(loadingService.show).toHaveBeenCalledBefore(loadingService.hide);
  });
});
