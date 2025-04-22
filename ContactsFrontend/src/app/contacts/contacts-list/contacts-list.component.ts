import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { Contact } from '../../models/contact.model';
import {Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {MatAnchor} from '@angular/material/button';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    MatAnchor
  ],
  styleUrls: ['./contacts-list.component.scss'],
  standalone: true,
})
export class ContactsListComponent implements OnInit {
  contacts: Contact[] = [];
  isLoggedIn = false;

  constructor(private contactsService: ContactsService, private router: Router,) {}

  ngOnInit(): void {
    this.contactsService.getAll().subscribe(data => this.contacts = data);
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
  login(): void {
    this.router.navigate(['/login']);
  }
}
