/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LibroService } from './libro.service';
import { ApiService } from './api.service';
import { Libro } from '../models/libro.model';
import { CrearLibroRequest } from '../models/crear-libro-request.model';

describe('LibroService', () => {
  let service: LibroService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', [
      'get',
      'post',
      'put',
      'delete',
    ]);

    TestBed.configureTestingModule({
      providers: [LibroService, { provide: ApiService, useValue: apiSpy }],
    });

    service = TestBed.inject(LibroService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('debería listar libros', () => {
    const mockLibros: Libro[] = [
      {
        id: 1,
        titulo: 'Libro 1',
        autor: 'Autor',
        isbn: '123',
        fechaPublicacion: '2020-01-01',
        disponible: true,
      },
    ];

    apiService.get.and.returnValue(of(mockLibros));

    service.listar().subscribe((res) => {
      expect(res).toEqual(mockLibros);
    });

    expect(apiService.get).toHaveBeenCalledWith('libros');
  });

  it('debería obtener un libro por id', () => {
    const mockLibro: Libro = {
      id: 1,
      titulo: 'Libro 1',
      autor: 'Autor',
      isbn: '123',
      fechaPublicacion: '2020-01-01',
      disponible: true,
    };

    apiService.get.and.returnValue(of(mockLibro));

    service.obtener(1).subscribe((res) => {
      expect(res).toEqual(mockLibro);
    });

    expect(apiService.get).toHaveBeenCalledWith('libros/1');
  });

  it('debería crear un libro', () => {
    const request: CrearLibroRequest = {
      titulo: 'Nuevo',
      autor: 'Autor',
      isbn: '123456',
      fechaPublicacion: '2024-01-01',
    };

    const mockResponse: Libro = {
      id: 1,
      ...request,
      disponible: true,
    };

    apiService.post.and.returnValue(of(mockResponse));

    service.crear(request).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith('libros', request);
  });

  it('debería actualizar un libro', () => {
    const request: CrearLibroRequest = {
      titulo: 'Actualizado',
      autor: 'Autor',
      isbn: '999',
      fechaPublicacion: '2024-01-01',
    };

    const mockResponse: Libro = {
      id: 1,
      ...request,
      disponible: true,
    };

    apiService.put.and.returnValue(of(mockResponse));

    service.actualizar(1, request).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.put).toHaveBeenCalledWith('libros/1', request);
  });

  it('debería eliminar un libro', () => {
    apiService.delete.and.returnValue(of(void 0));

    service.eliminar(1).subscribe((res) => {
      expect(res).toBeUndefined();
    });

    expect(apiService.delete).toHaveBeenCalledWith('libros/1');
  });
});
