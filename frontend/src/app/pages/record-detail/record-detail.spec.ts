import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDetail } from './record-detail';

describe('RecordDetail', () => {
  let component: RecordDetail;
  let fixture: ComponentFixture<RecordDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
