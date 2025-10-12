import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Record } from '../../models/record';
import { RecordStateService } from '../../services/record-state.service';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-list.html',
  styleUrls: ['./record-list.css']
})
export class RecordList implements OnInit {
  // The component now injects the state service as its single source of truth.
  // All state properties are read-only signals from the service.
  recordState = inject(RecordStateService);

  // --- Lifecycle Hooks ---
  ngOnInit(): void {
    this.recordState.fetchRecords();
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

  onSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    this.recordState.toggleSelectAll(isChecked);
  }

  onSelectRow(id: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    this.recordState.toggleSelectRow(id, isChecked);
  }

  // --- Helpers ---
  // Check if all records on the current page are selected
  isSelectAllChecked(): boolean {
    const currentRecordIds = this.recordState.records().map(r => r.id);
    return currentRecordIds.length > 0 && currentRecordIds.every(id => this.recordState.selectedRecordIds().has(id));
  }

  getFinalDiagnosis(record: Record): string {
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
}