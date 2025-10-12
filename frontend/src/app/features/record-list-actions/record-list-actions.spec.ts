import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordListActions } from './record-list-actions';

describe('RecordListActions', () => {
  let component: RecordListActions;
  let fixture: ComponentFixture<RecordListActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordListActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordListActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
