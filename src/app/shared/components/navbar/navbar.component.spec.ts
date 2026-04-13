/// <reference types="jasmine" />

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent], // 🔥 standalone
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar router.navigate', () => {
    component.navegar('libros');

    expect(router.navigate).toHaveBeenCalled();
  });

  it('debería navegar a la ruta correcta', () => {
    component.navegar('usuarios');

    expect(router.navigate).toHaveBeenCalledWith(['usuarios']);
  });

  it('debería navegar al hacer click en botón', () => {
    const button = fixture.nativeElement.querySelector('button');

    button.click();

    expect(router.navigate).toHaveBeenCalled();
  });
});
