import { Component, OnInit, inject } from '@angular/core';
import { HeaderStateService } from '../../services/header-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private headerState = inject(HeaderStateService);

  ngOnInit(): void {
    this.headerState.setTitle('Dashboard');
    this.headerState.setShowFilterButton(false);
  }
}
