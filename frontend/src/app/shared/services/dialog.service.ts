import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmClass?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogSubject = new Subject<boolean>();

  // Signal to hold the state and configuration of the dialog
  dialogState = signal<{ isOpen: boolean; config: DialogConfig | null }>({
    isOpen: false,
    config: null,
  });

  // Opens the dialog and returns an Observable that emits the user's choice
  open(config: DialogConfig): Observable<boolean> {
    this.dialogState.set({ isOpen: true, config });
    this.dialogSubject = new Subject<boolean>(); // Create a new subject for this instance
    return this.dialogSubject.asObservable();
  }

  // Closes the dialog and sends the result to the observer
  close(result: boolean): void {
    this.dialogState.update(state => ({ ...state, isOpen: false }));
    this.dialogSubject.next(result);
    this.dialogSubject.complete();
  }
}
