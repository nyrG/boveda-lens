import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../models/patient';
import { DetailItem } from '../../../../../shared/components/detail-item/detail-item';

@Component({
  selector: 'app-patient-summary',
  standalone: true,
  imports: [CommonModule, DetailItem],
  templateUrl: './patient-summary.html',
  host: {
    '[class]': `'block'`, // Ensures the component is a block-level element
  },
})
export class PatientSummary {
  // Input to receive the patient's summary data
  @Input({ required: true }) summary: Patient['summary'] | undefined | null;

  /**
   * Computes a filtered list of diagnoses, excluding any 'None' values.
   */
  filteredDiagnoses = computed(() => {
    return this.summary?.diagnoses?.filter(d => d.toLowerCase() !== 'none') ?? [];
  });

  /**
   * Computes a filtered list of allergies, excluding any 'None' values.
   */
  filteredAllergies = computed(() => {
    return this.summary?.allergies?.filter(a => a.toLowerCase() !== 'none') ?? [];
  });
}