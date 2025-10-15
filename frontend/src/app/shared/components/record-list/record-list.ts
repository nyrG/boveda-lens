import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../../modules/patients/models/patient';
import { RecordStateService } from '../../services/record-state.service';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './record-list.html',
  styleUrls: ['./record-list.css']
})
export class RecordList implements OnInit, OnDestroy {
  // The component now injects the state service as its single source of truth.
  // All state properties are read-only signals from the service.
  recordState = inject(RecordStateService);

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

  private pollingInterval: ReturnType<typeof setInterval> | undefined;

  // --- Lifecycle Hooks ---
  ngOnInit(): void {
    this.recordState.fetchRecords();

    // Poll for new data every 30 seconds.
    // The `preserveSelection` option ensures that the user's current checkbox
    // selections are not cleared on each background refresh.
    this.pollingInterval = setInterval(() => {
      this.recordState.fetchRecords({ preserveSelection: true });
    }, 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.pollingInterval);
  }

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
    console.log('Create from PDF clicked. Modal should open here.');
  }
}