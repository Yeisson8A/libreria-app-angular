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

  step1Form = this.fb.group({
    libroId: [null, Validators.required],
    busquedaLibro: [''],
  });

  step2Form = this.fb.group({
    usuarioId: [null, Validators.required],
    busquedaUsuario: [''],
  });

  ngOnInit() {
    this.cargarLibros();
    this.cargarUsuarios();

    // Búsqueda libros
    this.step1Form.get('busquedaLibro')?.valueChanges.subscribe((value) => {
      this.filtrarLibros(value!);
    });

    // Búsqueda usuarios
    this.step2Form.get('busquedaUsuario')?.valueChanges.subscribe((value) => {
      this.filtrarUsuarios(value!);
    });
  }

  cargarLibros() {
    this.libroService.listar().subscribe((data) => {
      this.libros = data.filter((l) => l.disponible);
      this.librosFiltrados = this.libros;
    });
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe((data) => {
      this.usuarios = data;
      this.usuariosFiltrados = data;
    });
  }

  filtrarLibros(valor: string) {
    if (!valor) {
      this.librosFiltrados = this.libros;
      return;
    }

    const filtro = valor.toLowerCase();

    this.librosFiltrados = this.libros.filter(
      (l) =>
        l.titulo.toLowerCase().includes(filtro) ||
        l.isbn.toLowerCase().includes(filtro),
    );
  }

  filtrarUsuarios(valor: string) {
    if (!valor) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    const filtro = valor.toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter((u) =>
      u.nombre.toLowerCase().includes(filtro),
    );
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
