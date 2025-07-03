import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAssistancePanelComponent } from './teacher-assistance-panel.component';

describe('TeacherAssistancePanelComponent', () => {
  let component: TeacherAssistancePanelComponent;
  let fixture: ComponentFixture<TeacherAssistancePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAssistancePanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherAssistancePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
