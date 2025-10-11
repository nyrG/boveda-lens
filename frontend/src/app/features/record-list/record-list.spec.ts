import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordList } from './record-list';

describe('RecordList', () => {
  let component: RecordList;
  let fixture: ComponentFixture<RecordList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
