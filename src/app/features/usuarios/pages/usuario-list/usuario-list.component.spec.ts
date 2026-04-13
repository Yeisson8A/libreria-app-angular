/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UsuarioListComponent } from './usuario-list.component';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Router } from '@angular/router';

describe('UsuarioListComponent', () => {
  let component: UsuarioListComponent;
  let fixture: ComponentFixture<UsuarioListComponent>;

  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let router: jasmine.SpyObj<Router>;

  const mockUsuarios = [
    { id: 1, nombre: 'Juan', email: 'juan@test.com' },
    { id: 2, nombre: 'Ana', email: 'ana@test.com' },
  ];

  beforeEach(async () => {
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['listar']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UsuarioListComponent], // standalone
      providers: [
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioListComponent);
    component = fixture.componentInstance;

    usuarioService = TestBed.inject(
      UsuarioService,
    ) as jasmine.SpyObj<UsuarioService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    usuarioService.listar.and.returnValue(of(mockUsuarios));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios en ngOnInit', () => {
    expect(usuarioService.listar).toHaveBeenCalled();
    expect(component.usuarios.length).toBe(2);
  });

  it('debería asignar usuarios correctamente', () => {
    component.cargarUsuarios();

    expect(component.usuarios).toEqual(mockUsuarios);
  });

  it('debería navegar a crear usuario', () => {
    component.irCrear();

    expect(router.navigate).toHaveBeenCalledWith(['/usuarios/nuevo']);
  });
});
