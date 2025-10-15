import { Component, Input } from '@angular/core';
import { PatientInfo as PatientInfoData, Address } from '../../models/patient';
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
  @Input({ required: true }) info!: PatientInfoData;

  /**
   * Constructs a full address string from an Address object.
   * Filters out empty parts and joins them in a standard format.
   * @param address The address object.
   * @returns A formatted address string or null if the address is empty.
   */
  getFullAddress(address: Address | null | undefined): string | null {
    if (!address) {
      return null;
    }

    const addressParts = [
      address.house_no_street,
      address.barangay,
      address.city_municipality,
      address.province,
    ].filter(Boolean); // filter(Boolean) removes any null, undefined, or empty strings

    if (addressParts.length === 0 && !address.zip_code) {
      return null;
    }

    let fullAddress = addressParts.join(', ');
    return fullAddress + (address.zip_code ? ` ${address.zip_code}` : '');
  }
}
