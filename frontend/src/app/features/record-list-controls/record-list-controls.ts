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
export class RecordListControls implements OnInit {
  recordState = inject(RecordStateService);

  // Map of sort values to their display text
  readonly sortOptions = new Map([
    ['name', 'Patient Name'],
    ['patient_info.patient_record_number', 'Record #'],
    ['patient_info.date_of_birth', 'Date of Birth'],
    ['created_at', 'Date Created'],
    ['updated_at', 'Last Modified'],
  ]);

  ngOnInit(): void {
    this.recordState.fetchCategories();
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.recordState.setSearchTerm(input.value);
  }

  onSortByChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.recordState.setSort(select.value);
  }

  onFilterCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.recordState.setFilterCategory(select.value);
  }
}
