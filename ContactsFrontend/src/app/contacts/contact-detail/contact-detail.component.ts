import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../contacts.service';
import { Contact } from '../../models/contact.model';
import { Category } from '../../models/category.model';
import { Subcategory } from '../../models/subcategory.model';
import { NgIf, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    RouterLink
  ],
  styleUrls: ['./contact-detail.component.scss'],
  standalone: true
})
export class ContactDetailComponent implements OnInit {
  form: FormGroup;
  contactId?: number;
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  showSubcategories = false;
  allowCustomSubcategory = false;
  isLoggedIn = false;

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
      otherSubcategory: [''],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get all categories
    this.isLoggedIn = !!localStorage.getItem('authToken');

    if (!this.isLoggedIn) {
      this.form.disable();
    }

    this.contactsService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });

    // Get contact data (if editing an existing one)
    this.contactId = Number(this.route.snapshot.params['id']);
    if (this.contactId) {
      this.contactsService.get(this.contactId).subscribe((contact: Contact) => {
        this.form.patchValue(contact);

        // If the contact has an assigned category, fetch subcategories
        if (contact.categoryId) {
          this.onCategoryChange(contact.categoryId);
        }
      });
    }

    // Listen for category selection changes
    this.form.get('categoryId')?.valueChanges.subscribe(categoryId => {
      if (categoryId) {
        this.onCategoryChange(categoryId);
      } else {
        this.showSubcategories = false;
        this.allowCustomSubcategory = false;
        this.form.get('subcategoryId')?.setValue(null);
      }
    });
  }

  onCategoryChange(categoryId: number): void {
    // Find the selected category
    const selectedCategory = this.categories.find(c => c.id === categoryId);

    if (selectedCategory) {
      // Set flags based on category properties
      this.showSubcategories = selectedCategory.allowsSubcategories;
      this.allowCustomSubcategory = selectedCategory.allowsCustomSubcategory;

      // If the category allows subcategories, fetch them
      if (this.showSubcategories) {
        this.contactsService.getSubcategoriesByCategory(categoryId).subscribe(subcategories => {
          this.subcategories = subcategories;
        });
      } else {
        // If the category doesn't allow subcategories, clear the selection
        this.form.get('subcategoryId')?.setValue(null);
      }
    }
  }

  save(): void {
    // If a custom subcategory is selected, clear the subcategory ID
    if (!this.isLoggedIn) { return; }
    if (this.allowCustomSubcategory && this.form.value.otherSubcategory) {
      this.form.get('subcategoryId')?.setValue(null);
    }

    const payload = { ...this.form.value, id: this.contactId };
    if (this.contactId) {
      this.contactsService.update(payload).subscribe(() => this.router.navigate(['/contacts']));
    } else {
      delete payload.id;
      this.contactsService.create(payload).subscribe(() => this.router.navigate(['/contacts']));
    }
  }

  delete(): void {
    if (!this.isLoggedIn || !this.contactId) { return; }
    this.contactsService.delete(this.contactId)
      .subscribe(() => this.router.navigate(['/contacts']));
  }
}
