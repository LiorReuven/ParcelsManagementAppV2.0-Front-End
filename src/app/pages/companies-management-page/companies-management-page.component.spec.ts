import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesManagementPageComponent } from './companies-management-page.component';

describe('CompaniesManagementPageComponent', () => {
  let component: CompaniesManagementPageComponent;
  let fixture: ComponentFixture<CompaniesManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesManagementPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
