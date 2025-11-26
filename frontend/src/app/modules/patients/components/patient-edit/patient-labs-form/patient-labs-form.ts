import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-patient-labs-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './patient-labs-form.html',
  styleUrl: './patient-labs-form.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class PatientLabsForm {
  @Input({ required: true }) labResults!: FormArray;

  @Output() addReport = new EventEmitter<void>();
  @Output() removeReport = new EventEmitter<number>();
  @Output() addTestRow = new EventEmitter<number>();
  @Output() removeTestRow = new EventEmitter<{ labIndex: number; rowIndex: number }>();

  // Helper to get the nested 'results' FormArray from a specific lab report
  getTestRows(labIndex: number): FormArray {
    return this.labResults.at(labIndex).get('results') as FormArray;
  }

  getLabGroup(index: number): FormGroup {
    return this.labResults.at(index) as FormGroup;
  }
}
