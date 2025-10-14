import { Component, ElementRef, HostListener, OnDestroy, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { RecordStateService } from '../../../../shared/services/record-state.service';
import { HeaderStateService } from '../../../../layout/services/header-state.service';
import { CommonModule } from '@angular/common';
import { PatientInfo } from '../patient-info/patient-info';
import { PatientSummary } from '../patient-summary/patient-summary';
import { PatientConsultations } from '../patient-consultations/patient-consultations';
import { PatientLabs } from '../patient-labs/patient-labs';
import { PatientRadiology } from '../patient-radiology/patient-radiology';
import { PatientSponsor } from '../patient-sponsor/patient-sponsor';
import { DialogService } from '../../../../shared/services/dialog.service';

type PatientTab = 'info' | 'summary' | 'consultations' | 'labs' | 'radiology' | 'sponsor';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule, // Provides pipes like 'date'
    RouterLink,
    PatientInfo,
    PatientSummary,
    PatientConsultations,
    PatientLabs,
    PatientRadiology,
    PatientSponsor,
  ],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.css',
})
export class PatientDetail implements OnDestroy {
  private route = inject(ActivatedRoute);
  private recordState = inject(RecordStateService);
  private headerState = inject(HeaderStateService);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private elementRef = inject(ElementRef);

  // Signal to manage which tab is currently active
  activeTab = signal<PatientTab>('info');

  // Signal to manage the actions dropdown menu
  isActionsMenuOpen = signal(false);

  // Data-driven tabs for cleaner template logic
  tabs: { id: PatientTab; label: string }[] = [
    { id: 'info', label: 'Patient Info' },
    { id: 'summary', label: 'Findings' },
    { id: 'consultations', label: 'Consultations' },
    { id: 'labs', label: 'Lab Results' },
    { id: 'radiology', label: 'Radiology' },
    { id: 'sponsor', label: 'Sponsor' },
  ];

  // Fetch the record based on the 'id' route parameter
  record = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.recordState.fetchRecordById(id);
      })
    ),
  );

  constructor() {
    // Set the initial title and hide the filter button
    this.headerState.setBreadcrumbs([{ text: 'Records', link: '/records' }]);
    this.headerState.setShowFilterButton(false);

    // Update the header title when the record data is loaded
    effect(() => {
      const patientId = this.record()?.id;
      if (patientId !== undefined) {
        this.headerState.setBreadcrumbs([{ text: 'Records', link: '/records' }, { text: `${patientId}` }]);
      }
    });
  }

  // Close the dropdown menu if a click occurs outside of it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdownElement = this.elementRef.nativeElement.querySelector('.actions-dropdown-container');
    if (this.isActionsMenuOpen() && dropdownElement && !dropdownElement.contains(event.target as Node)) {
      this.isActionsMenuOpen.set(false);
    }
  }

  // Method to change the active tab
  setActiveTab(tab: PatientTab) {
    this.activeTab.set(tab);
  }

  // Method to toggle the actions dropdown
  toggleActionsMenu() {
    // This needs to be set explicitly to handle the case where a click on the button
    // would be caught by onDocumentClick. We stop propagation in the template.
    // For simplicity here, we just toggle. The template change will handle the rest.
    this.isActionsMenuOpen.update((isOpen) => !isOpen);
  }

  // Method to delete the current patient record
  deleteRecord() {
    const patient = this.record();
    if (!patient) return;

    this.dialogService
      .open({
        title: 'Delete Record',
        message: `Are you sure you want to delete the record for ${patient.name}? This action cannot be undone.`,
        confirmText: 'Delete',
      })
      .subscribe(confirmed => {
        if (confirmed) {
          this.recordState.deleteRecordById(patient.id).subscribe({
            next: () => {
              this.router.navigate(['/records']);
            },
            error: (err: unknown) => console.error('Failed to delete record', err),
          });
        }
      });
  }

  ngOnDestroy(): void {
    // Reset the title when leaving the component. The Records page will set its own title.
    this.headerState.setTitle('Records');
  }
}
