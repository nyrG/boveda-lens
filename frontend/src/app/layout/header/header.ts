import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);
  private eRef = inject(ElementRef);
  layoutService = inject(LayoutService);

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
}