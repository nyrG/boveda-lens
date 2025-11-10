import { Component, Input, computed } from '@angular/core';
import { AddressType, Patient } from '../../models/patient';
import { CommonModule } from '@angular/common';
import { DetailItem } from '../../../../shared/components/detail-item/detail-item';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [CommonModule, DetailItem],
  templateUrl: './patient-info.html',
  styleUrl: './patient-info.css',
  host: {
    '[class]': `'block'`,
  },
})
export class PatientInfo {
  @Input({ required: true }) patient!: Patient;

  /**
   * Calculates the current age based on the date of birth.
   * @param birthDateString The date of birth as a string.
   * @returns The calculated age in years, or null if the birth date is invalid.
   */
  private calculateCurrentAge(birthDateString: string | null | undefined): number | null {
    if (!birthDateString) {
      return null;
    }
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Computed signal to display the patient's current age based on their date of birth.
  currentAge = computed(() => {
    return this.calculateCurrentAge(this.patient?.date_of_birth);
  });

  fullAddress = computed(() => {
    const addresses = this.patient?.addresses;
    if (!addresses || addresses.length === 0) {
      return null;
    }

    // Prioritize the 'RESIDENCE' address, otherwise fall back to the first one.
    const primaryAddress = addresses.find(addr => addr.addressType === AddressType.RESIDENCE) || addresses[0];

    if (!primaryAddress) {
      return null;
    }

    const addressParts = [
      primaryAddress.houseNoStreet,
      primaryAddress.barangay,
      primaryAddress.cityMunicipality,
      primaryAddress.province,
    ].filter(Boolean); // filter(Boolean) removes any null, undefined, or empty strings

    if (addressParts.length === 0 && !primaryAddress.zipCode) {
      return null;
    }

    let fullAddress = addressParts.join(', ');
    return fullAddress + (primaryAddress.zipCode ? ` ${primaryAddress.zipCode}` : '');
  });
}
