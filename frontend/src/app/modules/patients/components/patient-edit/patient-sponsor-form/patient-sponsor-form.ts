import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Sponsor } from '../../../models/patient';
import { Observable } from 'rxjs';
import { SponsorSearchModal } from './sponsor-search-modal/sponsor-search-modal';

import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-patient-sponsor-form',
  standalone: true,
  imports: [ReactiveFormsModule, SponsorSearchModal],
  templateUrl: './patient-sponsor-form.html',
  styleUrl: './patient-sponsor-form.css',
})
export class PatientSponsorForm {
  @Input({ required: true }) showForm!: boolean;
  @Input({ required: true }) searchSponsorsFn!: (name: string) => Observable<Sponsor[]>;
  @Input({ required: true }) selectSponsorFn!: (sponsor: Sponsor) => void;

  @Output() register = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  protected showSponsorSearchModal = signal(false);
  protected sponsorSearchResults = signal<Sponsor[]>([]);
  protected isSearchingSponsors = signal(false);

  public form: FormGroup;

  constructor() {
    this.form = inject(ControlContainer, { host: true }).control as FormGroup;
  }

  onRemove(): void {
    this.remove.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }

  openSponsorSearch(): void {
    this.sponsorSearchResults.set([]); // Clear previous results
    this.showSponsorSearchModal.set(true);
  }

  closeSponsorSearch(): void {
    // Wait for the closing animation to complete before hiding the component
    setTimeout(() => {
      this.showSponsorSearchModal.set(false);
    }, 100); // This duration should match the CSS animation duration
  }

  searchSponsors(name: string): void {
    if (!name || name.trim().length < 2) {
      this.sponsorSearchResults.set([]);
      return;
    }
    this.isSearchingSponsors.set(true);
    this.searchSponsorsFn(name).subscribe(results => {
      this.sponsorSearchResults.set(results);
      this.isSearchingSponsors.set(false);
    });
  }

  selectSponsor(sponsor: Sponsor): void {
    this.selectSponsorFn(sponsor);
    this.closeSponsorSearch();
  }

  get sponsorName(): string {
    const { first_name, middle_initial, last_name } = this.form.value;
    return [first_name, middle_initial, last_name].filter(Boolean).join(' ');
  }
}
