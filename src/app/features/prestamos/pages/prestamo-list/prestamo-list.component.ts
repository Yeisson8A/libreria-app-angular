import { Component, inject, OnInit } from '@angular/core';
import { PrestamoService } from '../../../../core/services/prestamo.service';
import { MatDialog } from '@angular/material/dialog';
import { Prestamo } from '../../../../core/models/prestamo.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CardGridComponent } from '../../../../shared/components/card-grid/card-grid.component';

@Component({
  selector: 'app-prestamo-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, CardGridComponent],
  templateUrl: './prestamo-list.component.html',
  styleUrl: './prestamo-list.component.scss',
})
export class PrestamoListComponent implements OnInit {
  private prestamoService = inject(PrestamoService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  prestamos: Prestamo[] = [];

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.prestamoService.listar().subscribe((data) => {
      this.prestamos = data;
    });
  }

  irCrear() {
    this.router.navigate(['/prestamos/nuevo']);
  }

  accionesPrestamo(prestamo: any) {
    const actions = [];

    if (!prestamo.fechaDevolucion) {
      actions.push({
        icon: 'assignment_return',
        tooltip: 'Devolver',
        color: 'primary',
        action: (p: any) => this.devolver(p),
      });
    }

    return actions;
  }

  devolver(prestamo: Prestamo) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Devolver libro',
        mensaje: `¿Deseas devolver el libro "${prestamo.tituloLibro}"?`,
        textoConfirmar: 'Devolver',
      },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.prestamoService.devolver(prestamo.id).subscribe(() => {
          this.cargar();
        });
      }
    });
  }
}
