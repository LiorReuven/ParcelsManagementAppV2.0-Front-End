import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoragesListComponent } from './storages-list.component';

describe('StoragesListComponent', () => {
  let component: StoragesListComponent;
  let fixture: ComponentFixture<StoragesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoragesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoragesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
