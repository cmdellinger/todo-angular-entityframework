import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { User } from '../models/user.model';

import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api';
  authUrl = this.apiUrl + '/auth';
  currentUser = signal<User | null>(null);

  register(registerDto: RegisterDto): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register`, registerDto).pipe(
      tap( user => {
        this.currentUser.set(user);
        localStorage.setItem('token', user.token);
      } )
    );
  }

  login(loginDto: LoginDto): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/login`, loginDto).pipe(
      tap( user => {
        this.currentUser.set(user);
        localStorage.setItem('token', user.token);
      } )
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/logout`, null).pipe(
      tap( () =>  {
        this.currentUser.set(null);
        localStorage.removeItem('token');
      } )
    );
  }

  loadCurrentUser(): Observable<User | null> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.http.get<User>(`${this.authUrl}/me`).pipe(
        tap(user => this.currentUser.set(user))
      );
    }
    return of(null);
  }
}