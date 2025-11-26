import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-detail-item',
  standalone: true,
  imports: [],
  templateUrl: './detail-item.html',
  styleUrl: './detail-item.css',
  host: {
    '[class]': `'block'`,
  },
})
export class DetailItem {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) label!: string;
  @Input() value: string | number | null | undefined;
  @Input() values: string[] | null | undefined;
  @Input() unit?: string;
}
