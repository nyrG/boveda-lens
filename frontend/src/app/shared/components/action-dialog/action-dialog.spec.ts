import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDialog } from './action-dialog';

describe('ActionDialog', () => {
  let component: ActionDialog;
  let fixture: ComponentFixture<ActionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
