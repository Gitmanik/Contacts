import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { Contact } from '../../models/contact.model';
import {RouterLink} from '@angular/router';
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

  constructor(private contactsService: ContactsService) {}

  ngOnInit(): void {
    this.contactsService.getAll().subscribe(data => this.contacts = data);
  }
}
