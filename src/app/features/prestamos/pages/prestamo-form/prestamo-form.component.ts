import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrestamoService } from '../../../../core/services/prestamo.service';
import { LibroService } from '../../../../core/services/libro.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { Libro } from '../../../../core/models/libro.model';
import { Usuario } from '../../../../core/models/usuario.model';
import { debounceTime, distinctUntilChanged, switchMap, filter, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-prestamo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatStepperModule,
    MatInputModule,
  ],
  templateUrl: './prestamo-form.component.html',
  styleUrl: './prestamo-form.component.scss',
})
export class PrestamoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private prestamoService = inject(PrestamoService);
  private libroService = inject(LibroService);
  private usuarioService = inject(UsuarioService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  libros: Libro[] = [];
  librosFiltrados: any[] = [];

  usuarios: Usuario[] = [];
  usuariosFiltrados: any[] = [];

  loadingLibros = false;
  loadingUsuarios = false;

  step1Form = this.fb.nonNullable.group({
    libroId: [null as number | null, Validators.required],
    busquedaLibro: [''],
  });

  step2Form = this.fb.nonNullable.group({
    usuarioId: [null as number | null, Validators.required],
    busquedaUsuario: [''],
  });

  ngOnInit() {
    this.initBusquedaLibros();
    this.initBusquedaUsuarios();
  }

  // LIBROS
  initBusquedaLibros() {
    this.step1Form.get('busquedaLibro')?.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.loadingLibros = true;
          this.librosFiltrados = [];
        }),
        filter((query) => !!query && query.length >= 2),
        switchMap((query) =>
          this.libroService.buscar(query!).pipe(
            catchError(() => of([]))
          )
        )
      )
      .subscribe((libros) => {
        this.librosFiltrados = libros.filter((l) => l.disponible);
        this.loadingLibros = false;
      });
  }

  // USUARIOS
  initBusquedaUsuarios() {
    this.step2Form.get('busquedaUsuario')?.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.loadingUsuarios = true;
          this.usuariosFiltrados = [];
        }),
        filter((query) => !!query && query.length >= 2),
        switchMap((query) =>
          this.usuarioService.buscar(query!).pipe(
            catchError(() => of([]))
          )
        )
      )
      .subscribe((usuarios) => {
        this.usuariosFiltrados = usuarios;
        this.loadingUsuarios = false;
      });
  }

  guardar() {
    if (this.step1Form.invalid || this.step2Form.invalid) return;

    const data = {
      libroId: this.step1Form.value.libroId!,
      usuarioId: this.step2Form.value.usuarioId!,
    };

    this.prestamoService.prestar(data).subscribe(() => {
      this.notification.showMessage('Libro prestado correctamente');
      this.router.navigate(['/prestamos']);
    });
  }

  volver() {
    this.router.navigate(['/prestamos']);
  }
}
