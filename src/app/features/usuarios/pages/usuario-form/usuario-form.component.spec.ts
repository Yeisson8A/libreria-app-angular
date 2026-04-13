/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { UsuarioFormComponent } from './usuario-form.component';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router } from '@angular/router';
import { FormErrorUtil } from '../../../../core/utils/form-error.util';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UsuarioFormComponent', () => {
  let component: UsuarioFormComponent;
  let fixture: ComponentFixture<UsuarioFormComponent>;

  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let notification: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['crear']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'showMessage',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UsuarioFormComponent, NoopAnimationsModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioFormComponent);
    component = fixture.componentInstance;

    usuarioService = TestBed.inject(
      UsuarioService,
    ) as jasmine.SpyObj<UsuarioService>;
    notification = TestBed.inject(
      NotificationService,
    ) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('no debería guardar si el formulario es inválido', () => {
    component.form.setValue({
      nombre: '',
      email: '',
    });

    component.guardar();

    expect(usuarioService.crear).not.toHaveBeenCalled();
  });

  it('debería crear usuario correctamente', () => {
    component.form.setValue({
      nombre: 'Juan',
      email: 'juan@test.com',
    });

    usuarioService.crear.and.returnValue(
      of({ id: 1, nombre: 'Juan', email: 'juan@test.com' }),
    );

    component.guardar();

    expect(usuarioService.crear).toHaveBeenCalledWith({
      nombre: 'Juan',
      email: 'juan@test.com',
    });

    expect(notification.showMessage).toHaveBeenCalledWith(
      'Usuario creado correctamente',
    );
    expect(router.navigate).toHaveBeenCalledWith(['/usuarios']);
  });

  it('debería aplicar errores backend', () => {
    spyOn(FormErrorUtil, 'applyBackendErrors');

    component.form.setValue({
      nombre: 'Juan',
      email: 'juan@test.com',
    });

    usuarioService.crear.and.returnValue(
      throwError(() => ({ error: { errors: { email: 'Error email' } } })),
    );

    component.guardar();

    expect(FormErrorUtil.applyBackendErrors).toHaveBeenCalled();
  });

  it('debería limpiar errores backend en cambios', () => {
    spyOn(FormErrorUtil, 'clearBackendErrors');

    component.form.patchValue({ nombre: 'Nuevo' });

    expect(FormErrorUtil.clearBackendErrors).toHaveBeenCalled();
  });

  it('debería navegar al volver', () => {
    component.volver();

    expect(router.navigate).toHaveBeenCalledWith(['/usuarios']);
  });
});
