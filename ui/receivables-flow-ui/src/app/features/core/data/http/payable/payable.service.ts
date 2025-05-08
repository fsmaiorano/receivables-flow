import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponseDto } from '../../../dto/pagination.response';
import { Result } from '../../../dto/result.generic';
import { PayableResponse } from './dto/payable.response';
import { CreatePayableRequest } from './dto/create-payable.request';
import { StoreService } from '../../../store/store.service';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PayableService {
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

  getPayables(
    page: number,
    pageSize: number,
    filter: string = '',
  ): Observable<Result<PaginatedResponseDto<PayableResponse>>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };
    let url = `${environment.apiUrl}/integrations/payable?page=${page - 1}&pageSize=${pageSize}`;

    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }

    console.log(`Requesting payables: ${url}`);

    return this.http.get<Result<PaginatedResponseDto<PayableResponse>>>(
      url,
      options,
    );
  }

  getPayableById(id: string): Observable<Result<PayableResponse>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };

    return this.http.get<Result<PayableResponse>>(
      `${environment.apiUrl}/integrations/payable/${id}`,
      options,
    );
  }

  createPayable(
    payable: CreatePayableRequest,
  ): Observable<Result<PayableResponse>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };

    return this.http.post<Result<PayableResponse>>(
      `${environment.apiUrl}/integrations/payable`,
      payable,
      options,
    );
  }

  updatePayable(
    id: string,
    payable: CreatePayableRequest,
  ): Observable<Result<PayableResponse>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };

    return this.http.put<Result<PayableResponse>>(
      `${environment.apiUrl}/integrations/payable/${id}`,
      payable,
      options,
    );
  }

  deletePayable(id: string): Observable<Result<PayableResponse>> {
    const options = {
      headers: this.getAuthorizationHeaders(),
    };

    return this.http.delete<Result<PayableResponse>>(
      `${environment.apiUrl}/integrations/payable/${id}`,
      options,
    );
  }
}
