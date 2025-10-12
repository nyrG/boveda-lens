import { Component } from '@angular/core';
import { RecordList } from '../../features/record-list/record-list';
import { RecordListActions } from '../../features/record-list-actions/record-list-actions';

@Component({
  selector: 'app-records',
  imports: [RecordList, RecordListActions],
  templateUrl: './records.html',
  styleUrl: './records.css'
})
export class Records {

}
