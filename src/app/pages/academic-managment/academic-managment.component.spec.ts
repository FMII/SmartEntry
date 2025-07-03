import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicManagmentComponent } from './academic-managment.component';

describe('AcademicManagmentComponent', () => {
  let component: AcademicManagmentComponent;
  let fixture: ComponentFixture<AcademicManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicManagmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
