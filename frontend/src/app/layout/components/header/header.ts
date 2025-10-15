import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../layout/services/layout.service';
import { HeaderStateService } from '../../../layout/services/header-state.service';
import { RouterLink } from '@angular/router';
import { RecordStateService } from '../../../shared/services/record-state.service';

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
  recordState = inject(RecordStateService);

  // Expose global functions to the template
  readonly Number = Number;
  readonly isNaN = isNaN;
}