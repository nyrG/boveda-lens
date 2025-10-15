import { Component, OnDestroy, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { RecordStateService } from '../../../../shared/services/record-state.service';
import { HeaderStateService } from '../../../../layout/services/header-state.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-patient-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-edit.html',
  styleUrl: './patient-edit.css',
})
export class PatientEdit implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recordState = inject(RecordStateService);
  private headerState = inject(HeaderStateService);
  private fb = inject(FormBuilder);

  // Fetch the record based on the 'id' route parameter
  record = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.recordState.fetchRecordById(id);
      }),
    ),
  );

  // Define the form structure to match the patient data model
  patientForm = this.fb.group({
    patient_info: this.fb.group({
      full_name: this.fb.group({
        first_name: [''],
        last_name: [''],
        middle_initial: [''],
      }),
      patient_record_number: [''],
      category: [''],
      date_of_birth: [''],
      documented_age: [null as number | null],
      sex: [''],
      address: this.fb.group({
        house_no_street: [''],
        city_municipality: [''],
        province: [''],
        zip_code: [''],
      }),
    }),
  });

  constructor() {
    this.headerState.setShowFilterButton(false);

    // Update the header when the record data is loaded
    effect(() => {
      const patient = this.record();
      if (patient) {
        this.headerState.setBreadcrumbs([
          { text: 'Records', link: '/records' },
          { text: `${patient.id}`, link: `/records/${patient.id}` },
          { text: 'Edit' },
        ]);

        // Create a deep copy to avoid mutating the original signal data.
        // Ensure nested objects expected by FormGroups are not null.
        const formValue = JSON.parse(JSON.stringify(patient));
        if (!formValue.patient_info.full_name) {
          formValue.patient_info.full_name = {};
        }
        if (!formValue.patient_info.address) {
          formValue.patient_info.address = {};
        }
        // Populate the form with the fetched patient data
        this.patientForm.patchValue(formValue);
      }
    });
  }

  // We will implement this later
  saveChanges() { }

  ngOnDestroy(): void {
    // Reset header state when leaving
    this.headerState.setBreadcrumbs([{ text: 'Records', link: '/records' }]);
  }
}
