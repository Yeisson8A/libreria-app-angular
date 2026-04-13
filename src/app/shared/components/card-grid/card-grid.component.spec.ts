/// <reference types="jasmine" />

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CardGridComponent } from './card-grid.component';

interface TestItem {
  id: number;
  titulo: string;
  descripcion: string;
}

describe('CardGridComponent', () => {
  let component: CardGridComponent<TestItem>;
  let fixture: ComponentFixture<CardGridComponent<TestItem>>;

  const mockItems: TestItem[] = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    titulo: `Item ${i + 1}`,
    descripcion: `Desc ${i + 1}`,
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGridComponent], // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(CardGridComponent<TestItem>);
    component = fixture.componentInstance;

    component.titleKey = 'titulo';
    component.subtitleKey = 'descripcion';

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería asignar items y resetear visibleCount', () => {
    component.items = mockItems;

    expect(component.totalItems()).toBe(20);
    expect(component.visibleCount()).toBe(component.pageSize);
  });

  it('debería limitar los items visibles según visibleCount', () => {
    component.items = mockItems;

    const items = component.itemsWithActions();

    expect(items.length).toBe(component.pageSize);
  });

  it('debería calcular totalItems correctamente', () => {
    component.items = mockItems;

    expect(component.totalItems()).toBe(20);
  });

  it('debería agregar acciones personalizadas', () => {
    component.customActions = (item) => [{ icon: 'edit', action: () => {} }];

    component.items = mockItems;

    const items = component.itemsWithActions();

    expect(items[0].actions.length).toBe(1);
    expect(items[0].actions[0].icon).toBe('edit');
  });

  it('debería tener acciones vacías si no hay customActions', () => {
    component.items = mockItems;

    const items = component.itemsWithActions();

    expect(items[0].actions).toEqual([]);
  });

  it('debería aumentar visibleCount al llamar loadMore', fakeAsync(() => {
    component.items = mockItems;

    const initial = component.visibleCount();

    component.loadMore();

    tick(500);

    expect(component.visibleCount()).toBe(initial + component.pageSize);
  }));

  it('no debería ejecutar loadMore si ya está cargando', fakeAsync(() => {
    component.items = mockItems;

    component.loading.set(true);

    const initial = component.visibleCount();

    component.loadMore();

    tick(500);

    expect(component.visibleCount()).toBe(initial);
  }));

  it('debería activar y desactivar loading durante loadMore', fakeAsync(() => {
    component.items = mockItems;

    component.loadMore();

    expect(component.loading()).toBeTrue();

    tick(500);

    expect(component.loading()).toBeFalse();
  }));
});
