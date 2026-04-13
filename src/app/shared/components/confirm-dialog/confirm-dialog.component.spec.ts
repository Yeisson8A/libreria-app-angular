/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const mockData: ConfirmDialogData = {
    titulo: 'Confirmar',
    mensaje: '¿Estás seguro?',
    textoConfirmar: 'Sí',
    textoCancelar: 'No',
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent], // standalone
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ConfirmDialogComponent>
    >;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería recibir los datos correctamente', () => {
    expect(component.data).toEqual(mockData);
    expect(component.data.mensaje).toBe('¿Estás seguro?');
  });

  it('debería cerrar el dialog con true al confirmar', () => {
    component.confirmar();

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('debería cerrar el dialog con false al cancelar', () => {
    component.cancelar();

    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('debería ejecutar confirmar desde el template', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');

    const btnConfirmar = buttons[1]; // depende del orden
    btnConfirmar.click();

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('debería ejecutar cancelar desde el template', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');

    const btnCancelar = buttons[0];
    btnCancelar.click();

    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
