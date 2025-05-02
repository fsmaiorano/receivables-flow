import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponseDto } from '../../../dto/pagination.response';
import { Result } from '../../../dto/result.generic';
import { AssignorResponse } from './dto/assignors.response';
import { CreateAssignorRequest } from './dto/create-assignor.request';
import { StoreService } from '../../../store/store.service';

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
  ): Observable<Result<PaginatedResponseDto<AssignorResponse>>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };

    return this.http.get<Result<PaginatedResponseDto<AssignorResponse>>>(
      `http://localhost:3333/integrations/assignor?page=${page}&pageSize=${pageSize}`,
      options,
    );
  }

  getAssignorById(id: string): Observable<Result<AssignorResponse>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };

    return this.http.get<Result<AssignorResponse>>(
      `http://localhost:3333/integrations/assignor/${id}`,
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
      `http://localhost:3333/integrations/assignor`,
      assignor,
      options,
    );
  }
}
