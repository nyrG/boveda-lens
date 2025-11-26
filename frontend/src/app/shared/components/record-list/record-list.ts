import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../../modules/patients/models/patient';
import { RecordStateService } from '../../services/record-state.service';
import { PatientUploadModal } from '../../../modules/patients/components/patient-upload-modal/patient-upload-modal';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [RouterLink, FormsModule, PatientUploadModal],
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

  /**
   * Safely retrieves and formats the diagnoses from a patient record.
   * @param record The patient record.
   * @returns A comma-separated string of diagnoses, or 'N/A' if none are found.
   */
  getDiagnoses(record: Patient): string {
    const diagnoses = record.summary?.diagnoses;

    if (Array.isArray(diagnoses) && diagnoses.length > 0) {
      return diagnoses.join(', ');
    }
    return 'N/A';
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

  /**
   * Generates a list of page numbers for pagination controls.
   * For large numbers of pages, it creates a truncated list with ellipses.
   * e.g., [1, 2, '...', 10, 11, 12, '...', 99, 100]
   * @returns An array of numbers or '...' strings.
   */
  getPageNumbers(): (number | string)[] {
    const totalPages = this.recordState.totalPages();
    const currentPage = this.recordState.currentPage();
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 7) {
      // If 7 or fewer pages, show all of them
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show the first page
    pageNumbers.push(1);

    // Determine the range of pages to show around the current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Show '...' if there's a gap after the first page
    if (startPage > 2) {
      pageNumbers.push('...');
    }

    // Add the pages in the determined range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Show '...' if there's a gap before the last page
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always show the last page
    pageNumbers.push(totalPages);

    return pageNumbers;
  }
}