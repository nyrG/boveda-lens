import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Record } from '../models/record';
import { PaginatedResponse } from '../models/api';

@Injectable({
  providedIn: 'root'
})
export class RecordApi {
  private http = inject(HttpClient);
  private apiUrl = '/api/patients';

  getRecords(page: number, limit: number, search?: string): Observable<PaginatedResponse<Record>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse<Record>>(this.apiUrl, { params });
  }

  deleteRecords(ids: number[]): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: { ids } });
  }
}
