/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('debería mostrar un mensaje', () => {
    service.showMessage('Hola mundo');

    expect(snackBar.open).toHaveBeenCalled();
  });

  it('debería usar duración por defecto (3000)', () => {
    service.showMessage('Mensaje test');

    expect(snackBar.open).toHaveBeenCalledWith('Mensaje test', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  });

  it('debería usar duración personalizada', () => {
    service.showMessage('Mensaje largo', 5000);

    expect(snackBar.open).toHaveBeenCalledWith('Mensaje largo', 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  });

  it('debería llamar open una sola vez', () => {
    service.showMessage('Test');

    expect(snackBar.open).toHaveBeenCalledTimes(1);
  });
});
