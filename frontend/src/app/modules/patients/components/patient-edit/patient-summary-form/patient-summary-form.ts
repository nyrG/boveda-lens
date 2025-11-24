import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  AbstractControl,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-patient-summary-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-summary-form.html',
})
export class PatientSummaryForm {
  @Input({ required: true }) form!: FormGroup;

  private fb = inject(FormBuilder);

  getArrayControls(
    arrayName: 'diagnoses' | 'medications_prescribed' | 'allergies',
  ): AbstractControl[] {
    const formArray = this.form.get(arrayName) as FormArray;
    return formArray.controls;
  }

  addListItem(
    arrayName: 'diagnoses' | 'medications_prescribed' | 'allergies',
    inputElement: HTMLInputElement,
  ): void {
    const value = inputElement.value.trim();
    const formArray = this.form.get(arrayName) as FormArray;

    // Prevent adding empty or duplicate values
    const isDuplicate = formArray.controls.some(control => control.value.toLowerCase() === value.toLowerCase());
    const isNoneValue = value.toLowerCase() === 'none';

    if (value && !isDuplicate && !isNoneValue) {
      formArray.push(this.fb.control(value));
      inputElement.value = '';
    }
  }

  removeListItem(arrayName: 'diagnoses' | 'medications_prescribed' | 'allergies', index: number): void {
    const formArray = this.form.get(arrayName) as FormArray;
    formArray.removeAt(index);
  }
}