import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RecordList } from '../../features/record-list/record-list';
import { RecordListActions } from '../../features/record-list-actions/record-list-actions';
import { HeaderStateService } from '../../services/header-state.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-records',
  imports: [RecordList, RecordListActions],
  templateUrl: './records.html',
  styleUrl: './records.css'
})
export class Records implements OnInit, OnDestroy {
  private headerState = inject(HeaderStateService);
  private layoutService = inject(LayoutService);

  ngOnInit(): void {
    this.headerState.setTitle('Patient Records');
    this.headerState.setShowFilterButton(true);
  }

  ngOnDestroy(): void {
    // When leaving the page, hide the filter button and close the sidebar
    this.headerState.setShowFilterButton(false);
    this.layoutService.closeActionSidebar();
  }
}
