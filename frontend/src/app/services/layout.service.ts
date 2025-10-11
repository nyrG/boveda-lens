import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isSidebarCollapsed = signal(false);

  toggleSidebar() {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
  }
}
