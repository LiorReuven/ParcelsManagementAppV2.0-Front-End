import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoragesManagementPageComponent } from './storages-management-page.component';

describe('StoragesManagementPageComponent', () => {
  let component: StoragesManagementPageComponent;
  let fixture: ComponentFixture<StoragesManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoragesManagementPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoragesManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
