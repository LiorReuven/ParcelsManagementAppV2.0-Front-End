import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelsDashboardComponent } from './parcels-dashboard.component';

describe('ParcelsDashboardComponent', () => {
  let component: ParcelsDashboardComponent;
  let fixture: ComponentFixture<ParcelsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelsDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
