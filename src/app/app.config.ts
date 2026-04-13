import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

export function customPaginator() {
  const paginator = new MatPaginatorIntl();

  paginator.itemsPerPageLabel = 'Items por página';
  paginator.nextPageLabel = 'Siguiente';
  paginator.previousPageLabel = 'Anterior';

  return paginator;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([loadingInterceptor, errorInterceptor])),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MatPaginatorIntl, useFactory: customPaginator },
  ],
};
