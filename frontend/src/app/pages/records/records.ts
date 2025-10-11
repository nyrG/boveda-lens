import { Component } from '@angular/core';
import { RecordList } from '../../features/record-list/record-list';

@Component({
  selector: 'app-records',
  imports: [RecordList],
  templateUrl: './records.html',
  styleUrl: './records.css'
})
export class Records {

}
