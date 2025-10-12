import { Component } from '@angular/core';
import { RecordList } from '../../features/record-list/record-list';
import { RecordListControls } from "../../features/record-list-controls/record-list-controls";

@Component({
  selector: 'app-records',
  imports: [RecordList, RecordListControls],
  templateUrl: './records.html',
  styleUrl: './records.css'
})
export class Records {

}
