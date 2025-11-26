import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';

import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-patient-radiology-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './patient-radiology-form.html',
  styleUrl: './patient-radiology-form.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class PatientRadiologyForm {
  @Input({ required: true }) radiologyReports!: FormArray;

  @Output() addReport = new EventEmitter<void>();
  @Output() removeReport = new EventEmitter<number>();
}
