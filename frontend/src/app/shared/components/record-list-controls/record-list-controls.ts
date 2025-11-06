import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordStateService } from '../../services/record-state.service';

@Component({
  selector: 'app-record-list-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-list-controls.html',
  styleUrl: './record-list-controls.css'
})
export class RecordListControls {
  recordState = inject(RecordStateService);

  // Map of sort values to their display text
  readonly sortOptions = new Map([
    ['name', 'Patient Name'],
    ['patient_record_number', 'Record #'],
    ['diagnoses', 'Diagnoses'],
    ['created_at', 'Date Created'],
    ['updated_at', 'Last Modified'],
    ['category', 'Category'],
  ]);

  onSortByChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.recordState.setSort(select.value);
  }

  onFilterCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.recordState.setFilterCategory(select.value);
  }
}
