import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { Toast as ToastModel } from '../../models/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast { // Renamed from ToastComponent to match usage in app.ts
  toastService = inject(ToastService);

  /**
   * Executes the action associated with a toast and then removes it.
   * @param toast The toast object containing the action.
   */
  executeAction(toast: ToastModel): void {
    // Execute the provided onClick function
    toast.action?.onClick();
    // Remove the toast after the action is performed
    this.toastService.remove(toast.id);
  }
}