import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { RecordStateService } from '../../../../shared/services/record-state.service';
import { HeaderStateService } from '../../../../layout/services/header-state.service';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../shared/services/toast.service'; // prettier-ignore
import { Patient, Sponsor } from '../../../../modules/patients/models/patient';
import { PatientInfoForm } from './patient-info-form/patient-info-form';
import { PatientSummaryForm } from './patient-summary-form/patient-summary-form';
import { PatientConsultationsForm } from './patient-consultations-form/patient-consultations-form';
import { PatientLabsForm } from './patient-labs-form/patient-labs-form';
import { PatientRadiologyForm } from './patient-radiology-form/patient-radiology-form';
import { PatientSponsorForm } from './patient-sponsor-form/patient-sponsor-form';
import { ValidationSummary } from '../../../../shared/components/validation-summary/validation-summary';
import { getFormErrors } from '../../../../shared/utils/form.utils';
import { FormError, FormErrorTab } from '../../../../shared/models/form-error';

type PatientEditTab = 'info' | 'summary' | 'consultations' | 'labs' | 'radiology' | 'sponsor';

@Component({
  standalone: true,
  selector: 'app-patient-edit',
  imports: [CommonModule, ReactiveFormsModule, PatientInfoForm, PatientSummaryForm, PatientConsultationsForm, PatientLabsForm, PatientRadiologyForm, PatientSponsorForm, ValidationSummary],
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

  // Signal to hold form validation errors for the summary component
  formErrors = signal<FormError[]>([]);

  // Signal to track the index of a recently moved address for a visual cue
  recentlyMovedAddressIndex = signal<number | null>(null);

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
    category_name: [''], // For display purposes
    category_id: [null as number | null],
    date_of_birth: ['', Validators.required],
    age: [null as number | null],
    sex: [null as 'M' | 'F' | null],
    rank: [''],
    afpsn: [''],
    branch_of_service: [''],
    unit_assignment: [''],

    // Nested FormArrays for related entities
    addresses: this.fb.array([]), // We'll manage the first address
    summary: this.fb.group({
      primary_complaint: [''],
      key_findings: [''],
      diagnoses: this.fb.array([]),
      medications_prescribed: this.fb.array([]),
      allergies: this.fb.array([]),
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

        return [formValue]; // Emit the processed value
      })
    )
  );

  constructor() {
    // Read the 'tab' from router state (passed from detail view) or fall back to query params
    const initialTab = (history.state?.tab ||
      this.route.snapshot.queryParamMap.get('tab')) as PatientEditTab | null;
    const isValidTab = this.tabs.some(t => t.id === initialTab);
    if (initialTab && isValidTab) {
      this.activeTab.set(initialTab);
    }

    // Effect to update header, breadcrumbs, and form when the record loads.
    effect(() => {
      const patient = this.record();
      this.headerState.setShowFilterButton(false);

      if (patient) {
        this.headerState.setBreadcrumbs([
          { text: 'Records', link: '/records' },
          { text: `${patient.id}`, link: `/records/${patient.id}` },
          { text: 'Edit' },
        ]);
      }

      const formValue = this.initialFormValue();
      if (formValue) {
        // Determine if sponsor form should be shown initially
        this.showSponsorForm.set(!!formValue.sponsor);

        // Disable sponsor form if no sponsor exists initially
        if (!formValue.sponsor) {
          this.patientForm.controls.sponsor.disable();
        }

        // --- Repopulate FormArrays ---
        this.repopulateFormArrays(formValue);

        // Populate the form with the fetched patient data
        this.patientForm.patchValue(formValue);

        // Manually set the category name for display
        if (formValue.category) {
          this.patientForm.controls.category_name.setValue(formValue.category.name);
        }
      }
    });
  }

  saveChanges() {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      this.formErrors.set(getFormErrors(this.patientForm));
      // Scroll to the top to make sure the user sees the error summary
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // --- Remap Category ---
    // The backend expects the category as an object { name: '...' } to find or create.
    // We need to transform the flat category_name from the form into this structure.
    const categoryName = (payload as any).category_name;
    if (categoryName && categoryName.trim() !== '') {
      payload.category = { name: categoryName.trim() } as any;
    } else {
      payload.category = null; // Disassociate category if the field is empty
    }
    delete (payload as any).category_name; // Remove the temporary form property

    // If the sponsor form is hidden, it means we intend to remove the sponsor.
    // Set the sponsor payload to null to disassociate it on the backend.
    if (!this.showSponsorForm()) {
      (payload as any).sponsor = null;
    } else {
      // If the sponsor is new (has a null ID), we must remove the 'id' property
      // from the payload. This tells TypeORM to treat it as a new entity to insert
      // rather than trying to update an entity with a null ID.
      if (payload.sponsor && payload.sponsor.id === null) {
        delete (payload.sponsor as Partial<Sponsor>).id;
      }

      // Ensure the middle initial is saved as uppercase
      if (payload.sponsor && payload.sponsor.middle_initial) {
        payload.sponsor.middle_initial = payload.sponsor.middle_initial.toUpperCase();
      }
    }

    this.recordState.updateRecord(patientId, payload).pipe(
      catchError(err => {
        // Check for a 400 Bad Request with a 'message' array (default NestJS validation response)
        if (err.status === 400 && Array.isArray(err.error?.message)) {
          const backendErrors: FormError[] = [];
          const errorMessages: string[] = err.error.message;

          for (const message of errorMessages) {
            // NestJS messages are often in the format "fieldName validation message"
            // e.g., "sponsor.sex must be one of the following values: M, F"
            const parts = message.split(' ');
            const controlPath = parts[0];
            const errorText = parts.slice(1).join(' ');

            const control = this.patientForm.get(controlPath);
            if (control) {
              backendErrors.push({
                controlPath: controlPath,
                message: errorText || 'Invalid value.', // Use the parsed message or a default
                tab: this.getTabForControl(controlPath),
                friendlyName: controlPath.replace(/_/g, ' ').replace(/\./g, ' > '), // e.g., sponsor > sex
              });
            }
          }
          this.formErrors.set(backendErrors);
          this.toastService.show({ message: 'Please correct the errors below.', type: 'error' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Handle other types of errors (500, network issues, etc.)
          console.error('Failed to save patient record:', err);
          this.toastService.show({ message: 'An unexpected error occurred. Please try again.', type: 'error' });
        }

        return EMPTY; // Stop the observable chain on error
      })
    ).subscribe(() => {
      this.formErrors.set([]); // Clear errors on successful save
      this.toastService.show({ message: 'Patient record updated successfully!', type: 'success' });
      // Navigate back to the detail view after a successful save
      this.router.navigate(['/records', patientId], { replaceUrl: true });
    });
  }

  private repopulateFormArrays(formValue: Patient): void {
    this.addresses.clear();
    formValue.addresses?.forEach(address => {
      this.addresses.push(this.createAddressGroup(address));
    });

    // Repopulate summary FormArrays
    const summaryGroup = this.patientForm.get('summary') as FormGroup;
    const diagnosesArray = summaryGroup.get('diagnoses') as FormArray;
    diagnosesArray.clear();
    formValue.summary?.diagnoses?.forEach(d => diagnosesArray.push(this.fb.control(d)));

    const medicationsArray = summaryGroup.get('medications_prescribed') as FormArray;
    medicationsArray.clear();
    formValue.summary?.medications_prescribed?.forEach(m =>
      medicationsArray.push(this.fb.control(m)),
    );

    const allergiesArray = summaryGroup.get('allergies') as FormArray;
    allergiesArray.clear();
    formValue.summary?.allergies
      ?.filter(a => a.toLowerCase() !== 'none')
      .forEach(a => allergiesArray.push(this.fb.control(a)));
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

  // Handles navigation from the validation summary component
  handleErrorNavigation(error: FormError) {
    this.setActiveTab(error.tab);
    // Use a timeout to ensure the tab content is rendered before marking for focus
    setTimeout(() => {
      this.patientForm.get(error.controlPath)?.markAsTouched();
    }, 100);
  }
  // Navigates back to the previous page in the browser's history
  cancel(): void {
    this.location.back();
  }

  // Method to display the sponsor registration form
  registerSponsor(): void {
    this.showSponsorForm.set(true);
    this.patientForm.controls.sponsor.enable();
  }

  // Method to remove the sponsor from the form
  removeSponsor(): void {
    this.showSponsorForm.set(false);
    this.patientForm.controls.sponsor.reset(); // Reset the form group to clear all values
    this.patientForm.controls.sponsor.disable(); // Disable to exclude from validation
  }

  // Creates a FormGroup for a single consultation
  private createConsultationGroup(consultation: any = {}): FormGroup {
    return this.fb.group({
      id: [consultation.id || null],
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
      id: [labResult.id || null], // Keep the ID for updates
      date_performed: [this.datePipe.transform(labResult.date_performed, 'yyyy-MM-dd') || ''],
      test_type: [labResult.test_type || ''],
      medical_technologist: [labResult.medical_technologist || ''],
      pathologist: [labResult.pathologist || ''],
      results: this.fb.array(testRows),
    });
  }

  // Creates a FormGroup for a single test result row
  public createTestRowGroup(testRow: any = {}): FormGroup {
    return this.fb.group({
      id: [testRow.id || null],
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
      date_performed: [this.datePipe.transform(report.date_performed, 'yyyy-MM-dd') || ''],
      examination: [report.examination || ''],
      findings: [report.findings || ''],
      impression: [report.impression || ''],
      radiologist: [report.radiologist || ''],
    });
  }

  // --- Sponsor Methods ---
  private createSponsorGroup(sponsor: any = {}): FormGroup {
    return this.fb.group({
      id: [sponsor.id || null],
      first_name: [sponsor.first_name || '', Validators.required],
      last_name: [sponsor.last_name || ''],
      middle_initial: [sponsor.middle_initial || ''],
      sex: [sponsor.sex || null], // Use null as the default for optional fields
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
      address_type: [address.addressType || 'RESIDENCE'], // Default to RESIDENCE
      house_no_street: [address.houseNoStreet || ''],
      barangay: [address.barangay || ''],
      city_municipality: [address.cityMunicipality || ''],
      province: [address.province || ''],
      zip_code: [address.zipCode || ''],
    });
  }

  // Adds a new, empty address FormGroup to the FormArray
  addAddress(): void {
    this.addresses.push(this.createAddressGroup());
  }

  // Removes an address FormGroup from the FormArray at a given index
  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  // Moves an address up in the list
  moveAddressUp(index: number): void {
    if (index > 0) {
      const control = this.addresses.at(index);
      const newIndex = index - 1;
      this.addresses.removeAt(index);
      this.addresses.insert(newIndex, control);
      this.flashMovedItem(newIndex);
    }
  }

  // Moves an address down in the list
  moveAddressDown(index: number): void {
    if (index < this.addresses.length - 1) {
      const control = this.addresses.at(index);
      const newIndex = index + 1;
      this.addresses.removeAt(index);
      this.addresses.insert(newIndex, control);
      this.flashMovedItem(newIndex);
    }
  }

  private flashMovedItem(index: number): void {
    this.recentlyMovedAddressIndex.set(index);
    setTimeout(() => this.recentlyMovedAddressIndex.set(null), 700); // Animation duration
  }

  /**
   * Makes the address at the given index the primary one by moving it to the top of the list.
   */
  makePrimaryAddress(index: number): void {
    if (index > 0) {
      const control = this.addresses.at(index);
      this.addresses.removeAt(index);
      this.addresses.insert(0, control);
      this.flashMovedItem(0); // Flash the item in its new position
    }
  }
  // The function that will be passed to the child component.
  // It's bound to the correct 'this' context to prevent template parsing errors.
  public readonly isPrimaryAddressFn = this._isPrimaryAddress.bind(this);

  /**
   * Determines if an address at a given index is the "primary" one.
   * The primary address is the first one with type 'RESIDENCE',
   * or the first address in the list if no 'RESIDENCE' type exists. With the
   * "Make Primary" button, the primary address is always the one at index 0.
   */
  private _isPrimaryAddress(currentIndex: number): boolean {
    return currentIndex === 0;
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

  private getTabForControl(controlPath: string): FormErrorTab {
    if (controlPath.startsWith('summary')) {
      return 'summary';
    }
    if (controlPath.startsWith('consultations')) {
      return 'consultations';
    }
    if (controlPath.startsWith('lab_reports')) {
      return 'labs';
    }
    if (controlPath.startsWith('radiology_reports')) {
      return 'radiology';
    }
    if (controlPath.startsWith('sponsor')) {
      return 'sponsor';
    }
    return 'info'; // Default to the 'info' tab
  }
  // Clear validation errors
  clearErrors(): void {
    this.formErrors.set([]);
  }

  ngOnDestroy(): void {
    // Reset header state when leaving
    this.headerState.setBreadcrumbs([{ text: 'Records', link: '/records' }]);
  }
}

export { PatientSummaryForm };
