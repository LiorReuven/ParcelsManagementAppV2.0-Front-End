import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelsManagementPageComponent } from './parcels-management-page.component';

describe('ParcelsManagementPageComponent', () => {
  let component: ParcelsManagementPageComponent;
  let fixture: ComponentFixture<ParcelsManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelsManagementPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelsManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
