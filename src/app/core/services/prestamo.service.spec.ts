/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PrestamoService } from './prestamo.service';
import { ApiService } from './api.service';
import { Prestamo } from '../models/prestamo.model';
import { CrearPrestamoRequest } from '../models/crear-prestamo-request.model';
import { EstadoPrestamo } from '../enums/estado-prestamo.enum';

describe('PrestamoService', () => {
  let service: PrestamoService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put']);

    TestBed.configureTestingModule({
      providers: [PrestamoService, { provide: ApiService, useValue: apiSpy }],
    });

    service = TestBed.inject(PrestamoService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('debería listar préstamos', () => {
    const mockPrestamos: Prestamo[] = [
      {
        id: 1,
        libroId: 1,
        usuarioId: 1,
        fechaPrestamo: '2024-01-01',
        tituloLibro: '',
        nombreUsuario: '',
        estado: EstadoPrestamo.PRESTADO,
      },
    ];

    apiService.get.and.returnValue(of(mockPrestamos));

    service.listar().subscribe((res) => {
      expect(res).toEqual(mockPrestamos);
    });

    expect(apiService.get).toHaveBeenCalledWith('prestamos');
  });

  it('debería obtener un préstamo por id', () => {
    const mockPrestamo: Prestamo = {
      id: 1,
      libroId: 1,
      usuarioId: 1,
      fechaPrestamo: '2024-01-01',
      tituloLibro: '',
      nombreUsuario: '',
      estado: EstadoPrestamo.PRESTADO
    };

    apiService.get.and.returnValue(of(mockPrestamo));

    service.obtener(1).subscribe((res) => {
      expect(res).toEqual(mockPrestamo);
    });

    expect(apiService.get).toHaveBeenCalledWith('prestamos/1');
  });

  it('debería crear un préstamo', () => {
    const request: CrearPrestamoRequest = {
      libroId: 1,
      usuarioId: 2,
    };

    const mockResponse: Prestamo = {
      id: 1,
      ...request,
      fechaPrestamo: '2024-01-01',
      tituloLibro: '',
      nombreUsuario: '',
      estado: EstadoPrestamo.PRESTADO,
    };

    apiService.post.and.returnValue(of(mockResponse));

    service.prestar(request).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith('prestamos', request);
  });

  it('debería devolver un préstamo', () => {
    const mockResponse: Prestamo = {
      id: 1,
      libroId: 1,
      usuarioId: 1,
      fechaPrestamo: '2024-01-01',
      fechaDevolucion: '2024-02-01',
      tituloLibro: '',
      nombreUsuario: '',
      estado: EstadoPrestamo.DEVUELTO
    };

    apiService.put.and.returnValue(of(mockResponse));

    service.devolver(1).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.put).toHaveBeenCalledWith('prestamos/devolver/1', {});
  });
});
