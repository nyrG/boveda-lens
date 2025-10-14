import { Component, Input } from '@angular/core';
import { PatientInfo as PatientInfoData } from '../../models/patient';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-info.html',
  styleUrl: './patient-info.css',
})
export class PatientInfo {
  @Input({ required: true }) info!: PatientInfoData;
}
