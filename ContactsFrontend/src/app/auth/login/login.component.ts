import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isRegister = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    const controlsConfig: { [key: string]: any } = {
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    };

    if (this.isRegister) {
      Object.assign(controlsConfig, {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      });
    }

    this.form = this.fb.group(
      controlsConfig,
      this.isRegister ? { validators: this.passwordMatchValidator } : {}
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    const pwd = form.get('password')!.value;
    const cpw = form.get('confirmPassword')!.value;
    return pwd === cpw ? null : { mismatch: true };
  }

  toggleMode(): void {
    this.isRegister = !this.isRegister;
    this.buildForm();
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
