import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationResponse } from './dto/sign-in.response';
import { Observable } from 'rxjs';
import { Result } from '../../../dto/result.generic';
import { environment } from '../../../../../../environments/environment.development';

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
      `${environment.apiUrl}/auth/signIn`,
      {
        email,
        password,
      },
    );
  }
}
