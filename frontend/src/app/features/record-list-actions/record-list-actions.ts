import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordStateService } from '../../services/record-state.service';

@Component({
  selector: 'app-record-list-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-list-actions.html',
  styleUrl: './record-list-actions.css',
})
export class RecordListActions {
  recordState = inject(RecordStateService);

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.recordState.setSearchTerm(input.value);
  }
}
