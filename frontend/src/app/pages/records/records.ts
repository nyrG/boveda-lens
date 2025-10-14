import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RecordList } from '../../shared/components/data-table/record-list';
import { RecordListActions } from '../../shared/components/record-list-actions/record-list-actions';
import { HeaderStateService } from '../../layout/services/header-state.service';
import { LayoutService } from '../../layout/services/layout.service';

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
    this.headerState.setTitle('Records');
    this.headerState.setShowFilterButton(true);
  }

  ngOnDestroy(): void {
    // When leaving the page, hide the filter button and close the sidebar
    this.headerState.setShowFilterButton(false);
    this.layoutService.closeActionSidebar();
  }
}
