import { Component, Input } from '@angular/core';
import { Consultation } from '../../models/patient';
import { CommonModule } from '@angular/common';
import { DetailItem } from '../../../../shared/components/detail-item/detail-item';

@Component({
  selector: 'app-patient-consultations',
  standalone: true,
  imports: [CommonModule, DetailItem],
  templateUrl: './patient-consultations.html',
  styleUrl: './patient-consultations.css',
  host: {
    '[class]': `'block'`,
  },
})
export class PatientConsultations {
  @Input({ required: true })
  consultations: Consultation[] | undefined = [];
}
