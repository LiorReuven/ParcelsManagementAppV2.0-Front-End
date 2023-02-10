import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelActionsModalComponent } from './parcel-actions-modal.component';

describe('ParcelActionsModalComponent', () => {
  let component: ParcelActionsModalComponent;
  let fixture: ComponentFixture<ParcelActionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelActionsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelActionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
