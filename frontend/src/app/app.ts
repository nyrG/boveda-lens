import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';
import { ActionSidebar } from './layout/action-sidebar/action-sidebar';
import { AuthService } from './services/auth.service';
import { LayoutService } from './services/layout.service';
import { Toast } from './features/toast/toast';

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
