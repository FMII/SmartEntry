import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopBlockadeComponent } from './workshop-blockade.component';

describe('WorkshopBlockadeComponent', () => {
  let component: WorkshopBlockadeComponent;
  let fixture: ComponentFixture<WorkshopBlockadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopBlockadeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkshopBlockadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
