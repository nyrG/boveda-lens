import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadiologyReport } from '../../models/patient';
import { DetailItem } from '../../../../shared/components/detail-item/detail-item';

@Component({
  selector: 'app-patient-radiology',
  standalone: true,
  imports: [CommonModule, DetailItem],
  templateUrl: './patient-radiology.html',
  styleUrl: './patient-radiology.css',
  host: {
    '[class]': `'block'`,
  },
})
export class PatientRadiology {
  @Input({ required: true })
  radiologyReports: RadiologyReport[] | undefined = [];
}
