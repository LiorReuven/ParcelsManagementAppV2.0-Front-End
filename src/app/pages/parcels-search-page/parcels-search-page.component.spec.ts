import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelsSearchPageComponent } from './parcels-search-page.component';

describe('ParcelsSearchPageComponent', () => {
  let component: ParcelsSearchPageComponent;
  let fixture: ComponentFixture<ParcelsSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelsSearchPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelsSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
