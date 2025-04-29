import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationResponse } from './dto/sign-in.response';
import { Observable } from 'rxjs';
import { Result } from '../../../dto/result.generic';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  authentication(
    email: string,
    password: string,
  ): Observable<Result<AuthenticationResponse>> {
    return this.http.post<Result<AuthenticationResponse>>(
      'http://localhost:3333/auth/signIn',
      {
        email,
        password,
      },
    );
  }
}
