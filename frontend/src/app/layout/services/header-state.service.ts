import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface Breadcrumb {
  text: string;
  link?: string | string[];
}

export interface BackButtonState {
  visible: boolean;
  link?: string | string[];
  text?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderStateService {
  private refreshSubject = new Subject<void>();
  readonly refresh$ = this.refreshSubject.asObservable();

  readonly breadcrumbs = signal<Breadcrumb[]>([{ text: 'Dashboard' }]);
  readonly showFilterButton = signal(false);
  readonly showRefreshButton = signal(false);
  readonly backButtonState = signal<BackButtonState>({ visible: false });

  setTitle(newTitle: string): void {
    this.breadcrumbs.set([{ text: newTitle }]);
  }

  setShowFilterButton(visible: boolean): void {
    this.showFilterButton.set(visible);
  }

  setShowRefreshButton(visible: boolean): void {
    this.showRefreshButton.set(visible);
  }

  setBackButton(visible: boolean, link?: string | string[], text?: string): void {
    this.backButtonState.set({ visible, link, text });
  }

  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbs.set(breadcrumbs);
  }

  triggerRefresh(): void {
    this.refreshSubject.next();
  }
}
