import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-patient-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-info-form.html',
  styleUrl: './patient-info-form.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class PatientInfoForm {
  public form = inject(ControlContainer).control as FormGroup;

  @Output() addAddress = new EventEmitter<void>();
  @Output() removeAddress = new EventEmitter<number>();

  // Getter for easy access to the addresses FormArray in the template
  get addresses() {
    return this.form.get('addresses') as FormArray;
  }
}
