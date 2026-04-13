/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LibroFormComponent } from './libro-form.component';
import { LibroService } from '../../../../core/services/libro.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormErrorUtil } from '../../../../core/utils/form-error.util';

describe('LibroFormComponent', () => {
  let component: LibroFormComponent;
  let fixture: ComponentFixture<LibroFormComponent>;

  let libroService: jasmine.SpyObj<LibroService>;
  let notification: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  const mockLibro = {
    id: 1,
    titulo: 'Libro Test',
    autor: 'Autor',
    isbn: '123',
    fechaPublicacion: '2024-01-01',
    disponible: true,
  };

  beforeEach(async () => {
    const libroSpy = jasmine.createSpyObj('LibroService', [
      'obtener',
      'crear',
      'actualizar',
    ]);

    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'showMessage',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LibroFormComponent, NoopAnimationsModule],
      providers: [
        { provide: LibroService, useValue: libroSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null, // por defecto crear
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LibroFormComponent);
    component = fixture.componentInstance;

    libroService = TestBed.inject(LibroService) as jasmine.SpyObj<LibroService>;
    notification = TestBed.inject(
      NotificationService,
    ) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar libro si hay id', () => {
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot.paramMap.get = () => '1';

    libroService.obtener.and.returnValue(of(mockLibro));

    component.ngOnInit();

    expect(libroService.obtener).toHaveBeenCalledWith(1);
  });

  it('no debería guardar si el formulario es inválido', () => {
    component.form.setValue({
      titulo: '',
      autor: '',
      isbn: '',
      fechaPublicacion: null,
    });

    component.guardar();

    expect(libroService.crear).not.toHaveBeenCalled();
  });

  it('debería crear libro', () => {
    component.form.setValue({
      titulo: 'Libro',
      autor: 'Autor',
      isbn: '123',
      fechaPublicacion: new Date('2024-01-01'),
    });

    libroService.crear.and.returnValue(of(mockLibro));

    component.guardar();

    expect(libroService.crear).toHaveBeenCalled();
    expect(notification.showMessage).toHaveBeenCalledWith(
      'Libro creado correctamente',
    );
    expect(router.navigate).toHaveBeenCalledWith(['/libros']);
  });

  it('debería actualizar libro si hay id', () => {
    component.id = 1;

    component.form.setValue({
      titulo: 'Libro',
      autor: 'Autor',
      isbn: '123',
      fechaPublicacion: new Date('2024-01-01'),
    });

    libroService.actualizar.and.returnValue(of(mockLibro));

    component.guardar();

    expect(libroService.actualizar).toHaveBeenCalledWith(
      1,
      jasmine.any(Object),
    );
    expect(notification.showMessage).toHaveBeenCalledWith(
      'Libro actualizado correctamente',
    );
  });

  it('debería aplicar errores backend', () => {
    spyOn(FormErrorUtil, 'applyBackendErrors');

    component.form.setValue({
      titulo: 'Libro',
      autor: 'Autor',
      isbn: '123',
      fechaPublicacion: new Date(),
    });

    libroService.crear.and.returnValue(
      throwError(() => ({ error: { errors: { titulo: 'Error' } } })),
    );

    component.guardar();

    expect(FormErrorUtil.applyBackendErrors).toHaveBeenCalled();
  });

  it('debería limpiar errores backend en cambios', () => {
    spyOn(FormErrorUtil, 'clearBackendErrors');

    component.form.patchValue({ titulo: 'Nuevo' });

    expect(FormErrorUtil.clearBackendErrors).toHaveBeenCalled();
  });

  it('debería navegar al volver', () => {
    component.volver();

    expect(router.navigate).toHaveBeenCalledWith(['/libros']);
  });

  it('debería formatear fecha correctamente', () => {
    const date = new Date('2024-01-01');

    const result = component.formatDate(date);

    expect(result).toBe('2024-01-01');
  });
});
