import { Injectable, signal } from '@angular/core';
import { Toast, ToastState } from '../models/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  /**
   * Displays a new toast message.
   * @param toastData An object containing the toast message, type, and optional duration.
   */
  show(toastData: Omit<Toast, 'id' | 'state'>): void {
    const newToast: Toast = {
      id: crypto.randomUUID(),
      state: 'visible',
      ...toastData,
    };
    this.toasts.update(toasts => [...toasts, newToast]);
    if (newToast.duration !== 0) {
      setTimeout(() => this.remove(newToast.id), newToast.duration || 5000);
    }
  }

  /**
   * Removes a toast message by its unique ID.
   * @param id The ID of the toast to remove.
   */
  remove(id: string): void {
    this.toasts.update(currentToasts =>
      currentToasts.map(t => (t.id === id ? { ...t, state: 'leaving' as ToastState } : t)),
    );

    // Wait for the animation to finish before completely removing it
    setTimeout(() => {
      this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== id));
    }, 300); // This duration should match the CSS animation duration
  }
}