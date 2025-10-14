import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/components/header/header';
import { Sidebar } from './layout/components/sidebar/sidebar';
import { ActionSidebar } from './layout/components/action-sidebar/action-sidebar';
import { AuthService } from './core/services/auth.service';
import { LayoutService } from './layout/services/layout.service';
import { Toast } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, ActionSidebar, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private authService = inject(AuthService);
  layoutService = inject(LayoutService);

  // Expose the isLoggedIn computed signal to the template
  isLoggedIn = this.authService.isLoggedIn;
}
