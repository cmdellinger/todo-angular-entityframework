import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../../core/services/auth.service';

import { LoginDto } from '../../../core/dtos/auth/login.dto';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(){
    // check if user logged in
    if (this.authService.currentUser()) {
      this.router.navigate(['/lists']);
      return;
    }

    // check if Google OAtuh token in URL
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      localStorage.setItem('token', token);
      this.authService.loadCurrentUser().subscribe(
        () => { this.router.navigate(['/lists']); }
      );
    }
  }

  loginForm = new FormGroup({
    email: new FormControl('',
      {validators: [
        Validators.required
      ]}
    ),
    password: new FormControl('',
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

  googleLogin() {
    window.location.href = 'http://localhost:5000/api/auth/google-login';
  }  
}