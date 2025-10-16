import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RecordList } from '../../shared/components/record-list/record-list';
import { HeaderStateService } from '../../layout/services/header-state.service';
import { LayoutService } from '../../layout/services/layout.service';
import { StatsCard } from '../../shared/components/stats-card/stats-card';
import { PatientApi } from '../../modules/patients/services/patient-api';
import { RecordStateService } from '../../shared/services/record-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-records',
  imports: [RecordList, StatsCard],
  templateUrl: './records.html',
  styleUrl: './records.css',
})
export class Records implements OnInit, OnDestroy {
  private headerState = inject(HeaderStateService);
  private layoutService = inject(LayoutService);
  private patientApi = inject(PatientApi);
  private recordState = inject(RecordStateService);
  private destroy$ = new Subject<void>();

  isLoadingStats = signal(true);
  totalRecords = signal<number | string>('...');
  averageAge = signal<number | string>('...');
  mostCommonDiagnosis = signal<string>('...');
  topCategory = signal<string>('...');

  private pollingInterval: ReturnType<typeof setInterval> | undefined;

  ngOnInit(): void {
    this.headerState.setTitle('Records');
    this.headerState.setShowFilterButton(true);
    this.headerState.setShowRefreshButton(true);
  }

  constructor() {
    this.fetchStats();
    this.recordState.fetchRecords();

    this.headerState.refresh$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.fetchStats();
      // The record state service already listens to the refresh event,
      // but calling it here ensures a coordinated refresh if needed.
      // this.recordState.fetchRecords({ showNotification: true });
    });

    this.pollingInterval = setInterval(() => {
      this.fetchStats();
      this.recordState.fetchRecords({ preserveSelection: true });
    }, 30000);
  }

  private fetchStats(): void {
    this.isLoadingStats.set(true);
    this.patientApi.getStats().subscribe((stats) => {
      this.totalRecords.set(stats.totalPatients ?? 'None');
      this.averageAge.set(stats.averageAge ?? 'None'); // This now correctly handles a null value from the backend
      // The backend sorts these, so the top item is the first in the array.
      this.mostCommonDiagnosis.set(stats.topDiagnoses[0]?.diagnosis || 'None');
      this.topCategory.set(stats.categories[0]?.category || 'None');

      this.isLoadingStats.set(false);
    });
  }

  ngOnDestroy(): void {
    this.headerState.setShowFilterButton(false);
    this.layoutService.closeActionSidebar();
    this.headerState.setShowRefreshButton(false);
    clearInterval(this.pollingInterval);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
