import { Component, inject } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { RecordListControls } from '../../features/record-list-controls/record-list-controls';

@Component({
  selector: 'app-action-sidebar',
  standalone: true,
  imports: [RecordListControls],
  templateUrl: './action-sidebar.html',
  styleUrl: './action-sidebar.css'
})
export class ActionSidebar {
  layoutService = inject(LayoutService);
}
