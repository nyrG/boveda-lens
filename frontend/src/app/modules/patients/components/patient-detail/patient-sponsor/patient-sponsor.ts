import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sponsor } from '../../../models/patient';
import { DetailItem } from '../../../../../shared/components/detail-item/detail-item';

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
  // The component now accepts a single sponsor object or null.
  @Input({ required: true }) sponsor: Sponsor | null | undefined;

  fullName = computed(() => {
    const sponsor = this.sponsor;
    if (!sponsor) return 'N/A';
    return [sponsor.first_name, sponsor.middle_initial ? `${sponsor.middle_initial}.` : '', sponsor.last_name]
      .filter(Boolean)
      .join(' ');
  });

  sex = computed(() => {
    const sex = this.sponsor?.sex;
    if (sex === 'M') {
      return 'Male';
    }
    if (sex === 'F') {
      return 'Female';
    }
    return 'N/A';
  });
}
