import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormArray, AbstractControl } from '@angular/forms';

import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  @Output() moveAddressUp = new EventEmitter<number>();
  @Output() moveAddressDown = new EventEmitter<number>();
  @Output() makePrimary = new EventEmitter<number>();

  @Input() isPrimaryAddress: (index: number) => boolean = () => false;
  @Input() recentlyMovedIndex: number | null = null;

  // Getter for easy access to the addresses FormArray in the template
  get addresses() {
    return this.form.get('addresses') as FormArray;
  }

  /**
   * Generates a displayable full address string from an address FormGroup.
   * If the address is empty, it returns a default title like "Address #1".
   * @param addressControl The FormGroup for a single address.
   * @param index The index of the address in the FormArray.
   * @returns A formatted address string or a default title.
   */
  getAddressTitle(addressControl: AbstractControl, index: number): string {
    const address = addressControl.value;
    const addressParts = [
      address.house_no_street,
      address.barangay,
      address.city_municipality,
      address.province,
    ].filter(Boolean); // Removes any null, undefined, or empty strings

    if (addressParts.length === 0 && !address.zip_code) {
      return `Address #${index + 1}`; // Fallback for a new or empty address
    }

    return addressParts.join(', ') + (address.zip_code ? ` ${address.zip_code}` : '');
  }
}
