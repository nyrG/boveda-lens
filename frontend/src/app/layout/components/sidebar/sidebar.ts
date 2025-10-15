import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { LayoutService } from '../../../layout/services/layout.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private eRef = inject(ElementRef);

  isProfileMenuOpen = signal(false);

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen.set(false);
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen.set(!this.isProfileMenuOpen());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navItems = [
    {
      link: '/dashboard',
      icon: 'fa-table-columns',
      text: 'Dashboard',
      exact: true,
    },
    {
      link: '/records',
      icon: 'fa-folder-open',
      text: 'Records',
    },
  ];
}