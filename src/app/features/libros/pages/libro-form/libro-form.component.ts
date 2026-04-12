import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LibroService } from '../../../../core/services/libro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormErrorUtil } from '../../../../core/utils/form-error.util';

@Component({
  selector: 'app-libro-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './libro-form.component.html',
  styleUrl: './libro-form.component.scss',
})
export class LibroFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private libroService = inject(LibroService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id?: number;
  maxDate = new Date();

  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    autor: ['', Validators.required],
    isbn: ['', Validators.required],
    fechaPublicacion: [null as Date | null, Validators.required],
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.libroService.obtener(this.id).subscribe((libro) => {
        this.form.patchValue({
          ...libro,
          fechaPublicacion: libro.fechaPublicacion
            ? new Date(libro.fechaPublicacion)
            : null,
        });
      });
    }

    this.form.valueChanges.subscribe(() => {
      FormErrorUtil.clearBackendErrors(this.form);
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const data = {
      ...raw,
      fechaPublicacion: this.formatDate(raw.fechaPublicacion!),
    };

    const request = this.id
      ? this.libroService.actualizar(this.id, data)
      : this.libroService.crear(data);

    request.subscribe({
      next: () => {
        this.notification.showMessage(
          this.id
            ? 'Libro actualizado correctamente'
            : 'Libro creado correctamente',
        );
        this.router.navigate(['/libros']);
      },
      error: (err) => FormErrorUtil.applyBackendErrors(this.form, err),
    });
  }

  volver() {
    this.router.navigate(['/libros']);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
