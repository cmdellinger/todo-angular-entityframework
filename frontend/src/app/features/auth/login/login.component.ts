import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { LoginDto } from '../../../core/dtos/auth/login.dto';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(){
    if (this.authService.currentUser()) {
      this.router.navigate(['/lists']);
    }
  }

  loginForm = new FormGroup({
    email: new FormControl('your@email.com',
      {validators: [
        Validators.required
      ]}
    ),
    password: new FormControl('password',
      {validators: [
        Validators.required
      ]}
    )
  });

  submit() {
    const loginDto: LoginDto = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    }
    this.authService.login(loginDto).subscribe({
      next: () => this.router.navigate(['/lists']),
      error: (err) => console.error(err)
    })
  }
}
