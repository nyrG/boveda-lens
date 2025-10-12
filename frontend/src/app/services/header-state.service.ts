import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderStateService {
  readonly title = signal<string>('Dashboard');
  readonly showFilterButton = signal(false);

  setTitle(newTitle: string): void {
    this.title.set(newTitle);
  }

  setShowFilterButton(visible: boolean): void {
    this.showFilterButton.set(visible);
  }
}
