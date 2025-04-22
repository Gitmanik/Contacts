import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { Category } from '../models/category.model';
import { Subcategory } from '../models/subcategory.model';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly baseUrl = `${environment.apiBaseUrl}/contacts`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  get(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${id}`);
  }

  create(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, contact);
  }

  update(contact: Contact): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${contact.id}`, contact);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.apiBaseUrl + '/categories');
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(environment.apiBaseUrl + `/categories/${id}`);
  }

  // Metody dla subkategorii
  getAllSubcategories(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(environment.apiBaseUrl + '/subcategories');
  }

  getSubcategory(id: number): Observable<Subcategory> {
    return this.http.get<Subcategory>(environment.apiBaseUrl + `/subcategories/${id}`);
  }

  getSubcategoriesByCategory(categoryId: number): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(environment.apiBaseUrl + `/subcategories/category/${categoryId}`);
  }
}
