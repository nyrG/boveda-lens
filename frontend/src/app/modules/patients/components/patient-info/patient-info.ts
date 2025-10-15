import { Component, Input } from '@angular/core';
import { PatientInfo as PatientInfoData } from '../../models/patient';
import { CommonModule } from '@angular/common';
import { DetailItem } from '../../../../shared/components/detail-item/detail-item';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [CommonModule, DetailItem],
  templateUrl: './patient-info.html',
  styleUrl: './patient-info.css',
  host: {
    '[class]': `'block'`,
  },
})
export class PatientInfo {
  @Input({ required: true }) info!: PatientInfoData;
}
