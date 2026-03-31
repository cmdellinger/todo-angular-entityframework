import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RegisterDto } from '../../../core/dtos/auth/register.dto';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
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
    username: new FormControl('username',
      Validators.required
    ),
    email: new FormControl('your@email.com',
      {validators: [
        Validators.required,
        Validators.email
      ]}
    ),
    password: new FormControl('password',
      {validators: [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/)
      ]}
    )
  });
  
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
