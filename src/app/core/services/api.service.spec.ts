/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer GET y retornar data', () => {
    const mockResponse = {
      success: true,
      data: [{ id: 1, nombre: 'Test' }],
    };

    service.get<any[]>('usuarios').subscribe((res) => {
      expect(res).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('debería enviar query params correctamente', () => {
    service.get<any[]>('usuarios', { nombre: 'Juan', edad: 30 }).subscribe();

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${baseUrl}/usuarios` &&
        request.params.get('nombre') === 'Juan' &&
        request.params.get('edad') === '30',
    );

    expect(req.request.method).toBe('GET');

    req.flush({ data: [] });
  });

  it('debería hacer POST y retornar data', () => {
    const body = { nombre: 'Nuevo' };

    const mockResponse = {
      success: true,
      data: { id: 1, nombre: 'Nuevo' },
    };

    service.post<any>('usuarios', body).subscribe((res) => {
      expect(res).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(mockResponse);
  });

  it('debería hacer PUT y retornar data', () => {
    const body = { nombre: 'Actualizado' };

    const mockResponse = {
      success: true,
      data: { id: 1, nombre: 'Actualizado' },
    };

    service.put<any>('usuarios/1', body).subscribe((res) => {
      expect(res).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios/1`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);

    req.flush(mockResponse);
  });

  it('debería hacer DELETE y retornar data', () => {
    const mockResponse = {
      success: true,
      data: null,
    };

    service.delete<any>('usuarios/1').subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios/1`);

    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  it('debería ignorar params null o undefined', () => {
    service
      .get('usuarios', {
        nombre: 'Juan',
        edad: null,
        ciudad: undefined,
      })
      .subscribe();

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${baseUrl}/usuarios` &&
        request.params.get('nombre') === 'Juan' &&
        !request.params.has('edad') &&
        !request.params.has('ciudad'),
    );

    req.flush({ data: [] });
  });
});
