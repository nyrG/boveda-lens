import { Component, OnDestroy, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { RecordStateService } from '../../../../shared/services/record-state.service';
import { HeaderStateService } from '../../../../layout/services/header-state.service';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../shared/services/toast.service';
import { Patient } from '../../../../modules/patients/models/patient';

type PatientEditTab = 'info' | 'summary' | 'consultations' | 'labs' | 'radiology' | 'sponsor';

@Component({
  standalone: true,
  selector: 'app-patient-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-edit.html',
  styleUrl: './patient-edit.css',
  providers: [DatePipe], // Add DatePipe for formatting dates in the form
})
export class PatientEdit implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recordState = inject(RecordStateService);
  private headerState = inject(HeaderStateService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private datePipe = inject(DatePipe);
  private location = inject(Location);

  // Fetch the record based on the 'id' route parameter
  record = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.recordState.fetchRecordById(id);
      }),
    ),
  );

  // Signal to manage which tab is currently active
  activeTab = signal<PatientEditTab>('info');

  // Signal to manage the visibility of the sponsor form
  showSponsorForm = signal(false);

  // Data-driven tabs for cleaner template logic
  tabs: { id: PatientEditTab; label: string }[] = [
    { id: 'info', label: 'Patient Info' },
    { id: 'summary', label: 'Findings' },
    { id: 'consultations', label: 'Consultations' },
    { id: 'labs', label: 'Lab Results' },
    { id: 'radiology', label: 'Radiology' },
    { id: 'sponsor', label: 'Sponsor' },
  ];

  // Define the form structure to match the patient data model
  patientForm = this.fb.group({
    patient_info: this.fb.group({
      full_name: this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        middle_initial: [''],
      }),
      patient_record_number: [''],
      category: [''],
      date_of_birth: ['', Validators.required],
      documented_age: [null as number | null],
      sex: ['', Validators.required],
      address: this.fb.group({
        house_no_street: [''],
        city_municipality: [''],
        province: [''],
        zip_code: [''],
      }),
      rank: [''],
      afpsn: [''],
      branch_of_service: [''],
      unit_assignment: [''],
    }),
    summary: this.fb.group({
      final_diagnosis: [''],
      primary_complaint: [''],
      key_findings: [''],
      medications_taken: [''],
      allergies: [''],
    }),
    medical_encounters: this.fb.group({
      consultations: this.fb.array([]),
      lab_results: this.fb.array([]),
      radiology_reports: this.fb.array([]),
    }),
    sponsor_info: this.fb.group({
      sponsor_name: this.fb.group({
        rank: [''],
        first_name: [''],
        middle_initial: [''],
        last_name: [''],
      }),
      sex: [''],
      afpsn: [''],
      branch_of_service: [''],
      unit_assignment: [''],
    }),
  });

  constructor() {
    this.headerState.setShowFilterButton(false);

    // Read the 'tab' from router state (passed from detail view) or fall back to query params
    const initialTab = (history.state?.tab || this.route.snapshot.queryParamMap.get('tab')) as
      | PatientEditTab
      | null;
    const isValidTab = this.tabs.some(t => t.id === initialTab);
    if (initialTab && isValidTab) {
      this.activeTab.set(initialTab);
    }

    // Update the header when the record data is loaded
    effect(() => {
      const patient = this.record();
      if (patient) {
        this.headerState.setBreadcrumbs([
          { text: 'Records', link: '/records' },
          { text: `${patient.id}`, link: `/records/${patient.id}` },
          { text: 'Edit' },
        ]);

        // Determine if sponsor form should be shown initially
        const sponsorExists = patient.sponsor_info && (patient.sponsor_info.afpsn || patient.sponsor_info.sponsor_name?.last_name);
        this.showSponsorForm.set(!!sponsorExists);

        // Create a deep copy to avoid mutating the original signal data.
        // Ensure nested objects expected by FormGroups are not null.
        const formValue = JSON.parse(JSON.stringify(patient));
        if (!formValue.patient_info.full_name) {
          formValue.patient_info.full_name = {};
        }
        if (!formValue.patient_info.address) {
          formValue.patient_info.address = {};
        }
        if (formValue.summary) {
          // Convert array fields to comma-separated strings for form inputs
          formValue.summary.final_diagnosis = (formValue.summary.final_diagnosis || []).join(', ');
          formValue.summary.medications_taken = (formValue.summary.medications_taken || []).join(', ');
          formValue.summary.allergies = (formValue.summary.allergies || []).join(', ');
        } else {
          // Ensure summary object exists for patching
          formValue.summary = {};
        }
        if (!formValue.sponsor_info) {
          formValue.sponsor_info = {};
        }
        if (!formValue.sponsor_info.sponsor_name) {
          formValue.sponsor_info.sponsor_name = {};
        }
        // Clear and repopulate the consultations FormArray
        this.consultations.clear();
        if (formValue.medical_encounters?.consultations) {
          formValue.medical_encounters.consultations.forEach((consultation: any) => {
            // Format date before patching
            if (consultation.consultation_date) {
              consultation.consultation_date = this.datePipe.transform(consultation.consultation_date, 'yyyy-MM-dd');
            }
            this.consultations.push(this.createConsultationGroup(consultation));
          });
        }

        // Clear and repopulate the lab_results FormArray
        this.labResults.clear();
        if (formValue.medical_encounters?.lab_results) {
          formValue.medical_encounters.lab_results.forEach((lab: any) => {
            if (lab.date_performed) {
              lab.date_performed = this.datePipe.transform(lab.date_performed, 'yyyy-MM-dd');
            }
            this.labResults.push(this.createLabResultGroup(lab));
          });
        }

        // Clear and repopulate the radiology_reports FormArray
        this.radiologyReports.clear();
        if (formValue.medical_encounters?.radiology_reports) {
          formValue.medical_encounters.radiology_reports.forEach((report: any) => {
            if (report.date_performed) {
              report.date_performed = this.datePipe.transform(report.date_performed, 'yyyy-MM-dd');
            }
            this.radiologyReports.push(this.createRadiologyReportGroup(report));
          });
        }

        // Populate the form with the fetched patient data
        this.patientForm.patchValue(formValue);
      }
    });
  }

  saveChanges() {
    if (this.patientForm.invalid) {
      this.toastService.show({ message: 'Please correct the errors before saving.', type: 'error' });
      // Here you could add logic to mark all fields as touched to show validation errors
      this.patientForm.markAllAsTouched();
      return;
    }

    const patientId = this.record()?.id;
    if (!patientId) {
      console.error('Cannot save changes, patient ID is missing.');
      this.toastService.show({ message: 'Error: Patient ID not found.', type: 'error' });
      return;
    }

    // Use getRawValue to include all values, even if some were disabled
    // Create a new object that conforms to Partial<Patient> to resolve type errors
    const payload: Partial<Patient> = JSON.parse(JSON.stringify(this.patientForm.getRawValue()));

    // Convert comma-separated strings back to arrays for summary fields
    if (payload.summary) {
      // The form has these as strings, but the Patient model expects string arrays.
      // We cast to `any` to perform the transformation before sending.
      payload.summary.final_diagnosis = ((payload.summary as any).final_diagnosis || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      payload.summary.medications_taken = ((payload.summary as any).medications_taken || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      payload.summary.allergies = ((payload.summary as any).allergies || '').split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    this.recordState.updateRecord(patientId, payload).pipe(
      catchError(err => {
        console.error('Failed to save patient record:', err);
        this.toastService.show({ message: 'Failed to save changes. Please try again.', type: 'error' });
        return EMPTY; // Stop the observable chain on error
      })
    ).subscribe(() => {
      this.toastService.show({ message: 'Patient record updated successfully!', type: 'success' });
      // Navigate back to the detail view after a successful save
      this.router.navigate(['/records', patientId]);
    });
  }

  // Navigates back to the previous page in the browser's history
  cancel(): void {
    this.location.back();
  }

  // Method to display the sponsor registration form
  registerSponsor(): void {
    this.showSponsorForm.set(true);
  }

  // Getter for easy access to the consultations FormArray in the template
  get consultations() {
    return this.patientForm.get('medical_encounters.consultations') as FormArray;
  }

  // Getter for easy access to the lab_results FormArray
  get labResults() {
    return this.patientForm.get('medical_encounters.lab_results') as FormArray;
  }

  // Getter for easy access to the radiology_reports FormArray
  get radiologyReports() {
    return this.patientForm.get('medical_encounters.radiology_reports') as FormArray;
  }

  // Creates a FormGroup for a single consultation
  private createConsultationGroup(consultation: any = {}): FormGroup {
    return this.fb.group({
      consultation_date: [consultation.consultation_date || ''],
      vitals: this.fb.group({
        height_cm: [consultation.vitals?.height_cm || null],
        weight_kg: [consultation.vitals?.weight_kg || null],
        temperature_c: [consultation.vitals?.temperature_c || null],
      }),
      chief_complaint: [consultation.chief_complaint || ''],
      notes: [consultation.notes || ''],
      diagnosis: [consultation.diagnosis || ''],
      treatment_plan: [consultation.treatment_plan || ''],
      attending_physician: [consultation.attending_physician || ''],
    });
  }

  // Adds a new, empty consultation FormGroup to the FormArray
  addConsultation(): void {
    this.consultations.push(this.createConsultationGroup());
  }

  // Removes a consultation FormGroup from the FormArray at a given index
  removeConsultation(index: number): void {
    this.consultations.removeAt(index);
  }

  // --- Lab Results Methods ---

  // Creates a FormGroup for a single lab report, including its nested test rows
  private createLabResultGroup(labResult: any = {}): FormGroup {
    const testRows = (labResult.results || []).map((test: any) => this.createTestRowGroup(test));
    return this.fb.group({
      date_performed: [labResult.date_performed || ''],
      test_type: [labResult.test_type || ''],
      results: this.fb.array(testRows),
    });
  }

  // Creates a FormGroup for a single test result row
  public createTestRowGroup(testRow: any = {}): FormGroup {
    return this.fb.group({
      test_name: [testRow.test_name || ''],
      value: [testRow.value || ''],
      unit: [testRow.unit || ''],
      reference_range: [testRow.reference_range || ''],
    });
  }

  // Adds a new, empty lab report FormGroup to the FormArray
  addLabResult(): void {
    this.labResults.push(this.createLabResultGroup());
  }

  // Removes a lab report FormGroup from the FormArray at a given index
  removeLabResult(index: number): void {
    this.labResults.removeAt(index);
  }

  // Helper to get the nested 'results' FormArray from a specific lab report
  getTestRows(labResultIndex: number): FormArray {
    return this.labResults.at(labResultIndex).get('results') as FormArray;
  }

  // --- Radiology Reports Methods ---

  // Creates a FormGroup for a single radiology report
  private createRadiologyReportGroup(report: any = {}): FormGroup {
    return this.fb.group({
      date_performed: [report.date_performed || ''],
      examination: [report.examination || ''],
      findings: [report.findings || ''],
      impression: [report.impression || ''],
    });
  }

  // Adds a new, empty radiology report FormGroup to the FormArray
  addRadiologyReport(): void {
    this.radiologyReports.push(this.createRadiologyReportGroup());
  }

  // Removes a radiology report FormGroup from the FormArray at a given index
  removeRadiologyReport(index: number): void {
    this.radiologyReports.removeAt(index);
  }

  // Method to change the active tab
  setActiveTab(tab: PatientEditTab) {
    this.activeTab.set(tab);
  }

  ngOnDestroy(): void {
    // Reset header state when leaving
    this.headerState.setBreadcrumbs([{ text: 'Records', link: '/records' }]);
  }
}
