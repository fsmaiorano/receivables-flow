import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationResponse } from './dto/sign-in.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  authentication(
    email: string,
    password: string,
  ): Observable<AuthenticationResponse> {
    debugger;
    return this.http.post<AuthenticationResponse>(
      'http://localhost:3333/auth/signIn',
      {
        email,
        password,
      },
    );
  }
}
