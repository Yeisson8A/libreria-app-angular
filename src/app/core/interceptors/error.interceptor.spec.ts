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
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería mostrar el mensaje del backend', () => {
    http.get('/test').subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne('/test');

    req.flush(
      { message: 'Error desde API' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(snackBar.open).toHaveBeenCalledWith('Error desde API', 'Cerrar', {
      duration: 3000,
    });
  });

  it('debería mostrar mensaje por defecto si no viene error.message', () => {
    http.get('/test').subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne('/test');

    req.flush(
      {}, // sin message
      { status: 500, statusText: 'Server Error' },
    );

    expect(snackBar.open).toHaveBeenCalledWith('Error inesperado', 'Cerrar', {
      duration: 3000,
    });
  });

  it('debería propagar el error', () => {
    let errorResponse: any;

    http.get('/test').subscribe({
      next: () => fail('No debería entrar aquí'),
      error: (err) => (errorResponse = err),
    });

    const req = httpMock.expectOne('/test');

    req.flush(
      { message: 'Error API' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(errorResponse).toBeTruthy();
    expect(errorResponse.status).toBe(400);
  });

  it('debería llamar al snackbar una sola vez', () => {
    http.get('/test').subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne('/test');

    req.flush(
      { message: 'Error API' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(snackBar.open).toHaveBeenCalledTimes(1);
  });
});
