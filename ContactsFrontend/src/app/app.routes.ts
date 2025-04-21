import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ContactsListComponent } from './contacts/contacts-list/contacts-list.component';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'contacts', component: ContactsListComponent },
  { path: 'contacts/new', component: ContactDetailComponent, canActivate: [AuthGuard] },
  { path: 'contacts/:id', component: ContactDetailComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'contacts' }
];
