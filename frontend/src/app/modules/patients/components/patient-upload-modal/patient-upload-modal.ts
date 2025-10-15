import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientUploadService } from '../../services/patient-upload.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-patient-upload-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-upload-modal.html',
  styleUrl: './patient-upload-modal.css',
})
export class PatientUploadModal {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private patientUploadService = inject(PatientUploadService);
  private toastService = inject(ToastService);

  // --- Component State Signals ---
  selectedFile = signal<File | null>(null);
  fileError = signal<string | null>(null);
  isDragging = signal(false);

  // --- Form for Upload Settings ---
  uploadForm = this.fb.group({
    documentType: ['military', Validators.required],
    // The model is hardcoded for now as per the service logic.
    // This can be expanded to a form control if needed.
  });

  // --- File Handling ---

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }

  handleFile(file: File): void {
    if (file.type !== 'application/pdf') {
      this.fileError.set('Invalid file type. Please select a PDF.');
      this.selectedFile.set(null);
    } else {
      this.fileError.set(null);
      this.selectedFile.set(file);
    }
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.fileError.set(null);
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // --- Main Action ---

  startUpload(): void {
    const file = this.selectedFile();
    if (!file) {
      this.fileError.set('Please select a file to upload.');
      return;
    }

    const settings = { model: 'gemini-2.5-flash-lite', documentType: this.uploadForm.value.documentType! };
    this.patientUploadService.uploadAndProcess(file, settings);
    this.toastService.show({ type: 'info', message: `Upload started for ${file.name}.` });
    this.close.emit();
  }
}
