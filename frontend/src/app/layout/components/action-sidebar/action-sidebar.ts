import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../layout/services/layout.service';
import { RecordListControls } from '../../../shared/components/record-list-controls/record-list-controls';

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
