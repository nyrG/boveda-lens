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

  getRecords(page: number, limit: number, search?: string, sortBy?: string, sortOrder?: string, category?: string): Observable<PaginatedResponse<Record>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }
    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<PaginatedResponse<Record>>(this.apiUrl, { params });
  }

  getStats(): Observable<{ categories: { category: string, count: number }[] }> {
    // A more specific interface could be created for the stats response later
    return this.http.get<{ categories: { category: string, count: number }[] }>(`${this.apiUrl}/stats`);
  }

  deleteRecords(ids: number[]): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: { ids } });
  }
}
