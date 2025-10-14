import { Injectable, signal } from '@angular/core';

export interface Breadcrumb {
  text: string;
  link?: string | string[];
}

@Injectable({
  providedIn: 'root'
})
export class HeaderStateService {
  readonly breadcrumbs = signal<Breadcrumb[]>([{ text: 'Dashboard' }]);
  readonly showFilterButton = signal(false);
  readonly showRefreshButton = signal(false);

  setTitle(newTitle: string): void {
    this.breadcrumbs.set([{ text: newTitle }]);
  }

  setShowFilterButton(visible: boolean): void {
    this.showFilterButton.set(visible);
  }

  setShowRefreshButton(visible: boolean): void {
    this.showRefreshButton.set(visible);
  }

  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbs.set(breadcrumbs);
  }
}
