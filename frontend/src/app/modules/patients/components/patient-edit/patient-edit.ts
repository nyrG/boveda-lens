import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { RecordStateService } from '../../../../shared/services/record-state.service';
import { HeaderStateService } from '../../../../layout/services/header-state.service';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../shared/services/toast.service'; // prettier-ignore
import { Patient } from '../../../../modules/patients/models/patient';
import { PatientInfoForm } from './patient-info-form/patient-info-form';
import { PatientSummaryForm } from './patient-summary-form/patient-summary-form';
import { PatientConsultationsForm } from './patient-consultations-form/patient-consultations-form';
import { PatientLabsForm } from './patient-labs-form/patient-labs-form';
import { PatientRadiologyForm } from './patient-radiology-form/patient-radiology-form';
import { PatientSponsorForm } from './patient-sponsor-form/patient-sponsor-form';

type PatientEditTab = 'info' | 'summary' | 'consultations' | 'labs' | 'radiology' | 'sponsor';

@Component({
  standalone: true,
  selector: 'app-patient-edit',
  imports: [CommonModule, ReactiveFormsModule, PatientInfoForm, PatientSummaryForm, PatientConsultationsForm, PatientLabsForm, PatientRadiologyForm, PatientSponsorForm],
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
  patientForm = this.fb.nonNullable.group({
    // Top-level patient fields
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    middle_initial: [''],
    patient_record_number: [''],
    category_id: [null as number | null],
    date_of_birth: ['', Validators.required],
    age: [null as number | null],
    sex: [null as 'M' | 'F' | null, Validators.required],
    rank: [''],
    afpsn: [''],
    branch_of_service: [''],
    unit_assignment: [''],

    // Nested FormArrays for related entities
    addresses: this.fb.array([]), // We'll manage the first address
    summary: this.fb.group({
      diagnoses: [''],
      primary_complaint: [''],
      key_findings: [''],
      medications_prescribed: [''],
      allergies: [''],
    }),
    consultations: this.fb.array([]),
    lab_reports: this.fb.array([]),
    radiology_reports: this.fb.array([]),
    sponsor: this.createSponsorGroup(), // Use a FormGroup for the single sponsor
  });

  // This signal holds the processed patient data ready for the form.
  // It's derived from the `record` signal but only emits once.
  private initialFormValue = toSignal(
    toObservable(this.record).pipe(
      switchMap(patient => {
        if (!patient) return EMPTY;

        // Create a deep copy to avoid mutating the original signal data.
        const formValue = JSON.parse(JSON.stringify(patient));

        // Format date before patching
        if (formValue.date_of_birth) {
          formValue.date_of_birth = this.datePipe.transform(formValue.date_of_birth, 'yyyy-MM-dd') ?? '';
        }

        // Convert array fields to comma-separated strings for form inputs
        this.prepareSummaryForForm(formValue);

        return [formValue]; // Emit the processed value
      })
    )
  );

  constructor() {
    this.headerState.setShowFilterButton(false);

    // Read the 'tab' from router state (passed from detail view) or fall back to query params
    const initialTab = (history.state?.tab ||
      this.route.snapshot.queryParamMap.get('tab')) as PatientEditTab | null;
    const isValidTab = this.tabs.some(t => t.id === initialTab);
    if (initialTab && isValidTab) {
      this.activeTab.set(initialTab);
    }

    // Effect to update header and breadcrumbs when the record loads.
    effect(() => {
      const patient = this.record();
      if (patient) {
        this.headerState.setBreadcrumbs([
          { text: 'Records', link: '/records' },
          { text: `${patient.record.name}`, link: `/records/${patient.id}` },
          { text: 'Edit' },
        ]);
      }
    });

    // Effect to patch the form value once the initial data is processed.
    // This replaces the need for `setTimeout`.
    effect(() => {
      const formValue = this.initialFormValue();
      if (formValue) {
        // Determine if sponsor form should be shown initially
        this.showSponsorForm.set(!!formValue.sponsor);

        // --- Repopulate FormArrays ---
        this.repopulateFormArrays(formValue);

        // Populate the form with the fetched patient data
        this.patientForm.patchValue(formValue);
      }
    });
  }

  private prepareSummaryForForm(formValue: any): void {
    if (formValue.summary) {
      formValue.summary.diagnoses = (formValue.summary.diagnoses || []).join(', ');
      formValue.summary.medications_prescribed = (formValue.summary.medications_prescribed || []).join(', ');
      formValue.summary.allergies = (formValue.summary.allergies || []).join(', ');
    } else {
      formValue.summary = {}; // Ensure summary object exists for patching
    }
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
      payload.summary.diagnoses = ((payload.summary as any).diagnoses || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      payload.summary.medications_prescribed = ((payload.summary as any).medications_prescribed || '').split(',').map((s: string) => s.trim()).filter(Boolean);
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

  private repopulateFormArrays(formValue: Patient): void {
    this.addresses.clear();
    if (formValue.addresses && formValue.addresses.length > 0) {
      this.addresses.push(this.createAddressGroup(formValue.addresses[0]));
    } else {
      this.addresses.push(this.createAddressGroup()); // Add an empty one if none exist
    }

    // Clear and repopulate FormArrays
    this.consultations.clear();
    if (formValue.consultations) {
      formValue.consultations.forEach((consultation: any) => {
        this.consultations.push(this.createConsultationGroup(consultation));
      });
    }

    this.labResults.clear();
    if (formValue.lab_reports) {
      formValue.lab_reports.forEach((lab: any) => {
        this.labResults.push(this.createLabResultGroup(lab));
      });
    }

    this.radiologyReports.clear();
    if (formValue.radiology_reports) {
      formValue.radiology_reports.forEach((report: any) => {
        this.radiologyReports.push(this.createRadiologyReportGroup(report));
      });
    }
  }

  // Navigates back to the previous page in the browser's history
  cancel(): void {
    this.location.back();
  }

  // Method to display the sponsor registration form
  registerSponsor(): void {
    this.showSponsorForm.set(true);
  }

  // Creates a FormGroup for a single consultation
  private createConsultationGroup(consultation: any = {}): FormGroup {
    return this.fb.group({
      height_cm: [consultation.height_cm || null],
      weight_kg: [consultation.weight_kg || null],
      temperature_c: [consultation.temperature_c || null],
      consultation_date: [
        this.datePipe.transform(consultation.consultation_date, 'yyyy-MM-dd') || '',
      ],
      chief_complaint: [consultation.chief_complaint || ''],
      notes: [consultation.notes || ''],
      diagnosis: [consultation.diagnosis || ''],
      treatment_plan: [consultation.treatment_plan || ''],
      attending_physician: [consultation.attending_physician || ''],
      // Vitals are now nested under a 'vitals' FormGroup
      vitals: this.fb.group({
        // This can be expanded later if needed
      }),
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
      id: [labResult.id || null],
      date_performed: [
        this.datePipe.transform(labResult.date_performed, 'yyyy-MM-dd') || '',
      ],
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

  // Adds a new test row to a specific lab report
  addTestRow(labIndex: number): void {
    this.getTestRows(labIndex).push(this.createTestRowGroup());
  }

  // Removes a test row from a specific lab report
  removeTestRow({ labIndex, rowIndex }: { labIndex: number; rowIndex: number }): void {
    this.getTestRows(labIndex).removeAt(rowIndex);
  }

  // Helper to get the nested 'results' FormArray from a specific lab report
  getTestRows(labResultIndex: number): FormArray {
    return this.labResults.at(labResultIndex).get('results') as FormArray;
  }

  // --- Radiology Reports Methods ---

  // Creates a FormGroup for a single radiology report
  private createRadiologyReportGroup(report: any = {}): FormGroup {
    return this.fb.group({
      id: [report.id || null],
      date_performed: [
        this.datePipe.transform(report.date_performed, 'yyyy-MM-dd') || '',
      ],
      examination: [report.examination || ''],
      findings: [report.findings || ''],
      impression: [report.impression || ''],
    });
  }

  // --- Sponsor Methods ---
  private createSponsorGroup(sponsor: any = {}): FormGroup {
    return this.fb.group({
      id: [sponsor.id || null],
      first_name: [sponsor.first_name || ''],
      last_name: [sponsor.last_name || ''],
      middle_initial: [sponsor.middle_initial || ''],
      sex: [sponsor.sex || ''],
      rank: [sponsor.rank || ''],
      afpsn: [sponsor.afpsn || ''],
      branch_of_service: [sponsor.branch_of_service || ''],
      unit_assignment: [sponsor.unit_assignment || ''],
    });
  }

  // --- Address Methods ---
  private createAddressGroup(address: any = {}): FormGroup {
    return this.fb.group({
      id: [address.id || null],
      addressType: [address.addressType || 'RESIDENCE'], // Default to RESIDENCE
      house_no_street: [address.house_no_street || ''],
      city_municipality: [address.city_municipality || ''],
      province: [address.province || ''],
      zip_code: [address.zip_code || ''],
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

  // --- Getters for FormArrays used in the template ---
  get consultations(): FormArray {
    return this.patientForm.controls.consultations;
  }

  get labResults(): FormArray {
    return this.patientForm.controls.lab_reports;
  }

  get radiologyReports(): FormArray {
    return this.patientForm.controls.radiology_reports;
  }

  get addresses(): FormArray {
    return this.patientForm.controls.addresses;
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
