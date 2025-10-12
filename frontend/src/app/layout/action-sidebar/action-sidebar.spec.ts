import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSidebar } from './action-sidebar';

describe('ActionSidebar', () => {
  let component: ActionSidebar;
  let fixture: ComponentFixture<ActionSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
