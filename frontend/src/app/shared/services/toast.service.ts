import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(toast: Toast): void {
    this.toasts.update(toasts => [...toasts, toast]);
    setTimeout(() => this.remove(toast), toast.duration || 3000);
  }

  remove(toast: Toast): void {
    this.toasts.update(toasts => toasts.filter(t => t !== toast));
  }
}