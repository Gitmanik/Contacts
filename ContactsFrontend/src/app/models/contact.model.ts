export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;

  categoryId: number;
  categoryName?: string;

  subcategoryId?: number;
  subcategoryName?: string;
  otherSubcategory?: string;

  phone: string;
  birthDate: string;
}
