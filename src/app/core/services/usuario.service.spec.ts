/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UsuarioService } from './usuario.service';
import { ApiService } from './api.service';
import { Usuario } from '../models/usuario.model';
import { CrearUsuarioRequest } from '../models/crear-usuario-request.model';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [UsuarioService, { provide: ApiService, useValue: apiSpy }],
    });

    service = TestBed.inject(UsuarioService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('debería listar usuarios', () => {
    const mockUsuarios: Usuario[] = [
      {
        id: 1,
        nombre: 'Juan',
        email: 'juan@test.com',
      },
    ];

    apiService.get.and.returnValue(of(mockUsuarios));

    service.listar().subscribe((res) => {
      expect(res).toEqual(mockUsuarios);
    });

    expect(apiService.get).toHaveBeenCalledWith('usuarios');
  });

  it('debería obtener un usuario por id', () => {
    const mockUsuario: Usuario = {
      id: 1,
      nombre: 'Juan',
      email: 'juan@test.com',
    };

    apiService.get.and.returnValue(of(mockUsuario));

    service.obtener(1).subscribe((res) => {
      expect(res).toEqual(mockUsuario);
    });

    expect(apiService.get).toHaveBeenCalledWith('usuarios/1');
  });

  it('debería crear un usuario', () => {
    const request: CrearUsuarioRequest = {
      nombre: 'Nuevo',
      email: 'nuevo@test.com',
    };

    const mockResponse: Usuario = {
      id: 1,
      ...request,
    };

    apiService.post.and.returnValue(of(mockResponse));

    service.crear(request).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith('usuarios', request);
  });
});
