import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';

import { RegisterDto } from '../../../core/dtos/auth/register.dto';

@Component({
  selector: 'app-register',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(){
    if (this.authService.currentUser()) {
      this.router.navigate(['/lists']);
    }
  }

  registerForm = new FormGroup({
    username: new FormControl('',
      Validators.required
    ),
    email: new FormControl('',
      {validators: [
        Validators.required,
        Validators.email
      ]}
    ),
    password: new FormControl('',
      {validators: [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/)
      ]}
    )
  });
  
  get passwordChecks() {
    const val = this.registerForm.get('password')?.value ?? '';
    return {
      all: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
      length: val.length >= 8,
      uppercase: /[A-Z]/.test(val),
      lowercase: /[a-z]/.test(val),
      digit: /\d/.test(val),
      symbol: /[^a-zA-Z\d]/.test(val)
    };
  }

  submit() {
    const registerDto: RegisterDto = {
      username: this.registerForm.value.username!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!

    }
    this.authService.register(registerDto).subscribe({
      next: () => this.router.navigate(['/lists']),
      error: (err) => console.error(err)
    })
  }
}
