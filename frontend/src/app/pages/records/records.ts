import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RecordList } from '../../shared/components/record-list/record-list';
import { HeaderStateService } from '../../layout/services/header-state.service';
import { LayoutService } from '../../layout/services/layout.service';
import { StatsCard } from '../../shared/components/stats-card/stats-card';
import { PatientApi } from '../../modules/patients/services/patient-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  private destroy$ = new Subject<void>();

  isLoadingStats = signal(true);
  totalRecords = signal<number | string>('...');
  averageAge = signal<number | string>('...');
  mostCommonDiagnosis = signal<string>('...');
  topCategory = signal<string>('...');

  ngOnInit(): void {
    this.headerState.setTitle('Records');
    this.headerState.setShowFilterButton(true);
    this.headerState.setShowRefreshButton(true);
  }

  constructor() {
    this.fetchStats();

    this.headerState.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetchStats());
  }

  private fetchStats(): void {
    this.isLoadingStats.set(true);
    this.patientApi.getStats().subscribe((stats) => {
      this.totalRecords.set(stats.totalPatients);
      this.averageAge.set(stats.averageAge);
      // The backend sorts these, so the top item is the first in the array.
      this.mostCommonDiagnosis.set(stats.topDiagnoses[0]?.diagnosis || 'N/A');
      this.topCategory.set(stats.categories[0]?.category || 'N/A');

      this.isLoadingStats.set(false);
    });
  }

  ngOnDestroy(): void {
    this.headerState.setShowFilterButton(false);
    this.layoutService.closeActionSidebar();
    this.headerState.setShowRefreshButton(false);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
