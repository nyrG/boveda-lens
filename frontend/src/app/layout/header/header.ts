import { Component, inject } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { HeaderStateService } from '../../services/header-state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  layoutService = inject(LayoutService);
  headerState = inject(HeaderStateService);
}