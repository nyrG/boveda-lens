import { Injectable, computed, inject, signal } from '@angular/core';
import { Record } from '../models/record';
import { RecordApi } from './record-api';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordStateService {
  private recordApi = inject(RecordApi);

  // --- Search ---
  private searchSubject = new Subject<string>();

  // --- State Signals ---
  readonly records = signal<Record[]>([]);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly rowsPerPage = signal(10);
  readonly selectedRecordIds = signal<Set<number>>(new Set());
  readonly searchTerm = signal('');
  readonly sortBy = signal('updated_at');
  readonly sortOrder = signal<'ASC' | 'DESC'>('DESC');
  readonly filterCategory = signal('');
  readonly categories = signal<string[]>([]);

  // --- Computed Signals ---
  readonly totalPages = computed(() => Math.ceil(this.totalRecords() / this.rowsPerPage()));
  readonly isAnythingSelected = computed(() => this.selectedRecordIds().size > 0);

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.searchTerm.set(search);
      this.fetchRecords();
    });
  }

  // --- Data Fetching ---
  fetchRecords(): void {
    this.recordApi.getRecords(this.currentPage(), this.rowsPerPage(), this.searchTerm())
      .subscribe(response => {
        this.records.set(response.data);
        this.totalRecords.set(response.total);
        // As per the old implementation, clear selection on data refresh
        this.selectedRecordIds.set(new Set());
      });
  }

  fetchCategories(): void {
    this.recordApi.getStats().subscribe(stats => {
      this.categories.set(stats.categories.map(c => c.category).filter(Boolean) as string[]);
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

  setSearchTerm(term: string): void {
    this.searchSubject.next(term);
  }

  setSort(sortBy: string): void {
    this.sortBy.set(sortBy);
    this.fetchRecords();
  }

  toggleSortOrder(): void {
    this.sortOrder.update(current => (current === 'ASC' ? 'DESC' : 'ASC'));
    this.fetchRecords();
  }

  setFilterCategory(category: string): void {
    this.filterCategory.set(category);
    this.currentPage.set(1);
    this.fetchRecords();
  }

  deleteSelectedRecords(): void {
    // In a future step, this will call the API to delete records
    console.log('Deleting records:', this.selectedRecordIds());
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
