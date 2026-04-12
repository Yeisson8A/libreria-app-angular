import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormErrorUtil } from '../../../../core/utils/form-error.util';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  
  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      FormErrorUtil.clearBackendErrors(this.form);
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue();

    this.usuarioService.crear(data).subscribe({
      next: () => {
        this.notification.showMessage('Usuario creado correctamente');
        this.router.navigate(['/usuarios']);
      },
      error: (err) => FormErrorUtil.applyBackendErrors(this.form, err),
    });
  }

  volver() {
    this.router.navigate(['/usuarios']);
  }
}
