import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../../modules/patients/models/patient';
import { RecordStateService } from '../../services/record-state.service';
import { PatientUploadModal } from '../../../modules/patients/components/patient-upload-modal/patient-upload-modal';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PatientUploadModal],
  templateUrl: './record-list.html',
  styleUrls: ['./record-list.css']
})
export class RecordList {
  // The component now injects the state service as its single source of truth.
  // All state properties are read-only signals from the service.
  recordState = inject(RecordStateService);

  // --- Component-Specific State ---
  isUploadModalOpen = signal(false);

  // --- Computed Signals for UI State ---
  isSelectAllChecked = computed(() => {
    // This must be a computed signal to react to changes in the state service
    return this.recordState.isAllSelectedOnPage();
  });

  isAnyButNotAllSelected = computed(() => {
    const selectedCount = this.recordState.selectedRecordIds().size;
    const recordsCount = this.recordState.records().length;
    return selectedCount > 0 && selectedCount < recordsCount;
  });

  // --- Event Handlers ---
  onPageChange(page: number): void {
    if (page > 0 && page <= this.recordState.totalPages()) {
      this.recordState.changePage(page);
    }
  }

  onRowsPerPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.recordState.changeRowsPerPage(parseInt(selectElement.value, 10));
  }

  onSelectAll(): void {
    this.recordState.toggleSelectAll();
  }

  onSelectRow(id: number, event: MouseEvent): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    const isShiftPressed = event.shiftKey;
    this.recordState.toggleSelectRow(id, isChecked, isShiftPressed);
  }

  getFinalDiagnosis(record: Patient): string {
    if (Array.isArray(record.summary?.final_diagnosis)) {
      return record.summary.final_diagnosis.join(', ');
    }
    return record.summary?.final_diagnosis || 'N/A';
  }

  getPaginationSummary(): string {
    const start = this.recordState.totalRecords() > 0 ? (this.recordState.currentPage() - 1) * this.recordState.rowsPerPage() + 1 : 0;
    const end = Math.min(this.recordState.currentPage() * this.recordState.rowsPerPage(), this.recordState.totalRecords());
    return `${start}-${end} of ${this.recordState.totalRecords()}`;
  }

  onCreateFromPdf(): void {
    this.isUploadModalOpen.set(true);
  }

  closeUploadModal(): void {
    this.isUploadModalOpen.set(false);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.recordState.totalPages() }, (_, i) => i + 1);
  }
}