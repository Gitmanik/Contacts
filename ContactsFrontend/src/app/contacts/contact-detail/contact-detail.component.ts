import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ContactsService } from '../contacts.service';
import { Contact } from '../../models/contact.model';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {
  form: FormGroup;
  contactId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactsService: ContactsService,
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      categoryId: [null, Validators.required],
      subcategoryId: [null],
      customSubcategory: [''],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.contactId = Number(this.route.snapshot.params['id']);
    if (this.contactId) {
      this.contactsService.get(this.contactId).subscribe((c: Contact) => this.form.patchValue(c));
    }
  }

  save(): void {
    const payload = { ...this.form.value, id: this.contactId };
    if (this.contactId) {
      this.contactsService.update(payload).subscribe(() => this.router.navigate(['/contacts']));
    } else {
      this.contactsService.create(payload).subscribe(() => this.router.navigate(['/contacts']));
    }
  }

  delete(): void {
    if (this.contactId) {
      this.contactsService.delete(this.contactId).subscribe(() => this.router.navigate(['/contacts']));
    }
  }
}
