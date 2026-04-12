import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibroService } from '../../../../core/services/libro.service';
import { Libro } from '../../../../core/models/libro.model';

@Component({
  selector: 'app-libro-detail',
  standalone: true,
  imports: [],
  templateUrl: './libro-detail.component.html',
  styleUrl: './libro-detail.component.scss'
})
export class LibroDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(LibroService);

  libro?: Libro;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.obtener(id).subscribe(data => this.libro = data);
  }
}
