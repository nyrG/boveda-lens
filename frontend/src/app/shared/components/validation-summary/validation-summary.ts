import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { FormError } from '../../models/form-error';

@Component({
  selector: 'app-validation-summary',
  imports: [CommonModule],
  templateUrl: './validation-summary.html',
  styleUrl: './validation-summary.css'
})
export class ValidationSummary {
  @Input({ required: true }) errors!: Signal<FormError[]>;
  @Output() navigateToError = new EventEmitter<FormError>();
  @Output() clear = new EventEmitter<void>()
}
