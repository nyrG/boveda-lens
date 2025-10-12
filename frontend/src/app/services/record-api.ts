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

  getRecords(page: number, limit: number, search?: string, sortBy?: string, sortOrder?: string, category?: string): Observable<PaginatedResponse<Record>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // In a future step, we will add search, sort, and filter parameters here.

    return this.http.get<PaginatedResponse<Record>>('/api/patients', { params });
  }
}
