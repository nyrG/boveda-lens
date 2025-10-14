import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SponsorInfo } from '../../models/patient';
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
  @Input({ required: true }) sponsorInfo: SponsorInfo | null | undefined;

  fullName = computed(() => {
    if (!this.sponsorInfo?.sponsor_name) return 'N/A';
    const { first_name, middle_initial, last_name } = this.sponsorInfo.sponsor_name;
    return [first_name, middle_initial ? `${middle_initial}.` : '', last_name]
      .filter(Boolean)
      .join(' ');
  });

  sex = computed(() => {
    const sex = this.sponsorInfo?.sex;
    if (sex === 'M') {
      return 'Male';
    }
    if (sex === 'F') {
      return 'Female';
    }
    return 'N/A';
  });
}
