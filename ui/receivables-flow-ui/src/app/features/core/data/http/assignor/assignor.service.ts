import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponseDto } from '../../../dto/pagination.response';
import { Result } from '../../../dto/result.generic';
import { AssignorResponse } from './dto/assignors.response';
import { CreateAssignorRequest } from './dto/create-assignor.request';
import { StoreService } from '../../../store/store.service';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AssignorService {
  constructor(
    private http: HttpClient,
    private storeService: StoreService,
  ) {}

  private getAuthorizationHeaders(): HttpHeaders {
    const store = this.storeService.getStore();
    return new HttpHeaders({
      Authorization: `Bearer ${store.token}`,
    });
  }

  getAssignors(
    page: number,
    pageSize: number,
    filter: string = '',
  ): Observable<Result<PaginatedResponseDto<AssignorResponse>>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };
    let url = `${environment.apiUrl}/integrations/assignor?page=${page - 1}&pageSize=${pageSize}`;

    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }

    console.log(`Requesting: ${url}`);

    return this.http.get<Result<PaginatedResponseDto<AssignorResponse>>>(
      url,
      options,
    );
  }

  getAssignorById(id: string): Observable<Result<AssignorResponse>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };

    return this.http.get<Result<AssignorResponse>>(
      `${environment.apiUrl}/integrations/assignor/${id}`,
      options,
    );
  }

  createAssignor(
    assignor: CreateAssignorRequest,
  ): Observable<Result<AssignorResponse>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };

    return this.http.post<Result<AssignorResponse>>(
      `${environment.apiUrl}/integrations/assignor`,
      assignor,
      options,
    );
  }

  updateAssignor(
    id: string,
    assignor: CreateAssignorRequest,
  ): Observable<Result<AssignorResponse>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };

    return this.http.put<Result<AssignorResponse>>(
      `${environment.apiUrl}/integrations/assignor/${id}`,
      assignor,
      options,
    );
  }

  deleteAssignor(id: string): Observable<Result<AssignorResponse>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };

    return this.http.delete<Result<AssignorResponse>>(
      `${environment.apiUrl}/integrations/assignor/${id}`,
      options,
    );
  }
}
