import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-patient-consultations-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-consultations-form.html',
  styleUrl: './patient-consultations-form.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class PatientConsultationsForm {
  @Input({ required: true }) consultations!: FormArray;

  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<number>();

  // Helper to get a specific consultation group for type safety in the template
  getConsultationGroup(index: number): FormGroup {
    return this.consultations.at(index) as FormGroup;
  }
}
