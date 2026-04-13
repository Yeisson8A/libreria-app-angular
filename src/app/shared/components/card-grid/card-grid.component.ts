import {
  Component,
  computed,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  signal,
  TemplateRef,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.scss',
})
export class CardGridComponent<T> {
  private _items = signal<T[]>([]);
  // cantidad visible
  visibleCount = signal(8);
  // incremento por carga
  pageSize = 8;
  loading = signal(false);
  // total (automático)
  totalItems = computed(() => this._items().length);

  @Input() set items(value: T[]) {
    this._items.set(value || []);
    this.visibleCount.set(this.pageSize);
  }

  @Input() titleKey!: keyof T;
  @Input() subtitleKey!: keyof T;
  @Input() extraKey?: keyof T;
  @Input() state?: keyof T;
  @Input() showEdit = true;
  @Input() showDelete = true;
  @Input() customActions?: (item: T) => any[];

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  @ContentChild('extraTemplate') extraTemplate?: TemplateRef<any>;

  // Computed: items + acciones
  itemsWithActions = computed(() => {
    return this._items()
      .slice(0, this.visibleCount())
      .map((item) => ({
        ...item,
        actions: this.customActions ? this.customActions(item) : [],
      }));
  });

  loadMore() {
    if (this.loading()) return;

    this.loading.set(true);

    // simula carga
    setTimeout(() => {
      this.visibleCount.update((v) => v + this.pageSize);
      this.loading.set(false);
    }, 500);
  }
}
