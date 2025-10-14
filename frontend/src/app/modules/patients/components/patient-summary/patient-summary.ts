import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Summary } from '../../models/patient';

@Component({
  selector: 'app-patient-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-summary.html',
  host: {
    '[class]': `'block'`, // Ensures the component is a block-level element
  },
})
export class PatientSummary {
  // Input to receive the patient's summary data
  @Input({ required: true }) summary: Summary | undefined | null;
}