import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubjectComponent } from './create-subjects.component';

describe('CreateSubjectsComponent', () => {
  let component: CreateSubjectComponent;
  let fixture: ComponentFixture<CreateSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
