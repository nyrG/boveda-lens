import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormGroupName, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-patient-sponsor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-sponsor-form.html',
  styleUrl: './patient-sponsor-form.css',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
    { provide: ControlContainer, useExisting: FormGroupName },
  ],
})
export class PatientSponsorForm {
  @Input({ required: true }) showForm!: boolean;
  @Output() register = new EventEmitter<void>();
}
