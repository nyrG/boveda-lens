import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-dialog.html',
  styleUrl: './action-dialog.css',
})
export class ActionDialog {
  dialogService = inject(DialogService);

  // Get the dialog state directly from the service
  state = this.dialogService.dialogState;

  onConfirm(): void {
    this.dialogService.close(true);
  }

  onCancel(): void {
    this.dialogService.close(false);
  }
}
