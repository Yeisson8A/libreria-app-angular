/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { LoadingSpinnerComponent } from './loading-spinner.component';
import { LoadingService } from '../../../core/services/loading.service';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);

    const loadingServiceMock = {
      loading$: loadingSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent], // standalone
      providers: [{ provide: LoadingService, useValue: loadingServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener loading$ definido', () => {
    expect(component.loading$).toBeDefined();
  });

  it('debería mostrar el spinner cuando loading es true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');

    expect(spinner).toBeTruthy();
  });

  it('no debería mostrar el spinner cuando loading es false', () => {
    loadingSubject.next(false);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');

    expect(spinner).toBeFalsy();
  });
});
