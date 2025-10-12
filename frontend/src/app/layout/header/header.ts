import { Component, inject } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { HeaderStateService } from '../../services/header-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  layoutService = inject(LayoutService);
  headerState = inject(HeaderStateService);
}