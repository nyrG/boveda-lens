import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecordStateService } from '../../services/record-state.service';

@Component({
  selector: 'app-record-list-actions',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './record-list-actions.html',
  styleUrl: './record-list-actions.css',
})
export class RecordListActions {
  recordState = inject(RecordStateService);
}
