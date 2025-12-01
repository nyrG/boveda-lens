import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Sponsor } from '../../../../models/patient';

@Component({
  selector: 'app-sponsor-search-modal',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './sponsor-search-modal.html',
  styleUrl: './sponsor-search-modal.css',
})
export class SponsorSearchModal implements OnInit, OnDestroy {
  @Input({ required: true }) searchResults!: Sponsor[];
  @Input({ required: true }) isSearching!: boolean;
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() sponsorSelected = new EventEmitter<Sponsor>();
  @Output() closeModal = new EventEmitter<void>();

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  protected searchTerm = signal('');
  protected isClosing = signal(false);

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300), // Wait for 300ms of silence before searching
        distinctUntilChanged(), // Only search if the value has changed
      )
      .subscribe(term => {
        this.searchTermChange.emit(term);
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearchTermChange(term: string): void {
    this.searchTerm.set(term);
    this.searchSubject.next(term);
  }

  selectSponsor(sponsor: Sponsor): void {
    this.sponsorSelected.emit(sponsor);
  }

  handleClose(): void {
    this.isClosing.set(true);
    this.closeModal.emit();
  }
}