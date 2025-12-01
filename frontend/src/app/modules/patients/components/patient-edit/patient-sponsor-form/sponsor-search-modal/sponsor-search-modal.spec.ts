import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorSearchModal } from './sponsor-search-modal';

describe('SponsorSearchModal', () => {
  let component: SponsorSearchModal;
  let fixture: ComponentFixture<SponsorSearchModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorSearchModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsorSearchModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
