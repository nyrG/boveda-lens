import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sponsor } from '../../models/patient';
import { DetailItem } from '../../../../shared/components/detail-item/detail-item';

@Component({
  selector: 'app-patient-sponsor',
  standalone: true,
  imports: [CommonModule, DetailItem],
  templateUrl: './patient-sponsor.html',
  styleUrl: './patient-sponsor.css',
  host: {
    '[class]': `'block'`,
  },
})
export class PatientSponsor {
  @Input({ required: true }) sponsors: Sponsor[] | null | undefined;

  // Computed signal to safely get the first sponsor from the array
  primarySponsor = computed(() => {
    if (this.sponsors && this.sponsors.length > 0) {
      return this.sponsors[0];
    }
    return null;
  });

  fullName = computed(() => {
    const sponsor = this.primarySponsor();
    if (!sponsor) return 'N/A';
    return [sponsor.first_name, sponsor.middle_initial ? `${sponsor.middle_initial}.` : '', sponsor.last_name].filter(Boolean).join(' ');
  });

  sex = computed(() => {
    const sex = this.primarySponsor()?.sex;
    if (sex === 'M') {
      return 'Male';
    }
    if (sex === 'F') {
      return 'Female';
    }
    return 'N/A';
  });
}
