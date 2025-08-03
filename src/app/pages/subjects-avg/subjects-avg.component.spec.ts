import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsAvgComponent } from './subjects-avg.component';

describe('SubjectsAvgComponent', () => {
  let component: SubjectsAvgComponent;
  let fixture: ComponentFixture<SubjectsAvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsAvgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectsAvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
