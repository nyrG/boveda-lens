import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-patient-summary-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-summary-form.html',
  styleUrl: './patient-summary-form.css',
})
export class PatientSummaryForm {
  // Inject the parent's control container and cast it to a FormGroup.
  // The template can now access this `form` property.
  public form: FormGroup;

  constructor() {
    const controlContainer = inject(ControlContainer, { host: true });
    console.log('PatientSummaryForm ControlContainer:', controlContainer);
    // The control is the specific FormGroup ('summary') passed from the parent.
    this.form = controlContainer.control as FormGroup;
  }
}
