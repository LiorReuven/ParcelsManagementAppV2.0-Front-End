import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieveParcelPageComponent } from './recieve-parcel-page.component';

describe('RecieveParcelPageComponent', () => {
  let component: RecieveParcelPageComponent;
  let fixture: ComponentFixture<RecieveParcelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecieveParcelPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecieveParcelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
