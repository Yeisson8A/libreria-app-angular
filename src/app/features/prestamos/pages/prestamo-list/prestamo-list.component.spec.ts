/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PrestamoListComponent } from './prestamo-list.component';
import { PrestamoService } from '../../../../core/services/prestamo.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EstadoPrestamo } from '../../../../core/enums/estado-prestamo.enum';

describe('PrestamoListComponent', () => {
  let component: PrestamoListComponent;
  let fixture: ComponentFixture<PrestamoListComponent>;

  let prestamoService: jasmine.SpyObj<PrestamoService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;

  const mockPrestamoActivo = {
    id: 1,
    libroId: 1,
    usuarioId: 1,
    tituloLibro: 'Libro 1',
    nombreUsuario: 'Usuario 1',
    fechaPrestamo: '2024-01-01',
    estado: EstadoPrestamo.PRESTADO
  };

  const mockPrestamoDevuelto = {
    id: 2,
    libroId: 2,
    usuarioId: 2,
    tituloLibro: 'Libro 2',
    nombreUsuario: 'Usuario 2',
    fechaPrestamo: '2024-01-01',
    fechaDevolucion: '2024-02-01',
    estado: EstadoPrestamo.DEVUELTO
  };

  beforeEach(async () => {
    const prestamoSpy = jasmine.createSpyObj('PrestamoService', [
      'listar',
      'devolver',
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PrestamoListComponent],
      providers: [
        { provide: PrestamoService, useValue: prestamoSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestamoListComponent);
    component = fixture.componentInstance;

    prestamoService = TestBed.inject(
      PrestamoService,
    ) as jasmine.SpyObj<PrestamoService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    prestamoService.listar.and.returnValue(of([mockPrestamoActivo]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar préstamos en ngOnInit', () => {
    expect(prestamoService.listar).toHaveBeenCalled();
    expect(component.prestamos.length).toBe(1);
  });

  it('debería asignar préstamos correctamente', () => {
    component.cargar();

    expect(component.prestamos).toEqual([mockPrestamoActivo]);
  });

  it('debería navegar a crear préstamo', () => {
    component.irCrear();

    expect(router.navigate).toHaveBeenCalledWith(['/prestamos/nuevo']);
  });

  it('debería retornar acción devolver si no tiene fechaDevolucion', () => {
    const actions = component.accionesPrestamo(mockPrestamoActivo);

    expect(actions.length).toBe(1);
    expect(actions[0].id).toBe('devolver');
  });

  it('no debería retornar acciones si ya fue devuelto', () => {
    const actions = component.accionesPrestamo(mockPrestamoDevuelto);

    expect(actions.length).toBe(0);
  });

  it('debería devolver préstamo si se confirma', () => {
    const dialogRefMock = {
      afterClosed: () => of(true),
    };

    dialog.open.and.returnValue(dialogRefMock as any);
    prestamoService.devolver.and.returnValue(of(mockPrestamoActivo));

    component.devolver(mockPrestamoActivo);

    expect(dialog.open).toHaveBeenCalled();
    expect(prestamoService.devolver).toHaveBeenCalledWith(
      mockPrestamoActivo.id,
    );
    expect(prestamoService.listar).toHaveBeenCalled(); // recarga
  });

  it('no debería devolver si el usuario cancela', () => {
    const dialogRefMock = {
      afterClosed: () => of(false),
    };

    dialog.open.and.returnValue(dialogRefMock as any);

    component.devolver(mockPrestamoActivo);

    expect(prestamoService.devolver).not.toHaveBeenCalled();
  });
});
