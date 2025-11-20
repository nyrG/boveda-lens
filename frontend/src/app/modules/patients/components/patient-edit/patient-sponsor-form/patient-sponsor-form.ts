import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-patient-sponsor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-sponsor-form.html',
  styleUrl: './patient-sponsor-form.css',
})
export class PatientSponsorForm {
  @Input({ required: true }) showForm!: boolean;
  @Output() register = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  public form: FormGroup;

  constructor() {
    this.form = inject(ControlContainer, { host: true }).control as FormGroup;
  }

  onRemove(): void {
    this.remove.emit();
  }
}
