import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAssistancePanelComponent } from './student-assistance-panel.component';

describe('StudentAssistancePanelComponent', () => {
  let component: StudentAssistancePanelComponent;
  let fixture: ComponentFixture<StudentAssistancePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAssistancePanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentAssistancePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
