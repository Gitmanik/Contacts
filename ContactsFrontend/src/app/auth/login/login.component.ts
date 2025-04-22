import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  isRegister = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    if (this.isRegister) {
      return this.fb.group({
        firstName: ['', Validators.required],
        lastName:  ['', Validators.required],
        email:     ['', [Validators.required, Validators.email]],
        password:  ['', Validators.required],
        confirmPassword: ['', Validators.required],
      }, { validators: this.passwordMatchValidator });
    }
    return this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const pwd = form.get('password')?.value;
    const cpw = form.get('confirmPassword')?.value;
    return pwd === cpw ? null : { mismatch: true };
  }

  // Przełącznik trybu
  toggleMode(): void {
    this.isRegister = !this.isRegister;
    this.form = this.createForm();
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value;
    if (this.isRegister) {
      // wywołanie endpointa rejestracji
      this.auth.register(payload).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.auth.login(payload).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
