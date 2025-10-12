import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isSidebarCollapsed = signal(false);

  toggleSidebar() {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
  }

  isActionSidebarVisible = signal(false);

  toggleActionSidebar() {
    this.isActionSidebarVisible.update((visible) => !visible);
  }
}
