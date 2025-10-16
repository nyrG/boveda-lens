import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientUploadService } from '../../services/patient-upload.service';
import { ToastService } from '../../../../shared/services/toast.service';
// We are importing this directly. In a real-world scenario, this would likely
// come from a shared library or an API call to the backend.
import { categoryTypes } from '../../../../../../../backend/src/extraction/extraction.constants';
@Component({
  selector: 'app-patient-upload-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-upload-modal.html',
  styleUrl: './patient-upload-modal.css',
})
export class PatientUploadModal {
  @Output() close = new EventEmitter<void>();

  private patientUploadService = inject(PatientUploadService);
  private toastService = inject(ToastService);

  // --- Component State Signals ---
  selectedFile = signal<File | null>(null);
  determinedDocumentType = signal<'military' | 'dependent' | 'general'>('general');
  fileError = signal<string | null>(null);
  isDragging = signal(false);

  private categoryTypes = categoryTypes;

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
      this.determineDocumentType(file.name);
    }
  }

  private determineDocumentType(fileName: string): void {
    const upperCaseFileName = fileName.toUpperCase();

    // Check for military categories first
    for (const category of this.categoryTypes.military) {
      if (upperCaseFileName.includes(category.toUpperCase())) {
        this.determinedDocumentType.set('military');
        return;
      }
    }

    // Then check for dependent categories
    for (const category of this.categoryTypes.dependent) {
      if (upperCaseFileName.includes(category.toUpperCase())) {
        this.determinedDocumentType.set('dependent');
        return;
      }
    }

    this.determinedDocumentType.set('general');
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

    const settings = {
      model: 'gemini-2.5-flash',
      documentType: this.determinedDocumentType(),
    };
    this.patientUploadService.uploadAndProcess(file, settings);
    this.toastService.show({ type: 'info', message: `Upload started for ${file.name}.` });
    this.close.emit();
  }
}
