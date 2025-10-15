import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailItem } from './detail-item';

describe('DetailItem', () => {
  let component: DetailItem;
  let fixture: ComponentFixture<DetailItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
