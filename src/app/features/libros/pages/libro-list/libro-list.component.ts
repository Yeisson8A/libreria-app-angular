import { Component, inject, OnInit } from '@angular/core';
import { Libro } from '../../../../core/models/libro.model';
import { LibroService } from '../../../../core/services/libro.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { CardGridComponent } from '../../../../shared/components/card-grid/card-grid.component';

@Component({
  selector: 'app-libro-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CardGridComponent,
  ],
  templateUrl: './libro-list.component.html',
  styleUrl: './libro-list.component.scss',
})
export class LibroListComponent implements OnInit {
  private libroService = inject(LibroService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  libros: Libro[] = [];

  ngOnInit() {
    this.cargarLibros();
  }

  cargarLibros() {
    this.libroService.listar().subscribe((data) => {
      this.libros = data;
    });
  }

  irCrear() {
    this.router.navigate(['/libros/nuevo']);
  }

  editar(libro: any) {
    this.router.navigate(['/libros/editar', libro.id]);
  }

  eliminar(libro: Libro) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Eliminar libro',
        mensaje: `¿Estás seguro de eliminar "${libro.titulo}"?`,
        textoConfirmar: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.libroService.eliminar(libro.id).subscribe(() => {
          this.notification.showMessage('Libro eliminado correctamente');
          this.cargarLibros();
        });
      }
    });
  }
}
