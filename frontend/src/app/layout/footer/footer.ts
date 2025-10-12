import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
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
}
