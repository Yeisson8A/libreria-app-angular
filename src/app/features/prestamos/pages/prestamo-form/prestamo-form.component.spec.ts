import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PrestamoFormComponent } from './prestamo-form.component';
import { PrestamoService } from '../../../../core/services/prestamo.service';
import { LibroService } from '../../../../core/services/libro.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EstadoPrestamo } from '../../../../core/enums/estado-prestamo.enum';

describe('PrestamoFormComponent', () => {
  let component: PrestamoFormComponent;
  let fixture: ComponentFixture<PrestamoFormComponent>;

  let prestamoServiceSpy: jasmine.SpyObj<PrestamoService>;
  let libroServiceSpy: jasmine.SpyObj<LibroService>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    prestamoServiceSpy = jasmine.createSpyObj('PrestamoService', ['prestar']);
    libroServiceSpy = jasmine.createSpyObj('LibroService', ['buscar']);
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['buscar']);
    notificationSpy = jasmine.createSpyObj('NotificationService', [
      'showMessage',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PrestamoFormComponent, NoopAnimationsModule],
      providers: [
        { provide: PrestamoService, useValue: prestamoServiceSpy },
        { provide: LibroService, useValue: libroServiceSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestamoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia buscar libros con debounce', fakeAsync(() => {
    const mockLibros = [
      {
        id: 1,
        titulo: 'Clean Code',
        autor: 'Augusto Torres',
        isbn: '123',
        disponible: true,
        fechaPublicacion: '2025-04-14',
      },
    ];

    libroServiceSpy.buscar.and.returnValue(of(mockLibros));

    component.step1Form.get('busquedaLibro')?.setValue('clean');

    tick(400);

    expect(libroServiceSpy.buscar).toHaveBeenCalledWith('clean');
    expect(component.librosFiltrados.length).toBe(1);
    expect(component.loadingLibros).toBeFalse();
  }));

  it('deberia buscar usuarios con debounce', fakeAsync(() => {
    const mockUsuarios = [{ id: 1, nombre: 'Juan', email: 'test@test.com' }];

    usuarioServiceSpy.buscar.and.returnValue(of(mockUsuarios));

    component.step2Form.get('busquedaUsuario')?.setValue('juan');

    tick(400);

    expect(usuarioServiceSpy.buscar).toHaveBeenCalledWith('juan');
    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.loadingUsuarios).toBeFalse();
  }));

  it('no deberia buscar si el texto es menor a 2 caracteres', fakeAsync(() => {
    component.step1Form.get('busquedaLibro')?.setValue('a');

    tick(400);

    expect(libroServiceSpy.buscar).not.toHaveBeenCalled();
  }));

  it('deberia guardar prestamo correctamente', () => {
    const mockPrestamo = {
      id: 1,
      libroId: 1,
      tituloLibro: 'Libro 1',
      usuarioId: 2,
      nombreUsuario: 'Usuario 2',
      fechaPrestamo: '2026-04-14',
      estado: EstadoPrestamo.PRESTADO
    }

    prestamoServiceSpy.prestar.and.returnValue(of(mockPrestamo));

    component.step1Form.setValue({ libroId: 1, busquedaLibro: '' });
    component.step2Form.setValue({ usuarioId: 2, busquedaUsuario: '' });

    component.guardar();

    expect(prestamoServiceSpy.prestar).toHaveBeenCalledWith({
      libroId: 1,
      usuarioId: 2,
    });

    expect(notificationSpy.showMessage).toHaveBeenCalledWith(
      'Libro prestado correctamente',
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/prestamos']);
  });

  it('no deberia guardar si el formulario es invalido', () => {
    component.step1Form.setValue({ libroId: null, busquedaLibro: '' });
    component.step2Form.setValue({ usuarioId: null, busquedaUsuario: '' });

    component.guardar();

    expect(prestamoServiceSpy.prestar).not.toHaveBeenCalled();
  });

  it('deberia navegar al listado al volver', () => {
    component.volver();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/prestamos']);
  });
});
