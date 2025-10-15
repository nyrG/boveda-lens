import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  /**
   * Displays a new toast message.
   * @param toastData An object containing the toast message, type, and optional duration.
   */
  show(toastData: Omit<Toast, 'id'>): void {
    const newToast: Toast = {
      id: crypto.randomUUID(),
      ...toastData,
    };
    this.toasts.update(toasts => [...toasts, newToast]);
    setTimeout(() => this.remove(newToast.id), newToast.duration || 5000);
  }

  /**
   * Removes a toast message by its unique ID.
   * @param id The ID of the toast to remove.
   */
  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}