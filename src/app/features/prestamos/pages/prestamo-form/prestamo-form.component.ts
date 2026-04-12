import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrestamoService } from '../../../../core/services/prestamo.service';
import { LibroService } from '../../../../core/services/libro.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormErrorUtil } from '../../../../core/utils/form-error.util';

@Component({
  selector: 'app-prestamo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
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

  libros: any[] = [];
  usuarios: any[] = [];

  form = this.fb.nonNullable.group({
    libroId: [null as number | null, Validators.required],
    usuarioId: [null as number | null, Validators.required],
  });

  ngOnInit() {
    this.libroService.listar().subscribe((data) => {
      this.libros = data.filter((l) => l.disponible);
    });

    this.usuarioService.listar().subscribe((data) => {
      this.usuarios = data;
    });

    this.form.valueChanges.subscribe(() => {
      FormErrorUtil.clearBackendErrors(this.form);
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const data = {
      libroId: raw.libroId!,
      usuarioId: raw.usuarioId!
    };

    this.prestamoService.prestar(data).subscribe({
      next: () => {
        this.notification.showMessage('Libro prestado correctamente');
        this.router.navigate(['/prestamos']);
      },
      error: (err) => FormErrorUtil.applyBackendErrors(this.form, err),
    });
  }

  volver() {
    this.router.navigate(['/prestamos']);
  }
}
