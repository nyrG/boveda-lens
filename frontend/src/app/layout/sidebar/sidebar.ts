import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Footer],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  layoutService = inject(LayoutService);

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