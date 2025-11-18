import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationSummary } from './validation-summary';

describe('ValidationSummary', () => {
  let component: ValidationSummary;
  let fixture: ComponentFixture<ValidationSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
