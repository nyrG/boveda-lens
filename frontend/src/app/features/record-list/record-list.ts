import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Record } from '../../models/record';
import { RecordApi } from '../../services/record-api';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-list.html',
  // styleUrls: ['./record-list.css'] // Will be created in a future step
})
export class RecordList implements OnInit {
  private recordApi = inject(RecordApi);

  // --- State Signals ---
  records = signal<Record[]>([]);
  totalRecords = signal(0);
  currentPage = signal(1);
  rowsPerPage = signal(10);
  selectedRecordIds = signal<Set<number>>(new Set());

  // --- Computed Signals ---
  totalPages = computed(() => Math.ceil(this.totalRecords() / this.rowsPerPage()));

  // Check if all records on the current page are selected
  selectAll = computed(() => {
    const currentRecordIds = this.records().map(r => r.id);
    return currentRecordIds.length > 0 && currentRecordIds.every(id => this.selectedRecordIds().has(id));
  });

  // --- Lifecycle Hooks ---
  ngOnInit(): void {
    this.fetchRecords();
  }

  // --- Data Fetching ---
  fetchRecords(): void {
    // In a future step, we will get search, sort, and filter criteria from a state service
    this.recordApi.getRecords(this.currentPage(), this.rowsPerPage())
      .subscribe((response: PaginatedResponse<Record>) => {
        this.records.set(response.data);
        this.totalRecords.set(response.total);
        // As per the old implementation, clear selection on data refresh
        this.selectedRecordIds.set(new Set());
      });
  }

  // --- Event Handlers ---
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.fetchRecords();
    }
  }

  onRowsPerPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.rowsPerPage.set(parseInt(selectElement.value, 10));
    this.currentPage.set(1); // Reset to first page
    this.fetchRecords();
  }

  onSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    this.selectedRecordIds.update(currentSet => {
      const newSet = new Set(currentSet);
      for (const record of this.records()) {
        if (isChecked) {
          newSet.add(record.id);
        } else {
          newSet.delete(record.id);
        }
      }
      return newSet;
    });
  }

  onSelectRow(id: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    this.selectedRecordIds.update(currentSet => {
      const newSet = new Set(currentSet);
      if (isChecked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }

  // --- Helpers ---
  getFinalDiagnosis(record: Record): string {
    if (Array.isArray(record.summary?.final_diagnosis)) {
      return record.summary.final_diagnosis.join(', ');
    }
    return record.summary?.final_diagnosis || 'N/A';
  }

  getPaginationSummary(): string {
    const start = this.totalRecords() > 0 ? (this.currentPage() - 1) * this.rowsPerPage() + 1 : 0;
    const end = Math.min(this.currentPage() * this.rowsPerPage(), this.totalRecords());
    return `${start}-${end} of ${this.totalRecords()}`;
  }
}