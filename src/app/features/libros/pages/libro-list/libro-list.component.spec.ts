/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LibroListComponent } from './libro-list.component';
import { LibroService } from '../../../../core/services/libro.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

describe('LibroListComponent', () => {
  let component: LibroListComponent;
  let fixture: ComponentFixture<LibroListComponent>;

  let libroService: jasmine.SpyObj<LibroService>;
  let notification: jasmine.SpyObj<NotificationService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;

  const mockLibros = [
    {
      id: 1,
      titulo: 'Libro 1',
      autor: 'Autor',
      isbn: '123',
      fechaPublicacion: '2020',
      disponible: true,
    },
  ];

  beforeEach(async () => {
    const libroSpy = jasmine.createSpyObj('LibroService', [
      'listar',
      'eliminar',
    ]);
    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'showMessage',
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LibroListComponent],
      providers: [
        { provide: LibroService, useValue: libroSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LibroListComponent);
    component = fixture.componentInstance;

    libroService = TestBed.inject(LibroService) as jasmine.SpyObj<LibroService>;
    notification = TestBed.inject(
      NotificationService,
    ) as jasmine.SpyObj<NotificationService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    libroService.listar.and.returnValue(of(mockLibros));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar libros en ngOnInit', () => {
    expect(libroService.listar).toHaveBeenCalled();
    expect(component.libros.length).toBe(1);
  });

  it('debería asignar libros al cargar', () => {
    component.cargarLibros();

    expect(component.libros).toEqual(mockLibros);
  });

  it('debería navegar a crear libro', () => {
    component.irCrear();

    expect(router.navigate).toHaveBeenCalledWith(['/libros/nuevo']);
  });

  it('debería navegar a editar libro', () => {
    const libro = mockLibros[0];

    component.editar(libro);

    expect(router.navigate).toHaveBeenCalledWith(['/libros/editar', libro.id]);
  });

  it('debería eliminar libro si se confirma', () => {
    const libro = mockLibros[0];

    const dialogRefMock = {
      afterClosed: () => of(true),
    };

    dialog.open.and.returnValue(dialogRefMock as any);
    libroService.eliminar.and.returnValue(of(void 0));

    component.eliminar(libro);

    expect(dialog.open).toHaveBeenCalled();

    expect(libroService.eliminar).toHaveBeenCalledWith(libro.id);
    expect(notification.showMessage).toHaveBeenCalledWith(
      'Libro eliminado correctamente',
    );
    expect(libroService.listar).toHaveBeenCalled(); // recarga
  });

  it('no debería eliminar si el usuario cancela', () => {
    const libro = mockLibros[0];

    const dialogRefMock = {
      afterClosed: () => of(false),
    };

    dialog.open.and.returnValue(dialogRefMock as any);

    component.eliminar(libro);

    expect(libroService.eliminar).not.toHaveBeenCalled();
    expect(notification.showMessage).not.toHaveBeenCalled();
  });
});
