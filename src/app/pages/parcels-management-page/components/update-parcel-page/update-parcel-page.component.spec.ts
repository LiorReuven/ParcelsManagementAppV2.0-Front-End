import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateParcelPageComponent } from './update-parcel-page.component';

describe('UpdateParcelPageComponent', () => {
  let component: UpdateParcelPageComponent;
  let fixture: ComponentFixture<UpdateParcelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateParcelPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateParcelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
