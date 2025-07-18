import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubjectsComponent } from './update-subjects.component';

describe('UpdateSubjectsComponent', () => {
  let component: UpdateSubjectsComponent;
  let fixture: ComponentFixture<UpdateSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSubjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
