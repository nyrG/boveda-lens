import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordListControls } from './record-list-controls';

describe('RecordListControls', () => {
  let component: RecordListControls;
  let fixture: ComponentFixture<RecordListControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordListControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordListControls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
