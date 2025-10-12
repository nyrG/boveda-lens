import { Injectable, computed, inject, signal } from '@angular/core';
import { Record } from '../models/record';
import { RecordApi } from './record-api';

@Injectable({
  providedIn: 'root'
})
export class RecordStateService {
  private recordApi = inject(RecordApi);

  // --- State Signals ---
  readonly records = signal<Record[]>([]);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly rowsPerPage = signal(10);
  readonly selectedRecordIds = signal<Set<number>>(new Set());

  // --- Computed Signals ---
  readonly totalPages = computed(() => Math.ceil(this.totalRecords() / this.rowsPerPage()));

  // --- Data Fetching ---
  fetchRecords(): void {
    // In a future step, we will get search, sort, and filter criteria from this service
    this.recordApi.getRecords(this.currentPage(), this.rowsPerPage())
      .subscribe(response => {
        this.records.set(response.data);
        this.totalRecords.set(response.total);
        // As per the old implementation, clear selection on data refresh
        this.selectedRecordIds.set(new Set());
      });
  }

  // --- State Updaters ---
  changePage(page: number): void {
    this.currentPage.set(page);
    this.fetchRecords();
  }

  changeRowsPerPage(rows: number): void {
    this.rowsPerPage.set(rows);
    this.currentPage.set(1); // Reset to first page
    this.fetchRecords();
  }

  toggleSelectAll(isChecked: boolean): void {
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

  toggleSelectRow(id: number, isChecked: boolean): void {
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
}
