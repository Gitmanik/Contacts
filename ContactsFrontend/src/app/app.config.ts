import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { apiInterceptor } from './core/api.interceptor';
import { errorInterceptor } from './core/error.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiInterceptor, errorInterceptor]),
    ),
    importProvidersFrom(MatSnackBarModule),
    provideAnimations(),
    provideNativeDateAdapter()
  ]
};
