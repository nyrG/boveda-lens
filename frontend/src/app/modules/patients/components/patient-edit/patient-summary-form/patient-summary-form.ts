import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective, FormGroupName } from '@angular/forms';

@Component({
  selector: 'app-patient-summary-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-summary-form.html',
  styleUrl: './patient-summary-form.css',
  // Provide the ControlContainer to link this component's form controls
  // to the parent FormGroup.
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
    { provide: ControlContainer, useExisting: FormGroupName },
  ],
})
export class PatientSummaryForm implements OnInit {
  form!: FormGroup;

  // Injecting the ControlContainer makes it available to the template.
  constructor(public controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }
}
