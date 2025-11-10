import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabReport } from '../../../models/patient';

@Component({
  selector: 'app-patient-labs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-labs.html',
  styleUrl: './patient-labs.css',
  host: {
    '[class]': `'block'`,
  },
})
export class PatientLabs {
  @Input({ required: true }) labResults: LabReport[] | undefined = [];
}