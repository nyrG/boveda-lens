import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { catchError, of, tap, filter, switchMap } from 'rxjs';

import { PatientApi } from './patient-api';
import { BackgroundTaskService } from '../../../shared/services/background-task.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Patient } from '../models/patient';

/**
 * Defines the settings required for a document upload.
 */
export interface UploadSettings {
  model: string;
  documentType: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientUploadService {
  private patientApi = inject(PatientApi);
  private backgroundTaskService = inject(BackgroundTaskService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  /**
   * Orchestrates the file upload and processing.
   * It registers a background task, uploads the file with progress tracking,
   * and handles success or failure notifications and state updates.
   * @param file The PDF file to upload.
   * @param settings The configuration for the extraction process.
   */
  uploadAndProcess(file: File, settings: UploadSettings): void {
    const taskId = this.backgroundTaskService.addTask(`Processing ${file.name}`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', settings.model);
    formData.append('documentType', settings.documentType);

    this.patientApi
      .uploadPatientDocument(formData)
      .pipe(
        tap(event => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round(100 * (event.loaded / (event.total ?? 1)));
            // Cap progress at 99 until server responds to signify processing.
            this.backgroundTaskService.updateTaskProgress(taskId, Math.min(progress, 99));
          }
        }),
        filter((event): event is HttpResponse<any> => event.type === HttpEventType.Response),
        // Switch from the extraction response to the creation call
        switchMap(response => {
          if (response && response.body) {
            // The body of the upload response is the extracted data, not a full patient record.
            // We now use this data to create the actual patient record.
            return this.patientApi.createPatient(response.body);
          }
          return of(null); // Or handle error if response is empty
        }),
        catchError(error => {
          this.backgroundTaskService.failTask(taskId, error);
          this.toastService.show({ type: 'error', message: 'Failed to process document.' });
          return of(null); // Handle the error gracefully
        }),
      )
      .subscribe(newPatient => {
        if (newPatient) {
          this.backgroundTaskService.completeTask(taskId, newPatient); // Pass the actual patient object
          this.toastService.show({
            type: 'success',
            message: `Record created for ${newPatient.name}.`,
            duration: 10000, // Give user more time to click
            action: {
              label: 'Review',
              onClick: () => this.router.navigate(['/records', newPatient.id]),
            },
          });
        }
      });
  }
}
