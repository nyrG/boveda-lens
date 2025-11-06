import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';
import { PaginatedResponse } from '../../../shared/models/api';
import { PatientStats } from '../models/patient';

export interface PatientQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientApi {
  private http = inject(HttpClient);
  private apiUrl = '/api/patients';

  getPatients(query: PatientQuery): Observable<PaginatedResponse<Patient>> {
    let params = new HttpParams({ fromObject: { ...query } });

    // Clean up params to remove any undefined/null values if necessary
    // Although fromObject handles this fairly well.
    return this.http.get<PaginatedResponse<Patient>>(this.apiUrl, { params });
  }

  getStats(): Observable<PatientStats> {
    return this.http.get<PatientStats>(`${this.apiUrl}/stats`);
  }

  // The `getCategories` method has been removed as there is no corresponding
  // `/api/patients/categories` endpoint on the backend. Category information
  // is available via the `getStats` endpoint or by filtering the `getPatients` list.
  // If a dedicated endpoint for categories is created later, this method can be re-added.

  deletePatients(ids: number[]): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: { ids } });
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updatePatient(id: number, patientData: Partial<Patient>): Observable<Patient> {
    return this.http.patch<Patient>(`${this.apiUrl}/${id}`, patientData);
  }

  uploadPatientDocument(formData: FormData): Observable<HttpEvent<Patient>> {
    // The endpoint for PDF extraction is different from the standard patient API.
    const req = new HttpRequest('POST', '/api/extraction/upload', formData, {
      reportProgress: true,
    });

    return this.http.request<Patient>(req);
  }

  createPatient(patientData: Partial<Patient>): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patientData);
  }
}
