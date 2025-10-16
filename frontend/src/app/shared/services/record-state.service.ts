import { Injectable, computed, inject, signal } from '@angular/core';
import { Patient } from '../../modules/patients/models/patient';
import { PatientApi } from '../../modules/patients/services/patient-api';
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs';
import { ToastService } from './toast.service';
import { DialogService } from './dialog.service';
import { HeaderStateService } from '../../layout/services/header-state.service';

@Injectable({
  providedIn: 'root'
})
export class RecordStateService {
  private recordApi = inject(PatientApi);
  private dialogService = inject(DialogService);
  private toastService = inject(ToastService);
  private headerState = inject(HeaderStateService);
  private destroy$ = new Subject<void>(); // For cleaning up subscriptions

  // --- Search ---
  private searchSubject = new Subject<string>();

  // --- State Signals ---
  readonly records = signal<Patient[]>([]);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly rowsPerPage = signal(10);
  readonly selectedRecordIds = signal<Set<number>>(new Set());
  readonly isLoading = signal(false);
  readonly lastSelectedRecordId = signal<number | null>(null);
  readonly searchTerm = signal(''); // Keep for basic search

  readonly sortBy = signal('created_at');
  readonly sortOrder = signal<'ASC' | 'DESC'>('DESC');
  readonly filterCategory = signal('');
  readonly categories = signal<string[]>([]);

  // --- Computed Signals ---
  readonly totalPages = computed(() => Math.ceil(this.totalRecords() / this.rowsPerPage()));
  readonly isAnythingSelected = computed(() => this.selectedRecordIds().size > 0);
  readonly isAllSelectedOnPage = computed(() => {
    const recordsOnPage = this.records();
    if (recordsOnPage.length === 0) return false;
    const selectedIds = this.selectedRecordIds();
    return recordsOnPage.every(r => selectedIds.has(r.id));
  });

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.searchTerm.set(search);
      this.fetchRecords();
    });

    this.headerState.refresh$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.fetchRecords({ showNotification: true });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Data Fetching ---
  fetchRecords(options: { preserveSelection?: boolean; showNotification?: boolean } = {}): void {
    this.isLoading.set(true);
    this.recordApi.getPatients(
      this.currentPage(),
      this.rowsPerPage(),
      this.searchTerm(),
      this.sortBy(),
      this.sortOrder()
    )
      .subscribe(response => {
        this.isLoading.set(false);
        this.records.set(response.data);
        this.totalRecords.set(response.total);
        if (!options.preserveSelection) {
          // As per the old implementation, clear selection on data refresh
          this.selectedRecordIds.set(new Set());
        }
        if (options.showNotification) {
          this.toastService.show({ message: 'Record list refreshed.', type: 'info' });
        }
      });
  }

  fetchRecordById(id: number) {
    return this.recordApi.getPatient(id).pipe(
      // In a real app, you might want to set a `selectedRecord` signal here
    );
  }

  fetchCategories(): void {
    this.recordApi.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });
  }

  // --- State Updaters ---
  changePage(page: number): void {
    this.currentPage.set(page);
    this.fetchRecords({ preserveSelection: true });
  }

  changeRowsPerPage(rows: number): void {
    this.rowsPerPage.set(rows);
    this.currentPage.set(1); // Reset to first page
    this.fetchRecords({ preserveSelection: true });
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
    // In a real implementation, you would likely pass this to fetchRecords
    // For now, we'll just log it or you can add it to the API call
    console.log('Filtering by category:', category);
    // Example of what it would look like:
    // this.currentPage.set(1);
    // this.fetchRecords();
  }

  deleteSelectedRecords(): void {
    const idsToDelete = Array.from(this.selectedRecordIds());
    if (idsToDelete.length === 0) {
      return;
    }

    const dialogConfig = {
      title: `Delete ${idsToDelete.length} Record(s)`,
      message: `Are you sure you want to delete ${idsToDelete.length} selected record(s)? This action cannot be undone.`,
      confirmText: 'Delete',
    };

    this.dialogService.open(dialogConfig).subscribe(confirmed => {
      if (confirmed) {
        this.recordApi.deletePatients(idsToDelete).subscribe(() => {
          this.toastService.show({
            message: `${idsToDelete.length} record(s) deleted successfully.`,
            type: 'success',
          });
          // Check if the current page would be empty after deletion
          const newTotal = this.totalRecords() - idsToDelete.length;
          const newTotalPages = Math.ceil(newTotal / this.rowsPerPage());
          if (this.currentPage() > newTotalPages && newTotalPages > 0) {
            this.currentPage.set(newTotalPages);
          }
          this.fetchRecords(); // Refresh the list after deletion
        });
      }
    });
  }

  deleteRecordById(id: number): Observable<void> {
    return this.recordApi.deletePatient(id).pipe(
      tap(() => {
        this.toastService.show({ message: 'Record deleted successfully.', type: 'success' });
      })
    );
  }

  updateRecord(id: number, data: Partial<Patient>): Observable<Patient> {
    return this.recordApi.updatePatient(id, data);
  }

  /**
   * Toggles the selection of all records on the current page.
   * If any records are selected, it deselects all.
   * If no records are selected, it selects all.
   */
  toggleSelectAll(): void {
    const shouldSelectAll = this.selectedRecordIds().size === 0;
    const recordsOnPage = this.records();

    if (shouldSelectAll) {
      this.selectedRecordIds.set(new Set(recordsOnPage.map(r => r.id)));
    } else {
      this.selectedRecordIds.set(new Set());
    }
  }

  toggleSelectRow(id: number, isChecked: boolean, isShiftPressed: boolean): void {
    const lastId = this.lastSelectedRecordId();
    const records = this.records();

    if (isShiftPressed && lastId !== null && records.length > 0) {
      this.selectedRecordIds.update(currentSet => {
        const newSet = new Set(currentSet);
        const lastIndex = records.findIndex(r => r.id === lastId);
        const currentIndex = records.findIndex(r => r.id === id);

        if (lastIndex !== -1 && currentIndex !== -1) {
          const start = Math.min(lastIndex, currentIndex);
          const end = Math.max(lastIndex, currentIndex);

          for (let i = start; i <= end; i++) {
            if (isChecked) {
              newSet.add(records[i].id);
            } else {
              // When unchecking with shift, unselect the entire range.
              newSet.delete(records[i].id);
            }
          }
        }
        return newSet;
      });
    } else {
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

    // Update last selected ID only on a normal click
    if (!isShiftPressed) {
      this.lastSelectedRecordId.set(isChecked ? id : null);
    }
  }
}
